# Image Generation Workflow

This document defines the process for generating and managing visual assets for *Sr Dev Devin*.

## The Handoff Pattern

Agents working on story content do NOT generate images directly. Instead, they must follow this 3-step loop:

1.  **Identify the Scene:** Determine the core emotional or narrative beat of a passage.
2.  **Generate a Prompt:** Create a high-quality image prompt following the [Visual Style Guide](STYLE_GUIDE.md). This prompt should be included as an HTML comment at the top of the passage.
3.  **Handoff to Illustrator:** Flag the need for image fulfillment to a specialized illustrator agent.

## Image Prompt Template

```html
<!-- IMAGE PROMPT: 16-bit cinematic pixel art. [Detailed Scene Description]. [Motifs: Hoodie/Hat/Apple Watch]. Corporate noir, high-contrast, chiaroscuro. -->
```

## Storage & Referencing

-   **Location:** Images are stored in `src/images/`.
-   **Filename Convention:** Use the passage name. `src/images/path-vimrc.png` ✅
-   **Syntax:** Use the Twine image tag: `[img[src/images/filename.png]]`

## Visual Archetypes

| Archetype | Description |
| :--- | :--- |
| **The Terminal** | Amber or green text on black. High bloom. Reflecting off character glasses. |
| **The Office** | Flickering fluorescents, sterile whites (Greg) vs. cluttered shadows (Devin). |
| **The Commute** | Cold streetlights, rain-slicked pavement, distant Audi taillights. |

## Fulfillment Rules

-   **Consistency:** Always reuse existing assets if the scene hasn't changed (e.g., same office angle).
-   **Aspect Ratio:** Always target **16:9** cinematic widescreen.
-   **Style:** Strictly adhere to "Cinematic Pixel-Grit". No generic AI art.
