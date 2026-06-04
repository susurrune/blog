#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'posts', 'data.js');

if (!fs.existsSync(file)) {
  console.error('ERROR: posts/data.js not found — run "node build.js" first.');
  process.exit(1);
}

const code = fs.readFileSync(file, 'utf8');
try {
  new Function(code);
  console.log('SUCCESS: data.js is valid JavaScript');
} catch (e) {
  console.error('ERROR: Invalid JavaScript:', e.message);
  process.exit(1);
}
