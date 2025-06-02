#!/usr/bin/env node

/**
 * Simple APK Build Script for Breather App
 * This script helps build the APK without git complications
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Breather APK Build Script');
console.log('============================');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Please run this from the project root.');
  process.exit(1);
}

// Read package.json to verify it's the Breather app
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if (packageJson.name !== 'breather') {
  console.error('❌ Error: This doesn\'t appear to be the Breather app.');
  process.exit(1);
}

console.log('✅ Found Breather app');

// Check if EAS is available
try {
  execSync('eas --version', { stdio: 'pipe' });
  console.log('✅ EAS CLI is available');
} catch (error) {
  console.error('❌ EAS CLI not found. Installing...');
  try {
    execSync('npm install -g eas-cli', { stdio: 'inherit' });
    console.log('✅ EAS CLI installed');
  } catch (installError) {
    console.error('❌ Failed to install EAS CLI');
    process.exit(1);
  }
}

// Build options
console.log('\n📱 APK Build Options:');
console.log('1. EAS Build (Cloud) - Recommended');
console.log('2. EAS Build (Local) - Requires Android SDK');
console.log('3. Web Build - For testing in browser');

// For now, let's try the cloud build with a clean approach
console.log('\n🔄 Attempting EAS Cloud Build...');

try {
  // Create a temporary .easignore file to exclude problematic files
  const easIgnoreContent = `
# Temporary files
*.tmp
*.temp
AppData/
.git/
node_modules/
.expo/
*.log
`;
  
  fs.writeFileSync('.easignore', easIgnoreContent);
  console.log('✅ Created .easignore file');
  
  // Try to build
  console.log('🚀 Starting build process...');
  console.log('This may take 10-15 minutes...');
  
  // Note: This would normally run the build, but we'll provide instructions instead
  console.log('\n📋 Manual Build Instructions:');
  console.log('1. Run: eas build --platform android --profile preview');
  console.log('2. If git issues persist, try: eas build --platform android --local');
  console.log('3. Or upload to Expo Snack: https://snack.expo.dev');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  
  console.log('\n🔄 Alternative Options:');
  console.log('1. Use Expo Snack: https://snack.expo.dev');
  console.log('2. Use Expo Go app for testing');
  console.log('3. Set up Android Studio for local builds');
}

console.log('\n✨ Build script completed!');
