import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');

function read(relativePath: string): string {
  return readFileSync(resolve(root, relativePath), 'utf8');
}

describe('surface style consistency', () => {
  it('gives subpage actions the same rounded glass treatment as other controls', () => {
    const source = read('components/SubpageActions.astro');

    expect(source).toContain('border-radius: 999px;');
    expect(source).toContain('linear-gradient(180deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.04))');
    expect(source).toContain('backdrop-filter: blur(14px);');
  });

  it('renders friend cards with rounded corners', () => {
    const source = read('pages/friends.astro');

    expect(source).toContain('border-radius: 1.2rem;');
  });
});
