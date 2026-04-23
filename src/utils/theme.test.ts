import { describe, expect, it } from 'vitest';
import { defaultTheme, resolveTheme, resolveThemedAsset } from './theme';

describe('resolveTheme', () => {
  it('defaults to dark theme', () => {
    expect(resolveTheme(undefined)).toBe(defaultTheme);
    expect(resolveTheme('unknown')).toBe(defaultTheme);
  });

  it('accepts light theme', () => {
    expect(resolveTheme('light')).toBe('light');
  });
});

describe('resolveThemedAsset', () => {
  it('prefers the active theme asset', () => {
    expect(
      resolveThemedAsset(
        {
          dark: '/dark.avif',
          light: '/light.avif',
        },
        'dark',
      ),
    ).toBe('/dark.avif');
  });

  it('falls back to default asset', () => {
    expect(
      resolveThemedAsset(
        {
          default: '/default.avif',
        },
        'light',
      ),
    ).toBe('/default.avif');
  });

  it('falls back to the opposite theme asset when needed', () => {
    expect(
      resolveThemedAsset(
        {
          light: '/light.avif',
        },
        'dark',
      ),
    ).toBe('/light.avif');
  });
});
