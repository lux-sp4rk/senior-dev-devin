# GEMINI.md - Project Context

## Project Overview
**Devin the Senior Dev** is an interactive fiction project built using a modular Twine (Twee) structure. It tells a branching narrative about a senior developer facing corporate AI pressures and personal financial stress.

### Core Technologies
- **Twee (Twine):** Source format for the interactive narrative.
- **Node.js:** Powers the custom build and development pipeline.
- **Custom Rendering Engine:** A bespoke HTML/JS engine (defined in `scripts/template.html`) that renders Twee passages in the browser.

### Architecture
- `src/metadata/`: Contains core story metadata (Title, IFID, Start passage).
- `src/story/`: Contains modular `.twee` files for different story parts (prologue, episodes, paths).
- `scripts/`: Contains the build and development logic.
- `index.html`: The compiled output file containing the entire story and engine.

---

## Building and Running

### Development
To start the development server with live rebuilding and a local preview:
```bash
npm run dev
```
- **Preview URL:** `http://localhost:3000`
- **Watcher:** Automatically triggers a rebuild when `.twee` files in `src/` are modified.

### Production Build
To generate the final `index.html` file:
```bash
npm run build
```

---

## Development Conventions

### 1. Naming Convention (Hyphen Rule)
**ALWAYS use hyphens (`-`) instead of underscores (`_`) for passage names.**
- ✅ `:: path-vimrc`
- ❌ `:: path_vimrc`

**Rationale:** The custom rendering engine uses a regex that can misinterpret underscores as Markdown italics (e.g., `path_vimrc` becomes `path<em>vimrc</em>`), breaking the HTML `data-dest` attribute and causing "Passage not found" errors.

### 2. File Organization
- New scenes or episodes should be created as separate `.twee` files in `src/story/`.
- Keep `src/metadata/story.twee` reserved for `:: StoryTitle` and `:: StoryData`.

### 3. Link Syntax
Standard Harlowe-style links are supported:
- `[[Display Text->TargetPassage]]` (Recommended for clarity)
- `[[TargetPassage]]`
- `[[TargetPassage<-Display Text]]`
- `[[Display Text|TargetPassage]]`

### 4. Code Style
- **Build Scripts:** Written in ESM (ES Modules) using Node.js.
- **Twee Files:** Use HTML comments for internal episode markers (e.g., `<!-- EPISODE 1 -->`).
