#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

// Read package.json to get package info
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const packageName = packageJson.name.replace('@', '').replace('/', '-');
const version = packageJson.version;

// Create output filename
const outputFile = `${packageName}-${version}.zip`;

// Files to include
const filesToInclude = [
  'manifest.json',
  'dist',
  'src',
  'README.md',
  'LICENSE',
  'CHANGELOG.md',
  'package.json'
];

// Files to exclude patterns
const excludePatterns = [
  /node_modules/,
  /\.git/,
  /\.gitignore/,
  /\.npmignore/,
  /\.log$/,
  /\.env/,
  /package-zip.*\.js$/,
  /\.zip$/,
  /\.tgz$/,
  /\.d\.ts$/,
  /\.d\.ts\.map$/,
  /\.js\.map$/,
  /\.css\.map$/
];

const shouldIncludeFile = (filePath) => {
  return !excludePatterns.some(pattern => pattern.test(filePath));
};

const addFileToZip = (zip, filePath, relativePath) => {
  if (!fs.existsSync(filePath)) return;

  const stats = fs.statSync(filePath);
  if (stats.isDirectory()) {
    const entries = fs.readdirSync(filePath);
    for (const entry of entries) {
      const fullPath = path.join(filePath, entry);
      const relPath = path.join(relativePath, entry).replace(/\\/g, '/');

      if (shouldIncludeFile(relPath)) {
        addFileToZip(zip, fullPath, relPath);
      }
    }
  } else {
    const content = fs.readFileSync(filePath);
    zip.file(relativePath.replace(/\\/g, '/'), content);
    console.log(`Added: ${relativePath}`);
  }
};

async function createZip() {
  try {
    const zip = new JSZip();

    // Add files to ZIP
    for (const fileOrDir of filesToInclude) {
      if (fs.existsSync(fileOrDir)) {
        const stats = fs.statSync(fileOrDir);
        if (stats.isDirectory()) {
          addFileToZip(zip, fileOrDir, fileOrDir);
        } else {
          if (shouldIncludeFile(fileOrDir)) {
            const content = fs.readFileSync(fileOrDir);
            zip.file(fileOrDir, content);
            console.log(`Added: ${fileOrDir}`);
          }
        }
      }
    }

    // Generate ZIP with maximum compatibility settings
    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'STORE', // No compression for maximum compatibility
      compressionOptions: {
        level: 0
      },
      platform: 'UNIX', // Use UNIX platform for better compatibility
      comment: `Plugin package created by JSZip for ${packageName} v${version}`
    });

    // Write to file
    fs.writeFileSync(outputFile, zipBuffer);

    // Show file info
    const stats = fs.statSync(outputFile);
    console.log(`✅ Created ${outputFile} using JSZip (STORE compression)`);
    console.log(`📦 Package size: ${(stats.size / 1024).toFixed(1)} KB`);
    console.log(`📁 Location: ${path.resolve(outputFile)}`);

  } catch (error) {
    console.error('❌ Failed to create package:', error.message);
    process.exit(1);
  }
}

createZip();
