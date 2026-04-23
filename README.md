# PhSeCl.com

PhSeCl.com 是一个以樱花夜色为主题的个人博客与作品主页，使用 Astro 构建，强调轻量、氛围感与长期可扩展性。

## 技术栈

- Astro
- MDX
- Tailwind CSS
- Astro Content Collections
- Canvas 2D sakura particle system
- Giscus
- Cloudflare Pages

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 部署

部署平台为 Cloudflare Pages。

- 构建命令：`npm run build`
- 输出目录：`dist/`

## 素材说明

以下素材需要手动放入仓库中的对应目录，代码已预留引用与降级逻辑：

- `public/video/hero-bg.mp4`
- `public/images/hero-cover.webp`
- `public/images/avatar.webp`
- `public/images/og-image.png`

如需扩展作品封面、友链头像等素材，也请继续放入 `public/images/` 下的对应路径。
