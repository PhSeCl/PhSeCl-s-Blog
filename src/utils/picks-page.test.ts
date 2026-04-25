import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');

function read(relativePath: string): string {
  return readFileSync(resolve(root, relativePath), 'utf8');
}

describe('picks page integration', () => {
  it('adds the picks navigation entry between about and friends', () => {
    const hero = read('components/VideoHero.astro');

    expect(hero).toContain("{ key: 'nav.about', fallback: 'ABOUT', href: '/about' },");
    expect(hero).toContain("{ key: 'nav.picks', fallback: 'PICKS', href: '/picks' },");
    expect(hero).toContain("{ key: 'nav.friends', fallback: 'FRIENDS', href: '/friends' },");
    expect(hero.indexOf("nav.about")).toBeLessThan(hero.indexOf("nav.picks"));
    expect(hero.indexOf("nav.picks")).toBeLessThan(hero.indexOf("nav.friends"));
  });

  it('wires picks translations across all locale files', () => {
    const zh = read('i18n/zh.ts');
    const ja = read('i18n/ja.ts');
    const en = read('i18n/en.ts');

    expect(zh).toContain("'nav.picks': 'PICKS'");
    expect(ja).toContain("'nav.picks': 'おすすめ'");
    expect(en).toContain("'nav.picks': 'PICKS'");

    expect(zh).toContain("'picks.title': '精选'");
    expect(ja).toContain("'picks.title': 'おすすめ'");
    expect(en).toContain("'picks.title': 'Picks'");

    expect(zh).toContain("'picks.description': '我喜欢的游戏、音乐和项目'");
    expect(ja).toContain("'picks.description': '好きなゲーム、音楽、プロジェクト'");
    expect(en).toContain("'picks.description': 'Games, music and projects I love'");
  });

  it('defines picks data as extendable categorized content', () => {
    const picks = read('data/picks.json');

    expect(picks).toContain('"categories"');
    expect(picks).toContain('"id": "games"');
    expect(picks).toContain('"id": "music"');
    expect(picks).toContain('"id": "projects"');
    expect(picks).toContain('"featured"');
    expect(picks).toContain('"label"');
    expect(picks).toContain('"cover"');
    expect(picks).toContain('"tags"');
    expect(picks).not.toContain('"cover": "public/');
    expect(picks).not.toContain('"/images/picks/');
    expect(picks).toContain('"id": "projects"');
    expect(picks).toContain('"items": []');
  });

  it('supports structured multi-language item titles with explicit display order', () => {
    const picks = read('data/picks.json');
    const page = read('pages/picks.astro');

    expect(picks).toContain('"title": {');
    expect(picks).toContain('"display"');
    expect(page).toContain('interface PickItemTitle');
    expect(page).toContain("type PickTitleLang = 'zh' | 'ja' | 'en';");
    expect(page).toContain('function resolvePickTitle');
    expect(page).toContain('typeof title === \'string\'');
    expect(page).toContain('const normalizedDisplay =');
    expect(page).toContain("normalizedDisplay.includes('zh')");
    expect(picks).toContain('"artist": "');
    expect(page).toContain('artist?: string;');
  });

  it('only treats featured as active when the configured index exists', () => {
    const page = read('pages/picks.astro');

    expect(page).toContain('const hasFeaturedItem = featuredItem !== undefined;');
    expect(page).toContain('itemIndex === 0 && hasFeaturedItem');
    expect(page).toContain('itemIndex === 0 && hasFeaturedItem ?');
  });

  it('renders picks sections, smooth filter links, and card styling hooks', () => {
    const page = read('pages/picks.astro');

    expect(page).toContain('const featuredItem = category.items[category.featured];');
    expect(page).toContain('const orderedItems = featuredItem');
    expect(page).toContain('class:list={{');
    expect(page).toContain("'pick-card-featured'");
    expect(page).toContain('itemIndex === 0 && hasFeaturedItem');
    expect(page).toContain('data-i18n="picks.featured"');
    expect(page).toContain('resolvePickTitle(item.title)');
    expect(page).toContain('{item.artist && <p class="pick-artist">{item.artist}</p>}');
    expect(page).toContain('class="pick-description"');
    expect(page).toContain('data-pick-toggle');
    expect(page).toContain('data-url={item.url}');
    expect(page).toContain("role=\"link\"");
    expect(page).toContain('bindPickCardLinks()');
    expect(page).toContain('class="pick-open-link"');
    expect(page).toContain('class="pick-expand-toggle"');
    expect(page).toContain('class="pick-title-main"');
    expect(page).toContain('class="pick-title-alt"');
    expect(page).toContain('.pick-artist');
    expect(page).toContain('-webkit-line-clamp: 2;');
    expect(page).toContain('titleKey="picks.title"');
    expect(page).toContain('seoTitleKey="picks.title"');
    expect(page).toContain('seoDescriptionKey="picks.description"');
    expect(page).toContain('repeat(auto-fill, minmax(280px, 1fr))');
    expect(page).toContain('href={`#${category.id}`}');
    expect(page).toContain('scroll-margin-top');
    expect(page).toContain('aspect-ratio: 16 / 9;');
    expect(page).toContain('object-fit: cover;');
    expect(page).toContain('target="_blank"');
    expect(page).toContain('box-shadow: 0 20px 60px rgba(160, 60, 100, 0.08);');
    expect(page).toContain('.pick-badge');
    expect(page).toContain('.pick-card-featured');
    expect(page).toContain('const hasItems = category.items.length > 0;');
    expect(page).toContain('class="pick-empty"');
    expect(page).toContain('data-label-zh={emptyState.zh}');
    expect(page).toContain('data-label-ja={emptyState.ja}');
    expect(page).toContain('data-label-en={emptyState.en}');
    expect(page).toContain('{emptyState.zh}');
    expect(page).toContain("window.matchMedia('(max-width: 767px)').matches");
    expect(page).toContain(".pick-card[data-expanded='true'] .pick-description");
    expect(page).toContain('.pick-card:hover .pick-description');
    expect(page).toContain("window.open(url, '_blank', 'noopener,noreferrer')");
    expect(page).toContain('.pick-open-link {\n    display: none;');
  });

  it('skips the image request entirely when a pick cover is missing', () => {
    const page = read('pages/picks.astro');

    expect(page).toContain('cover: string | null;');
    expect(page).toContain('{item.cover && (');
    expect(page).toContain('src={item.cover}');
  });
});
