## Folumio: 面向技术写作与深度阅读的 Astro 博客主题[![Deploy](https://github.com/Louaq/louaq.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/Louaq/louaq.github.io/actions/workflows/deploy.yml)

基于 [Firefly](https://github.com/CuteLeaf/Firefly) 主题二次开发的个人博客，专注于多模态医学图像分析领域的论文阅读笔记与技术分享。使用 [Astro](https://astro.build) 构建，站点内容全部为静态生成。

## 预览

在线预览：<a href="https://louaq.io" target="_blank" rel="noopener noreferrer">https://louaq.io</a>

<table>
  <tr>
    <td width="50%" align="center">
      <img src="https://pic1.imgdb.cn/i/034eTilS48S3CdG1acXUup.png" alt="首页"><br>
      <sub><b>首页 · 深色</b></sub>
    </td>
    <td width="50%" align="center">
      <img src="https://pic1.imgdb.cn/i/034eTjOcsNigCY1uSZadG3.png" alt="文章页"><br>
      <sub><b>文章页</b></sub>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <img src="https://pic1.imgdb.cn/i/034eTlN9D2SLgavCMnmveB.png" alt="归档页"><br>
      <sub><b>归档页</b></sub>
    </td>
    <td width="50%" align="center">
      <img src="https://pic1.imgdb.cn/i/034eTlmbViuJddiKcsv7j4.png" alt="追番 / 观影清单"><br>
      <sub><b>追番 / 观影清单</b></sub>
    </td>
  </tr>
</table>

## 特性

**写作**
- 📝 Markdown / MDX，KaTeX 数学公式、Expressive Code 代码高亮（可折叠、带标题栏工具条）
- 💡 GitHub 风格提示块（`> [!NOTE]` 等）
- 🧩 自定义指令：GitHub 仓库卡片、PDF 内嵌预览、视频播放（见下文）
- 🖼️ 带 alt 的图片自动生成图注，点击放大（medium-zoom）
- 🔗 外链自动新窗口打开，标题自动生成锚点
- ⏱️ 字数统计与阅读时长、文章过期提醒

**页面与组件**
- 🏠 首页轮播、顶部通知条、文章置顶
- 🧭 侧边栏组件：个人资料、公告、音乐播放器、运行时间、节气，可配置顺序与开关
- 🎵 侧边栏音乐播放器（APlayer + 自建曲库，支持歌单搜索、定位当前播放，Swup 换页不中断）
- 🏷️ 分类、标签、归档、RSS、站点地图
- 🎬 追番 / 观影清单（动画、电影、剧集）、友链页面
- 🔐 文章密码保护
- 💬 Twikoo 评论
- 🔍 Meilisearch 站内搜索
- 🌗 明暗主题切换

**性能**
- ⚡ Swup 页面过渡；KaTeX、评论、PDF / 视频播放器等按需懒加载
- 🔤 正文中文字体按全站用字子集化并分层切片

## 技术栈

[Astro](https://astro.build) 7 · [Svelte](https://svelte.dev) 5 · [Tailwind CSS](https://tailwindcss.com) 4 · TypeScript · pnpm

## 快速开始

环境要求：Node.js 24.x（LTS），pnpm（`preinstall` 已强制要求使用 pnpm，版本见 `package.json` 的 `packageManager` 字段）。

```bash
pnpm install   # 安装依赖
pnpm dev       # 启动开发服务器
pnpm build     # 构建到 dist/
pnpm preview   # 本地预览构建产物
```

> [!WARNING]
> 配置了 Meilisearch 管理密钥时，`pnpm build` 会把文章上传到线上搜索索引，本地测试文章也会被推上去。

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产环境静态站点 |
| `pnpm preview` | 本地预览构建产物 |
| `pnpm check` | Astro 类型/内容检查 |
| `pnpm type-check` | TypeScript 类型检查 |
| `pnpm format` | 使用 Biome 格式化代码 |
| `pnpm lint` | 使用 Biome 检查并修复代码 |
| `pnpm new-post -- <文件名>` | 在 `src/content/posts/` 创建带 front-matter 的新文章 |
| `pnpm subset-font` | 按全站用字子集化正文字体（需先把原始 TTF 放进 `font-src/`，依赖 Python fonttools） |
| `pnpm split-font` | 在 `build` 之后运行，把子集字体按页面用字切成两层 woff2 |
| `pnpm prune-pdfjs` | 裁剪 `public/pdfjs/` 中用不到的 pdf.js 资源（升级 pdf.js 后重跑） |

新增生僻字后的字体流程：`pnpm subset-font` → `pnpm build` → `pnpm split-font` → 提交产物。

## 写文章

文章放在 `src/content/posts/`，支持子目录。front-matter 字段：

```yaml
---
title: 标题                # 必填
published: 2026-10-07      # 必填
updated: 2026-10-08
description: 摘要
image: 封面图地址
tags: [标签A, 标签B]
category: 分类
draft: false               # true 时不发布
pinned: false              # 置顶
slug: custom-path          # 自定义 URL，不填则按 siteConfig.postPathMode 生成短 hash
password: "xxx"            # 文章密码；写 true 则使用环境变量 PASSWORD
comment: true              # 是否开启评论
author: ""                 # 转载文章的作者、来源与许可证
sourceLink: ""
licenseName: ""
licenseUrl: ""
homeCarousel: false        # 是否进入首页轮播
homeCarouselOrder: 1
homeCarouselImage: ""
lang: ""
---
```

### 自定义指令

```md
::github{repo="owner/repo"}

::pdf{src="https://example.com/file.pdf" title="可选" height="660px"}

::video{src="https://example.com/video.mp4" poster="https://example.com/cover.jpg" title="视频说明"}
```

| 指令 | 属性 | 说明 |
| --- | --- | --- |
| `::github` | `repo` | GitHub 仓库卡片，格式 `owner/repo` |
| `::pdf` | `src`（或 `url`）、`title`、`height` | 使用自托管的 pdf.js viewer，带翻页/缩放/搜索/下载工具栏；跨域 PDF 需源站开启 CORS；`height` 默认 `90vh` |
| `::video` | `src`（或 `url`）、`poster`、`title` | Video.js 播放器，支持 mp4 / webm，`.m3u8` 自动走 hls.js；高度随视频比例自适应 |

## 侧边栏音乐

- 开关与排序：`src/config/sidebarConfig.ts` 中 `type: "music"` 的组件
- 接口地址：固定使用同源 `/ncm`，由服务器反向代理到网易云兼容接口（见 `src/components/widget/Music.astro`）
- 歌单：站点根路径 `/music.json`，由服务器上的 `scan.mjs` 生成，不在仓库内
- 开发时 `/ncm`、`/music.json`、`/assets/music` 会被代理到线上站点（见 `astro.config.mjs`）
- 移动端（≤ 768px）不加载播放器

## 配置

站点外观与功能开关都在 `src/config/` 下：

| 文件 | 内容 |
| --- | --- |
| `siteConfig.ts` | 站点信息、主题色、文章 URL 模式、封面图显示、文章许可证信息、过期提醒阈值、页面开关、分页 |
| `navBarConfig.ts` | 导航栏链接 |
| `profileConfig.ts` | 头像、简介、社交链接 |
| `sidebarConfig.ts` | 侧边栏组件顺序与开关 |
| `announcementConfig.ts` | 侧边栏公告 |
| `homeCarouselConfig.ts` | 首页轮播手动项 |
| `homeTopNoticeConfig.ts` | 首页顶部通知 |
| `adConfig.ts` | 推广位 |
| `commentConfig.ts` | 评论系统（Twikoo） |
| `expressiveCodeConfig.ts` | 代码块主题 |
| `fontConfig.ts` | 字体 |
| `footerConfig.ts` / `FooterConfig.html` | 页脚 HTML 注入 |
| `friendsConfig.ts` | 友链 |
| `watchlist/` | 追番 / 观影清单数据（动画、电影、剧集） |

## 环境变量

| 变量 | 用途 |
| --- | --- |
| `PASSWORD` | `password: true` 的文章使用的统一密码 |
| `MEILISEARCH_HOST` / `PUBLIC_MEILISEARCH_HOST` | Meilisearch 地址 |
| `MEILISEARCH_ADMIN_KEY` | 构建时上传索引用的管理密钥 |
| `MEILISEARCH_INDEX_NAME` / `PUBLIC_MEILISEARCH_INDEX_NAME` | 索引名 |
| `PUBLIC_MEILISEARCH_SEARCH_KEY` | 前端搜索用的只读密钥 |

本地可写在根目录 `.env`（不要提交）。

## 部署

推送到 `master` 分支后，`.github/workflows/deploy.yml` 会自动构建，并通过 rsync 把 `dist/` 同步到自己的服务器。需要在仓库 Secrets 中配置：

- 构建：`PASSWORD`、`MEILISEARCH_ADMIN_KEY`、`MEILISEARCH_INDEX_NAME`、`PUBLIC_MEILISEARCH_SEARCH_KEY`、`PUBLIC_MEILISEARCH_INDEX_NAME`
- 部署：`SSH_KEY`、`SSH_HOST`、`SSH_PORT`、`SSH_USER`、`DEPLOY_PATH`

仓库里也有 `vercel.json`、`netlify.toml`，可以直接托管 `dist/`。

## 目录结构（节选）

```
src/
├── components/   # UI 组件（layout / widget / controls / misc …）
├── config/       # 站点配置
├── content/      # posts/ 文章，spec/ 关于页等
├── i18n/         # 多语言文案
├── layouts/      # 页面布局
├── pages/        # 路由页面
├── plugins/      # remark/rehype 自定义插件
└── styles/       # 全局样式
scripts/          # 新建文章、字体子集化与切片、pdf.js 裁剪
font-src/         # 字体子集化的中间产物
public/           # 静态资源（含自托管 pdf.js）
```

## 贡献

欢迎提交 Issue / PR，提交前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。


## 感谢

参考样式：[Ru-yu Blog](https://www.chichu.chat/)、[ThriveX Blog](https://liuyuyang.net/)

## 许可证

[MIT](LICENSE)
