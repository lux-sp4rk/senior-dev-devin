# Devin the Senior Dev

An interactive fiction series about a senior dev drowning in corporate AI pressure.

## Features
- **Modular Twee Engine:** Built with a custom Node.js pipeline.
- **Game State System:** Tracks "Stress" and other metrics via JSON.
- **Lorebook:** Persistent discovery system for character backstories and corporate secrets.
- **Cinematic Pixel-Grit:** A unique visual style blending 16-bit art with corporate noir.

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Runs a local server at [http://localhost:3000](http://localhost:3000).

### Build
```bash
npm run build
```
Compiles all `.twee` files in `src/` into a single `index.html`.

### Testing
```bash
npm test
```
Verifies story path consistency and game state mutations.

## Documentation
- [AGENTS.md](AGENTS.md): Instructions for AI collaborators.
- [Visual Style Guide](docs/STYLE_GUIDE.md): Guidelines for the "Cinematic Pixel-Grit" aesthetic.
- [Narrative Style Guide](docs/NARRATIVE_STYLE.md): Literary heuristics for the series.
- [Image Workflow](docs/IMAGE_WORKFLOW.md): How images are prompted and fulfilled.

## Project Structure
- `src/story/`: Modular Twee files.
- `src/metadata/`: Initial game state and story metadata.
- `scripts/`: Build pipeline and development tools.
- `assets/`: Global CSS and fonts.
