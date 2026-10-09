const fs = require('fs');
let content = fs.readFileSync('D:/projects/tupynambalucas/package.json', 'utf8');
content = content.replace('"version": "1.0.0"', '"version": "12.6.0"');
content = content.replace(/("name"\s*:\s*"[^"]+",)/, '$1\n  "version": "1.0.0",');
fs.writeFileSync('D:/projects/tupynambalucas/package.json', content);
