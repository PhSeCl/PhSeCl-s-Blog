import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://phsecl.com',
  output: 'static',
  adapter: cloudflare(),
  integrations: [mdx(), sitemap(), tailwind()],
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});

