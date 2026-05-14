import { readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..');

export class StoryGraph {
  constructor() {
    this.passages = new Map();
  }

  load() {
    const srcDir = join(PROJECT_ROOT, 'src');
    const files = this.getAllFiles(srcDir).filter(f => f.endsWith('.twee'));
    
    files.forEach(file => {
      const content = readFileSync(file, 'utf-8');
      // Split by "::" at the start of a line
      const rawPassages = content.split(/^::/m).filter(p => p.trim() !== '');
      
      rawPassages.forEach(raw => {
        const lines = raw.split('\n');
        const header = lines[0].trim();
        const body = lines.slice(1).join('\n');
        
        // Parse header: name [tags]
        let name = header;
        let tags = [];
        const tagMatch = header.match(/([^\[]+)\[([^\]]+)\]/);
        if (tagMatch) {
          name = tagMatch[1].trim();
          tags = tagMatch[2].split(' ').map(t => t.trim());
        }

        const links = [];
        const loreLinks = [];
        const linkRegex = /\[\[([^\]]+)\]\](?:\{([^\}]+)\})?/g;
        let linkMatch;
        while ((linkMatch = linkRegex.exec(body)) !== null) {
          let linkContent = linkMatch[1];
          let setter = linkMatch[2] ? linkMatch[2].trim() : null;
          let original = linkMatch[0]; // Capture the whole match including {}
          let text = linkContent;
          let dest = linkContent;
          
          if (linkContent.includes('|')) {
            const parts = linkContent.split('|');
            text = parts[0].trim();
            dest = parts[1].trim();
          } else if (linkContent.includes('->')) {
            const parts = linkContent.split('->');
            text = parts[0].trim();
            dest = parts[1].trim();
          } else if (linkContent.includes('<-')) {
            const parts = linkContent.split('<-');
            text = parts[1].trim();
            dest = parts[0].trim();
          }
          
          const linkObj = { text, dest, original, setter };
          if (dest.startsWith('lore-') || dest === 'lore-index') {
            loreLinks.push(linkObj);
          } else {
            links.push(linkObj);
          }
        }
        
        this.passages.set(name, { tags, body, links, loreLinks });
      });
    });
  }

  getAllFiles(dirPath, arrayOfFiles = []) {
    const files = readdirSync(dirPath);
    files.forEach(file => {
      const fullPath = join(dirPath, file);
      if (statSync(fullPath).isDirectory()) {
        arrayOfFiles = this.getAllFiles(fullPath, arrayOfFiles);
      } else {
        arrayOfFiles.push(fullPath);
      }
    });
    return arrayOfFiles;
  }

  walk(startPassage, choices) {
    let current = startPassage;
    for (const choice of choices) {
      const p = this.passages.get(current);
      if (!p) throw new Error(`Passage not found: ${current}`);
      
      let next;
      if (typeof choice === 'number') {
        next = p.links[choice];
      } else if (choice instanceof RegExp) {
        next = p.links.find(l => choice.test(l.text));
      } else {
        next = p.links.find(l => l.text.includes(choice));
      }

      if (!next) {
        const available = p.links.map(l => `"${l.text}"`).join(', ');
        throw new Error(`Choice "${choice}" not available in ${current}. Available story choices: ${available}`);
      }
      current = next.dest;
    }
    return current;
  }
}
