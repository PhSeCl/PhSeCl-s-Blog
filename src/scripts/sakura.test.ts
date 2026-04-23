import { describe, expect, test } from 'vitest';
import {
  DEFAULT_PETAL_COLORS,
  createSakuraConfig,
  getResponsivePetalCount,
  mergeSakuraConfig,
} from './sakura';

describe('sakura configuration', () => {
  test('uses desktop defaults on larger screens', () => {
    const config = createSakuraConfig({ viewportWidth: 1440 });

    expect(config.isMobile).toBe(false);
    expect(config.countRange).toEqual([150, 200]);
    expect(config.sizeRange).toEqual([6, 18]);
    expect(config.speedRange).toEqual([0.3, 1]);
    expect(config.blurEnabled).toBe(true);
    expect(config.enableMouseInteraction).toBe(true);
    expect(config.colors).toEqual(DEFAULT_PETAL_COLORS);
  });

  test('uses mobile defaults on smaller screens', () => {
    const config = createSakuraConfig({ viewportWidth: 390 });

    expect(config.isMobile).toBe(true);
    expect(config.countRange).toEqual([50, 80]);
    expect(config.sizeRange).toEqual([5, 12]);
    expect(config.speedRange).toEqual([0.3, 0.8]);
    expect(config.blurEnabled).toBe(false);
    expect(config.enableMouseInteraction).toBe(false);
  });

  test('merges overrides without dropping existing defaults', () => {
    const merged = mergeSakuraConfig(
      createSakuraConfig({ viewportWidth: 1280 }),
      {
        colors: ['rgba(255,255,255,0.5)'],
        interactionRadius: 180,
      },
    );

    expect(merged.colors).toEqual(['rgba(255,255,255,0.5)']);
    expect(merged.interactionRadius).toBe(180);
    expect(merged.countRange).toEqual([150, 200]);
  });

  test('resolves petal counts within the configured range', () => {
    expect(getResponsivePetalCount([150, 200], 0)).toBe(150);
    expect(getResponsivePetalCount([150, 200], 0.5)).toBe(175);
    expect(getResponsivePetalCount([150, 200], 1)).toBe(200);
  });
});
