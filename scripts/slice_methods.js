import fs from 'fs';

const stepMap = JSON.parse(fs.readFileSync('scripts/extracted_step_map.json', 'utf8'));

// Helper to extract a method by name from a block of code
function extractMethodFromText(text, methodName) {
  const regex = new RegExp(`((?:\\/\\*\\*[\\s\\S]*?\\*\\/\\s*)?(?:static|private)\\s+${methodName}\\b[\\s\\S]*?)(?=\\n\\s*(?:(?:\\/\\*\\*[\\s\\S]*?\\*\\/\\s*)?(?:static|private)\\s+[A-Za-z0-9_]+\\b|\\}))`);
  const m = text.match(regex);
  if (m) return m[1].trim();

  // If that didn't match, maybe it's the last method in the text
  const regex2 = new RegExp(`((?:\\/\\*\\*[\\s\\S]*?\\*\\/\\s*)?(?:static|private)\\s+${methodName}\\b[\\s\\S]*)`);
  const m2 = text.match(regex2);
  if (m2) {
    let code = m2[1].trim();
    // Trim trailing closing brace if it closed the class
    if (code.endsWith('}\n}')) code = code.substring(0, code.length - 2).trim();
    else if (code.endsWith('}')) code = code.trim();
    return code;
  }
  return null;
}

// Test extraction for a few methods
const shopMesh = extractMethodFromText(stepMap['10899'][0], 'createShopMesh');
console.log('createShopMesh found:', !!shopMesh, shopMesh ? shopMesh.length : 0);

const marketStallMesh = extractMethodFromText(stepMap['11054'][0], 'createMarketStallMesh');
console.log('createMarketStallMesh found:', !!marketStallMesh, marketStallMesh ? marketStallMesh.length : 0);

const wheelMesh = extractMethodFromText(stepMap['11390'][0], 'createVerticalWheelMesh');
console.log('createVerticalWheelMesh found:', !!wheelMesh, wheelMesh ? wheelMesh.length : 0);
