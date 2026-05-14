# ARCHITECTURE.md

> How *Sr. Dev Devin* is built, rendered, and deployed.

---

## Overview

*Sr. Dev Devin* is a browser-based interactive fiction series. The authoring format is [Twee](https://twinery.org/cookbook/terms/terms_twee.html) (Twine's plain-text syntax), but the project does **not** use Twine's GUI or standard story formats. Instead, it uses a custom Node.js build pipeline and a lightweight runtime engine embedded directly in the output HTML.

This gives us:
- **Plain-text source control** for branching narrative
- **A custom visual layer** (corporate-dystopia pixel aesthetic) without fighting a story format
- **Zero build dependencies** beyond Node.js built-ins
- **Single-file deploy** to GitHub Pages

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Source format | Twee (`.twee`) |
| Build toolchain | Node.js 20+ (ES modules, no deps) |
| Runtime engine | Custom vanilla JS (embedded in `index.html`) |
| Styling | Inline CSS (corporate-noir theme) |
| Hosting | GitHub Pages |
| Asset pipeline | Image prompts in source → illustrator agent → `src/images/` |

---

## Repository Layout

```
senior-dev-devin/
├── scripts/
│   ├── build.js          # Compiles src/**/*.twee → index.html
│   ├── dev.js            # File watcher + static server on :3000
│   └── template.html     # HTML shell + CSS + runtime engine
├── src/
│   ├── story/            # Passage source files (.twee)
│   ├── characters/       # Character definitions / profiles
│   ├── images/           # Generated pixel-art assets
│   └── metadata/         # Episode trackers, asset manifests
├── docs/
│   ├── ARCHITECTURE.md   # This file
│   ├── STYLE_GUIDE.md    # Visual style rules for illustrator agent
│   ├── NARRATIVE_STYLE.md# Tone, voice, and prose conventions
│   └── prompts/          # LLM prompt templates for content generation
├── index.html            # Generated artifact (do not edit directly)
├── package.json          # npm scripts: build, dev
└── AGENTS.md             # Agent workflow conventions
```

---

## Build Pipeline

### `npm run build`

`scripts/build.js` performs three steps:

1. **Discover** — recursively finds all `.twee` files under `src/`
2. **Parse** — extracts passages from each file using the Twee `:: passage-name [tags]` syntax
3. **Inject** — inserts rendered `<tw-passagedata>` elements into `scripts/template.html` at the `{{PASSAGES}}` placeholder
4. **Emit** — writes the result to `index.html`

The parser:
- HTML-escapes passage body text
- Splits on `\n:: ` to find passage boundaries
- Extracts name, optional tags, and body
- Stops parsing a passage body if it encounters another `::` at line start

**Passage naming convention:** Always hyphen-case. `:: episode-2-monday` ✅ `:: episode_2_monday` ❌

### `npm run dev`

`scripts/dev.js`:
- Watches `src/**/*.twee` and `scripts/template.html` for changes
- Triggers rebuild on file change
- Serves the project root on `http://localhost:3000`
- Runs an initial build on startup

The dev server is a minimal `http.createServer` that serves files from disk with no caching logic.

---

## Runtime Engine

The game runs entirely client-side via a self-contained IIFE in `template.html`.

### Passage Store

At boot, the engine queries all `<tw-passagedata>` elements inside `<tw-storydata>` and builds an in-memory map:

```js
passages["intro-greg-office"] = "<escaped HTML body>";
```

### Rendering Pipeline

The `render()` function processes passage text in this order:

1. **Markdown-ish formatting**
   - `**bold**` → `<strong>`
   - `_italic_` → `<em>`

2. **Comments → chapter titles or hidden prompts**
   - `<!-- IMAGE PROMPT: ... -->` → stripped (hidden from player)
   - `<!-- Any other text -->` → `<div class="chapter-title">`

3. **Dev notes**
   - `[//]: ...` → stripped

4. **Images**
   - `[img[src/images/foo.png]]` → `<img>`

5. **Links**
   - `[[display text|destination]]`
   - `[[display text->destination]]`
   - `[[destination<-display text]]`
   - `[[destination]]` (simple self-link)
   - All rendered as `<a class="tw-link btn-rails-3" data-dest="...">`

6. **Line breaks**
   - `\n` → `<br>`

### Navigation

Clicking a link calls `go(destination)`, which:
1. Looks up the passage in the store
2. Renders it via `render()`
3. Injects it into `#game` along with a nav header showing the passage name
4. Re-binds click handlers on the new links

The start passage is defined by the `start` attribute on `<tw-storydata>`.

### Visual Layer

The UI is a deliberate meta-joke: **Rails 3-era Bootstrap** styling.
- Navbar with gradient backgrounds, text shadows, uppercase labels
- `.btn-rails-3` links styled like 2011 Twitter Bootstrap primary buttons
- JetBrains Mono typeface, terminal-amber link colors
- Dark `#0a0a0a` background

This aesthetic choice reinforces the story's themes: legacy tech, corporate nostalgia, and the absurdity of "AI acceleration" built ontop of fragile foundations.

---

## Story Architecture

### Episodic Structure

The narrative is organized into episodes, each composed of many passages (nodes):

| Episode | Status | Start Passage |
|---------|--------|---------------|
| 1 — "The Deal" | Complete | `intro-greg-office` |
| 2 — "The Conductor's Song" | In progress | `episode-2-monday` |
| 3 — "The Breach" | Planned | TBD |

### Passage Types

- **Scene passages** — narrative text + player choices (`[[A) ...->dest]]`)
- **Bridge passages** — single `[[Next->dest]]` transition for pacing
- **End passages** — episode finales with restart links

### Branching Model

Choices are presented as explicit A/B (sometimes C) options. There is no hidden state or inventory system — the engine supports only simple link-based branching. Any narrative state (e.g., "Devin gave Kieran full access") is implicit in which passage the player reached.

### Asset Integration

Every passage should include an image prompt comment:

```twee
<!-- IMAGE PROMPT: A wide cinematic shot of... 16-bit pixel art, corporate noir. -->
```

These prompts are stripped at build time. The actual images are generated separately by an illustrator agent and placed in `src/images/`, then referenced via `[img[src/images/...]]` in the passage body.

---

## Deployment

`index.html` is a self-contained static file. It is deployed to GitHub Pages from the `main` branch. No build step runs on CI — `index.html` is checked into the repo and rebuilt locally (or by agent) before push.

**Play URL:** https://lux-sp4rk.github.io/senior-dev-devin

---

## Agent Workflow

This project is maintained by multiple AI agents. See `AGENTS.md` for full conventions. Key architectural implications:

- **Git worktrees** for parallel branch work (no `git checkout`/`git stash`)
- **Branch prefixes:** `narrative/`, `fix/`, `feat/`, `pr-N`
- **No direct main commits** — everything goes through PR + Uli review
- **Image generation is out-of-band** — agents write prompts, illustrators generate assets
- **Build artifacts (`index.html`) are committed** — there is no CI build step

---

## Extension Points

If you want to modify the engine or pipeline:

| Change | Where |
|--------|-------|
| Add new passage syntax | `scripts/build.js` → `parsePassages()` |
| Change rendering rules | `scripts/template.html` → `render()` |
| Modify UI theme | `scripts/template.html` → `<style>` |
| Add state/variables | Requires engine extension in `go()` / `render()` |
| New build output | `scripts/build.js` → `OutputFile` |
| Dev server port | `scripts/dev.js` → `PORT` |

---

## Design Decisions

**Why custom engine instead of Harlowe/SugarCube?**
> Full control over the visual layer and rendering pipeline. The Rails 3 Bootstrap aesthetic is the joke — a standard story format would fight us.

**Why commit `index.html`?**
> GitHub Pages serves static files from the repo. No CI runner needed. Agents can build and commit in one step.

**Why Twee instead of JSON/YAML?**
> Twee is the native authoring format for interactive fiction writers. The `[[link]]` syntax is ergonomic and diff-friendly.

**Why zero npm dependencies?**
> The build pipeline is trivial (file I/O + string manipulation). Adding dependencies would slow agent setup and increase supply-chain risk for no benefit.
