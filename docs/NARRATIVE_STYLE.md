# Narrative Style Guide: Sr Dev Devin

This document defines the literary heuristics and stylistic rules for the "Sr Dev Devin" interactive narrative.

## Core Tone
- **Gritty & Cynical:** The perspective of a burnout senior dev.
- **Corporate Noir:** High-stakes corporate pressure meets "unscalable" craftsmanship.
- **Anti-AI-ism:** Rigorously avoid "AI-isms" (e.g., significance inflation, "tapestry," "delve").

## Literary Heuristics

### 1. Identification Before Dialogue
Always identify who is speaking *before* the dialogue begins, especially in multi-character scenes.
- **Bad:** "I don't think we can scale this," Devin said.
- **Good:** Devin looked at the graph. "I don't think we can scale this."

### 2. Cause Before Consequence
Maintain a logical flow where the action/stimulus happens before the reaction/result.
- **Bad:** He fell over because the floor was slippery.
- **Good:** The floor was slippery. He fell over.

### 3. Varied Sentence Length (Rhythm)
Avoid monotonous sentence structures. Mix short, punchy statements with longer, more complex ones to create rhythm.

### 4. Aggressive Cutting of Fillers & Cliches
Eliminate "thought-verbs" (knew, felt, saw) where possible to bring the reader closer to the action. Cut tired tropes.

### 5. Root Out Purple Prose & Sentimentality
Purple prose is overblown writing that turns off readers. Sentimentality is an excess of response to a stimulus.
- **Goal:** Stimulate emotions *in the reader*, don't show an excessive response from the characters.
- **Avoid:**
    - "the cry of a soul in torment, swept by a tide of anger and outrage"
    - "terror plucked at her taut nerves"
    - "jagged laughter tore at her throat"
    - "ghastly red spatterings, vicious red-streaked gobbets of his brains"
    - "fierce rending triumph"
- **Action:** If a character's reaction is "flowery" or over-the-top compared to the event, cut it back. Keep it grounded.

### 6. Use "Said" Over Descriptive Dialogue Tags
Avoid using tags like "muttered," "screamed," "exclaimed," "gasped," or "whispered." These tags attempt to do the dialogue's job for it.
- **Goal:** Use "said" or let the surrounding action identify the speaker. If a character is angry, the dialogue should sound angry.
- **Bad:** "I can't take it anymore!" Devin screamed.
- **Good:** Devin slammed his palm onto the desk. "I can't take it anymore."

## Dialogue Dynamics

### 7. Fragmented Speech
Real people rarely speak in complete, grammatically perfect sentences. Characters should use fragments, especially when stressed or in casual environments.

### 8. Visibility Through Dialogue
Use dialogue to make scenes "visible." Instead of narrating a conflict, let the characters' words show the tension.

### 9. Confrontational Energy
Dialogue in "Sr Dev Devin" should be sufficiently confrontational. Characters are under pressure; their words should have edges. Avoid polite or "filler" agreement.

### 10. The Three-Sentence Rule
If a character speaks for more than three sentences, break it up. Use an interjection from another character, a sudden thought, or a physical action. Monologues are for villains who have already lost.

### 11. Oblique Responses
Responses should often be oblique—don't have characters answer questions directly. They have their own agendas, distractions, and emotional shields.

## Visual & Structural Rules

### 12. Visual Anchorage
Every page/passage MUST contain at least one visual element (image, UI block, or stylized ASCII).
- **The Red Flag:** Two or more consecutive pages without visuals.
- **The Diagnosis:** If visuals are missing, the passage might be suffering from "narrative summary." Convert the summary into an immediate, high-stakes scene.
- **Action:** Ensure a 16:9 "Cinematic Pixel-Grit" image or a relevant UI component anchors the text.

---

## Usage in Humanizer
When using the `humanizer` skill, ensure these project-specific heuristics are applied in addition to the standard AI-pattern removal.
