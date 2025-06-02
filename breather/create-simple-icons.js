// Simple script to create basic placeholder PNG icons
const fs = require('fs');
const path = require('path');

// Create a simple base64 encoded 1x1 PNG (transparent)
const createSimplePNG = () => {
  // This is a base64 encoded 1x1 transparent PNG
  return Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg==',
    'base64'
  );
};

// Create a simple colored PNG (blue square)
const createColoredPNG = () => {
  // This is a base64 encoded 1x1 blue PNG
  return Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
};

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
}

// Create simple PNG files
const icons = [
  { name: 'icon.png', colored: true },
  { name: 'adaptive-icon.png', colored: true },
  { name: 'splash-icon.png', colored: true },
  { name: 'favicon.png', colored: true },
];

icons.forEach(icon => {
  const pngData = icon.colored ? createColoredPNG() : createSimplePNG();
  fs.writeFileSync(path.join(assetsDir, icon.name), pngData);
  console.log(`Created ${icon.name}`);
});

console.log('Simple PNG icons created!');
console.log('These are minimal 1x1 pixel placeholders.');
console.log('For production, replace with proper 1024x1024 icons.');
