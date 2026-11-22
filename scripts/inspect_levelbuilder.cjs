const fs = require('fs');
const content = fs.readFileSync('src/levels/LevelBuilder.ts', 'utf8');

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('movementType') || line.includes('startDelay') || line.includes('loop') || line.includes('forward')) {
    console.log(`${i+1}: ${line.trim()}`);
  }
}
