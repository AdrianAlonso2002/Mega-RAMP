import fs from 'fs';

const content = fs.readFileSync('src/levels/LevelBuilder.ts', 'utf8');
const lines = content.split('\n');

console.log('Around line 6990:');
console.log(lines.slice(6985, 7015).join('\n'));
