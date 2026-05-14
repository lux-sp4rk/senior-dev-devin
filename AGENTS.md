# AGENTS.md — senior-dev-devin

## Worktree Map

```
~/Projects/senior-dev-devin/             ← main repo, branch main
~/Projects/senior-dev-devin-pr27/       ← branch narrative/rust-hr-ending-refinement (PR #27)
```

**Symlink:** `./projects/` in agent workspaces → `~/Projects/`

Each worktree is a completely separate Git checkout. Switching branches = switching directories. No `git checkout`, no `git stash`.

---

## Game State & Logic

The project uses a JSON-based game state system combined with custom Twee syntax.

-   **Initial State:** Defined in `src/metadata/initial-state.json`.
-   **Mutation Syntax:** `[[Choice | Destination]]{stat += 10}`.
-   **Current Stats:**
    -   `stress`: Tracks Devin's burnout levels. Displayed in the UI navbar.
-   **Persistence:** State is saved to `localStorage` on every navigation.

---

## Image Workflow

**Rule:** Every story path (passage) must have an accompanying image.
-   **Policy:** Follow [docs/IMAGE_WORKFLOW.md](docs/IMAGE_WORKFLOW.md).
-   **Agent Role:** Do NOT generate the image yourself. Create a high-quality **image prompt** (as an HTML comment) based on [docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md).
-   **Handoff:** Flag for a specialized illustrator agent.

---

## Build & Test

```bash
npm run build   # compiles src/**/*.twee → index.html
npm run dev     # live-reload dev server (http://localhost:3000)
npm test        # runs story logic and state mutation tests
```

**Dev Mode:** Append `?dev=1` to the URL in the browser to see passage names in the navbar.

---

## Passage Conventions

-   **Naming:** Always use hyphens, not underscores. `:: path-vimrc` ✅ `:: path_vimrc` ❌
-   **Visuals:** Every passage MUST have an `[img[src/images/passage-name.png]]` tag or a prompt comment.

---

## Uli as the Bottleneck

**Rule of thumb:** If you're asking "should I…?" — you probably shouldn't be doing it. Agents should act autonomously. Uli's job is to:
- Review and merge PRs
- Make creative/strategic calls
- Say yes or no to publication-gate decisions
