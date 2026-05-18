const fs = require('fs');
const path = require('path');

let nextBinPath = '';
const pathsToCheck = [
  path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next'),
  path.join(__dirname, 'web', 'node_modules', 'next', 'dist', 'bin', 'next')
];

for (const p of pathsToCheck) {
  if (fs.existsSync(p)) {
    nextBinPath = p;
    break;
  }
}

if (!nextBinPath) {
  console.error("ERROR: Could not find Next.js binary in root node_modules or web/node_modules.");
  process.exit(1);
}

process.argv.push('start');
process.argv.push('web');
require(nextBinPath);
