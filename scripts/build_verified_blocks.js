import fs from 'fs';
import readline from 'readline';
import ts from 'typescript';

async function buildBlocks() {
  const fileStream = fs.createReadStream('C:/Users/Helio/.gemini/antigravity/brain/4cc64493-cbaf-4561-a71b-b67783a9ec43/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const targetSteps = new Set([
    10899, 11054, 11074, 11132, 11345, 11390, 11712, 11887, 11996, 12557,
    12637, 12778, 12782, 13303, 13439, 13603, 15446, 15450, 15664, 15668,
    15977, 16110, 16411, 16419, 16441, 16445, 16760, 16794, 17284, 17294,
    17396, 17400, 17632, 17887, 19409, 19510, 19781
  ]);

  const stepReplacements = new Map();

  for await (const line of rl) {
    if (line.includes('edit_file') && line.includes('LevelBuilder.ts')) {
      try {
        const p = JSON.parse(line);
        if (targetSteps.has(p.step_index)) {
          for (const tc of p.tool_calls) {
            if (tc.name === 'edit_file' && tc.args.Path && tc.args.Path.includes('LevelBuilder.ts') && tc.args.Replacement) {
              stepReplacements.set(p.step_index, tc.args.Replacement);
            }
          }
        }
      } catch (e) {}
    }
  }

  console.log('Loaded replacements for steps:', [...stepReplacements.keys()].sort((a,b)=>a-b));

  // Verify TS parsing function
  function parseMethodsFromSnippet(snippet) {
    const wrapped = `class LevelBuilder {\n${snippet}\n}`;
    const sf = ts.createSourceFile('test.ts', wrapped, ts.ScriptTarget.Latest, true);
    const methods = new Map();

    function visit(node) {
      if (ts.isMethodDeclaration(node) && node.name) {
        const name = node.name.text;
        const start = node.getStart(sf);
        const end = node.getEnd();
        methods.set(name, wrapped.substring(start, end));
      }
      ts.forEachChild(node, visit);
    }
    visit(sf);
    return methods;
  }

  // Let's test step 10899
  const m10899 = parseMethodsFromSnippet(stepReplacements.get(10899));
  console.log('Step 10899 parsed methods:', [...m10899.keys()]);

  // Step 11887
  const m11887 = parseMethodsFromSnippet(stepReplacements.get(11887));
  console.log('Step 11887 parsed methods:', [...m11887.keys()]);

  // Step 11996
  const m11996 = parseMethodsFromSnippet(stepReplacements.get(11996));
  console.log('Step 11996 parsed methods:', [...m11996.keys()]);

  // Step 12637
  const m12637 = parseMethodsFromSnippet(stepReplacements.get(12637));
  console.log('Step 12637 parsed methods:', [...m12637.keys()]);

  // Step 15977
  const m15977 = parseMethodsFromSnippet(stepReplacements.get(15977));
  console.log('Step 15977 parsed methods:', [...m15977.keys()]);

  // Step 16445
  const m16445 = parseMethodsFromSnippet(stepReplacements.get(16445));
  console.log('Step 16445 parsed methods:', [...m16445.keys()]);

  // Step 17887
  const m17887 = parseMethodsFromSnippet(stepReplacements.get(17887));
  console.log('Step 17887 parsed methods:', [...m17887.keys()]);

  // Step 19409
  const m19409 = parseMethodsFromSnippet(stepReplacements.get(19409));
  console.log('Step 19409 parsed methods:', [...m19409.keys()]);
}

buildBlocks();
