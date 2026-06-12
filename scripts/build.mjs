import { rmSync, mkdirSync, cpSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// ── Helper: fix relative paths in HTML files ──────────────────────────
function fixHtmlPaths(srcPath, destPath, isCalculator) {
  let content = readFileSync(srcPath, 'utf8');

  if (isCalculator) {
    // Calculator is in /calculator/ folder — go up one level for shared assets
    content = content.replace(
      /src=["']script\.js["']/g,
      'src="../script.js"'
    );
    content = content.replace(
      /href=["']\/["']/g,
      'href="../"'
    );
    content = content.replace(
      /href=["']\/calculator["']/g,
      'href="./"'
    );
  } else {
    // Home page is at root — use relative paths
    content = content.replace(
      /href=["']\/calculator\/?["']/g,
      'href="./calculator/"'
    );
  }

  writeFileSync(destPath, content);
  console.log(`Built: ${srcPath} -> ${destPath}`);
}

// ── Auto-detect file structure ─────────────────────────────────────────
console.log('🔍 Detecting project structure...\n');

// Check all possible homepage locations
const HOME_CANDIDATES = [
  'home.html',
  'index.html',
  'src/index.html',
  'public/index.html'
];

// Check all possible calculator locations
const CALC_CANDIDATES = [
  'calculator/index.html',
  'calc/index.html',
  'app/index.html',
  'index(1).html',
  'index2.html',
  'calc.html'
];

let HOME_FILE = null;
let CALC_FILE = null;

// Find homepage (prioritize home.html, then root index.html)
for (const candidate of HOME_CANDIDATES) {
  if (existsSync(candidate)) {
    // If it's root index.html, make sure it's not actually the calculator
    if (candidate === 'index.html' && existsSync('calculator/index.html')) {
      // Root index.html is likely home, calculator is in subfolder
      HOME_FILE = candidate;
      break;
    } else if (candidate === 'index.html' && !existsSync('calculator/index.html')) {
      // No calculator subfolder, check if this is home or calc
      const content = readFileSync(candidate, 'utf8');
      if (content.includes('calculator') || content.includes('VUNA Calculator')) {
        // This might be the calculator, keep looking for home
        continue;
      }
      HOME_FILE = candidate;
      break;
    } else {
      HOME_FILE = candidate;
      break;
    }
  }
}

// Find calculator
for (const candidate of CALC_CANDIDATES) {
  if (existsSync(candidate)) {
    CALC_FILE = candidate;
    break;
  }
}

// Handle edge case: if root index.html exists and no calculator subfolder
// and no other home file, assume root index.html is home
if (!HOME_FILE && existsSync('index.html') && !CALC_FILE) {
  // Check if there's another index file that could be calculator
  if (existsSync('index(1).html')) {
    HOME_FILE = 'index.html';
    CALC_FILE = 'index(1).html';
  } else {
    HOME_FILE = 'index.html';
  }
}

// ── Validate and report ───────────────────────────────────────────────
console.log('📁 Detected files:');
console.log(`   Homepage: ${HOME_FILE || 'NOT FOUND'}`);
console.log(`   Calculator: ${CALC_FILE || 'NOT FOUND'}`);
console.log();

if (!HOME_FILE) {
  console.error('❌ Error: No homepage file found!');
  console.error('   Tried: ' + HOME_CANDIDATES.join(', '));
  console.error('   Please create home.html or ensure index.html exists at root.');
  process.exit(1);
}

if (!CALC_FILE) {
  console.error('❌ Error: No calculator file found!');
  console.error('   Tried: ' + CALC_CANDIDATES.join(', '));
  console.error('   Please create calculator/index.html or calc.html.');
  process.exit(1);
}

// ── Clean and create dist ──────────────────────────────────────────────
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
mkdirSync('dist/calculator', { recursive: true });

// ── Build pages ────────────────────────────────────────────────────────
fixHtmlPaths(HOME_FILE, 'dist/index.html', false);
fixHtmlPaths(CALC_FILE, 'dist/calculator/index.html', true);

// ── Copy shared assets ──────────────────────────────────────────────────
const ASSET_CANDIDATES = [
  { src: 'script.js', dest: 'dist/script.js' },
  { src: 'script(1).js', dest: 'dist/script.js' },
  { src: 'calculator/script.js', dest: 'dist/calculator/script.js' },
];

let jsCopied = false;
for (const asset of ASSET_CANDIDATES) {
  if (existsSync(asset.src) && !jsCopied) {
    cpSync(asset.src, asset.dest);
    console.log(`Copied: ${asset.src} -> ${asset.dest}`);
    jsCopied = true;
  }
}

if (!jsCopied) {
  console.warn('⚠️  No script.js found. Calculator may not work.');
}

// Copy other assets
if (existsSync('assets')) {
  cpSync('assets', 'dist/assets', { recursive: true });
  console.log('Copied: assets/ -> dist/assets/');
}

if (existsSync('src')) {
  cpSync('src', 'dist/src', { recursive: true });
  console.log('Copied: src/ -> dist/src/');
}

if (existsSync('styles.css')) {
  cpSync('styles.css', 'dist/styles.css');
  console.log('Copied: styles.css -> dist/styles.css');
}

// ── Create 404 page ────────────────────────────────────────────────────
const notFoundHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - Not Found</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css">
  <style>
    body { 
      min-height: 100vh; 
      display: flex; 
      align-items: center; 
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .error-card {
      background: white;
      padding: 60px;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
      text-align: center;
      max-width: 500px;
    }
    .error-code { font-size: 6rem; font-weight: 800; color: #667eea; }
  </style>
</head>
<body>
  <div class="error-card">
    <div class="error-code">404</div>
    <h2 class="mb-4">Page Not Found</h2>
    <p class="text-muted mb-4">The page you are looking for does not exist.</p>
    <a href="/" class="btn btn-primary btn-lg">Go Home</a>
    <a href="/calculator/" class="btn btn-outline-primary btn-lg ms-2">Open Calculator</a>
  </div>
</body>
</html>`;

writeFileSync('dist/404.html', notFoundHtml);
console.log('Created: 404.html');

console.log('\n✅ Build complete -> dist/');
console.log('   /          -> Home (Defence)');
console.log('   /calculator/ -> Calculator (CA)');