import { getTheme, resolveThemedAsset, type Theme } from '../utils/theme';

type LoadingMode = 'auto' | 'manual' | 'poster';

interface NetworkLike {
  effectiveType?: string;
  saveData?: boolean;
  type?: string;
}

interface VideoDecisionInput {
  viewportWidth: number;
  connection?: NetworkLike;
}

interface VideoDecision {
  shouldLoad: boolean;
  showPlayButton: boolean;
  mode: LoadingMode;
}

const MOBILE_BREAKPOINT = 768;

export function decideVideoLoadingMode({
  viewportWidth,
  connection,
}: VideoDecisionInput): VideoDecision {
  const isMobile = viewportWidth < MOBILE_BREAKPOINT;

  if (!connection) {
    return isMobile
      ? { shouldLoad: false, showPlayButton: true, mode: 'manual' }
      : { shouldLoad: true, showPlayButton: false, mode: 'auto' };
  }

  if (connection.saveData) {
    return { shouldLoad: false, showPlayButton: false, mode: 'poster' };
  }

  if (isMobile) {
    return { shouldLoad: false, showPlayButton: true, mode: 'manual' };
  }

  const effectiveType = connection.effectiveType?.toLowerCase();
  const connectionType = connection.type?.toLowerCase();
  const isWifi = connectionType === 'wifi';
  const isFastEnough = effectiveType === '4g' || isWifi;

  if (isFastEnough) {
    return { shouldLoad: true, showPlayButton: false, mode: 'auto' };
  }

  return { shouldLoad: false, showPlayButton: false, mode: 'poster' };
}

function resolvePosterAsset(poster: HTMLImageElement, theme: Theme): string {
  return resolveThemedAsset(
    {
      default: poster.dataset.posterDefault,
      dark: poster.dataset.posterDark,
      light: poster.dataset.posterLight,
    },
    theme,
  );
}

function applyPosterTheme(poster?: HTMLImageElement | null, theme = getTheme()): void {
  if (!poster) {
    return;
  }

  const asset = resolvePosterAsset(poster, theme);

  if (!asset) {
    poster.classList.add('poster-missing');
    poster.removeAttribute('src');
    return;
  }

  poster.classList.remove('poster-missing');

  if (poster.getAttribute('src') !== asset) {
    poster.src = asset;
  }
}

function revealVideo(video: HTMLVideoElement, poster?: HTMLImageElement | null): void {
  video.classList.add('is-visible');
  poster?.classList.add('is-hidden');
}

function hidePosterIfMissing(poster?: HTMLImageElement | null): void {
  poster?.classList.add('poster-missing');
}

function showPlayButton(button?: HTMLButtonElement | null): void {
  if (!button) {
    return;
  }

  button.hidden = false;
}

function hidePlayButton(button?: HTMLButtonElement | null): void {
  if (!button) {
    return;
  }

  button.hidden = true;
}

function loadVideo(
  video: HTMLVideoElement,
  poster?: HTMLImageElement | null,
  button?: HTMLButtonElement | null,
): void {
  const source = video.dataset.videoSrc;

  if (!source || video.dataset.loaded === 'true') {
    hidePlayButton(button);

    if (video.dataset.loaded === 'true') {
      void video.play().catch(() => {});
    }

    return;
  }

  video.dataset.loaded = 'true';
  video.src = source;
  video.load();
  hidePlayButton(button);

  const onReady = () => {
    revealVideo(video, poster);
    void video.play().catch(() => {});
  };

  const onError = () => {
    video.classList.remove('is-visible');
  };

  video.addEventListener('canplaythrough', onReady, { once: true });
  video.addEventListener('loadeddata', onReady, { once: true });
  video.addEventListener('error', onError, { once: true });
}

export function initVideoLoader(root: ParentNode = document): void {
  const hero = root.querySelector<HTMLElement>('[data-video-hero]');

  if (!hero) {
    return;
  }

  const poster = hero.querySelector<HTMLImageElement>('[data-hero-poster]');
  const video = hero.querySelector<HTMLVideoElement>('[data-hero-video]');
  const playButton = hero.querySelector<HTMLButtonElement>('[data-video-play]');

  applyPosterTheme(poster);

  if (hero.dataset.videoLoaderReady === 'true') {
    return;
  }

  hero.dataset.videoLoaderReady = 'true';

  if (!video) {
    return;
  }

  poster?.addEventListener('error', () => hidePosterIfMissing(poster), { once: true });

  window.addEventListener('theme-change', (event: Event) => {
    const detail = (event as CustomEvent<{ theme?: Theme }>).detail;

    if (!video.classList.contains('is-visible')) {
      applyPosterTheme(poster, detail.theme ?? getTheme());
    }
  });

  const connection = (navigator as Navigator & {
    connection?: NetworkLike;
  }).connection;

  const decision = decideVideoLoadingMode({
    viewportWidth: window.innerWidth,
    connection,
  });

  if (decision.showPlayButton) {
    showPlayButton(playButton);
    playButton?.addEventListener(
      'click',
      () => {
        loadVideo(video, poster, playButton);
      },
      { once: true },
    );
    return;
  }

  hidePlayButton(playButton);

  if (decision.shouldLoad) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => loadVideo(video, poster, playButton), {
        once: true,
      });
    } else {
      loadVideo(video, poster, playButton);
    }
  }
}
