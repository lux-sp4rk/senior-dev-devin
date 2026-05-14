import { describe, it, expect, beforeEach } from 'vitest';
import { StoryGraph } from './scripts/story-tester.js';

describe('Story Path Consistency', () => {
  let graph;

  beforeEach(() => {
    graph = new StoryGraph();
    graph.load();
  });

  it('Vim Path: Staring at hairline leads to PIP email', () => {
    // We walk by matching text in the choice links
    const endPassage = graph.walk('path-vimrc', [
      /Stare at him until the silence becomes a HR violation/,
      /Next/
    ]); 
    expect(endPassage).toBe('path-vim-02-pip-email');
  });

  it('Rust Path: Staring at hairline leads to HR Incident', () => {
    const endPassage = graph.walk('path-rust-02-fired', [
      /Stare at his hairline until it becomes an HR incident/,
      /Next/
    ]);
    expect(endPassage).toBe('path-rust-04-locked-out');
  });

  it('Both HR paths should contain the "Sarah from People & Culture" email', () => {
    const hrPassages = ['path-vim-02-pip-email', 'path-rust-04-locked-out'];
    hrPassages.forEach(name => {
      const p = graph.passages.get(name);
      expect(p.body).toContain('Sarah from People & Culture');
    });
  });

  it('The HR incident in Rust should unlock Greg\'s hat lore', () => {
    const p = graph.passages.get('path-rust-03-hr-incident');
    expect(p.tags).toContain('unlock-lore-greg-hat');
  });

  it('Staring at Greg in the intro (Vim path) should increase stress by 20', () => {
    const p = graph.passages.get('path-vimrc');
    const stareLink = p.links.find(l => /Stare at him/.test(l.text));
    expect(stareLink.setter).toBe('stress += 20');
  });

  it('Staring at Greg in the intro (Rust path) should increase stress by 25', () => {
    const p = graph.passages.get('path-rust-02-fired');
    const stareLink = p.links.find(l => /Stare at his hairline/.test(l.text));
    expect(stareLink.setter).toBe('stress += 25');
  });
});
