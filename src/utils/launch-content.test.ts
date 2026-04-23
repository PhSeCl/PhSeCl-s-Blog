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

  it('renders works covers from content data with a visual fallback', () => {
    const worksPage = read('pages/works.astro');

    expect(worksPage).toContain('style={work.cover ? `--work-cover-image: url(${JSON.stringify(work.cover)})` : undefined}');
    expect(worksPage).toContain('var(--work-cover-image)');
  });

  it('renders friend avatars as standard images with an explicit fallback state', () => {
    const friendsPage = read('pages/friends.astro');

    expect(friendsPage).toContain('src={friend.avatar}');
    expect(friendsPage).toContain("onerror=\"this.dataset.error = 'true'\"");
    expect(friendsPage).toContain('.friend-avatar[data-error=\'true\'] img');
  });

  it('shows the site owner name and the final avatar asset on the about page', () => {
    const about = read('pages/about.astro');

    expect(about).toContain('src="/media/people/avatar.png"');
    expect(about).toContain('<h2 class="about-name">PhSeCl</h2>');
    expect(about).not.toContain('PhSeCl Blog Rebuild');
    expect(about).not.toContain('Creative Frontend Experiments');
  });
});
