import { rmSync, mkdirSync, cpSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

// Clean and create dist
rmSync(join(root, 'dist'), { recursive: true, force: true });
mkdirSync(join(root, 'dist'), { recursive: true });

// Copy homepage to root
cpSync(join(root, 'index.html'), join(root, 'dist/index.html'));
console.log('Copied: index.html -> dist/index.html');

// Copy calculator to root
cpSync(join(root, 'calculator.html'), join(root, 'dist/calculator.html'));
console.log('Copied: calculator.html -> dist/calculator.html');

// Copy assets folder (contains js/script.js, css, etc.)
if (existsSync(join(root, 'assets'))) {
  cpSync(join(root, 'assets'), join(root, 'dist/assets'), { recursive: true });
  console.log('Copied: assets/ -> dist/assets/');
}

// FIX: Copy script.js to dist root so calculator.html can find it
if (existsSync(join(root, 'assets/js/script.js'))) {
  cpSync(join(root, 'assets/js/script.js'), join(root, 'dist/script.js'));
  console.log('Copied: assets/js/script.js -> dist/script.js');
} else if (existsSync(join(root, 'script.js'))) {
  cpSync(join(root, 'script.js'), join(root, 'dist/script.js'));
  console.log('Copied: script.js -> dist/script.js');
}

console.log('\n✅ Build complete -> dist/');