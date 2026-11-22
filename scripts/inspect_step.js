import fs from 'fs';
import readline from 'readline';

const stepIndex = parseInt(process.argv[2] || '18235', 10);
const full = process.argv[3] === 'full';
const regex = new RegExp(`"step_index"\\s*:\\s*${stepIndex}\\b`);

async function inspect() {
  const rl = readline.createInterface({
    input: fs.createReadStream('C:/Users/Helio/.gemini/antigravity/brain/4cc64493-cbaf-4561-a71b-b67783a9ec43/.system_generated/logs/transcript_full.jsonl')
  });

  for await (const line of rl) {
    if (regex.test(line)) {
      const p = JSON.parse(line);
      if (p.tool_calls) {
        for (const tc of p.tool_calls) {
          console.log('Tool:', tc.name, 'Path:', tc.args.Path);
          if (tc.name === 'edit_file') {
            if (full) {
              console.log('--- TARGET ---');
              console.log(tc.args.Target);
              console.log('--- REPLACEMENT ---');
              console.log(tc.args.Replacement);
            } else {
              console.log('Target snippet:', (tc.args.Target || '').substring(0, 300));
              console.log('Replacement snippet:', (tc.args.Replacement || '').substring(0, 500));
            }
          }
        }
      }
    }
  }
}

inspect();
