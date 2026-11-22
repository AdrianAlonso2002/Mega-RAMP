import fs from 'fs';
import readline from 'readline';

async function testPrint() {
  const fileStream = fs.createReadStream('C:/Users/Helio/.gemini/antigravity/brain/4cc64493-cbaf-4561-a71b-b67783a9ec43/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (line.includes('"step_index":17887')) {
      const parsed = JSON.parse(line);
      const rep = parsed.tool_calls[0].args.Replacement;
      console.log('Length:', rep.length);
      console.log(rep.substring(0, 500));
      break;
    }
  }
}
testPrint();
