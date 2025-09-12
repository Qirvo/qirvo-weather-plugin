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
  'package-zip.js',
  '*.zip',
  '*.tgz'
];

try {
  // Use 7zip if available, otherwise use PowerShell
  try {
    // Try 7zip first (more reliable)
    const includeArgs = filesToInclude.map(f => `"${f}"`).join(' ');
    const excludeArgs = filesToExclude.map(f => `-xr!"${f}"`).join(' ');
    
    execSync(`7z a "${outputFile}" ${includeArgs} ${excludeArgs}`, { stdio: 'inherit' });
    console.log(`✅ Created ${outputFile} using 7zip`);
  } catch (error) {
    // Fallback to PowerShell
    console.log('7zip not found, using PowerShell...');
    
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

    // Copy essential files
    if (fs.existsSync('manifest.json')) copyFile('manifest.json', path.join(tempDir, 'manifest.json'));
    if (fs.existsSync('README.md')) copyFile('README.md', path.join(tempDir, 'README.md'));
    if (fs.existsSync('package.json')) copyFile('package.json', path.join(tempDir, 'package.json'));
    
    // Copy dist directory if it exists
    if (fs.existsSync('dist')) {
      execSync(`xcopy /E /I /Y "dist" "${tempDir}\\dist"`, { stdio: 'inherit' });
    }

    // Create ZIP using PowerShell
    const powershellCmd = `Compress-Archive -Path "${tempDir}\\*" -DestinationPath "${outputFile}" -Force`;
    execSync(`powershell -Command "${powershellCmd}"`, { stdio: 'inherit' });
    
    // Cleanup
    fs.rmSync(tempDir, { recursive: true, force: true });
    
    console.log(`✅ Created ${outputFile} using PowerShell`);
  }
  
  // Show file info
  const stats = fs.statSync(outputFile);
  console.log(`📦 Package size: ${(stats.size / 1024).toFixed(1)} KB`);
  console.log(`📁 Location: ${path.resolve(outputFile)}`);
  
} catch (error) {
  console.error('❌ Failed to create package:', error.message);
  process.exit(1);
}
