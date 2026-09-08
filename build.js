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
  'v8-shell.css',
  'v8-tasks.css',
  'v8-plan.css',
  'v8-responsive.css',
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

const runtimeFiles = ['cilo-design-v6.js', 'cilo-design-v8.js'];
const runtime = runtimeFiles
  .map(file => {
    const filePath = path.join(src, file);
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8').trim() : '';
  })
  .filter(Boolean)
  .join('\n\n');

if (runtime) {
  html = html.replace('</body>', `<script>\n${runtime}\n</script>\n</body>`);
}

const out = path.join(__dirname, 'dist');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), html);
console.log(`Built dist/index.html (${Buffer.byteLength(html)} bytes)`);
