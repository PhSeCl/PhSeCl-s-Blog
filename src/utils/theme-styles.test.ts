import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');

function read(relativePath: string): string {
  return readFileSync(resolve(root, relativePath), 'utf8');
}

describe('theme text contrast styles', () => {
  it('defines dedicated heading tokens for both dark and light themes', () => {
    const css = read('styles/global.css');

    expect(css).toContain('--text-heading: #fff0f5;');
    expect(css).toContain('--text-heading: #5a2d3d;');
    expect(css).toContain('--text-soft: rgba(210, 180, 194, 0.68);');
    expect(css).toContain('--text-soft: rgba(96, 54, 72, 0.78);');
  });

  it('uses heading tokens instead of pale sakura tokens for readable text', () => {
    const files = [
      'components/BlogCard.astro',
      'components/VideoHero.astro',
      'layouts/BlogPost.astro',
      'layouts/PageLayout.astro',
      'pages/404.astro',
      'pages/about.astro',
      'pages/friends.astro',
      'pages/index.astro',
      'pages/works.astro',
    ];

    for (const file of files) {
      const source = read(file);
      expect(source).not.toContain('color: var(--sakura-100);');
      expect(source).not.toContain('color: var(--sakura-50);');
    }
  });
});
