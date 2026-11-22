import fs from 'fs';
import readline from 'readline';

async function listMethods() {
  const fileStream = fs.createReadStream('C:/Users/Helio/.gemini/antigravity/brain/4cc64493-cbaf-4561-a71b-b67783a9ec43/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (line.includes('edit_file') && line.includes('LevelBuilder.ts')) {
      try {
        const parsed = JSON.parse(line);
        if (parsed.tool_calls) {
          for (const tc of parsed.tool_calls) {
            if (tc.name === 'edit_file' && tc.args.Path && tc.args.Path.includes('LevelBuilder.ts')) {
              const rep = tc.args.Replacement || '';
              const methods = [...rep.matchAll(/static\s+([A-Za-z0-9_]+)\s*\(/g)].map(m => m[1]);
              const privates = [...rep.matchAll(/private\s+([A-Za-z0-9_]+)\s*\(/g)].map(m => m[1]);
              if (methods.length > 0 || privates.length > 0) {
                console.log(`Step ${parsed.step_index}:`, [...methods, ...privates].join(', '));
              }
            }
          }
        }
      } catch (e) {}
    }
  }
}
listMethods();
