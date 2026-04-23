import { en } from './en';
import { ja } from './ja';
import { zh } from './zh';

export const languages = {
  zh: '中文',
  ja: '日本語',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'zh';

export const ui: Record<Lang, Record<string, string>> = {
  zh,
  ja,
  en,
};
