import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');

function read(relativePath: string): string {
  return readFileSync(resolve(root, relativePath), 'utf8');
}

describe('launch content cleanup', () => {
  it('uses the updated bilibili profile url on the homepage', () => {
    const hero = read('components/VideoHero.astro');

    expect(hero).toContain('https://space.bilibili.com/384628212');
  });

  it('keeps the works empty state messaging wired up', () => {
    const worksPage = read('pages/works.astro');

    expect(worksPage).toContain('data-i18n="works.empty"');
    expect(worksPage).toContain('workItems.length > 0 ?');
  });

  it('shows the site owner name and the final avatar asset on the about page', () => {
    const about = read('pages/about.astro');

    expect(about).toContain('src="/media/people/avatar.png"');
    expect(about).toContain('<h2 class="about-name">PhSeCl</h2>');
    expect(about).not.toContain('PhSeCl Blog Rebuild');
    expect(about).not.toContain('Creative Frontend Experiments');
  });
});
