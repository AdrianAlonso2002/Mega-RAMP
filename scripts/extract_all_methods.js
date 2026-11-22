import fs from 'fs';
import readline from 'readline';

async function extract() {
  const stepsToInspect = [
    10899, 11054, 11058, 11074, 11132, 11345, 11390, 11712, 11887, 11996, 12557,
    12637, 12778, 12782, 13303, 13439, 13603, 15446, 15450, 15664, 15668,
    15977, 16110, 16411, 16419, 16441, 16445, 16760, 16794, 17284, 17294,
    17396, 17400, 17529, 17632, 17875, 17887, 19409, 19510, 19781
  ];

  const stepSet = new Set(stepsToInspect);
  const stepMap = new Map();

  const fileStream = fs.createReadStream('C:/Users/Helio/.gemini/antigravity/brain/4cc64493-cbaf-4561-a71b-b67783a9ec43/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (line.includes('edit_file') && line.includes('LevelBuilder.ts')) {
      try {
        const parsed = JSON.parse(line);
        if (stepSet.has(parsed.step_index)) {
          for (const tc of parsed.tool_calls) {
            if (tc.name === 'edit_file' && tc.args.Path && tc.args.Path.includes('LevelBuilder.ts') && tc.args.Replacement) {
              if (!stepMap.has(parsed.step_index)) {
                stepMap.set(parsed.step_index, []);
              }
              stepMap.get(parsed.step_index).push(tc.args.Replacement);
            }
          }
        }
      } catch (e) {}
    }
  }

  console.log('Found steps:', [...stepMap.keys()].sort((a,b)=>a-b));
  fs.writeFileSync('scripts/extracted_step_map.json', JSON.stringify(Object.fromEntries(stepMap), null, 2), 'utf8');
  console.log('Saved scripts/extracted_step_map.json');
}

extract();
