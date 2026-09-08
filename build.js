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
  'cilo-v6-0.css',
  'cilo-v6-1.css',
  'cilo-v6-2.css',
  'cilo-v6-3.css',
  'cilo-v6-4.css',
  'cilo-v6-5.css',
  'cilo-v6-6.css',
  'cilo-v6-7.css',
  'cilo-design-v7.css',
];

const responsiveOverrides = overrideFiles
  .map(file => {
    const filePath = path.join(src, file);
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8').trim() : '';
  })
  .filter(Boolean)
  .join('\n\n');

let html = responsiveOverrides
  ? sourceHtml.replace('</style>', `\n${responsiveOverrides}\n</style>`)
  : sourceHtml;

const runtimeFile = path.join(src, 'cilo-design-v6.js');
if (fs.existsSync(runtimeFile)) {
  const runtime = fs.readFileSync(runtimeFile, 'utf8').trim();
  html = html.replace('</body>', `<script>\n${runtime}\n</script>\n</body>`);
}

const out = path.join(__dirname, 'dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log(`Built dist/index.html (${Buffer.byteLength(html)} bytes)`);
