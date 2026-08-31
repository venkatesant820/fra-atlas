import fs from 'fs';

const files = [
  'C:/fra-atlas/frontend/app/dashboard/page.tsx',
  'C:/fra-atlas/frontend/app/map/page.tsx',
  'C:/fra-atlas/frontend/app/anomaly/page.tsx',
  'C:/fra-atlas/frontend/app/blockchain/page.tsx',
  'C:/fra-atlas/frontend/app/ocr/page.tsx'
];

const replacement = 'const API = typeof window !== "undefined" ? (window.location.hostname.includes("localhost") || window.location.hostname.includes("127.0.0.1") ? "http://127.0.0.1:8000" : "") : "";';

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace('const API = "http://127.0.0.1:8000";', replacement);
  fs.writeFileSync(f, content, 'utf8');
});

console.log('Successfully written dynamic location configuration script');
