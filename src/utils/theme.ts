export const themes = {
  dark: 'dark',
  light: 'light',
} as const;

export type Theme = keyof typeof themes;

export interface ThemedAssetSet {
  default?: string | null;
  dark?: string | null;
  light?: string | null;
}

const STORAGE_KEY = 'theme';
export const defaultTheme: Theme = 'dark';

export function resolveTheme(value?: string | null): Theme {
  return value === 'light' ? 'light' : defaultTheme;
}

export function getTheme(): Theme {
  if (typeof window === 'undefined') {
    return defaultTheme;
  }

  return resolveTheme(window.localStorage.getItem(STORAGE_KEY));
}

export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.dataset.theme = theme;
}

export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
  window.dispatchEvent(
    new CustomEvent('theme-change', {
      detail: { theme },
    }),
  );
}

export function initTheme(): Theme {
  const theme = getTheme();
  applyTheme(theme);
  return theme;
}

export function resolveThemedAsset(assets: ThemedAssetSet, theme: Theme): string {
  const primary = theme === 'dark' ? assets.dark : assets.light;
  const secondary = theme === 'dark' ? assets.light : assets.dark;

  return primary ?? assets.default ?? secondary ?? '';
}
