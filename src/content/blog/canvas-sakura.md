---
title: What Actually Matters When Optimizing a Canvas Particle Scene
description: Notes from tuning a sakura particle system without losing the softness of the visual effect.
date: 2025-04-10
tags:
  - creative
  - canvas
  - performance
draft: false
readingTime: 5
---

People often assume that rich particle effects immediately require WebGL, but for a personal homepage that is not always true. In this case, Canvas 2D was enough, as long as the implementation stayed disciplined.

The biggest performance wins did not come from clever math. They came from practical choices: fewer petals, lower DPR on mobile, less path complexity, and no expensive blur filters inside the render loop.

That trade-off felt right for this project. The goal was not to simulate everything perfectly. The goal was to create a scene that feels alive, remains readable, and can run smoothly for a long time in the background.
