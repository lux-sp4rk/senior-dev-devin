## Project Narrative Style
Refer to [docs/NARRATIVE_STYLE.md](docs/NARRATIVE_STYLE.md) for core heuristics and anti-purple-prose rules.

## Visual Workflow
- **Image Policy:** Every story passage must include an image or an image prompt.
- **Handoff:** Agents generate high-quality **image prompts** (as HTML comments) but do NOT trigger image generation. The actual images are fulfilled by a specialized illustrator agent.
- **Style:** Follow the "Cinematic Pixel-Grit" rules in [docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md).
- **Cheap Iteration Mode:** During drafting, the illustrator agent should use the settings in `.env.nanobanana` to minimize costs.
  - Model: `gemini-3.1-flash-image-preview`
  - Resolution: `1024x1024`
  - Count: `1`
