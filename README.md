# 雨落 · 代码与笔墨

一个温暖、零依赖的个人技术博客。记录编程、架构与思考。

## 特性

- **零框架零依赖** — 纯手工 HTML + CSS + JavaScript，运行时仅依赖 CDN 字体和 Prism.js 语法高亮
- **Hash 路由永久链接** — `/#/post/slug` 格式，支持浏览器前进/后退、中键新标签页打开
- **全站搜索** — 200ms 防抖实时搜索标题、摘要、标签
- **标签筛选** — 直观的标签分类导航
- **阅读进度条** — 文章阅读时顶部固定进度指示
- **自动目录 (TOC)** — 文章内 H2/H3 标题自动生成可折叠目录
- **暗色/亮色主题** — 一键切换，持久化到 localStorage
- **RSS 订阅** — 自动生成 `feed.xml`（Atom 格式）
- **站点地图** — 自动生成 `sitemap.xml`
- **SEO 优化** — Open Graph、Twitter Card、Canonical URL
- **社交分享** — 复制链接、Twitter/X 分享、原生 Web Share API
- **Giscus 评论区** — 基于 GitHub Discussions 的免费评论系统
- **CI/CD 自动部署** — 推送即部署到 GitHub Pages

## 目录结构

```
├── index.html          # 主页面（CSS + JS 内嵌）
├── build.js            # Markdown → data.js 构建脚本
├── feed.xml            # RSS 订阅源（自动生成）
├── sitemap.xml         # 站点地图（自动生成）
├── favicon.svg         # 博客图标
├── .github/workflows/  # GitHub Actions 自动部署
└── posts/
    ├── data.js         # 文章数据（自动生成）
    └── md/             # Markdown 源文件
```

## 发布文章

1. 在 `posts/md/` 目录下创建 `.md` 文件：

```markdown
---
title: '文章标题'
date: '2026-06-04'
tags: ['技术', 'JavaScript']
excerpt: '文章摘要...'
---

## 正文开始...
```

2. 运行 `node build.js`
3. 推送 `git push`（GitHub Actions 自动部署）

## 本地预览

```bash
node build.js           # 先构建
npx serve .             # 启动静态文件服务器
```

## 配置 Giscus 评论

1. 在 https://github.com/apps/giscus 安装 Giscus App
2. 仓库 Settings → 启用 Discussions
3. 访问 https://giscus.app 获取 `data-repo-id`、`data-category-id`
4. 替换 `index.html` 中 `loadComments` 函数里的占位值

## 许可证

MIT
