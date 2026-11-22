import fs from 'fs';
import readline from 'readline';

async function check13717() {
  const fileStream = fs.createReadStream('C:/Users/Helio/.gemini/antigravity/brain/4cc64493-cbaf-4561-a71b-b67783a9ec43/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (line.includes('"step_index":13717')) {
      const parsed = JSON.parse(line);
      const tc = parsed.tool_calls[0];
      console.log('Step 13717 Replacement:\n', tc.args.Replacement);
      break;
    }
  }
}
check13717();
