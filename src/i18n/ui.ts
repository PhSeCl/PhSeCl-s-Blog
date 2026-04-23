export const languages = {
  zh: '中文',
  ja: '日本語',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'zh';

export const ui: Record<Lang, Record<string, string>> = {
  zh: {
    'nav.blog': 'BLOG',
    'nav.works': 'WORKS',
    'nav.about': 'ABOUT',
    'nav.friends': 'FRIENDS',
    'hero.title': '花が散る、\n言葉が残る。',
    'hero.subtitle': 'コードと日常の記録。\n技术博客 & Portfolio',
    'hero.badge': '桜の庭 — SINCE 2025',
    'blog.latest': '最新の記事',
    'blog.readmore': '続きを読む',
    'footer.powered': 'Powered by Astro',
  },
  ja: {
    'nav.blog': 'ブログ',
    'nav.works': '作品',
    'nav.about': '紹介',
    'nav.friends': 'リンク',
    'hero.title': '花が散る、\n言葉が残る。',
    'hero.subtitle': 'コードと日常の記録。\n技術ブログ & ポートフォリオ',
    'hero.badge': '桜の庭 — SINCE 2025',
    'blog.latest': '最新の記事',
    'blog.readmore': '続きを読む',
    'footer.powered': 'Powered by Astro',
  },
  en: {
    'nav.blog': 'BLOG',
    'nav.works': 'WORKS',
    'nav.about': 'ABOUT',
    'nav.friends': 'FRIENDS',
    'hero.title': 'Petals fall,\nwords remain.',
    'hero.subtitle': 'A record of code and life.\nTech Blog & Portfolio',
    'hero.badge': 'Garden of Sakura — SINCE 2025',
    'blog.latest': 'Latest Posts',
    'blog.readmore': 'Read more',
    'footer.powered': 'Powered by Astro',
  },
};

