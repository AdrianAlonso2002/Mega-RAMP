import fs from 'fs';
import readline from 'readline';

async function check12555() {
  const fileStream = fs.createReadStream('C:/Users/Helio/.gemini/antigravity/brain/4cc64493-cbaf-4561-a71b-b67783a9ec43/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (line.includes('"step_index":12555') || line.includes('"step_index":12557') || line.includes('"step_index":12563')) {
      const parsed = JSON.parse(line);
      const tc = parsed.tool_calls[0];
      console.log(`Step ${parsed.step_index}: Target (${tc.args.Target.length}) -> Replacement (${tc.args.Replacement.length})`);
      console.log(tc.args.Replacement.substring(0, 200));
    }
  }
}
check12555();
