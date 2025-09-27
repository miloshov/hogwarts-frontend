const fs = require('fs');
const s = fs.readFileSync('AdminPanel.js','utf8');
let stack = [];
for (let i=0;i<s.length;i++){
  const c = s[i];
  if (c === '{' || c === '(' || c === '[') stack.push({c, i});
  if (c === '}' || c === ')' || c === ']') {
    const top = stack.pop();
    if (!top) { console.log('Unmatched closing', c, 'at', i); break; }
    if ((top.c==='{' && c!=='}')||(top.c==='('&&c!==')')||(top.c==='['&&c!==']')) {
      console.log('Mismatch', top.c, 'at', top.i, 'closed by', c, 'at', i); 
      console.log('Top context:', s.slice(Math.max(0,top.i-80), top.i+80));
      console.log('Close context:', s.slice(Math.max(0,i-80), i+80));
      process.exit(0);
    }
  }
}
if (stack.length) {
  console.log('Unclosed openings count:', stack.length);
  const last = stack[stack.length-1];
  console.log('Last unclosed:', last, 'context:', s.slice(Math.max(0,last.i-80), last.i+80));
} else console.log('All balanced');