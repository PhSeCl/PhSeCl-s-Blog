import { defaultLang, type Lang, ui } from '../i18n/ui';

const STORAGE_KEY = 'lang';

function isLang(value: string | null | undefined): value is Lang {
  return Boolean(value && value in ui);
}

export function resolveLang(value?: string | null): Lang {
  return isLang(value) ? value : defaultLang;
}

export function getLang(): Lang {
  if (typeof window === 'undefined') {
    return defaultLang;
  }

  return resolveLang(window.localStorage.getItem(STORAGE_KEY));
}

export function applyTranslations(root: ParentNode = document, lang = getLang()): void {
  const elements = root.querySelectorAll<HTMLElement>('[data-i18n]');

  elements.forEach((element) => {
    const key = element.dataset.i18n;

    if (!key) {
      return;
    }

    element.textContent = ui[lang][key] ?? key;
  });
}

export function setLang(lang: Lang): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  applyTranslations(document, lang);
  window.dispatchEvent(
    new CustomEvent('lang-change', {
      detail: { lang },
    }),
  );
}

export function t(key: string): string {
  const lang = getLang();
  return ui[lang][key] ?? key;
}

export function initI18n(root: ParentNode = document): void {
  if (typeof window === 'undefined') {
    return;
  }

  const lang = getLang();
  document.documentElement.lang = lang;
  applyTranslations(root, lang);
}
