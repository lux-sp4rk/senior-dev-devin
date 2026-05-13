# AGENTS.md — senior-dev-devin

## Worktree Map

```
~/Projects/senior-dev-devin/             ← main repo, branch pr-18
~/Projects/senior-dev-devin-pr21/       ← branch narrative/character-friction-and-backstory (PR #21)
```

**Symlink:** `./projects/` in agent workspaces → `~/Projects/`

Each worktree is a completely separate Git checkout. Switching branches = switching directories. No `git checkout`, no `git stash`.

---

## Branch Conventions

| Prefix | What | Example |
|--------|------|---------|
| `pr-N` | Long-lived feature branch | `pr-18` |
| `narrative/` | Story content work | `narrative/character-friction-and-backstory` |
| `fix/` | Bug or CI fixes | `fix/nodejs20-deprecation-warning` |
| `feat/` | New features | — |

Never commit directly to `main`. All changes go through a branch → PR → review → merge.

---

## Adding a Worktree

```bash
# From the main repo
cd ~/Projects/senior-dev-devin
git fetch origin <branch>
git worktree add ~/Projects/senior-dev-devin-pr<NUM> <branch-name>

# Then tell the agent which directory to work in
# e.g., "work in ~/Projects/senior-dev-devin-pr21"
```

---

## GitHub Flow

1. Agent or Uli creates a branch: `git checkout -b narrative/new-scene`
2. Work happens in the appropriate worktree
3. Push and open PR: `gh pr create`
4. CI runs automatically (Gemini Dispatch workflow)
5. **Uli approves/merges** — agents do not merge without Uli sign-off
6. After merge: delete the branch locally and on GitHub

---

## Project Tech Stack

- **Twine/Twee**: Modular story files in `src/story/`
- **Node.js**: Build pipeline (`npm run build`, `npm run dev`)
- **Custom HTML/JS engine**: Renders compiled `index.html`

**Build:**
```bash
npm run build   # compiles src/**/*.twee → index.html
npm run dev     # live-reload dev server
```

**Passage naming:** Always use hyphens, not underscores. `:: path-vimrc` ✅ `:: path_vimrc` ❌

---

## Uli as the Bottleneck

**Rule of thumb:** If you're asking "should I…?" — you probably shouldn't be doing it. Agents should act autonomously within their domain. Uli's job is to:
- Review and merge PRs
- Make creative/strategic calls
- Say yes or no to publication-gate decisions

**Agents should:**
- Propose, not ask permission
- Execute without waiting for confirmation on routine tasks
- Flag blockers explicitly: "can't proceed until Uli approves X"

**To reduce friction:**
- Never loop asking for confirmation on multi-step work
- Use `--handoff` at end of session if Uli needs to do something next
- Check `memory/` before assuming what's been decided
