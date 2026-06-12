import { rmSync, mkdirSync, cpSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

rmSync(join(root, 'dist'), { recursive: true, force: true });
mkdirSync(join(root, 'dist'), { recursive: true });

cpSync(join(root, 'index.html'), join(root, 'dist/index.html'));
cpSync(join(root, 'calculator.html'), join(root, 'dist/calculator.html'));

if (existsSync(join(root, 'assets'))) {
  cpSync(join(root, 'assets'), join(root, 'dist/assets'), { recursive: true });
}

// ADD THIS LINE
cpSync(join(root, 'calculator.js'), join(root, 'dist/calculator.js'));

console.log('\n✅ Build complete -> dist/');