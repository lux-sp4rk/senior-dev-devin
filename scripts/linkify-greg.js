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

const allFiles = getAllFiles('src').filter(f => f.endsWith('.twee') && !f.endsWith('greg.twee'));

allFiles.forEach(file => {
  const content = readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  const newLines = lines.map(line => {
    if (line.trim().startsWith('::') || line.includes('[img[')) {
      return line;
    }
    // Regex explanation:
    // (?<!\[\[|-)  - Not preceded by [[ or -
    // Greg         - The name
    // (?!-|\|)     - Not followed by - or | (to avoid breaking [[Greg|lore-greg]])
    return line.replace(/(?<!\[\[|-)Greg(?!-|\|)/g, '[[Greg|lore-greg]]');
  });

  writeFileSync(file, newLines.join('\n'), 'utf-8');
  console.log(`Updated ${file}`);
});
