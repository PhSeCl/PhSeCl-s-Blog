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

## 友链投稿

欢迎通过提交 PR 的方式申请加入友链页。站点会从 `src/data/friends.json` 读取友链数据，并在 `/friends` 页面展示。

### 提交流程

1. Fork 本仓库并创建分支。
2. 将你的头像文件放到 `public/media/friends/` 目录下。
3. 在 `src/data/friends.json` 里追加一条对象。
4. 提交 PR，标题可写为 `Add friend link: 你的站点名`。

### 数据格式

`src/data/friends.json` 使用 JSON 数组，单条友链格式如下：

```json
{
  "name": "你的站点名",
  "description": "一句简短介绍，建议 20-60 字",
  "url": "https://your-site.example",
  "avatar": "/media/friends/your-avatar.png"
}
```

如果文件当前还是空数组 `[]`，可以直接改成：

```json
[
  {
    "name": "你的站点名",
    "description": "一句简短介绍，建议 20-60 字",
    "url": "https://your-site.example",
    "avatar": "/media/friends/your-avatar.png"
  }
]
```

如果已经有其他友链，请按下面的方式继续追加，注意逗号位置：

```json
[
  {
    "name": "已有站点",
    "description": "已有简介",
    "url": "https://example.com",
    "avatar": "/media/friends/existing-avatar.png"
  },
  {
    "name": "你的站点名",
    "description": "一句简短介绍，建议 20-60 字",
    "url": "https://your-site.example",
    "avatar": "/media/friends/your-avatar.png"
  }
]
```

### 投稿约定

- `name`：展示在卡片标题中的站点名或昵称
- `description`：展示在卡片正文中的一句介绍
- `url`：你的主页链接，需带 `https://`
- `avatar`：仓库内头像资源路径，建议使用方形图片
- 头像文件名尽量使用英文、数字和短横线，便于维护
- 请确保站点可以正常访问，且内容适合公开展示
