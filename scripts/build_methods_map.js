import fs from 'fs';
import readline from 'readline';

async function extractMethods() {
  const fileStream = fs.createReadStream('C:/Users/Helio/.gemini/antigravity/brain/4cc64493-cbaf-4561-a71b-b67783a9ec43/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const allReplacements = [];
  for await (const line of rl) {
    if (line.includes('edit_file') && line.includes('LevelBuilder.ts')) {
      try {
        const parsed = JSON.parse(line);
        if (parsed.tool_calls) {
          for (const tc of parsed.tool_calls) {
            if (tc.name === 'edit_file' && tc.args.Path && tc.args.Path.includes('LevelBuilder.ts') && tc.args.Replacement) {
              allReplacements.push({ step: parsed.step_index, rep: tc.args.Replacement });
            }
          }
        }
      } catch (e) {}
    }
  }

  console.log('Loaded', allReplacements.length, 'LevelBuilder edits.');

  // Let's check step 17887 which has membrillo, pokemon, pirate ship, water geyser, carrefour arch, applyContinuousWorldUVs
  const step17887 = allReplacements.find(r => r.step === 17887);
  if (step17887) {
    console.log('Step 17887 length:', step17887.rep.length);
    fs.writeFileSync('scripts/step17887_rep.txt', step17887.rep, 'utf8');
  }

  // Step 19409 has Islazul, Primark, Funko, Rodilla, Quesarito, TGB, Cinema, VivaGym
  const step19409 = allReplacements.find(r => r.step === 19409);
  if (step19409) {
    console.log('Step 19409 length:', step19409.rep.length);
    fs.writeFileSync('scripts/step19409_rep.txt', step19409.rep, 'utf8');
  }

  // Step 19781 has Republican methods
  const step19781 = allReplacements.find(r => r.step === 19781);
  if (step19781) {
    console.log('Step 19781 length:', step19781.rep.length);
    fs.writeFileSync('scripts/step19781_rep.txt', step19781.rep, 'utf8');
  }
}

extractMethods();
