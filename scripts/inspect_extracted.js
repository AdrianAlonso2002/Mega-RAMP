import fs from 'fs';
import readline from 'readline';

async function inspectSteps() {
  const steps = [
    11054, 11712, 11887, 11996, 12621, 12637, 13303, 15450, 
    15668, 15977, 16106, 16110, 16441, 16445, 17294, 17400, 
    17529, 17632, 17875, 17887
  ];

  const fileStream = fs.createReadStream('C:/Users/Helio/.gemini/antigravity/brain/4cc64493-cbaf-4561-a71b-b67783a9ec43/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    for (const s of steps) {
      if (line.includes(`"step_index":${s}`)) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.tool_calls) {
            for (const tc of parsed.tool_calls) {
              if (tc.name === 'edit_file' && tc.args.Path && tc.args.Path.includes('LevelBuilder.ts')) {
                const rep = tc.args.Replacement;
                const methods = [...rep.matchAll(/static\s+([A-Za-z0-9_]+)\s*\(/g)].map(m => m[1]);
                console.log(`Step ${s} (${rep.length} chars):`, methods.join(', '));
              }
            }
          }
        } catch (e) {}
      }
    }
  }
}
inspectSteps();
