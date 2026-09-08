const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const src = path.join(__dirname, 'src');
const parts = [0,1,2,3,4].map(i => fs.readFileSync(path.join(src, `part-${i}.b64`), 'utf8').trim());
const compressed = Buffer.from(parts.join(''), 'base64');
const sourceHtml = zlib.gunzipSync(compressed).toString('utf8');

const overrideFiles = [
  'responsive-v3.css',
  'cilo-design-v5.css',
];

const responsiveOverrides = overrideFiles
  .map(file => {
    const filePath = path.join(src, file);
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8').trim() : '';
  })
  .filter(Boolean)
  .join('\n\n');

const html = responsiveOverrides
  ? sourceHtml.replace('</style>', `\n${responsiveOverrides}\n</style>`)
  : sourceHtml;

const out = path.join(__dirname, 'dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log(`Built dist/index.html (${Buffer.byteLength(html)} bytes)`);
