#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read package.json to get package info
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const packageName = packageJson.name.replace('@', '').replace('/', '-');
const version = packageJson.version;

// Create output filename
const outputFile = `${packageName}-${version}.zip`;

// Files to include (similar to npm pack logic)
const filesToInclude = [
  'manifest.json',
  'dist/**/*',
  'src/**/*',
  'README.md',
  'LICENSE*',
  'CHANGELOG*',
  '*.md'
];

// Files to exclude
const filesToExclude = [
  'node_modules/**',
  '.git/**',
  '.gitignore',
  '.npmignore',
  '*.log',
  '.env*',
  'package-zip.js'
];

try {
  // Use Node.js built-in approach for maximum compatibility
  console.log('Creating ZIP package using Node.js for JSZip compatibility...');

  // Create a temporary directory with files to zip
  const tempDir = 'temp-package';
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempDir);

  // Copy files manually (simplified approach)
  const copyFile = (src, dest) => {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
  };

  const copyDirectory = (src, dest) => {
    if (!fs.existsSync(src)) return;

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        copyDirectory(srcPath, destPath);
      } else {
        copyFile(srcPath, destPath);
      }
    }
  };

  // Copy essential files
  if (fs.existsSync('manifest.json')) copyFile('manifest.json', path.join(tempDir, 'manifest.json'));
  if (fs.existsSync('README.md')) copyFile('README.md', path.join(tempDir, 'README.md'));
  if (fs.existsSync('package.json')) copyFile('package.json', path.join(tempDir, 'package.json'));

  // Copy dist directory if it exists
  if (fs.existsSync('dist')) {
    copyDirectory('dist', path.join(tempDir, 'dist'));
  }

  // Try 7zip with store compression (no compression) for better compatibility
  try {
    execSync(`7z a -mx0 "${outputFile}" "${tempDir}\\*"`, { stdio: 'inherit' });
    console.log(`✅ Created ${outputFile} using 7zip (store mode)`);
  } catch (error) {
    // Fallback to PowerShell with no compression
    console.log('7zip not found, using PowerShell with no compression...');
    const powershellCmd = `Compress-Archive -Path "${tempDir}\\*" -DestinationPath "${outputFile}" -CompressionLevel NoCompression -Force`;
    execSync(`powershell -Command "${powershellCmd}"`, { stdio: 'inherit' });
    console.log(`✅ Created ${outputFile} using PowerShell (no compression)`);
  }

  // Cleanup
  fs.rmSync(tempDir, { recursive: true, force: true });

  // Show file info
  const stats = fs.statSync(outputFile);
  console.log(`📦 Package size: ${(stats.size / 1024).toFixed(1)} KB`);
  console.log(`📁 Location: ${path.resolve(outputFile)}`);

} catch (error) {
  console.error('❌ Failed to create package:', error.message);
  process.exit(1);
}
