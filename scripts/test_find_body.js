import fs from 'fs';

const stepMap = JSON.parse(fs.readFileSync('scripts/extracted_step_map.json', 'utf8'));

function findMethodBodyStart(text, startIdx) {
  let searchIdx = startIdx;
  while (true) {
    const brace = text.indexOf('{', searchIdx);
    if (brace === -1) return -1;
    const after = text.substring(brace + 1, brace + 80).trim();
    // A method body starts with statements or comments, NOT with type definitions like 'group: THREE.Group'
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

const goku = extractMethodAccurate(stepMap['15977'][0], 'createGokuMesh');
console.log('createGokuMesh extracted length:', goku ? goku.length : 0);
console.log(goku ? goku.substring(0, 150) + '\n...\n' + goku.substring(goku.length - 100) : 'null');
