import ts from 'typescript';
import fs from 'fs';

const stepMap = JSON.parse(fs.readFileSync('scripts/extracted_step_map.json', 'utf8'));

function extractMethodWithTS(text, methodName) {
  // Wrap in dummy class if needed so it parses as class elements
  const wrapped = `class Dummy {\n${text}\n}`;
  const sourceFile = ts.createSourceFile('dummy.ts', wrapped, ts.ScriptTarget.Latest, true);

  let result = null;
  function visit(node) {
    if (ts.isMethodDeclaration(node) && node.name && node.name.text === methodName) {
      // Extract from wrapped
      const start = node.getStart(sourceFile);
      const end = node.getEnd();
      result = wrapped.substring(start, end);
      return;
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return result;
}

const wheel = extractMethodWithTS(stepMap['11390'][0], 'createVerticalWheelMesh');
console.log('createVerticalWheelMesh length:', wheel ? wheel.length : 0);
console.log('Starts with:\n', wheel ? wheel.substring(0, 150) : 'null');
console.log('Ends with:\n', wheel ? wheel.substring(wheel.length - 50) : 'null');
