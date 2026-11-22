import * as RealThree from 'three';
import * as BundledThree from '../dist/assets/three-MSiqGvIi.js';
import fs from 'fs';

const bundle = fs.readFileSync('dist/assets/index-BNnaf9pB.js', 'utf8');
const importMatch = bundle.match(/import\s*\{([^}]+)\}\s*from\s*["'](?:\.\/)?three/);

const map = {};
for (const entry of importMatch[1].split(',')) {
  const [exported, local] = entry.trim().split(/\s+as\s+/);
  const localName = local || exported;
  const val = BundledThree[exported];
  
  let found = null;
  for (const [realName, realVal] of Object.entries(RealThree)) {
    if (val === realVal || (typeof val === 'function' && val.name === realName)) {
      found = realName;
      break;
    }
    if (typeof val === 'function' && typeof realVal === 'function' && val.prototype && realVal.prototype) {
      if (val.name === realName || val.prototype.constructor.name === realName) {
        found = realName;
        break;
      }
    }
  }
  map[localName] = found || (typeof val === 'function' ? val.name : typeof val);
}

console.log('Mapped count:', Object.keys(map).length);
console.log('Sample mappings:', JSON.stringify(Object.fromEntries(Object.entries(map).slice(0, 30)), null, 2));
fs.writeFileSync('scripts/three_symbol_map.json', JSON.stringify(map, null, 2), 'utf8');
