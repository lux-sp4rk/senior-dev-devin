import { readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');

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

const allFiles = getAllFiles(join(PROJECT_ROOT, 'src')).filter(f => f.endsWith('.twee'));

const passages = new Set();
const links = [];

allFiles.forEach(file => {
  const content = readFileSync(file, 'utf-8');
  const passageRegex = /^::\s*([^\[\n\r]+)(?:\[([^\]]+)\])?/gm;
  let match;
  while ((match = passageRegex.exec(content)) !== null) {
    passages.add(match[1].trim());
  }

  const linkRegex = /\[\[([^\]]+)\]\]/g;
  while ((match = linkRegex.exec(content)) !== null) {
    let linkText = match[1];
    let dest = linkText;
    if (linkText.includes('|')) {
      dest = linkText.split('|')[1].trim();
    } else if (linkText.includes('->')) {
      dest = linkText.split('->')[1].trim();
    } else if (linkText.includes('<-')) {
      dest = linkText.split('<-')[0].trim();
    }
    links.push({ from: file, dest: dest });
  }
});

console.log(`Checking ${passages.size} passages and ${links.size} links...`);

let broken = 0;
links.forEach(link => {
  if (!passages.has(link.dest) && !link.dest.startsWith('lore-') && link.dest !== 'lore-index') {
    console.error(`[BROKEN LINK] In ${link.from.replace(PROJECT_ROOT, '')}: [[${link.dest}]] not found.`);
    broken++;
  }
});

if (broken === 0) {
  console.log('✅ No broken links found.');
} else {
  console.log(`❌ Found ${broken} broken links.`);
  process.exit(1);
}
