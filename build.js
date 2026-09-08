const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const src = path.join(__dirname, 'src');
const parts = [0,1,2,3,4].map(i => fs.readFileSync(path.join(src, `part-${i}.b64`), 'utf8').trim());
const compressed = Buffer.from(parts.join(''), 'base64');
const sourceHtml = zlib.gunzipSync(compressed).toString('utf8');

const overridesPath = path.join(src, 'responsive-v3.css');
const responsiveOverrides = fs.existsSync(overridesPath)
  ? fs.readFileSync(overridesPath, 'utf8').trim()
  : '';

const html = responsiveOverrides
  ? sourceHtml.replace('</style>', `\n${responsiveOverrides}\n</style>`)
  : sourceHtml;

const out = path.join(__dirname, 'dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log(`Built dist/index.html (${Buffer.byteLength(html)} bytes)`);
