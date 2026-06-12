import { rmSync, mkdirSync, cpSync, existsSync } from 'node:fs';

// Clean and create dist
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });

// Copy homepage to root
cpSync('index.html', 'dist/index.html');

// Copy calculator to root as calculator.html (NOT in a subfolder!)
if (existsSync('calculator/index.html')) {
  cpSync('calculator/index.html', 'dist/calculator.html');
} else if (existsSync('index(1).html')) {
  cpSync('index(1).html', 'dist/calculator.html');
}

// Copy JS file
cpSync('script.js', 'dist/script.js');

// Copy assets if they exist
if (existsSync('assets')) {
  cpSync('assets', 'dist/assets', { recursive: true });
}

console.log('Build complete -> dist/');