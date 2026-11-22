import fs from 'fs';

const stepMap = JSON.parse(fs.readFileSync('scripts/extracted_step_map.json', 'utf8'));

// Also load 11074 and 12637 if they are in stepMap
console.log('Available steps in stepMap:', Object.keys(stepMap));

function findMethodBodyStart(text, startIdx) {
  let searchIdx = startIdx;
  while (true) {
    const brace = text.indexOf('{', searchIdx);
    if (brace === -1) return -1;
    const after = text.substring(brace + 1, brace + 80).trim();
    if (!after.includes(':') || after.startsWith('//') || after.startsWith('/*') || after.startsWith('const ') || after.startsWith('let ') || after.startsWith('if ') || after.startsWith('return ') || after.startsWith('this.')) {
      return brace;
    }
    searchIdx = brace + 1;
  }
}

function extractMethodAccurate(text, methodName) {
  const startRegex = new RegExp(`(?:\\/\\*\\*[\\s\\S]*?\\*\\/\\s*)?(?:static|private)\\s+${methodName}\\b`);
  const match = text.match(startRegex);
  if (!match) return null;

  const startIndex = match.index;
  const openBrace = findMethodBodyStart(text, startIndex);
  if (openBrace === -1) return null;

  let depth = 0;
  let inString = false;
  let stringChar = '';
  let inComment = false;
  let inLineComment = false;

  for (let i = openBrace; i < text.length; i++) {
    const c = text[i];
    const prev = i > 0 ? text[i - 1] : '';
    const next = i < text.length - 1 ? text[i + 1] : '';

    if (inLineComment) {
      if (c === '\n') inLineComment = false;
      continue;
    }
    if (inComment) {
      if (c === '*' && next === '/') {
        inComment = false;
        i++;
      }
      continue;
    }
    if (inString) {
      if (c === stringChar && prev !== '\\') {
        inString = false;
      }
      continue;
    }

    if (c === '/' && next === '/') {
      inLineComment = true;
      i++;
      continue;
    }
    if (c === '/' && next === '*') {
      inComment = true;
      i++;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      inString = true;
      stringChar = c;
      continue;
    }

    if (c === '{') {
      depth++;
    } else if (c === '}') {
      depth--;
      if (depth === 0) {
        return text.substring(startIndex, i + 1).trim();
      }
    }
  }

  return null;
}

const tests = [
  { name: 'createLimpKickerMesh', step: 11074 },
  { name: 'createVerticalWheelMesh', step: 11058 },
  { name: 'createEMTBus35Mesh', step: 15450 },
  { name: 'createDogMesh', step: 12637 },
  { name: 'createDoorMesh', step: 12637 },
  { name: 'createMisinaCatMesh', step: 12637 },
  { name: 'createClappingGlovesMesh', step: 16445 },
  { name: 'createHoodedManMesh', step: 16445 },
  { name: 'createGokuMesh', step: 15977 },
  { name: 'createContinuousKamehamehaMesh', step: 16110 },
  { name: 'createKamehamehaBeamMesh', step: 15977 },
  { name: 'createKamehamehaBurstMesh', step: 15977 },
  { name: 'createKamehamehaChargeMesh', step: 15977 }
];

for (const t of tests) {
  const reps = stepMap[String(t.step)];
  if (!reps) {
    console.log('No reps for step', t.step);
    continue;
  }
  let found = null;
  for (const r of reps) {
    found = extractMethodAccurate(r, t.name);
    if (found) break;
  }
  console.log(t.name, 'from step', t.step, '-> length:', found ? found.length : 'NULL');
}
