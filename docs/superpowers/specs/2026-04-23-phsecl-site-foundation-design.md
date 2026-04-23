# PhSeCl Site Foundation Design

**Project:** `PhSeCl.com` personal site built with Astro, Tailwind, MD/MDX, and Cloudflare Pages.

**Objective:** Build a lightweight, expandable static site with a distinct sakura-night visual identity, native motion effects, client-side UI language switching, a Markdown-powered blog, and graceful fallbacks for missing media and weak-network scenarios.

## Scope

This design covers the full site architecture and the phased implementation order. The initial implementation module is limited to project scaffolding and global configuration so later work can layer on visuals and content features without restructuring the foundation.

## Product Intent

The site is both a homepage and a blog. It should feel atmospheric and authored rather than template-driven. The homepage carries the brand through split-screen media, decorative typography, and sakura particle motion. Inner pages reuse the same dark, restrained visual system so the site feels coherent as content grows.

## Architecture

The site will use Astro static output with file-based routing. Shared page structure lives in Astro layouts, while complex runtime behavior is isolated into small browser scripts:

- `src/scripts/sakura.ts` owns the persistent canvas particle system.
- `src/scripts/video-loader.ts` owns homepage media loading policy and progressive enhancement.
- `src/i18n/*` owns UI copy and language lookup.
- `src/content/*` owns validated blog content schemas.
- `src/data/*` will hold structured non-blog content such as works and friends.

This keeps pages declarative and makes future iteration straightforward.

## Visual System

- Global design tokens are defined in `src/styles/global.css` via CSS variables.
- Tailwind handles layout, spacing, cards, typography, and shared UI primitives.
- Homepage hero and other high-fidelity decorative surfaces may use authored CSS instead of forcing everything into utility classes.
- Fonts are limited to `Zen Old Mincho`, `Shippori Mincho`, and `Noto Sans JP`.

## Interaction Model

- Global sakura canvas is fixed, non-interactive, and persistent across page transitions.
- Homepage video loads only when device/network conditions allow it.
- Language switching updates the UI in-place using client-side events and `localStorage`.
- Missing images or video must not throw or visibly break layouts; the site falls back to gradients and solid surfaces.

## Content Model

- Blog posts live in Astro Content Collections with schema validation for title, date, tags, description, and draft state.
- Blog body language is author-controlled and never auto-translated.
- UI labels are translated into Chinese, Japanese, and English only.
- Chinese mode intentionally allows mixed Japanese/English styling in selected copy.

## SEO and Deployment

- Every page receives explicit title, description, canonical, and OG metadata.
- Blog articles add article-specific metadata.
- Sitemap generation is handled by Astro integration.
- Deployment target is Cloudflare Pages with static output.

## Implementation Phases

1. Scaffold project structure and global configuration.
2. Build base layouts and persistent sakura canvas shell.
3. Build homepage split hero and latest-posts section.
4. Add client-side language system and switcher.
5. Add blog collections, index page, and post page.
6. Add Giscus for post pages only.
7. Add About, Works, Friends, 404, and supporting data files.
8. Finish SEO and deployment polish.

## Non-Goals for Module 1

- No homepage visuals yet beyond shared tokens and placeholders.
- No particle animation logic yet.
- No video loading logic yet.
- No content rendering beyond the minimum sample structure required for later modules.

## Acceptance Criteria for Module 1

- The repo contains the agreed directory structure.
- Astro, Tailwind, MDX, sitemap, and Cloudflare adapter are configured.
- Global CSS variables and font imports exist.
- Placeholder files and data stubs exist for future modules.
- `.gitignore` excludes build output, dependencies, editor noise, and local brainstorm artifacts.
