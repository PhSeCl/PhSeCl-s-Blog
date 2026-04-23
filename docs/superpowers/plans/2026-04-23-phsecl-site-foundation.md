# PhSeCl Site Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the PhSeCl.com Astro project foundation so later modules can add visuals, runtime effects, content, and deployment settings without restructuring.

**Architecture:** The site is split into clear units: Astro config at the root, shared style tokens in `src/styles`, content schemas in `src/content`, runtime scripts in `src/scripts`, layouts and components in their own folders, and future structured content in `src/data`. Module 1 creates the stable file map and configuration contract but does not yet implement the homepage or particle logic.

**Tech Stack:** Astro, TypeScript, Tailwind CSS, MDX, Astro Content Collections, Astro sitemap, Astro Cloudflare adapter

---

## File Map

- Create: `F:/PhSeCl-s-Blog/.gitignore`
- Create: `F:/PhSeCl-s-Blog/package.json`
- Create: `F:/PhSeCl-s-Blog/tsconfig.json`
- Create: `F:/PhSeCl-s-Blog/astro.config.mjs`
- Create: `F:/PhSeCl-s-Blog/tailwind.config.mjs`
- Create: `F:/PhSeCl-s-Blog/public/favicon.svg`
- Create: `F:/PhSeCl-s-Blog/public/robots.txt`
- Create: `F:/PhSeCl-s-Blog/public/images/.gitkeep`
- Create: `F:/PhSeCl-s-Blog/public/video/.gitkeep`
- Create: `F:/PhSeCl-s-Blog/src/env.d.ts`
- Create: `F:/PhSeCl-s-Blog/src/styles/global.css`
- Create: `F:/PhSeCl-s-Blog/src/content/config.ts`
- Create: `F:/PhSeCl-s-Blog/src/content/blog/hello-world.md`
- Create: `F:/PhSeCl-s-Blog/src/layouts/BaseLayout.astro`
- Create: `F:/PhSeCl-s-Blog/src/layouts/BlogPost.astro`
- Create: `F:/PhSeCl-s-Blog/src/layouts/PageLayout.astro`
- Create: `F:/PhSeCl-s-Blog/src/components/Search.astro`
- Create: `F:/PhSeCl-s-Blog/src/components/TableOfContents.astro`
- Create: `F:/PhSeCl-s-Blog/src/components/SakuraCanvas.astro`
- Create: `F:/PhSeCl-s-Blog/src/components/VideoHero.astro`
- Create: `F:/PhSeCl-s-Blog/src/components/Navbar.astro`
- Create: `F:/PhSeCl-s-Blog/src/components/LanguageSwitcher.astro`
- Create: `F:/PhSeCl-s-Blog/src/components/BlogCard.astro`
- Create: `F:/PhSeCl-s-Blog/src/components/Footer.astro`
- Create: `F:/PhSeCl-s-Blog/src/components/Giscus.astro`
- Create: `F:/PhSeCl-s-Blog/src/components/FriendLinks.astro`
- Create: `F:/PhSeCl-s-Blog/src/pages/index.astro`
- Create: `F:/PhSeCl-s-Blog/src/pages/about.astro`
- Create: `F:/PhSeCl-s-Blog/src/pages/works.astro`
- Create: `F:/PhSeCl-s-Blog/src/pages/friends.astro`
- Create: `F:/PhSeCl-s-Blog/src/pages/404.astro`
- Create: `F:/PhSeCl-s-Blog/src/pages/blog/index.astro`
- Create: `F:/PhSeCl-s-Blog/src/pages/blog/[...slug].astro`
- Create: `F:/PhSeCl-s-Blog/src/pages/tags/[tag].astro`
- Create: `F:/PhSeCl-s-Blog/src/i18n/ui.ts`
- Create: `F:/PhSeCl-s-Blog/src/i18n/zh.ts`
- Create: `F:/PhSeCl-s-Blog/src/i18n/ja.ts`
- Create: `F:/PhSeCl-s-Blog/src/i18n/en.ts`
- Create: `F:/PhSeCl-s-Blog/src/utils/i18n.ts`
- Create: `F:/PhSeCl-s-Blog/src/scripts/sakura.ts`
- Create: `F:/PhSeCl-s-Blog/src/scripts/video-loader.ts`
- Create: `F:/PhSeCl-s-Blog/src/data/friends.json`
- Create: `F:/PhSeCl-s-Blog/src/data/works.json`

### Task 1: Write the agreed project scaffolding

**Files:**
- Create: `.gitignore`, `package.json`, `tsconfig.json`, `astro.config.mjs`, `tailwind.config.mjs`
- Create: root public and src tree files listed above

- [ ] **Step 1: Create root ignore rules and package metadata**

```gitignore
node_modules/
dist/
.astro/
.DS_Store
Thumbs.db
.idea/
.vscode/
.superpowers/
coverage/
package-lock.json
pnpm-lock.yaml
yarn.lock
```

```json
{
  "name": "phsecl-com",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  }
}
```

- [ ] **Step 2: Add Astro, Tailwind, and TypeScript configuration**

```js
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
```

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

- [ ] **Step 3: Add theme tokens and placeholder modules**

```css
:root {
  --bg-deep: #0a0608;
  --bg-surface: #0d0810;
  --sakura-50: #fff5f8;
  --sakura-100: #fff0f5;
  --sakura-200: #ffdddd;
  --sakura-300: #f5b8cc;
  --sakura-400: #d4789a;
  --sakura-500: #a04060;
  --sakura-600: #7a2e4a;
  --text-primary: #f0e6ec;
  --text-muted: rgba(220, 180, 200, 0.5);
  --border-subtle: rgba(220, 160, 190, 0.1);
}
```

- [ ] **Step 4: Verify file tree shape**

Run: `Get-ChildItem -Recurse src,public`
Expected: directories for layouts, components, content, pages, i18n, scripts, styles, utils, and placeholder assets are present.

- [ ] **Step 5: Commit**

```bash
git add .gitignore package.json tsconfig.json astro.config.mjs tailwind.config.mjs public src docs
git commit -m "chore: scaffold Astro site foundation"
```

### Task 2: Install dependencies and validate Astro configuration

**Files:**
- Modify: `package.json`
- Verify: local dependency installation and Astro config load

- [ ] **Step 1: Install exact baseline dependencies**

Run: `npm install astro @astrojs/mdx @astrojs/sitemap @astrojs/cloudflare @astrojs/tailwind tailwindcss @tailwindcss/typography astro-icon zod`
Expected: package manager writes dependency metadata successfully.

- [ ] **Step 2: Run Astro diagnostics**

Run: `npx astro check`
Expected: Astro starts type/content validation without missing-config errors.

- [ ] **Step 3: Commit dependency lockfile if generated**

```bash
git add package.json package-lock.json
git commit -m "build: install Astro foundation dependencies"
```

## Coverage Check

- Module 1 covers the documented project initialization requirement.
- Later modules still need layouts, visuals, i18n behavior, content rendering, Giscus, content pages, and SEO implementation details.
