import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function getAllFiles(dirPath, arrayOfFiles) {
  const files = readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    const fullPath = join(dirPath, file);
    if (statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles('src').filter(f => f.endsWith('.twee'));

allFiles.forEach(file => {
  const content = readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  const newLines = lines.map(line => {
    // If it's an image prompt comment, revert the linkify
    if (line.includes('IMAGE PROMPT')) {
       return line.replace(/\[\[Greg\|lore-greg\]\]/g, 'Greg');
    }
    return line;
  });

  writeFileSync(file, newLines.join('\n'), 'utf-8');
  console.log(`Cleaned ${file}`);
});
