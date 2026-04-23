import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  applyTranslations,
  getLang,
  initI18n,
  resolveLang,
  setLang,
  t,
} from './i18n';

function createStorage() {
  const store = new Map<string, string>();

  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
  };
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe('i18n utilities', () => {
  test('falls back to zh for missing or invalid languages', () => {
    expect(resolveLang(undefined)).toBe('zh');
    expect(resolveLang('de')).toBe('zh');
    expect(resolveLang('ja')).toBe('ja');
  });

  test('reads language from localStorage', () => {
    const localStorage = createStorage();
    localStorage.setItem('lang', 'ja');

    vi.stubGlobal('window', {
      localStorage,
      dispatchEvent: vi.fn(),
    });

    expect(getLang()).toBe('ja');
  });

  test('translates using the active language and falls back to key', () => {
    const localStorage = createStorage();
    localStorage.setItem('lang', 'en');

    vi.stubGlobal('window', {
      localStorage,
      dispatchEvent: vi.fn(),
    });

    expect(t('blog.latest')).toBe('Latest Posts');
    expect(t('missing.key')).toBe('missing.key');
  });

  test('setLang persists language, updates html lang, and dispatches event', () => {
    const localStorage = createStorage();
    const dispatchEvent = vi.fn();
    const html = { lang: 'zh' };
    const querySelectorAll = vi.fn(() => []);

    vi.stubGlobal('window', {
      localStorage,
      dispatchEvent,
    });
    vi.stubGlobal('document', {
      documentElement: html,
      querySelectorAll,
    });
    vi.stubGlobal(
      'CustomEvent',
      class CustomEventMock {
        type: string;
        detail: unknown;

        constructor(type: string, init?: { detail?: unknown }) {
          this.type = type;
          this.detail = init?.detail;
        }
      },
    );

    setLang('en');

    expect(localStorage.setItem).toHaveBeenCalledWith('lang', 'en');
    expect(html.lang).toBe('en');
    expect(dispatchEvent).toHaveBeenCalled();
  });

  test('applyTranslations updates all data-i18n nodes', () => {
    const titleNode = { dataset: { i18n: 'hero.title' }, textContent: '' };
    const navNode = { dataset: { i18n: 'nav.about' }, textContent: '' };

    applyTranslations(
      {
        querySelectorAll: () => [titleNode, navNode],
      } as unknown as ParentNode,
      'en',
    );

    expect(titleNode.textContent).toBe('Petals fall,\nwords remain.');
    expect(navNode.textContent).toBe('ABOUT');
  });

  test('initI18n applies saved language and updates html lang', () => {
    const localStorage = createStorage();
    localStorage.setItem('lang', 'ja');
    const heroNode = { dataset: { i18n: 'hero.badge' }, textContent: '' };
    const html = { lang: 'zh' };

    vi.stubGlobal('window', {
      localStorage,
      dispatchEvent: vi.fn(),
    });
    vi.stubGlobal('document', {
      documentElement: html,
      querySelectorAll: () => [heroNode],
    });

    initI18n();

    expect(html.lang).toBe('ja');
    expect(heroNode.textContent).toBe('桜の庭 — SINCE 2025');
  });
});
