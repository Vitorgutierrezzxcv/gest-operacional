import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';

const parts = [0, 1, 2, 3, 4].map((i) =>
  readFileSync(`src/part-${i}.b64`, 'utf8').trim()
);

const encoded = parts.join('');
const compressed = Buffer.from(encoded, 'base64');
const html = gunzipSync(compressed).toString('utf8');

if (!html.toLowerCase().includes('<!doctype html>')) {
  throw new Error('Bundle invalido: DOCTYPE nao encontrado.');
}
if (!html.includes('Central') && !html.includes('Botanika')) {
  throw new Error('Bundle invalido: marcadores da Central nao encontrados.');
}

mkdirSync('dist', { recursive: true });
writeFileSync('dist/index.html', html);

const sha256 = createHash('sha256').update(html).digest('hex');
console.log(`Built dist/index.html (${Buffer.byteLength(html)} bytes)`);
console.log(`SHA256 ${sha256}`);
