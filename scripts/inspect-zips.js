const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Using AdmZip or PowerShell command or native node
const { execSync } = require('child_process');

const zipFiles = [
  'alokadhivationposter2026.zip',
  'listofmemberswithdesignation.zip',
  'photo.zip',
  'topofwebsite.zip'
];

zipFiles.forEach(zf => {
  const p = path.join(process.cwd(), 'public', 'asset', zf);
  console.log(`\n=== ZIP: ${zf} ===`);
  try {
    const output = execSync(`powershell -NoProfile -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::OpenRead('${p.replace(/\\/g, '/')}').Entries | Select-Object -Property FullName, Length | Format-Table -AutoSize"`).toString();
    console.log(output);
  } catch (err) {
    console.error('Error reading zip:', err.message);
  }
});
