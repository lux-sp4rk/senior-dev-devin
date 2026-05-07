---
name: twee-modular-project
description: Manage a modular Twee/Twine interactive fiction project. Use this when adding new scenes, updating the build script, or managing the custom rendering engine for Twee files in this repository.
---

# Twee Modular Project Management

This skill provides the workflow and constraints for managing the modular Twine (Twee) project structure and its custom build/rendering pipeline.

## Project Structure

The project follows a modular structure to avoid monolithic file issues:

- `src/metadata/`: Contains `story.twee` with `:: StoryTitle` and `:: StoryData` (IFID, format).
- `src/story/`: Contains scene-based `.twee` files (e.g., `prologue.twee`, `paths.twee`).
- `scripts/build.js`: Compiles all `src/**/*.twee` into a single `index.html`.
- `scripts/template.html`: The HTML/JS engine that renders the story in the browser.

## Critical Constraints

### 1. Naming Convention (The Hyphen Rule)
**ALWAYS use hyphens (`-`) instead of underscores (`_`) for passage names.**
- ✅ `:: path-vimrc`
- ❌ `:: path_vimrc`

**Why?** The custom rendering engine in `template.html` uses a regex that can mistake underscores for Markdown italics (e.g., `path_vimrc` becomes `path<em>vimrc</em>`), which breaks the HTML `data-dest` attribute and causes "Passage not found" errors.

### 2. Link Syntax
The custom engine supports standard Harlowe-style links:
- `[[Display Text->TargetPassage]]` (Recommended for choices)
- `[[TargetPassage<-Display Text]]`
- `[[Display Text|TargetPassage]]`
- `[[TargetPassage]]`

## Workflows

### Adding a New Scene
1. Create a new `.twee` file in `src/story/` (e.g., `src/story/episode-2.twee`).
2. Add passage headers using `:: Passage-Name-With-Hyphens`.
3. Link to existing passages using the hyphenated names.

### Development and Testing
Run the dev server to get live previews and auto-rebuilds:
```bash
npm run dev
```
Access the preview at `http://localhost:3000`. The server watches for changes in `src/` and automatically triggers `scripts/build.js`.

### Manual Build
To generate the final `index.html` without starting a server:
```bash
npm run build
```

## Troubleshooting

### "Passage not found" error
1. Check if the passage name in the `.twee` file matches the link exactly.
2. Ensure no underscores are used in the passage name.
3. Check the browser console to see if the `data-dest` attribute contains HTML tags (italics).
