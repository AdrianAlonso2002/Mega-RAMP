import fs from 'fs';

const bundle = fs.readFileSync('dist/assets/index-BNnaf9pB.js', 'utf8');
const yachtIdx = bundle.indexOf('createYachtMesh(');
const sub = bundle.substring(yachtIdx, bundle.indexOf('class ', yachtIdx));

const regex = /(?:static\s+|)([A-Za-z0-9_]+)\s*\([A-Za-z0-9_,=."#'$]*\)\s*\{/g;
let m;
while ((m = regex.exec(sub)) !== null) {
  console.log(m[1]);
}
