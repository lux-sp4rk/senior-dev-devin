#!/usr/bin/env node
// scripts/dev.js
import { watch } from 'fs';
import { exec } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'src');
const BUILD_SCRIPT = path.join(__dirname, 'build.js');
const PORT = 3000;

// 1. Rebuild Function
const rebuild = () => {
  console.log('[dev] File change detected, rebuilding...');
  exec(`node ${BUILD_SCRIPT}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`[dev] Build error: ${err}`);
      return;
    }
    console.log(stdout.trim());
  });
};

// 2. Watcher
console.log(`[dev] Watching for changes in ${SRC_DIR} and template.html...`);
watch(SRC_DIR, { recursive: true }, (eventType, filename) => {
  if (filename && filename.endsWith('.twee')) {
    rebuild();
  }
});

// Also watch the template file
watch(path.dirname(BUILD_SCRIPT), (eventType, filename) => {
  if (filename === 'template.html') {
    rebuild();
  }
});

// 3. Static Server
const server = http.createServer((req, res) => {
  let filePath = path.join(PROJECT_ROOT, req.url === '/' ? 'index.html' : req.url);

  const extname = path.extname(filePath);
  let contentType = 'text/html';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if(error.code == 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`[dev] Server running at http://localhost:${PORT}`);
  console.log('[dev] Press Ctrl+C to stop');
  // Initial build
  rebuild();
});
