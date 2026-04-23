# PhSeCl.com

PhSeCl.com 是一个以樱花夜色为主题的个人博客与作品主页，使用 Astro 构建，强调轻量、氛围感与长期可扩展性。站点默认暗色模式，并支持亮色主题与按主题切换素材。

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

## 素材目录

项目中的美术素材统一建议放在 `public/media/` 下，便于后续扩展：

- `public/media/site/hero/`
  首页视频、封面图等站点级 Hero 素材
- `public/media/site/branding/`
  OG 图等品牌相关素材
- `public/media/pages/<page-slug>/`
  各个子页面未来可单独使用的背景图
- `public/media/people/`
  头像等人物素材
- `public/media/works/`
  作品封面
- `public/media/friends/`
  友链头像

## 主题素材约定

页面和组件支持以下三种素材组织方式：

- 明暗各一张：`*-dark.*` / `*-light.*`
- 只有一张通用图：`default`
- 没有图片：自动退回默认背景，不报错

## 当前需要手动放入的素材

- `public/media/site/hero/video.mp4`
- `public/media/site/hero/cover-dark.avif`
- `public/media/site/hero/cover-light.avif`
- `public/media/site/branding/og-image.png`
- `public/media/people/avatar.webp`
