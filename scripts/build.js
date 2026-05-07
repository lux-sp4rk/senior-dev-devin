#!/usr/bin/env node
// devin-the-senior-dev/scripts/build.js
// Build index.html from story.twee + template.html

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(__dirname, '..');
const TweeFile = resolve(PROJECT_DIR, 'story.twee');
const OutputFile = resolve(PROJECT_DIR, 'index.html');
const TemplateFile = resolve(__dirname, 'template.html');

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function parsePassages(content) {
  // Match Python re.split behavior: prepend newline so the regex split produces
  // 9 chunks (1 empty + 7 passages + 1 trailing), matching passages[1:]
  const raw = ('\n' + content).split('\n:: ');
  const passages = [];

  for (const block of raw.slice(1)) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    const lines = trimmed.split('\n');
    const nameLine = lines[0];
    // Match passage name + optional tags
    const match = nameLine.match(/^(\S+)(.*)$/);
    const name = match ? match[1] : nameLine;
    const tagStr = match && match[2] ? match[2].trim() : '';

    // Collect body lines until next passage marker or end
    const bodyLines = [];
    for (const line of lines.slice(1)) {
      if (line.trimStart().startsWith('::')) break;
      bodyLines.push(line);
    }

    const body = escapeHtml(bodyLines.join('\n'));
    const tagAttr = tagStr ? ` tags="${tagStr}"` : '';
    passages.push(`<tw-passagedata name="${name}"${tagAttr}>${body}</tw-passagedata>`);
  }

  return passages.join('\n');
}

function build() {
  // Read source files
  const twee = readFileSync(TweeFile, 'utf-8');
  const template = readFileSync(TemplateFile, 'utf-8');

  // Parse passages from .twee
  const passagesHtml = parsePassages(twee);

  // Inject into template
  const html = template.replace('{{PASSAGES}}', passagesHtml);

  // Write output
  writeFileSync(OutputFile, html, 'utf-8');

  console.log('[build] story.twee → index.html');
  console.log(`[build] done (${passagesHtml.split('<tw-passagedata').length - 1} passages)`);
}

build();