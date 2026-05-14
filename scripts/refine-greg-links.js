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
  let foundGregInPassage = false;
  
  const newLines = lines.map(line => {
    // Reset state on new passage
    if (line.trim().startsWith('::')) {
      foundGregInPassage = false;
      return line;
    }

    // Skip image prompts
    if (line.includes('IMAGE PROMPT')) {
      return line;
    }

    // Replace [[Greg|lore-greg]] with Greg, but keep the first one
    let newLine = line;
    const linkPattern = /\[\[Greg\|lore-greg\]\]/g;
    
    newLine = line.replace(linkPattern, (match) => {
      if (!foundGregInPassage) {
        foundGregInPassage = true;
        return match;
      }
      return 'Greg';
    });

    return newLine;
  });

  writeFileSync(file, newLines.join('\n'), 'utf-8');
  console.log(`Refined links in ${file}`);
});
