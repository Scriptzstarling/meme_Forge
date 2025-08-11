const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "../client/public");
const outputFile = path.join(publicDir, "images.json");

// Read all image files from public
const files = fs.readdirSync(publicDir).filter(file => {
  return /\.(png|jpe?g|gif|webp)$/i.test(file);
});

fs.writeFileSync(outputFile, JSON.stringify(files, null, 2));

console.log(`✅ images.json generated with ${files.length} images`);
