const fs = require('fs');
const code = fs.readFileSync('E:/workspace/blog/posts/data.js', 'utf8');
try {
  new Function(code);
  console.log('SUCCESS: data.js is valid JavaScript');
} catch (e) {
  console.error('ERROR: Invalid JavaScript:', e.message);
}
