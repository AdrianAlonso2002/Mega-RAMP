import fs from 'fs';
import readline from 'readline';

async function check18261() {
  const fileStream = fs.createReadStream('C:/Users/Helio/.gemini/antigravity/brain/4cc64493-cbaf-4561-a71b-b67783a9ec43/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (line.includes('"step_index":18261')) {
      const parsed = JSON.parse(line);
      const tc = parsed.tool_calls[0];
      console.log('Step 18261 Target len:', tc.args.Target.length);
      console.log('Step 18261 Replacement len:', tc.args.Replacement.length);
      console.log('Step 18261 Target:\n', tc.args.Target.substring(0, 300));
      break;
    }
  }
}
check18261();
