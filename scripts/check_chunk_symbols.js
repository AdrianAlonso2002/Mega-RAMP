import fs from 'fs';

const bundle = fs.readFileSync('dist/assets/index-BNnaf9pB.js', 'utf8');
const chunk = bundle.substring(900500, 1018757);

const known = new Set([
  'xe', 'M', 'n', 'b', 'G', 'ne', 'ye', 'Be', 'Fe', 'de', 'Mo', 'jt', 'Ue', 'Ve', 'pe', 'Qt', 'zt', '_t', 'vt', 'mt', 'vo', 'co', 'eo', 'lo', 'Ko', 'Po', 'ft', 'xo', 'Ao', 'Io', 'Uo', 'Lo', 'Ro', 'ho', 'wo', 'so', 'ht', 'ot', 'Zt', 'fo', 'ie',
  // standard globals
  'Math', 'document', 'window', 'localStorage', 'Date', 'Float32Array', 'Uint32Array', 'Array', 'Set', 'Map', 'Object', 'JSON', 'console', 'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'String', 'Number', 'Boolean', 'RegExp', 'Error', 'setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'
]);

// Find all identifiers in chunk
const allIdentifiers = [...chunk.matchAll(/\b([A-Za-z_$][A-Za-z0-9_$]*)\b/g)].map(m => m[1]);
const unknown = new Set();
for (const id of allIdentifiers) {
  if (id.length <= 2 && !known.has(id)) {
    // Check if it's a single letter parameter or local var (e.g. e, o, s, t, r, a, etc.)
    // Single letter identifiers are local params/vars!
    if (id.length === 2 && !known.has(id)) {
      unknown.add(id);
    }
  }
}
console.log('Two-letter unknown identifiers:', [...unknown]);
