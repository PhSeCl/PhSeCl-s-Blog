---
title: Why I Returned to Astro for This Site
description: A short note on why a light, content-first stack still feels right for a personal website.
date: 2025-04-18
tags:
  - devlog
  - astro
draft: false
cover: /media/site/hero/cover-dark.avif
---

When I rebuilt this site, I was not looking for the most fashionable stack. I wanted something calm, readable, and easy to keep alive over time. That goal pushed me toward a setup with fewer moving parts and clearer boundaries.

Astro works well for that kind of project because pages can stay pages first. The homepage, blog list, and article detail routes are mostly content surfaces. Interactivity still matters, but only in a few focused places such as the language switcher, theme switcher, particles, and media loading.

Static output also keeps the deployment story simple. I would rather spend my energy refining writing, visuals, and structure than maintaining a larger client runtime than this project really needs.
