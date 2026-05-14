#!/usr/bin/env node
// devin-the-senior-dev/scripts/build.js
// Build index.html from src/**/*.twee + template.html

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_DIR = resolve(__dirname, "..");
const SRC_DIR = resolve(PROJECT_DIR, "src");
const OutputFile = resolve(PROJECT_DIR, "index.html");
const TemplateFile = resolve(__dirname, "template.html");
const InitialStateFile = resolve(SRC_DIR, "metadata", "initial-state.json");

function getAllTweeFiles(dirPath, arrayOfFiles) {
  const files = readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (statSync(join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllTweeFiles(join(dirPath, file), arrayOfFiles);
    } else {
      if (file.endsWith(".twee")) {
        arrayOfFiles.push(join(dirPath, file));
      }
    }
  });

  return arrayOfFiles;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function parsePassages(content) {
  const raw = ("\n" + content).split("\n:: ");
  const passages = [];

  for (const block of raw.slice(1)) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    const lines = trimmed.split("\n");
    const nameLine = lines[0];
    const match = nameLine.match(/^(\S+)(.*)$/);
    const name = match ? match[1] : nameLine;
    const tagStr = match && match[2] ? match[2].trim() : "";

    const bodyLines = [];
    for (const line of lines.slice(1)) {
      if (line.trimStart().startsWith("::")) break;
      bodyLines.push(line);
    }

    const body = escapeHtml(bodyLines.join("\n"));
    const tagAttr = tagStr ? ` tags="${tagStr}"` : "";
    passages.push(
      `<tw-passagedata name="${name}"${tagAttr}>${body}</tw-passagedata>`,
    );
  }

  return passages.join("\n");
}

function build() {
  // Find all .twee files in src/
  const tweeFiles = getAllTweeFiles(SRC_DIR);
  console.log(`[build] Found ${tweeFiles.length} .twee files`);

  // Combine contents
  let combinedTwee = "";
  tweeFiles.forEach((file) => {
    combinedTwee += "\n" + readFileSync(file, "utf-8");
  });

  const template = readFileSync(TemplateFile, "utf-8");

  // Parse passages
  const passagesHtml = parsePassages(combinedTwee);

  // Read initial state
  const initialState = readFileSync(InitialStateFile, "utf-8");

  // Inject into template
  let html = template.replace("{{PASSAGES}}", passagesHtml);
  html = html.replace("{{INITIAL_STATE}}", initialState);

  // Write output
  writeFileSync(OutputFile, html, "utf-8");

  console.log("[build] src/**/*.twee → index.html");
  console.log(
    `[build] done (${passagesHtml.split("<tw-passagedata").length - 1} passages)`,
  );
}

build();
