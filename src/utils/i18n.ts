import { defaultLang, type Lang, ui } from '../i18n/ui';

export function getLang(value?: string | null): Lang {
  if (value && value in ui) {
    return value as Lang;
  }

  return defaultLang;
}

export function t(lang: Lang, key: string): string {
  return ui[lang][key] ?? ui[defaultLang][key] ?? key;
}

