/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_VIDEO_CDN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

