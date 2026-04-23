import { describe, expect, test } from 'vitest';
import { decideVideoLoadingMode } from './video-loader';

describe('video loading strategy', () => {
  test('auto loads on desktop 4g connections', () => {
    expect(
      decideVideoLoadingMode({
        viewportWidth: 1440,
        connection: { effectiveType: '4g', saveData: false },
      }),
    ).toEqual({
      shouldLoad: true,
      showPlayButton: false,
      mode: 'auto',
    });
  });

  test('uses manual loading on mobile even with fast network', () => {
    expect(
      decideVideoLoadingMode({
        viewportWidth: 390,
        connection: { effectiveType: '4g', saveData: false },
      }),
    ).toEqual({
      shouldLoad: false,
      showPlayButton: true,
      mode: 'manual',
    });
  });

  test('does not load when save data is enabled', () => {
    expect(
      decideVideoLoadingMode({
        viewportWidth: 1440,
        connection: { effectiveType: '4g', saveData: true },
      }),
    ).toEqual({
      shouldLoad: false,
      showPlayButton: false,
      mode: 'poster',
    });
  });

  test('does not load on 3g and slower networks', () => {
    expect(
      decideVideoLoadingMode({
        viewportWidth: 1440,
        connection: { effectiveType: '3g', saveData: false },
      }),
    ).toEqual({
      shouldLoad: false,
      showPlayButton: false,
      mode: 'poster',
    });
  });

  test('falls back to desktop auto loading when connection api is unavailable', () => {
    expect(
      decideVideoLoadingMode({
        viewportWidth: 1280,
      }),
    ).toEqual({
      shouldLoad: true,
      showPlayButton: false,
      mode: 'auto',
    });
  });

  test('falls back to mobile manual loading when connection api is unavailable', () => {
    expect(
      decideVideoLoadingMode({
        viewportWidth: 500,
      }),
    ).toEqual({
      shouldLoad: false,
      showPlayButton: true,
      mode: 'manual',
    });
  });
});
