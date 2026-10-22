const fs = require('fs');
const path = require('path');

// Read image header dimensions without external library
function getImageSize(buffer) {
  // PNG
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { type: 'png', width, height };
  }
  // JPEG
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];
      if (marker === 0xc0 || marker === 0xc2) {
        const height = buffer.readUInt16BE(offset + 5);
        const width = buffer.readUInt16BE(offset + 7);
        return { type: 'jpeg', width, height };
      }
      offset += 2 + buffer.readUInt16BE(offset + 2);
    }
  }
  return { type: 'unknown', width: null, height: null };
}

function scanDir(dir, relPath = '') {
  const items = fs.readdirSync(dir);
  let results = [];
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const currentRel = relPath ? `${relPath}/${item}` : item;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(scanDir(fullPath, currentRel));
    } else if (/\.(jpg|jpeg|png|webp|gif)$/i.test(item)) {
      try {
        const buf = fs.readFileSync(fullPath);
        const size = getImageSize(buf);
        results.push({
          file: currentRel,
          bytes: stat.size,
          width: size.width,
          height: size.height,
          type: size.type
        });
      } catch (e) {
        results.push({ file: currentRel, bytes: stat.size, error: e.message });
      }
    }
  });
  return results;
}

const assets = scanDir(path.join(process.cwd(), 'public', 'asset'));
console.log('Total images found:', assets.length);
assets.forEach(a => {
  console.log(`${a.file} | ${a.width}x${a.height} | ${(a.bytes / 1024).toFixed(1)} KB`);
});
