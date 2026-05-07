# Devin the Senior Dev

An interactive fiction series about a senior dev drowning in corporate AI pressure, financial stress, and bad decisions. Written as branching narrative Twine episodes.

**Start:** Open `index.html` in any browser. No server required.

---

## Episode Structure

Each tweet/X post thread = one Episode in the story. Episodes are written as `.twee` passages and merged into `index.html`.

```
story.twee    ← source of truth (version-controlled)
index.html   ← built artifact (playable)
scripts/
  build.sh    ← story.twee → index.html
```

To write a new episode: add passages to `story.twee`, run `./scripts/build.sh`, commit.

---

## Development

```bash
# Build after editing story.twee
./scripts/build.sh

# Or open index.html directly in browser
open index.html
```

---

## Story Status

- **Episode 1** ✅ — "The Deal" (prologue through three path branches → Monday meeting)
- **Episode 2**.pending — Monday meeting, Greg, "The Guy" arrives

---

## Philosophy

- Senior devs live in terminals — this is terminal-native creative work dressed in HTML
- Short episodes. Punchy. Collectible. Shareable as screen recordings or screenshots
- No auth, no backend, no tracking. Pure static HTML
- Branching narrative rewards bad decisions