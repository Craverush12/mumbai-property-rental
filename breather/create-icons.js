// Simple script to create placeholder icons
// Run this with: node create-icons.js

const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
const createSVGIcon = (size, color = '#6366F1') => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${color}" rx="${size * 0.1}"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size * 0.3}" fill="white" opacity="0.9"/>
  <text x="${size/2}" y="${size/2 + size * 0.05}" text-anchor="middle" fill="${color}" font-family="Arial" font-size="${size * 0.15}" font-weight="bold">B</text>
</svg>`;
};

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
}

// Create SVG icons
const icons = [
  { name: 'icon.svg', size: 1024 },
  { name: 'adaptive-icon.svg', size: 1024 },
  { name: 'splash-icon.svg', size: 1024 },
  { name: 'favicon.svg', size: 32 },
];

icons.forEach(icon => {
  const svgContent = createSVGIcon(icon.size);
  fs.writeFileSync(path.join(assetsDir, icon.name), svgContent);
  console.log(`Created ${icon.name}`);
});

console.log('Placeholder icons created! You can convert these SVGs to PNG files online or use image editing software.');
console.log('For now, you can also rename any square image files to:');
console.log('- icon.png (1024x1024)');
console.log('- adaptive-icon.png (1024x1024)');
console.log('- splash-icon.png (1024x1024)');
console.log('- favicon.png (32x32)');
