---
title: Folumio 主题完整使用指南
published: 2026-11-18
category: Folumio 文档
tags: [Folumio, Astro]
description: 从克隆项目、发布第一篇文章，到配置首页、独立页面、搜索、评论与部署。
---

## Astro 是什么？

Astro 是一个用于构建网站的框架。在 Folumio 里，你把文章写成 Markdown 或 MDX，Astro 读取文章标题、分类和标签，套用主题布局，在构建时生成文章页、归档页和 RSS。生成的文件放在 `dist/`，发布到静态托管平台或自己的 Web 服务器后，读者就能访问。

Astro 也支持由服务器在收到请求时生成页面。同一个项目可以预先生成公开文章，同时按请求渲染需要登录的页面。Folumio 的公开页面使用静态生成。[Astro 官方文档：按需渲染](https://docs.astro.build/en/guides/on-demand-rendering/)

## 静态博客和动态博客有什么区别？

最主要的区别是 **HTML 在什么时候生成**。以下用 Folumio 和一套常见的自建动态博客对比。

| 对比 | 静态博客（以 Folumio 为例） | 常见的动态博客（以自建 WordPress 为例） |
| --- | --- | --- |
| 打开文章 | **服务器或 CDN 返回构建时已经生成的 HTML 文件** | 应用在收到请求后读取内容并生成页面，也可以返回缓存 |
| 发布文章 | **修改仓库中的 Markdown 或 MDX，重新构建并发布。这个过程可以由 CI 自动完成** | 登录管理后台编辑，点击发布后写入数据库，通常无需重新构建全站 |
| 部署与维护 | **正文页面只需要静态文件托管。评论、搜索等服务可以按需接入** | 通常需要可运行应用的服务器和数据库，也要维护应用、插件及数据库备份 |
| 常见用途 | **个人技术笔记、项目文档、作品集等以公开阅读为主的站点** | 需要经常通过后台更新、多人编辑、会员登录或按读者显示不同内容的站点 |

例如，给一篇 Folumio 文章补一张图，你会提交 Markdown 和图片，然后发布新一版静态文件。读者发表评论时，浏览器直接请求 Twikoo，文章的 HTML 无需重新生成。发布文章与处理评论是两条独立的流程。

## 修改前先认目录

- `src/config/` 保存站点配置和独立页面的数据。
- `src/content/posts/` 保存 Markdown 和 MDX 文章。
- `public/` 保存按原路径发布的资源，例如头像、封面和附件。
- `src/content/posts/docs/` 保存本指南，文档与普通文章共用文章路由和归档。

> [!TIP]
> 文档中的配置片段通常只展示要改的字段。请在原配置对象中替换对应字段，保留同文件里的其他选项。

## 1. 从零搭建

### 准备环境

| 工具 | 用途 |
| --- | --- |
| Git | 获取代码和保存自己的改动 |
| Node.js 24.x | 运行 Astro |
| pnpm | 安装依赖；版本以 `package.json` 的 `packageManager` 为准 |
| Python 3.12 | 可参考仓库 CI 使用此版本，构建时生成中文字体子集 |

在终端运行 `git --version`、`node --version`、`pnpm --version` 确认。若系统还没有 pnpm，可先读取项目声明的版本，再用 `npm install -g pnpm@<声明的版本>` 安装。尖括号内需换成实际版本号。

### 获取项目并启动

如果需要在 GitHub 上长期维护自己的博客，先 Fork [Folumio](https://github.com/Louaq/Folumio)，再将下面的仓库地址换成自己的 Fork。只想本地体验时可以直接克隆。

```bash
git clone https://github.com/Louaq/Folumio.git
cd Folumio
pnpm install --frozen-lockfile
pnpm dev
```

从终端打开 Astro 打印的 `Local` 地址，常见是 `http://localhost:4321/`。端口已占用时，以终端输出为准。按 `Ctrl+C` 停止服务。

> [!NOTE]
> 请在含有 `package.json` 和 `pnpm-lock.yaml` 的仓库根目录执行命令。项目的安装脚本要求使用 pnpm。若冻结锁文件安装失败，先核对 Node.js、pnpm 版本和锁文件是否对应当前提交。

### 首次设置的顺序

1. 在 `src/config/siteConfig.ts` 修改 `title`、`subtitle`、`site_url` 和 `description`。
2. 在 `profileConfig.ts`、`aboutConfig.ts` 和 `footerConfig.ts` 替换个人信息、邮箱、社交链接与版权信息。
3. 将头像、Banner 和图标放进 `public/assets/`，并更新对应路径。`public/assets/images/avatar.webp` 的网页地址是 `/assets/images/avatar.webp`。
4. 新建一篇自己的文章，确认首页、文章页和归档能找到它。替换样例时，先列出已有页面仍在引用的文章与图片，再清理演示素材。
5. 核对默认配置中的第三方地址与外链。暂时不接入音乐或评论时，分别关闭 `floatingControls.music` 和 `commentConfig.type`（设为 `"none"`）。

### 本地验收

检查桌面与手机宽度下的 Banner、导航和头像。打开一篇文章并点击分类、标签与 RSS。重启开发服务器后重复检查涉及环境变量的功能。

## 2. 文章与内容

### 创建第一篇文章

```bash
pnpm new-post -- first-post.md
```

也可以在 `src/content/posts/` 手动新建 `.md` 或 `.mdx` 文件。使用 Markdown 就能写正文、公式和代码；需要直接在文章中引用组件时才使用 MDX。

```markdown
---
title: 我的第一篇文章
published: 2026-01-15
description: 记录博客搭建过程和第一个配置示例
tags: [Astro, 博客]
category: 建站笔记
draft: false
pinned: false
---

## 正文

这里是第一段正文。
```

### Front Matter 字段

| 字段 | 用法 |
| --- | --- |
| `title`、`published` | 必填；日期按示例写成 `YYYY-MM-DD` |
| `updated`、`description`、`image` | 更新日期、摘要、文章封面 |
| `category`、`tags` | 单个分类与标签数组；统一拼写以避免重复条目 |
| `draft`、`pinned` | `draft: true` 的文章在本地开发时可见，生产环境会过滤；`pinned: true` 控制置顶 |
| `slug`、`lang` | 自定义文章路径段、文章语言 |
| `author`、`sourceLink`、`licenseName`、`licenseUrl` | 来源信息和许可声明 |
| `comment` | 默认允许评论；单篇可设为 `false` |
| `password` | 字符串指定密码，`true` 使用 `PASSWORD` |

### 路径、封面和附件

正文存放目录可以分层，但默认文章 URL 用短 hash。要使用可读且长期稳定的地址，可在首次发布前写 `slug: first-post`，然后访问 `/posts/first-post/`。自定义路径应唯一；已发布后变更路径会影响收藏链接和其他站点引用。

放在 `public/assets/posts/` 的静态资源可用 `/assets/posts/文件名` 引用。上线前检查文件名大小写，Linux 部署环境会区分大小写。

#### 正文图片展示

下面用主题自带的 Banner 演示正文插图。方括号内填写能说明画面的替代文本，圆括号内填写图片路径。

```markdown
![](/assets/coverImage/3.webp)
```

![](/assets/coverImage/3.webp)

点击图片可以打开大图预览，预览窗口会显示替代文本。若希望正文中也显示图注，可在图片下方另写一行说明。

### 代码、公式和提示块

给代码围栏标注语言以启用高亮，例如使用 `ts` 或 `bash`。长文按二级、三级标题组织，便于文章目录定位。

#### 数学公式

Folumio 使用 KaTeX 渲染 LaTeX 公式。下面每组先给出 Markdown 源码，再显示渲染结果。

**行内公式**用单个美元符号包围，适合在一句话里定义变量或给出简短公式。

```markdown
设 $x_1,\ldots,x_n$ 是观测值，其均值为 $\bar{x}$。
```

设 $x_1,\ldots,x_n$ 是观测值，其均值为 $\bar{x}$。

**独立公式**把双美元符号各放一行，适合显示带分式、求和或积分的公式。

```markdown
$$
\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i
$$
```

$$
\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i
$$

**多行对齐**在独立公式中使用 `aligned`，用 `&` 标记对齐位置，用 `\\` 换行。

```markdown
$$
\begin{aligned}
s^2 &= \frac{1}{n-1}\sum_{i=1}^{n}(x_i-\bar{x})^2 \\
    &= \frac{\sum_{i=1}^{n}x_i^2 - n\bar{x}^2}{n-1}
\end{aligned}
$$
```

$$
\begin{aligned}
s^2 &= \frac{1}{n-1}\sum_{i=1}^{n}(x_i-\bar{x})^2 \\
    &= \frac{\sum_{i=1}^{n}x_i^2 - n\bar{x}^2}{n-1}
\end{aligned}
$$


#### 代码块分组

用 `:::code-tabs` 包住一组代码块，每个标签用 `@tab 标签名` 开头。默认显示第一组，也可以用 `@tab:active 标签名` 指定默认项。每个标签显示其后的第一个代码块。标签和代码围栏之间留一空行。

````markdown
:::code-tabs

@tab pnpm

```bash
pnpm dev
```

@tab yarn

```bash
yarn dev
```

@tab:active npm

```bash
npm run dev
```

:::
````

下方默认显示 **npm**。点击 **pnpm** 或 **yarn** 可切换命令。这里演示运行脚本的不同写法，Folumio 安装依赖时仍要求使用 pnpm。

:::code-tabs

@tab pnpm

```bash
pnpm dev
```

@tab yarn

```bash
yarn dev
```

@tab:active npm

```bash
npm run dev
```

:::

#### GitHub 风格提示块

Folumio 当前使用 GitHub 风格，内置下面五种提示框。每组先给出 Markdown 写法，再显示实际渲染效果。

**NOTE · 补充说明**

```markdown
> [!NOTE]
> 正文里的图片路径从站点根目录算起，例如 `/assets/images/cover.webp`。
```

> [!NOTE]
> 正文里的图片路径从站点根目录算起，例如 `/assets/images/cover.webp`。

**TIP · 实用建议**

```markdown
> [!TIP]
> 修改配置后，先在本地预览对应页面。
```

> [!TIP]
> 修改配置后，先在本地预览对应页面。

**IMPORTANT · 关键步骤**

```markdown
> [!IMPORTANT]
> 发布前，将 `site_url` 改为自己的正式域名，否则 RSS 和站点地图可能指向演示站。
```

> [!IMPORTANT]
> 发布前，将 `site_url` 改为自己的正式域名，否则 RSS 和站点地图可能指向演示站。

**WARNING · 风险提醒**

```markdown
> [!WARNING]
> 构建时如果使用生产环境的 Meilisearch 管理密钥，可能更新线上搜索索引。
```

> [!WARNING]
> 构建时如果使用生产环境的 Meilisearch 管理密钥，可能更新线上搜索索引。

**CAUTION · 高风险操作**

```markdown
> [!CAUTION]
> 部署命令使用 `rsync --delete` 时，目标目录中不在 `dist/` 里的文件可能被删除。
```

> [!CAUTION]
> 部署命令使用 `rsync --delete` 时，目标目录中不在 `dist/` 里的文件可能被删除。

### 在正文嵌入仓库、PDF 和视频

#### GitHub 仓库卡片

填写 `owner/repo` 格式的仓库名。下面是 Folumio 的仓库卡片，点击可以打开 GitHub。

```markdown
::github{repo="Louaq/Folumio"}
```

::github{repo="Louaq/Folumio"}

#### 在文章内阅读 PDF

下面是一份两页的示例 PDF。试试用工具栏翻到第 2 页，或放大页面。

```markdown
::pdf{src="/assets/docs/embed-demo.pdf" title="Folumio PDF 嵌入示例" height="520px"}
```

::pdf{src="/assets/docs/embed-demo.pdf" title="Folumio PDF 嵌入示例" height="520px"}

PDF 支持 `src` 或 `url`。本例的文件位于 `public/assets/docs/`，引用时从 `/assets/docs/` 开始。使用站外 PDF 时，文件服务器需要允许跨域读取。

#### 在文章内播放视频

点击播放即可查看一段 5 秒的无声演示。播放器加载前会显示 `poster` 指定的封面。

```markdown
::video{src="/assets/docs/embed-demo.webm" poster="/assets/docs/embed-demo.webp" title="Folumio 视频嵌入示例"}
```

::video{src="/assets/docs/embed-demo.webm" poster="/assets/docs/embed-demo.webp" title="Folumio 视频嵌入示例"}

视频也可以使用 MP4 或 `.m3u8`。使用 HLS 时，播放清单和分片都需要允许浏览器访问。

### 发布前自查

- 打开文章确认摘要、封面、公式与嵌入内容均能正常渲染。
- 搜索、RSS 和归档分别使用各自的内容逻辑。涉及私密内容时，不要将文章密码用作机密文件的访问控制。
- 文章正文中的相对链接和图片应以最终生成的页面地址检验。

## 3. 站点与外观

### 站点身份和域名

打开 `src/config/siteConfig.ts`，先修改站名、描述、关键词与正式域名。`site_url` 应填写完整的 HTTPS 地址，用于生成绝对链接，例如 RSS 和站点地图。`siteStartDate` 对应站点运行时间，`timezone` 使用 IANA 时区名，例如 `Asia/Shanghai`。

```ts
title: "山间笔记",
subtitle: "记录写作与实验",
site_url: "https://blog.example.com",
description: "分享技术笔记与日常记录",
keywords: ["Astro", "技术笔记"],
siteStartDate: "2026-01-15",
timezone: "Asia/Shanghai",
```

### Banner、主题色和图标

把示例图片替换为实际存在的文件。以 `/` 开头的图片路径映射到 `public/`，也可使用 HTTPS URL。Banner 另支持 `src/assets` 中相对于 `src` 的项目路径。桌面端和移动端可独立配置静态图或非空数组，多图按顺序切换，间隔单位为毫秒。

```ts
homeBanner: {
  hitokoto: false,
  waves: true,
  desktop: ["/assets/images/banner.webp", "/assets/images/banner-2.webp"],
  mobile: "/assets/images/banner-mobile.webp",
  switchInterval: 10000,
},
themeColor: {
  color: "#4fb185",
  defaultMode: "light",
  showModeSwitch: true,
},
```

`hitokoto: false` 时使用 `subtitle`。关闭 `waves` 可以去掉底部波浪。`favicon` 控制浏览器标签图标，`navbar.logo` 控制导航里的 Logo，两者独立。替换图标后可以通过新标签页或私密窗口排除浏览器缓存。

### 导航、个人资料与页脚

- `navBarConfig.ts` 管理顶部导航。站内页面可使用 `LinkPreset`。预设定义在 `src/constants/link-presets.ts`，中文标签在 `src/i18n/languages/zh_CN.ts`。
- 添加站外链接时在导航项中填写 `name`、`url` 和 `external: true`。站内路径保持项目的末尾斜杠风格。
- `profileConfig.ts` 管理个人卡片，包含头像、简介与社交入口；`footerConfig.ts` 管理页脚版权、导航、支持方、友链和访客统计。
- `sidebarConfig.ts` 的 `components` 列表可设置小组件的 `enable`、`order`、`position` 和 `showOnPostPage`。改完后同时检查首页和文章页，因为两者的布局不同。
- `floatingControls` 分别控制音乐、返回顶部与返回底部按钮。

例如，要把个人卡片改成自己的信息，可先将头像放进 `public/assets/images/my-avatar.webp`，再用以下示例替换 `src/config/profileConfig.ts` 中的 `profileConfig` 对象。文件顶部的类型导入保留。

```ts
export const profileConfig: ProfileConfig = {
  name: "山间笔记",
  avatar: "/assets/images/my-avatar.webp",
  cover: "/assets/images/profile-cover.webp",
  bio: "记录写作与实验",
  links: [
    { name: "GitHub", icon: "/assets/images/github.svg", url: "https://github.com/your-name" },
    { name: "RSS", icon: "/assets/images/rss.svg", url: "/rss.xml" },
  ],
};
```

要把这篇文档加到导航，在 `navBarConfig.ts` 的 `return { links }` 之前添加 `links.push({ name: "使用文档", url: "/posts/docs/" });`。刷新首页后点击「使用文档」，确认打开的是文章页。若还修改了 `footerConfig.ts` 的署名，同时检查页脚。

如果只想隐藏侧栏公告，在 `sidebarConfig.ts` 找到 `type: "announcement"` 的那一项，设置 `enable: false`。刷新首页时，公告卡片应消失，个人卡片保留。若仍看见公告文字，确认它是否来自首页通知条或导航弹窗，这两处各有独立开关。

### 阅读和字体

| 选项 | 配置位置 | 用途 |
| --- | --- | --- |
| `pagination.postsPerPage` | `siteConfig.ts` | 文章列表的每页数量 |
| `postPathMode` | `siteConfig.ts` | URL 生成模式；修改前确认对既有链接的影响 |
| `license` | `siteConfig.ts` | 默认文章许可，与代码仓库的许可证分开配置 |
| `showLastModified`、`outdatedThreshold` | `siteConfig.ts` | 更新信息及过期提醒 |
| `rss.mode` | `siteConfig.ts` | RSS 内容模式，可在 `/rss.xml` 查看结果 |
| 字体及代码样式 | `fontConfig.ts`、`expressiveCodeConfig.ts` | 分别管理字体设定与代码块主题、行号和折叠选项 |

使用自定义字体时提供可访问的资源，检查中西文、代码和移动端换行。中文字体子集由完整构建流程生成，详见部署章节。

如果只想让代码默认展开，可在 `expressiveCodeConfig.ts` 中保留 `pluginCollapsible.enable: true`，把 `defaultCollapsed` 改成 `false`。`lineThreshold: 30` 用于判断长代码块，`previewLines: 20` 控制折叠时可见行数。改完重启 Astro，用一段超过 30 行的代码确认折叠按钮和默认状态。

## 4. 独立页面与组件

### 页面开关与入口

在 `src/config/siteConfig.ts` 的 `pages` 中控制 `essays`、`friends`、`watchlist`。关闭某页后，同时检查页脚和正文中有没有手动添加的链接。分类、标签和归档来自文章内容，分别访问 `/categories/`、`/tags/` 和 `/archive/`。404 页面对应 `src/pages/404.astro`。

### 关于页与随笔

关于页在 `/about/`，主要数据来自 `aboutConfig.ts`。请先修改简介与联系方式，再检查链接。随笔页在 `/essays/`，从 `essaysConfig.ts` 的 `items` 读取数据，按日期倒序展示。

修改 `aboutPageConfig.title` 可替换页内大标题，`headerDescription` 是标题下的小字，`introduction` 是正文简介。页面默认复用 `profileConfig.avatar`。还可以直接替换 `identityTags` 和 `directions`，清掉原作者的研究方向。

```ts
{
  date: "2026-01-15",
  content: "完成了博客的第一次部署。\n下一篇记录踩坑过程。",
  images: ["/assets/images/first-deploy.webp"],
},
```

`content` 是纯文本，使用 `\n` 换行。`images` 可以省略，多张图按数组顺序显示。

### 友情链接

`friendsConfig.ts` 管理本站交换信息 `friendSiteInfo`、页面选项 `friendsPageConfig` 和友链分组。将站点添加到已有分组的 `friends` 数组。分组及站点都可设 `enabled`，`weight` 用于配置排序。开启 `randomizeSort` 时，构建阶段随机排序并忽略权重。

```ts
{
  title: "朋友的博客",
  imgurl: "https://friend.example.com/avatar.webp",
  siteurl: "https://friend.example.com",
  desc: "记录技术与生活",
  weight: 10,
  enabled: true,
},
```

若不开放友链申请，可按需调整 `showCustomContent`。`showComment` 需要同时配置全站评论。

### 追番与观影清单

在 `src/config/watchlist/` 中按作品类型编辑 `animeConfig.ts`、`movieConfig.ts` 或 `tvConfig.ts`。`index.ts` 汇总清单并设置排序、分页及是否显示进度和评分。

```ts
{
  title: "某部动画",
  cover: "/assets/images/watch-example.webp",
  type: "anime",
  status: "watching",
  rating: 8,
  episodes: { current: 3, total: 12 },
  enabled: true,
},
```

状态支持 `watching`、`completed` 和 `plan_to_watch`。评分范围为 1–10；进度、日期、标签和置顶都可选。只有配置有效封面的示例才适合长期保留。

### 三种公告如何选择

| 场景 | 配置 | 适合内容 |
| --- | --- | --- |
| 侧栏 | `announcementConfig.ts` | 简短的常驻通知，还需启用对应侧栏组件 |
| 首页列表上方 | `homeTopNoticeConfig.ts` | 多条通知轮播或引导链接，可配置时间间隔 |
| 导航公告弹窗 | `popupConfig.ts` | 需要独立展示的通知，可配置 HTML 内容与触发时机 |

弹窗的 `showMode` 支持 `always`、`once`、`scheduled` 和 `none`。选择定时模式时，在 `scheduledAt` 填写带时区偏移的时间，例如 `2026-01-15T10:00:00+08:00`。变更后用私密窗口检验首次访问时的表现。

如果要在首页文章列表上方放一个「如何使用本主题」链接，把下面的对象放进 `homeTopNoticeConfig.items`。同时确认外层 `enable` 为 `true`。

```ts
{
  title: "文档",
  content: "第一次使用 Folumio？从安装和配置开始。",
  link: { enable: true, url: "/posts/docs/", external: false },
},
```

单条内容不轮播。多条时由 `switchInterval` 控制间隔，单位为毫秒。首页有通知文字但无法点击时，先检查该条自己的 `link.enable`。

## 5. 评论、搜索与音乐

### Twikoo 评论

先部署自己的 Twikoo 服务，再到 `src/config/commentConfig.ts` 将 `type` 设为 `"twikoo"`，并用自己的服务地址替换 `twikoo.envId`。`lang` 可设为 `"zh-CN"`。暂不使用评论时，设 `type: "none"`。单篇文章设置 `comment: false` 可关闭该篇评论。

```ts
export const commentConfig: CommentConfig = {
  type: "twikoo",
  twikoo: {
    envId: "https://comments.example.com",
    lang: "zh-CN",
    visitorCount: false,
  },
};
```

这里使用 Twikoo 自有服务的 HTTPS 地址。`visitorCount: false` 只关闭 Twikoo 的浏览计数，评论仍可用。

在正式域名打开文章并提交一条测试评论。若列表空白，检查浏览器网络请求和服务端日志，核对接口地址、HTTPS 和服务端允许访问的域名。友链页还需检查该页的 `showComment`。

### Meilisearch 搜索

搜索分成两条链路。构建端用管理密钥更新索引，访客浏览器用只读搜索密钥查询。使用自己的服务和索引，前后端的索引名称应一致。

```dotenv
MEILISEARCH_HOST=https://search.example.com
MEILISEARCH_INDEX_NAME=blog
MEILISEARCH_ADMIN_KEY=在本地或CI环境中填写
PUBLIC_MEILISEARCH_HOST=https://search.example.com
PUBLIC_MEILISEARCH_INDEX_NAME=blog
PUBLIC_MEILISEARCH_SEARCH_KEY=限指定索引的搜索密钥
```

> [!WARNING]
> `PUBLIC_` 变量可能进入浏览器产物。管理密钥应只交给构建环境，不要提交 `.env` 或把管理密钥填进公开变量。项目在构建中可能更新或清理索引记录，预览和生产应分开使用索引。

若能打开站点却搜不到文章，依次核对前端地址、查询密钥权限、索引名称和构建日志。仓库包含项目作者的默认搜索地址，Fork 后请明确配置自己的地址再启用索引上传。

本地可以在仓库根目录用 `.env` 配置 Astro 读取的前端变量。索引上传脚本从进程环境读取构建端变量，运行构建时应通过当前终端或托管平台注入这些值。改完前端变量后重启本地服务，或重新构建已发布的站点。

### 悬浮音乐

`siteConfig.ts` 的 `floatingControls.music` 控制入口。播放器会在首次展开时读取站点根路径的 `/music.json`，通过同源 `/ncm` 调用音乐服务（私有服务，暂不开源，请理解！），并引用 `/assets/music` 下的封面等资源。

> [!IMPORTANT]
> Folumio 演示站的音乐 API 是作者自用的私有服务，不对外开放。主题仅提供播放器，歌单生成程序和音乐服务均不随仓库提供。

部署自己的博客时，请接入自有音乐服务，并在实际部署域名验证歌单、封面和音源能否加载。如果没有对应的代理与资源，可将 `floatingControls.music` 设为 `false` 隐藏播放器入口。

### 密码和访客统计

密码字段使用 `true` 时，在构建环境提供 `PASSWORD`，切勿把正式密码写入仓库。静态附件、站点索引和外部服务需分别核对可见性；需要身份认证的内容应使用带访问控制的服务。

访客统计在 `footerConfig.ts` 中配置 `visitorCount`，使用 Vercount 接口。更换域名后检查统计归属，再决定是否显示站点 PV 和 UV。

## 6. 部署与故障排查

### 生成并预览静态产物

构建需要 Node.js、pnpm 与 Python。仓库的 CI 使用 Python 3.12，并从 `scripts/font-requirements.txt` 安装字体处理依赖。选好构建环境后，从项目根目录执行：

```bash
pnpm install --frozen-lockfile
python -m pip install -r scripts/font-requirements.txt
pnpm build
pnpm preview
```

`pnpm build` 生成 `dist/` 后运行字体子集脚本。`pnpm preview` 用于预览最终产物。配置了 Meilisearch 管理密钥的构建可能写入线上索引，首次试跑使用独立索引或不注入管理密钥。

### 方式一：托管在 Vercel 或 Netlify

导入自己的仓库，确认项目根目录正确，使用 Node.js 24.x、项目声明的 pnpm 版本和可运行字体脚本的 Python 环境。构建命令设为 `pnpm build`，发布目录设为 `dist`。仓库包含 `vercel.json` 和 `netlify.toml`，使用前核对其中的版本和默认域名，尤其是 `netlify.toml` 的 `PNPM_VERSION` 是否与 `package.json` 一致。可选服务的环境变量在平台项目中设置。

### 方式二：GitHub Actions 与自有服务器

仓库的 `.github/workflows/deploy.yml` 支持推送 `master` 和手动触发。它在 CI 上构建，再用 SSH 和 rsync 将 `dist/` 同步到 `DEPLOY_PATH`。

下面是可保存到自己仓库的 `.github/workflows/deploy.yml` 示例。请将 `branches` 改为实际发布分支。示例保留仓库的构建步骤，并改用预先核验的 SSH 主机公钥。服务器地址、私钥、密码和搜索密钥均从仓库配置读取。

```yaml title=".github/workflows/deploy.yml"
name: Deploy Folumio

on:
  push:
    branches: [master]
    paths-ignore:
      - README.md
  workflow_dispatch:

permissions:
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # pnpm 版本从 package.json 的 packageManager 读取
      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - run: python -m pip install -r scripts/font-requirements.txt

      - name: Build static files
        run: pnpm build
        env:
          PASSWORD: ${{ secrets.PASSWORD }}
          MEILISEARCH_HOST: ${{ vars.MEILISEARCH_HOST }}
          MEILISEARCH_ADMIN_KEY: ${{ secrets.MEILISEARCH_ADMIN_KEY }}
          MEILISEARCH_INDEX_NAME: ${{ secrets.MEILISEARCH_INDEX_NAME }}
          PUBLIC_MEILISEARCH_HOST: ${{ vars.PUBLIC_MEILISEARCH_HOST }}
          PUBLIC_MEILISEARCH_SEARCH_KEY: ${{ secrets.PUBLIC_MEILISEARCH_SEARCH_KEY }}
          PUBLIC_MEILISEARCH_INDEX_NAME: ${{ secrets.PUBLIC_MEILISEARCH_INDEX_NAME }}

      - name: Deploy with rsync
        env:
          SSH_KEY: ${{ secrets.SSH_KEY }}
          SSH_KNOWN_HOSTS: ${{ secrets.SSH_KNOWN_HOSTS }}
          SSH_HOST: ${{ secrets.SSH_HOST }}
          SSH_PORT: ${{ secrets.SSH_PORT }}
          SSH_USER: ${{ secrets.SSH_USER }}
          DEPLOY_PATH: ${{ secrets.DEPLOY_PATH }}
        run: |
          install -d -m 700 "$HOME/.ssh"
          install -m 600 /dev/null "$HOME/.ssh/id_ed25519"
          printf '%s\n' "$SSH_KEY" > "$HOME/.ssh/id_ed25519"
          printf '%s\n' "$SSH_KNOWN_HOSTS" > "$HOME/.ssh/known_hosts"
          rsync -az --delete -e "ssh -p $SSH_PORT -o StrictHostKeyChecking=yes" dist/ \
            "$SSH_USER@$SSH_HOST:${DEPLOY_PATH%/}/"
```

在仓库 **Settings → Secrets and variables → Actions** 中配置以下 **Secrets**。服务器需要安装 rsync，并允许部署用户通过 SSH 登录。将部署公钥加入该用户的 `~/.ssh/authorized_keys`，把对应私钥原样填入 `SSH_KEY`，保留换行。

| Secrets | 含义 |
| --- | --- |
| `SSH_HOST`、`SSH_PORT` | 服务器地址和端口 |
| `SSH_USER`、`SSH_KEY` | 部署用户和私钥 |
| `SSH_KNOWN_HOSTS` | 预先核验的服务器主机公钥记录，使用 OpenSSH `known_hosts` 格式。非默认端口的主机字段使用 `[主机名]:端口` |
| `DEPLOY_PATH` | Web 服务器实际读取的站点目录 |
| `PASSWORD` | 仅为使用统一文章密码的站点提供 |
| `MEILISEARCH_ADMIN_KEY`、`MEILISEARCH_INDEX_NAME` | 启用搜索索引写入时配置 |
| `PUBLIC_MEILISEARCH_SEARCH_KEY`、`PUBLIC_MEILISEARCH_INDEX_NAME` | 访客查询所需的密钥和索引名 |

启用搜索时，在同一设置页的 **Variables** 中填入 `MEILISEARCH_HOST` 和 `PUBLIC_MEILISEARCH_HOST`。前者供构建端写入索引，后者供访客浏览器查询。暂不接入搜索时，可省略这些变量和搜索相关 Secrets。

正式部署前核对 SSH 指纹，给部署用户分配站点目录权限，并确认 `DEPLOY_PATH` 指向专用目录。工作流使用 `rsync --delete`，目标目录中未出现在 `dist/` 的文件可能被删除，上传的附件和独立服务文件应放在其他目录。

例如，若 Web 服务器读取 `/var/www/blog`，在仓库 Actions Secrets 中将 `DEPLOY_PATH` 设置为 `/var/www/blog`，确认 `SSH_USER` 有该目录的写权限。首次发布可在 GitHub Actions 的「Deploy」工作流中手动运行，检查构建与同步步骤均成功，再访问实际域名的 `/posts/docs/` 和 `/rss.xml`。如果同步成功后首页仍是旧版，核对 Web 服务器的站点根目录是否与 `DEPLOY_PATH` 一致。

### 上线后逐项检查

- 打开首页、文章、`/posts/docs/` 和一个不存在的地址，确认路由与 404 配置。
- 检查图片、图标、RSS、站点地图中的域名，以及浏览器中是否有混合内容警告。
- 用移动设备检查导航、Banner、长代码块和表格。
- 若启用第三方服务，分别验证评论、搜索和音乐。静态 HTML 部署成功不会自动配置这些服务。

### 常见故障

| 症状 | 排查方向 |
| --- | --- |
| 依赖装不上 | 核对 Node.js、pnpm 版本以及锁文件所在目录 |
| 首页能打开，刷新子页面 404 | 检查发布目录，确认服务器支持目录下的 `index.html`，核对尾斜杠 |
| 中文字体构建失败 | 确认构建日志中的 Python 可执行文件及字体依赖 |
| 新文章不显示 | 检查文件位置、`title`、日期和 `draft` |
| 更新后样式或图片还是旧的 | 先确认部署日志与文件，再检查浏览器和 CDN 缓存 |
| 本地能播音乐，线上不能 | 检查同源的 `/ncm`、`/music.json` 和封面资源 |
| 搜索为空 | 核对前后端索引是否一致，检查 Meilisearch 构建日志 |

### 更新主题

更新前提交自己的文章和配置。先查看上游的 `package.json`、`src/config/`、内容 schema 和部署工作流有哪些变更，再合并上游提交并处理配置冲突。优先在预览环境检查旧文章链接和外部服务，确认无误后部署。保留上一次可用的部署产物，以便回退。

## 7. 自用修改建议

第一次部署时，先把站点身份、个人内容和生产环境配置改好。配色、字体和播放器可以等博客上线后再逐项调整。

| 先改什么 | 去哪里改 | 改完怎么看 |
| --- | --- | --- |
| 换成自己的站名、域名和头像 | 在 `siteConfig.ts` 修改 `title`、`site_url`、`favicon`，在 `profileConfig.ts` 替换头像、简介和社交链接 | 检查首页、关于页和页脚是否还显示模板作者的信息，再打开 `/rss.xml` 和 `/sitemap.xml` 核对域名 |
| 清理演示内容和外链 | 在 `src/content/posts/` 替换示例文章，在 `aboutConfig.ts`、`friendsConfig.ts` 和 `navBarConfig.ts` 检查个人资料、友链和「状态」入口 | 从首页逐项点进归档、分类、关于页和友链，确认没有遗留示例或失效链接 |
| 关闭还没接好的功能 | 将 `commentConfig.type` 设为 `"none"`，将 `floatingControls.music` 设为 `false`。随笔、友链和观影清单暂时没有内容时，可在 `siteConfig.pages` 中关闭对应页面 | 检查文章页和导航，确认访客看不到尚不可用的评论区、播放器或空页面入口 |
| 核对搜索与部署目标 | 检查 `netlify.toml`、工作流和托管平台的环境变量。接入自己的搜索服务后再配置对应的索引和密钥，确认 `DEPLOY_PATH` 指向自己的站点目录 | 第一次用自己的域名发布后，打开一篇文章并刷新。启用搜索时，再用刚发布的文章标题测试查询 |

外观建议从改 `themeColor.color` 和桌面、移动端 Banner 开始。先用手机看标题是否压在复杂的背景上，再切换明暗主题检查正文、链接和代码块是否清楚。能在 `src/config/` 完成的调整，优先留在配置文件里，这样以后更新主题更容易对照。

发布后，把文章路径当作读者已经收藏的地址。重要文章可以在首次发布前写好 `slug`。更换标题或整理文件目录时，保留已有的 `slug`，并重新检查文章链接。建议把文章内容、站点配置和部署调整分开提交，便于定位问题和回退。
