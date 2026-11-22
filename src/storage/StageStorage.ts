/** Lossless stage-only storage. Progress, options and skin unlocks remain untouched. */
const PREFIX = "!MR-LZW1!";
const CLEAR = 256,
  LIMIT = 32768,
  MAX_BYTES = 16 * 1024 * 1024;
const isStageKey = (key: string) =>
  /^(custom_stage|stage_snapshots)_\d+_\d+_\d+$/.test(key);

export function decodeStagePayload(value: string): string {
  if (!value.startsWith(PREFIX)) return value;
  const separator = value.indexOf(":", PREFIX.length),
    length = Number(value.slice(PREFIX.length, separator));
  if (
    separator < 0 ||
    !Number.isInteger(length) ||
    length < 1 ||
    length > MAX_BYTES
  )
    throw new Error("Invalid stage storage header");
  const dictionary: string[] = [],
    output: string[] = [];
  let next = 257,
    previous = "",
    size = 0;
  for (let i = separator + 1; i < value.length; i++) {
    const code = value.charCodeAt(i) - 32;
    if (code === CLEAR) {
      dictionary.length = 0;
      next = 257;
      previous = "";
      continue;
    }
    if (code < 0 || code >= LIMIT)
      throw new Error("Invalid stage storage code");
    const entry =
      code < 256
        ? String.fromCharCode(code)
        : (dictionary[code] ??
          (code === next && previous ? previous + previous[0] : undefined));
    if (entry === undefined) throw new Error("Corrupt stage storage");
    size += entry.length;
    if (size > length) throw new Error("Invalid stage storage length");
    output.push(entry);
    if (previous && next < LIMIT) dictionary[next++] = previous + entry[0];
    previous = entry;
  }
  if (size !== length) throw new Error("Truncated stage storage");
  const bytes = output.join(""),
    array = new Uint8Array(length);
  for (let i = 0; i < length; i++) array[i] = bytes.charCodeAt(i);
  return new TextDecoder("utf-8", { fatal: true }).decode(array);
}

export function encodeStagePayload(value: string): string {
  if (value.length < 256) return value;
  const bytes = new TextEncoder().encode(value);
  if (bytes.length > MAX_BYTES || new TextDecoder().decode(bytes) !== value)
    return value;
  const dictionary = new Map<string, number>(),
    output: string[] = [];
  let next = 257,
    phrase = String.fromCharCode(bytes[0]);
  const emit = (code: number) => output.push(String.fromCharCode(code + 32));
  const codeFor = (word: string) =>
    word.length === 1 ? word.charCodeAt(0) : dictionary.get(word)!;
  for (let i = 1; i < bytes.length; i++) {
    const character = String.fromCharCode(bytes[i]),
      combined = phrase + character;
    if (dictionary.has(combined)) phrase = combined;
    else {
      emit(codeFor(phrase));
      if (next < LIMIT) dictionary.set(combined, next++);
      else {
        emit(CLEAR);
        dictionary.clear();
        next = 257;
      }
      phrase = character;
    }
  }
  emit(codeFor(phrase));
  const packed = PREFIX + bytes.length + ":" + output.join("");
  // Verify before persisting; old saves must never be changed by a lossy conversion.
  return packed.length < value.length && decodeStagePayload(packed) === value
    ? packed
    : value;
}

export function isStorageQuotaError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    ["QuotaExceededError", "NS_ERROR_DOM_QUOTA_REACHED"].includes(
      String(error.name),
    )
  );
}

/** Shrink legacy entries in place without removing a single save or history version. */
export function compactStageStorage(storage: Storage): number {
  if (typeof storage.length !== "number" || typeof storage.key !== "function")
    return 0;
  const keys = Array.from({ length: storage.length }, (_, i) =>
    storage.key(i),
  ).filter((key): key is string => key !== null && isStageKey(key));
  let recovered = 0;
  for (const key of keys) {
    const raw = storage.getItem(key);
    if (raw === null || raw.startsWith(PREFIX)) continue;
    const packed = encodeStagePayload(raw);
    if (packed.length >= raw.length) continue;
    try {
      storage.setItem(key, packed);
      recovered += raw.length - packed.length;
    } catch (error) {
      if (!isStorageQuotaError(error)) throw error;
    }
  }
  return recovered;
}

/** Retire old histories only after a valid single saved version has been secured. */
export function retireStageHistory(
  storage: Storage = globalThis.localStorage,
): number {
  if (
    !storage ||
    typeof storage.length !== "number" ||
    typeof storage.key !== "function"
  )
    return 0;
  const keys = Array.from({ length: storage.length }, (_, i) =>
    storage.key(i),
  ).filter(
    (key): key is string =>
      key !== null && /^stage_snapshots_\d+_\d+_\d+$/.test(key),
  );
  const valid = (
    value: unknown,
  ): value is { id: string; objects: unknown[]; timeLimit: number } =>
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "objects" in value &&
    Array.isArray(value.objects) &&
    "timeLimit" in value &&
    typeof value.timeLimit === "number";
  let retired = 0;
  for (const key of keys)
    try {
      const primaryKey = key.replace("stage_snapshots_", "custom_stage_"),
        raw = storage.getItem(primaryKey);
      let primary: unknown;
      try {
        primary = raw ? JSON.parse(decodeStagePayload(raw)) : undefined;
      } catch {
        primary = undefined;
      }
      if (!valid(primary)) {
        const legacy = JSON.parse(
          decodeStagePayload(storage.getItem(key) ?? "null"),
        );
        if (!Array.isArray(legacy)) continue;
        const newest = legacy
          .filter((entry) => entry && valid(entry.data))
          .sort(
            (a, b) => Number(b.timestamp ?? 0) - Number(a.timestamp ?? 0),
          )[0];
        if (!newest) continue;
        const recovered = encodeStagePayload(
          JSON.stringify({
            ...newest.data,
            customSaved: true,
            properties: { ...newest.data.properties, userSaved: true },
          }),
        );
        try {
          storage.setItem(primaryKey, recovered);
        } catch (error) {
          if (!isStorageQuotaError(error)) throw error;
          compactStageStorage(storage);
          storage.setItem(primaryKey, recovered);
        }
        forget(primaryKey);
      }
      storage.removeItem(key);
      forget(key);
      retired++;
    } catch {
      /* Leave unrecoverable entries intact rather than discard the only remaining data. */
    }
  return retired;
}

// Repeated HUD/count and prepared-level reads must not decompress geometry every frame.
const decodedCache = new Map<string, { raw: string; value: string }>();
let cachedCharacters = 0;
function forget(key: string): void {
  const old = decodedCache.get(key);
  if (old) cachedCharacters -= old.value.length;
  decodedCache.delete(key);
}
function remember(key: string, raw: string, value: string): void {
  forget(key);
  if (value.length > 2_000_000) return;
  decodedCache.set(key, { raw, value });
  cachedCharacters += value.length;
  while (decodedCache.size > 48 || cachedCharacters > 2_000_000)
    forget(decodedCache.keys().next().value!);
}

/** Same synchronous API as localStorage, including compatibility with legacy plain JSON. */
export const stageStorage = {
  getItem(key: string): string | null {
    if (typeof globalThis.localStorage === "undefined") return null;
    const raw = globalThis.localStorage.getItem(key);
    if (raw === null || !isStageKey(key) || !raw.startsWith(PREFIX)) {
      forget(key);
      return raw;
    }
    const cached = decodedCache.get(key);
    if (cached?.raw === raw) return cached.value;
    try {
      const value = decodeStagePayload(raw);
      remember(key, raw, value);
      return value;
    } catch {
      return raw;
    } // Existing JSON validation provides the normal recovery path.
  },
  setItem(key: string, value: string): void {
    // Legacy official-stage seed code must not recreate the retired four-version history.
    if (/^stage_snapshots_\d+_\d+_\d+$/.test(key)) return;
    const storage = globalThis.localStorage,
      packed = isStageKey(key) ? encodeStagePayload(value) : value;
    try {
      storage.setItem(key, packed);
    } catch (error) {
      if (!isStageKey(key) || !isStorageQuotaError(error)) throw error;
      compactStageStorage(storage);
      storage.setItem(key, packed);
    }
    if (packed !== value) remember(key, packed, value);
    else forget(key);
  },
  removeItem(key: string): void {
    globalThis.localStorage.removeItem(key);
    forget(key);
  },
};
