# AGENTS.md — senior-dev-devin / PR #21

## Worktree Setup

This is a **worktree** off the main repo at `~/Projects/senior-dev-devin`.

```
~/Projects/senior-dev-devin/              ← main repo, branch pr-18
~/Projects/senior-dev-devin-pr21/        ← THIS worktree, branch narrative/character-friction-and-backstory
```

**Symlink:** `./projects/` in agent workspaces → `~/Projects/`

---

## Branch

`narrative/character-friction-and-backstory` → PR #21

## Conventions

- Branch naming: `narrative/`, `fix/`, `feat/` prefixes
- Commits: conventional commits (`feat(narrative):`, `fix(ci):`, etc.)
- CI: Gemini CLI handles review/triage/invoke via `.github/workflows/`
- **Passage names:** always hyphens, never underscores

## Tech Stack

- **Twine/Twee**: `src/story/` — modular story files
- **Node.js**: `npm run build`, `npm run dev`
- Passage naming: `:: my-passage` ✅ | `:: my_passage` ❌

## Repo

`lux-sp4rk/senior-dev-devin` — interactive fiction, Twine-based
