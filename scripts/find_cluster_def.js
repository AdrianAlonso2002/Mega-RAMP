import fs from 'fs';
import readline from 'readline';

async function findDef() {
  const fileStream = fs.createReadStream('C:/Users/Helio/.gemini/antigravity/brain/4cc64493-cbaf-4561-a71b-b67783a9ec43/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (line.includes('private buildWaterClusters(') || line.includes('buildWaterClusters(')) {
      try {
        const parsed = JSON.parse(line);
        if (parsed.tool_calls) {
          for (const tc of parsed.tool_calls) {
            if (tc.name === 'edit_file' && tc.args.Replacement && tc.args.Replacement.includes('buildWaterClusters(')) {
              if (tc.args.Replacement.includes('buildWaterClusters(') && tc.args.Replacement.includes('{')) {
                console.log('Step', parsed.step_index, tc.args.Replacement.length, 'chars');
              }
            }
          }
        }
      } catch (e) {}
    }
  }
}
findDef();
