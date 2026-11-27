# 时六 · SHILIU

一个可以直接部署到 GitHub Pages 的个人博客，使用 [Astro](https://astro.build/) 构建。

线上地址：<https://tokiro16.github.io/>

甜酷黑粉配色、圆润可爱的手写字体、拍立得式照片、库洛米风小恶魔贴纸、深浅色模式、文章搜索、标签归档、RSS 与 SEO 都已经准备好。内容围绕玩乐、游戏、物理、八卦、计算机与美妆穿搭展开，目前保留了一篇真实的串流折腾日志。

![时六博客预览](docs/preview.jpg)

## 已经包含

- 首页：大标题、精选文章、最新文章、六个主题栏目、关于区
- 文章页：目录、阅读进度、代码复制、上一篇 / 下一篇、相关推荐、JSON-LD
- 文章列表：按栏目筛选，支持 `?category=游戏` 这样的链接
- 标签页：标签云与标签详情
- 搜索：`⌘K` / `Ctrl+K` / `/` 打开，客户端全文检索
- 深浅色主题：跟随系统，也可以手动切换并记住选择
- RSS、Sitemap、robots.txt、Open Graph 分享图
- GitHub Actions：推送到 `main` 自动发布

## 本地运行

需要 Node.js 22 或更高版本。

```bash
npm install
npm run dev
```

打开 `http://localhost:4321`。

生产构建：

```bash
npm run build
npm run preview
```

## 先改这三处

### 1. 站点信息

编辑 [`src/config.ts`](src/config.ts)：

- `title` / `name`：站点名与作者名（当前为「时六」）
- `tagline`：首页与 SEO 的一句话介绍
- `description`：站点描述
- `location` / `since`
- `socials`：GitHub 链接（当前为 `tokiro16`）
- `topics`：首页的六个主题卡片

如果以后改了 GitHub 用户名，记得同步 `src/config.ts`、`astro.config.mjs` 和 README 里的链接。

### 2. 文章

文章都在 `src/content/posts/`，一个 Markdown 文件就是一篇文章。新增文件后不需要改路由。

```md
---
title: 文章标题
description: 一句话摘要，会显示在卡片和搜索结果里
date: 2026-11-24
category: 游戏
tags: [游戏, 开放世界]
cover: grid
featured: false
draft: false
---

正文从这里开始。

## 二级标题

支持 **粗体**、列表、引用、代码块和链接。
```

字段说明：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 文章标题 |
| `description` | 是 | 摘要，用于卡片、SEO 和 RSS |
| `date` | 是 | 日期，格式 `YYYY-MM-DD` |
| `category` | 是 | 栏目，用于列表筛选 |
| `tags` | 否 | 标签数组，会生成标签页 |
| `cover` | 否 | 封面文件名，默认 `orbit`（自动补 `.svg`；也可写 `my-photo.jpg`） |
| `featured` | 否 | 设为 `true` 会成为首页精选（只会取第一篇） |
| `draft` | 否 | 设为 `true` 后只在开发环境可见 |

`category` 建议从这六个里选，首页主题卡片才能和筛选对应：`玩乐`、`游戏`、`物理`、`八卦`、`计算机`、`美妆穿搭`。

内置封面在 `public/covers/`：`orbit`、`grid`、`type`、`arch`、`wave`、`mono`、`bloom`。也可以把自己的图片放进 `public/covers/`，然后把 `cover` 写成文件名。

### 3. 照片 / 个人介绍

首页主视觉使用 `public/images/shiliu-cool.jpg`，关于页使用 `public/images/shiliu-sweet.jpg`。想换照片时，直接替换这两张图（建议 3:4 竖图，宽度 900px 左右），再编辑 `src/pages/about.astro` 里的文字和「现在」列表即可。

## 部署到 GitHub Pages

### 方式一：用户主页（推荐）

1. 新建一个名为 `tokiro16.github.io` 的仓库。
2. 在项目目录里初始化并推送：

```bash
git init -b main
git add .
git commit -m "Initial blog"
git remote add origin https://github.com/tokiro16/tokiro16.github.io.git
git push -u origin main
```

3. 打开仓库的 **Settings → Pages**。
4. 在 **Build and deployment** 里把 **Source** 改成 **GitHub Actions**。
5. 回到 **Actions**，等待 `Deploy to GitHub Pages` 跑完。

之后每次 `git push` 都会自动构建并发布。地址是 `https://tokiro16.github.io`。

### 方式二：普通项目仓库

仓库名可以随意，例如 `my-blog`。仓库建好后把上面的 `git remote` 换成对应地址即可。工作流会自动把 `BASE_PATH` 设为 `/my-blog/`，所以站内链接和样式不会 404。

发布地址是 `https://tokiro16.github.io/my-blog/`。

工作流里的这段逻辑负责自动判断：

```yaml
SITE_URL: https://${{ github.repository_owner }}.github.io
BASE_PATH: ${{ github.event.repository.name == format('{0}.github.io', github.repository_owner) && '/' || format('/{0}', github.event.repository.name) }}
```

### 使用自定义域名

1. 在仓库 **Settings → Pages → Custom domain** 里填写域名。
2. 修改 `.github/workflows/deploy.yml` 里的两个环境变量：

```yaml
SITE_URL: https://blog.example.com
BASE_PATH: /
```

3. 在 `public/` 下新增一个 `CNAME` 文件，内容是你的域名（不要带 `https://`）。

### 部署前检查清单

- [ ] `src/config.ts` 里的名字、站点简介、社交链接都是最新的
- [ ] `astro.config.mjs` 的 `site` 或工作流里的 `SITE_URL` 是最终域名
- [x] 已删除占位文章，只保留真实日志
- [ ] 仓库 **Settings → Pages → Source** 已选择 **GitHub Actions**
- [ ] `npm run build` 本地通过

## 项目结构

```text
.
├─ .github/workflows/deploy.yml   # GitHub Pages 自动部署
├─ docs/preview.jpg               # README 预览图
├─ public/
│  ├─ covers/                     # 封面图
│  ├─ images/                     # 首页与关于页照片
│  ├─ favicon.svg
│  └─ og.png                      # 社交分享图
├─ src/
│  ├─ components/                 # 页头、页脚、卡片、搜索等
│  ├─ content/posts/              # 所有文章
│  ├─ layouts/BaseLayout.astro
│  ├─ lib/                        # 文章解析、日期、URL 工具
│  ├─ pages/                      # 路由
│  ├─ scripts/main.ts             # 主题、搜索、目录、阅读进度
│  ├─ styles/global.css           # 全站样式
│  └─ config.ts                   # 站点信息
├─ astro.config.mjs
└─ package.json
```

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生成静态站点到 `dist/` |
| `npm run preview` | 本地预览构建结果 |
| `npm run og` | 重新生成 `public/og.png` |

## 说明

- 标题和正文使用 ZCOOL KuaiLe（SIL Open Font License 1.1），授权文件在 `src/assets/fonts/OFL.txt`。
- 背景贴纸是原创的库洛米风小恶魔矢量图，放在 `public/stickers/`，没有使用官方素材。
- 文章正文由 `marked` 在构建时转成 HTML，文章来自你自己的仓库，属于可信内容。
- 搜索索引在构建时生成到 `search.json`，不会请求任何第三方服务。
- 站内链接统一经过 `src/lib/urls.ts` 处理，因此项目页和自定义域名都能正常工作。
- 配色、字号、间距都在 `src/styles/global.css` 顶部的 `@layer tokens` 里，想换风格改那里最快。
