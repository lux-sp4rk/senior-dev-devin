# ARCHITECTURE.md

> How *Devin the Senior Dev* is built, rendered, and deployed.

---

## Overview

*Devin the Senior Dev* is a browser-based interactive fiction series with a lightweight custom engine. The authoring format is [Twee](https://twinery.org/cookbook/terms/terms_twee.html) (Twine's plain-text syntax), but the project does **not** use Twine's GUI or standard story formats. Instead, it uses a custom Node.js build pipeline and a lightweight runtime engine embedded directly in the output HTML.

This gives us:
- **Plain-text source control** for branching narrative
- **Full control over UI/UX** — the corporate-dystopia aesthetic is the joke
- **JSON-based game state** with `localStorage` persistence
- **Zero production dependencies** — only `vitest` for testing
- **Single-file deploy** to GitHub Pages

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Source format | Twee (`.twee`) |
| Build toolchain | Node.js 20+ (ES modules, zero deps) |
| Runtime engine | Custom vanilla JS (embedded in `index.html`) |
| Styling | Inline CSS (corporate-noir / Rails 3 Bootstrap meta-joke) |
| Testing | Vitest (`npm test`) |
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
│   └── metadata/         # Episode trackers, asset manifests,
│                         # initial-state.json
├── docs/
│   ├── ARCHITECTURE.md   # This file
│   ├── STYLE_GUIDE.md    # Visual style rules for illustrator agent
│   ├── NARRATIVE_STYLE.md# Tone, voice, and prose conventions
│   ├── IMAGE_WORKFLOW.md # Asset generation handoff process
│   └── prompts/          # LLM prompt templates
├── index.html            # Generated artifact (do not edit directly)
├── package.json          # npm scripts: build, dev, test
├── .gitignore            # Excludes node_modules/, .DS_Store, etc.
└── AGENTS.md             # Agent workflow conventions
```

---

## Build Pipeline

### `npm run build`

`scripts/build.js` performs four steps:

1. **Discover** — recursively finds all `.twee` files under `src/`
2. **Parse** — extracts passages from each file using the Twee `:: passage-name [tags]` syntax
3. **Inject** — inserts rendered `<tw-passagedata>` elements and `{{INITIAL_STATE}}` into `scripts/template.html`
4. **Emit** — writes the result to `index.html`

The parser:
- HTML-escapes passage body text
- Splits on `\n:: ` to find passage boundaries
- Extracts name, optional tags, and body
- Stops parsing a passage body if it encounters another `::` at line start

**Passage naming convention:** Always hyphen-case. `:: path-vimrc` ✅ `:: path_vimrc` ❌

### `npm run dev`

`scripts/dev.js`:
- Watches `src/**/*.twee`, `src/metadata/initial-state.json`, and `scripts/template.html` for changes
- Triggers rebuild on file change
- Serves the project root on `http://localhost:3000`
- Runs an initial build on startup

The dev server is a minimal `http.createServer` that serves files from disk with no caching logic.

### `npm test`

Vitest runs story logic and state mutation tests. See test files (not yet in `main`) for coverage of passage consistency and stat mutation validation.

---

## Runtime Engine

The game runs entirely client-side via a self-contained IIFE in `template.html`.

### Passage Store

At boot, the engine queries all `<tw-passagedata>` elements inside `<tw-storydata>` and builds an in-memory map:

```js
passages["intro-greg-office"] = "<escaped HTML body>";
passageTags["intro-greg-office"] = ["lore-trigger"];
```

### State System

Game state is JSON-driven and persisted to `localStorage`:

- **Initial state** is read from `src/metadata/initial-state.json` and embedded into the HTML as `{{INITIAL_STATE}}`
- **Current state** is merged with `localStorage` on load (`sr-dev-devin-state` key)
- **Persistence** happens automatically on every navigation

```json
{
  "devin": {
    "stress": 0
  },
  "unlockedLore": [],
  "lastStoryPassage": "intro-greg-office"
}
```

### Mutation Syntax

Links can carry inline state mutations:

```twee
[[A) Push back | episode-2-rust-callback]]{stress += 10}
```

At runtime, the engine parses `stress += 10` and maps it to `state.devin.stress += 10`. The setter is executed via a lightweight expression evaluator before navigation.

### Rendering Pipeline

The `render()` function processes passage text in this order:

1. **Game Over blocks** — `**GAME OVER: TITLE**` + `*description*` → Rails 3.2 Bootstrap alert box
2. **Markdown-ish formatting**
   - `**bold**` → `<strong>`
   - `_italic_` → `<em>`
3. **Comments → chapter titles or hidden prompts**
   - `<!-- IMAGE PROMPT: ... -->` → stripped (hidden from player)
   - `<!-- Any other text -->` → `<div class="chapter-title">`
4. **Dev notes**
   - `[//]: ...` → stripped
5. **Conditional blocks**
   - `{{if condition}}...{{else}}...{{/if}}` — rendered based on current state (lore unlocks, etc.)
6. **Images**
   - `[img[src/images/foo.png]]` → `<img>`
7. **Links**
   - `[[display text|destination]]`
   - `[[display text->destination]]`
   - `[[destination<-display text]]`
   - `[[destination]]` (simple self-link)
   - All rendered as `<a class="tw-link btn-rails-3" data-dest="...">`
   - Links with setters get `data-setter="..."` for runtime mutation
8. **Line breaks**
   - `\n` → `<br>`

### Navigation

Clicking a link calls `go(destination)`, which:
1. Executes any `data-setter` mutation
2. Saves state to `localStorage`
3. Looks up the passage in the store
4. Renders it via `render()`
5. Injects it into `#game` along with a nav header
6. Re-binds click handlers on the new links

The start passage is defined by the `start` attribute on `<tw-storydata>`, but the engine resumes from `state.lastStoryPassage` if a saved game exists.

### Stress HUD

A gradient bar (green → red) in the navbar shows `state.devin.stress` as a percentage. Updated on every navigation.

### Lorebook Modal

`lore-*` passages are treated as collectible entries:
- Clicking a `lore-*` link opens a Bootstrap 3-style modal instead of navigating
- Unlocked lore IDs are tracked in `state.unlockedLore`
- A **Lore** link appears in the navbar once any lore is unlocked
- `lore-index` dynamically lists all discovered entries

### Dev Mode

Append `?dev=1` to the URL to show passage names in the navbar breadcrumb. Hidden by default for immersion.

### Visual Layer

The UI is a deliberate meta-joke: **Rails 3-era Bootstrap** styling.
- Navbar with gradient backgrounds, text shadows, uppercase labels
- `.btn-rails-3` links styled like 2011 Twitter Bootstrap primary buttons
- JetBrains Mono typeface, terminal-amber link colors
- Dark `#0a0a0a` background
- Modal dialogs in Bootstrap 3.2 style

This aesthetic choice reinforces the story's themes: legacy tech, corporate nostalgia, and the absurdity of "AI acceleration" built on top of fragile foundations.

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
- **Lore passages** — prefixed `lore-*`, rendered in modal, tracked in state

### Branching Model

Choices are presented as explicit A/B (sometimes C) options. State mutations (`stress += 10`) create implicit narrative branches — the same passage may read differently depending on accumulated stats. No hidden dice rolls; all state changes are explicit in the link syntax.

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

## Engine Evolution

### Should we switch to a "real" engine?

**Short answer: no.** Not yet.

The custom engine is not a liability — it's a deliberate design choice that enables the project's identity. Here's why switching to Harlowe, SugarCube, or another story format would cost more than it gains:

| Concern | Custom Engine | Story Format |
|---|---|---|
| **Visual identity** | Full control — Rails 3 Bootstrap, stress HUD, lore modal are native | Would require fighting the format's UI layer |
| **State syntax** | `[[Link\|Dest]]{stress += 10}` is ergonomic and diff-friendly | SugarCube macros are verbose; Harlowe is restrictive |
| **Lorebook** | Modal overlay with dynamic index — trivial | Would require significant macro workarounds |
| **Dependencies** | Zero production deps | Adds upstream dependency + migration risk |
| **Testing** | Vitest tests story logic directly | Would need format-specific test harnesses |

**The real problem** isn't the engine's capabilities — it's that the engine is currently a ~600-line IIFE crammed into `template.html`. It has outgrown its inline-script phase.

### Recommended path: modularize, don't migrate

Instead of swapping engines, graduate the current one:

```
scripts/engine/
├── state.js          # initialState, loadState(), saveState(), mutation parser
├── render.js         # render(), markdown, conditionals, images, links
├── navigation.js     # go(), history, passage lookup
├── lorebook.js       # openLoreModal(), lore-index builder
├── ui.js             # stress bar, navbar, game-over blocks, dev mode
└── main.js           # Boot sequence, event binding
```

The build step would bundle these into the IIFE that gets injected into `template.html`. The runtime API stays the same; the authoring experience stays the same. The only thing that changes is the engine becomes maintainable.

**When to reconsider migration:**
- If you add inventory, combat, or time-based mechanics
- If you hit 20+ episodes and need a save-slot system
- If you want multiplayer or server-side state

Until then, the custom engine is a feature, not a bug.

---

## Extension Points

If you want to modify the engine or pipeline:

| Change | Where |
|--------|-------|
| Add new passage syntax | `scripts/build.js` → `parsePassages()` |
| Change rendering rules | `scripts/template.html` → `render()` |
| Modify UI theme | `scripts/template.html` → `<style>` |
| Add state fields | `src/metadata/initial-state.json` + `render()` conditionals |
| Change mutation syntax | `template.html` → link click handler, `eval()` replacement |
| New build output | `scripts/build.js` → `OutputFile` |
| Dev server port | `scripts/dev.js` → `PORT` |
| Add tests | Vitest test files alongside `src/` |

---

## Design Decisions

**Why custom engine instead of Harlowe/SugarCube?**
> Full control over the visual layer and rendering pipeline. The Rails 3 Bootstrap aesthetic is the joke — a standard story format would fight us at every turn.

**Why commit `index.html`?**
> GitHub Pages serves static files from the repo. No CI runner needed. Agents can build and commit in one step.

**Why Twee instead of JSON/YAML?**
> Twee is the native authoring format for interactive fiction writers. The `[[link]]` syntax is ergonomic and diff-friendly.

**Why zero production dependencies?**
> The build pipeline is trivial (file I/O + string manipulation). Adding dependencies would slow agent setup and increase supply-chain risk for no benefit.

**Why `node_modules/` is gitignored?**
> It was accidentally committed in an early PR. Vendor directories bloat clones, break diffs, and create merge conflicts. `npm install` is the source of truth.
