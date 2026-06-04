#!/usr/bin/env node
/**
 * build.js — 将 posts/md/ 中的 Markdown 文件编译为 posts/data.js
 *
 * 用法: node build.js
 *
 * .md 文件格式：
 *   ---
 *   title: '文章标题'
 *   date: '2026-05-20'
 *   tags: ['技术', 'JavaScript']
 *   excerpt: '文章摘要...'
 *   ---
 *
 *   ## Markdown 正文从这里开始...
 *
 * 同时生成：
 *   - feed.xml       RSS/Atom 订阅源
 *   - sitemap.xml     站点地图
 */

const fs = require('fs');
const path = require('path');

// ──────────────────────────────────────────────
// 配置
// ──────────────────────────────────────────────
const MD_DIR = path.join(__dirname, 'posts', 'md');
const DATA_FILE = path.join(__dirname, 'posts', 'data.js');
const FEED_FILE = path.join(__dirname, 'feed.xml');
const SITEMAP_FILE = path.join(__dirname, 'sitemap.xml');

const SITE = {
  title: '雨落 · 代码与笔墨',
  description: '关于编程、架构与思考的笔记',
  url: 'https://susurrune.github.io/blog',
  author: '雨落',
  lang: 'zh-CN',
};

// ──────────────────────────────────────────────
// 工具函数
// ──────────────────────────────────────────────

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** 从文件名生成 URL-safe slug */
function slugify(filename) {
  return path.basename(filename, '.md')
    .replace(/[^\w一-鿿-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** 估算阅读时间（中文 ~275 字/分钟，英文 ~200 词/分钟） */
function estimateReadingTime(html) {
  const text = html.replace(/<[^>]+>/g, '');
  const chineseChars = (text.match(/[一-鿿]/g) || []).length;
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(chineseChars / 275 + (words - chineseChars) / 200));
  return minutes;
}

/** 从 HTML 生成纯文本摘要 */
function generateExcerpt(html, maxLen = 150) {
  let text = html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  if (text.length > maxLen) {
    text = text.slice(0, maxLen).replace(/\s+\S*$/, '') + '…';
  }
  return text;
}

// ──────────────────────────────────────────────
// Markdown → HTML 转换器
// ──────────────────────────────────────────────

function parseInline(text) {
  let t = text;
  t = t.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  t = t.replace(/`([^`]+)`/g, (_, code) => `<code>${escapeHtml(code)}</code>`);
  t = t.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/\*(.+?)\*/g, '<em>$1</em>');
  t = t.replace(/~~(.+?)~~/g, '<del>$1</del>');
  return t;
}

function parseTableCell(cell, isHeader) {
  const tag = isHeader ? 'th' : 'td';
  return `<${tag}>${parseInline(cell.trim())}</${tag}>`;
}

/** 计算一行的前导空白宽度（用于嵌套列表） */
function indentWidth(line) {
  const m = line.match(/^(\s*)/);
  return m ? m[1].length : 0;
}

function markdownToHtml(md) {
  const lines = md.split('\n');
  const out = [];
  let i = 0;

  let inCode = false;
  let codeLang = '';
  let codeBuf = [];

  let inTable = false;
  let tblHeads = null;
  let tblRows = [];

  // 列表状态：用栈跟踪嵌套层级
  let listStack = [];   // [{ type: 'ul'|'ol', indent: number }]

  // 块引用缓冲区：收集连续的 > 行
  let quoteBuf = [];

  function flushTable() {
    if (!tblHeads) return;
    let html = '<table>\n<thead>\n<tr>';
    for (const h of tblHeads) html += parseTableCell(h, true);
    html += '</tr>\n</thead>\n';
    if (tblRows.length > 0) {
      html += '<tbody>\n';
      for (const row of tblRows) {
        html += '<tr>';
        for (const cell of row) html += parseTableCell(cell, false);
        html += '</tr>\n';
      }
      html += '</tbody>\n';
    }
    html += '</table>\n';
    out.push(html);
    tblHeads = null;
    tblRows = [];
    inTable = false;
  }

  function flushQuote() {
    if (quoteBuf.length === 0) return;
    // 按空引用行分段
    const paragraphs = [];
    let cur = [];
    for (const line of quoteBuf) {
      if (line === '') {
        if (cur.length > 0) { paragraphs.push(cur); cur = []; }
      } else {
        cur.push(line);
      }
    }
    if (cur.length > 0) paragraphs.push(cur);

    if (paragraphs.length === 0) {
      out.push('<blockquote></blockquote>\n');
    } else {
      let html = '<blockquote>\n';
      for (const p of paragraphs) {
        html += `<p>${parseInline(p.join(' '))}</p>\n`;
      }
      html += '</blockquote>\n';
      out.push(html);
    }
    quoteBuf = [];
  }

  function flushList() {
    while (listStack.length > 0) {
      const { type } = listStack.pop();
      out.push(`</${type}>\n`);
    }
  }

  function openList(type, indent) {
    out.push(`<${type}>\n`);
    listStack.push({ type, indent });
  }

  function closeToLevel(targetIndent) {
    // 关闭所有缩进大于等于 targetIndent 的列表层级
    while (listStack.length > 0) {
      const top = listStack[listStack.length - 1];
      if (top.indent >= targetIndent) {
        out.push(`</${top.type}>\n`);
        listStack.pop();
      } else {
        break;
      }
    }
  }

  while (i < lines.length) {
    const raw = lines[i];
    const t = raw.trim();
    const iw = indentWidth(raw);

    // ── 代码块 ──
    if (t.startsWith('```')) {
      flushQuote();
      flushList();
      flushTable();
      if (inCode) {
        const cls = codeLang ? ` class="language-${escapeHtml(codeLang)}"` : '';
        out.push(`<pre${cls}><code>${escapeHtml(codeBuf.join('\n'))}</code></pre>\n`);
        codeBuf = [];
        codeLang = '';
        inCode = false;
      } else {
        codeLang = t.slice(3).trim();
        inCode = true;
      }
      i++;
      continue;
    }
    if (inCode) { codeBuf.push(raw); i++; continue; }

    // ── 空行 ──
    if (t === '') {
      flushQuote();
      flushTable();
      // 空行不自动关闭列表——让后续的非列表行来关闭
      i++;
      continue;
    }

    // ── 分隔线 ──
    if (/^[-*_]{3,}$/.test(t)) {
      flushQuote();
      flushList();
      flushTable();
      out.push('<hr>\n');
      i++;
      continue;
    }

    // ── 标题 ──
    const hm = t.match(/^(#{1,6})\s+(.+)/);
    if (hm) {
      flushQuote();
      flushList();
      flushTable();
      const level = hm[1].length;
      const id = hm[2].replace(/<[^>]+>/g, '').replace(/\s+/g, '-').toLowerCase();
      out.push(`<h${level} id="${id}">${parseInline(hm[2])}</h${level}>\n`);
      i++;
      continue;
    }

    // ── 表格 ──
    if (t.startsWith('|') && t.endsWith('|')) {
      flushQuote();
      if (listStack.length > 0) flushList();
      const cells = t.split('|').slice(1, -1).map(c => c.trim());
      // 跳过分隔行
      if (/^[\s:|-]+$/.test(t.replace(/\|/g, ''))) { i++; continue; }
      if (!inTable) {
        tblHeads = cells;
        inTable = true;
      } else {
        tblRows.push(cells);
      }
      i++;
      continue;
    }
    if (inTable) flushTable();

    // ── 块引用 ──
    if (t.startsWith('>')) {
      flushList();
      flushTable();
      const content = t.startsWith('> ') ? t.slice(2) : (t.startsWith('>') ? t.slice(1) : '');
      quoteBuf.push(content.trim());
      i++;
      continue;
    }

    // 遇到非引用行，先 flush 缓存的引用
    flushQuote();

    // ── 无序列表（支持嵌套） ──
    const ulm = t.match(/^[-*+]\s+(.+)/);
    if (ulm) {
      flushTable();
      // 判断当前缩进层级
      if (listStack.length === 0 || iw > listStack[listStack.length - 1].indent) {
        // 新嵌套层级
        openList('ul', iw);
      } else if (iw < listStack[listStack.length - 1].indent) {
        // 退出嵌套层级
        closeToLevel(iw + 1);
      }
      // 如果当前顶层不是 ul，需要切换
      if (listStack.length > 0 && listStack[listStack.length - 1].type !== 'ul') {
        closeToLevel(0);
        openList('ul', iw);
      }
      if (listStack.length === 0) openList('ul', iw);
      listBufPush(ulm[1]);
      i++;
      continue;
    }

    // ── 有序列表（支持嵌套） ──
    const olm = t.match(/^\d+\.\s+(.+)/);
    if (olm) {
      flushTable();
      if (listStack.length === 0 || iw > listStack[listStack.length - 1].indent) {
        openList('ol', iw);
      } else if (iw < listStack[listStack.length - 1].indent) {
        closeToLevel(iw + 1);
      }
      if (listStack.length > 0 && listStack[listStack.length - 1].type !== 'ol') {
        closeToLevel(0);
        openList('ol', iw);
      }
      if (listStack.length === 0) openList('ol', iw);
      listBufPush(olm[1]);
      i++;
      continue;
    }

    // ── 段落 ──
    flushList();
    flushTable();
    out.push(`<p>${parseInline(t)}</p>\n`);
    i++;
  }

  flushQuote();
  flushTable();
  flushList();
  if (inCode) {
    const cls = codeLang ? ` class="language-${escapeHtml(codeLang)}"` : '';
    out.push(`<pre${cls}><code>${escapeHtml(codeBuf.join('\n'))}</code></pre>\n`);
  }

  return out.join('').replace(/\n{3,}/g, '\n\n');

  // 内部辅助：把列表项内容推入当前最内层列表
  function listBufPush(content) {
    // 找到当前最内层：listStack 的最后一个元素
    // 直接在它之后插入 <li>，但需确保在正确的位置
    // 简化：把 <li> 直接 append 到 out，listStack 仅用于层级管理
    out.push(`<li>${parseInline(content)}</li>\n`);
  }
}

// ──────────────────────────────────────────────
// YAML 前置元数据解析
// ──────────────────────────────────────────────

function parseFrontmatter(content) {
  const meta = { title: '', date: '', tags: [], excerpt: '' };

  const normalized = content.replace(/\r\n/g, '\n');
  const m = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { meta, body: content };

  const yaml = m[1];
  const body = m[2];

  for (const line of yaml.split('\n')) {
    const kv = line.match(/^(\w+):\s*(.+)/);
    if (!kv) continue;
    const key = kv[1].trim();
    let val = kv[2].trim();

    if (key === 'tags') {
      try {
        meta.tags = JSON.parse(val.replace(/'/g, '"'));
      } catch {
        meta.tags = val.replace(/[\[\]]/g, '').split(',').map(t => t.trim().replace(/['"]/g, ''));
      }
    } else if (key === 'title' || key === 'date' || key === 'excerpt') {
      meta[key] = val.replace(/^['"](.*)['"]$/, '$1');
    }
  }

  return { meta, body: body.trim() };
}

// ──────────────────────────────────────────────
// RSS / Atom 生成
// ──────────────────────────────────────────────

function generateFeed(posts) {
  const now = new Date().toISOString();
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(SITE.title)}</title>
  <subtitle>${escapeXml(SITE.description)}</subtitle>
  <link href="${SITE.url}/feed.xml" rel="self"/>
  <link href="${SITE.url}/"/>
  <updated>${now}</updated>
  <id>${SITE.url}/</id>
  <author>
    <name>${escapeXml(SITE.author)}</name>
  </author>
`;

  for (const p of posts) {
    const postUrl = `${SITE.url}/#/post/${p.slug}`;
    const dateISO = new Date(p.date).toISOString();
    xml += `  <entry>
    <title>${escapeXml(p.title)}</title>
    <link href="${escapeXml(postUrl)}"/>
    <id>${escapeXml(postUrl)}</id>
    <published>${dateISO}</published>
    <updated>${dateISO}</updated>
    <summary>${escapeXml(p.excerpt)}</summary>
    <content type="html">${escapeXml(p.content)}</content>
  </entry>
`;
  }

  xml += '</feed>\n';
  return xml;
}

// ──────────────────────────────────────────────
// Sitemap 生成
// ──────────────────────────────────────────────

function generateSitemap(posts) {
  const now = new Date().toISOString().split('T')[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE.url}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
`;

  for (const p of posts) {
    const postUrl = `${SITE.url}/#/post/${p.slug}`;
    xml += `  <url>
    <loc>${escapeXml(postUrl)}</loc>
    <lastmod>${p.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  }

  xml += '</urlset>\n';
  return xml;
}

// ──────────────────────────────────────────────
// 主构建逻辑
// ──────────────────────────────────────────────

function build() {
  if (!fs.existsSync(MD_DIR)) {
    console.error(`❌ 目录不存在: ${MD_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(MD_DIR)
    .filter(f => f.endsWith('.md'))
    .sort();

  if (files.length === 0) {
    console.log('📭 没有找到 .md 文件。');
    return;
  }

  const posts = [];

  for (const file of files) {
    const filePath = path.join(MD_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { meta, body } = parseFrontmatter(content);

    if (!meta.title) {
      console.warn(`⚠️ 跳过 ${file}: 缺少 title`);
      continue;
    }

    const htmlContent = markdownToHtml(body);
    const readingTime = estimateReadingTime(htmlContent);
    const slug = slugify(file);

    let excerpt = meta.excerpt;
    if (!excerpt) {
      excerpt = generateExcerpt(htmlContent);
    }

    // 缩进 content，保持 data.js 模板字符串格式
    const indentedHtml = htmlContent.split('\n').map(line => `      ${line}`).join('\n');

    const safeContent = indentedHtml
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\${/g, '\\${');

    posts.push({
      file,
      slug,
      title: meta.title,
      excerpt,
      date: meta.date || '2026-01-01',
      tags: meta.tags.length > 0 ? meta.tags : ['未分类'],
      readingTime,
      content: safeContent
    });

    console.log(`📄 + ${file} → "${meta.title}" (${readingTime} min read)`);
  }

  // 按日期降序排列
  posts.sort((a, b) => {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return a.file.localeCompare(b.file);
  });

  // ── 生成 data.js ──
  const sb = [];
  sb.push(`/**\n`);
  sb.push(` * 博客文章数据 — 由 build.js 自动生成\n`);
  sb.push(` * 请勿手动编辑此文件\n`);
  sb.push(` * 生成时间: ${new Date().toISOString()}\n`);
  sb.push(` * 文章数量: ${posts.length}\n`);
  sb.push(` */\n`);
  sb.push(`const BLOG_META = {\n`);
  sb.push(`  title: '${SITE.title}',\n`);
  sb.push(`  description: '${SITE.description}',\n`);
  sb.push(`  url: '${SITE.url}',\n`);
  sb.push(`  author: '${SITE.author}',\n`);
  sb.push(`  postCount: ${posts.length},\n`);
  sb.push(`  builtAt: '${new Date().toISOString()}',\n`);
  sb.push(`};\n\n`);
  sb.push(`const posts = [\n`);

  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    const id = i + 1;
    const comma = i < posts.length - 1 ? ',' : '';

    sb.push(`  {\n`);
    sb.push(`    id: ${id},\n`);
    sb.push(`    slug: '${p.slug}',\n`);
    sb.push(`    title: '${p.title.replace(/'/g, "\\'")}',\n`);
    sb.push(`    excerpt: '${p.excerpt.replace(/'/g, "\\'")}',\n`);
    sb.push(`    date: '${p.date}',\n`);
    sb.push(`    tags: ${JSON.stringify(p.tags)},\n`);
    sb.push(`    readingTime: ${p.readingTime},\n`);
    sb.push(`    content: \`\n`);
    sb.push(`${p.content}\n`);
    sb.push(`    \`${comma}\n`);
    sb.push(`  }${comma}\n`);
  }

  sb.push(`];\n`);

  fs.writeFileSync(DATA_FILE, sb.join(''), 'utf-8');
  console.log(`\n✅ 构建完成！${posts.length} 篇文章已生成 → ${DATA_FILE}`);

  // ── 生成 RSS ──
  const feedXml = generateFeed(posts);
  fs.writeFileSync(FEED_FILE, feedXml, 'utf-8');
  console.log(`📡 RSS 订阅源已生成 → ${FEED_FILE}`);

  // ── 生成 Sitemap ──
  const sitemapXml = generateSitemap(posts);
  fs.writeFileSync(SITEMAP_FILE, sitemapXml, 'utf-8');
  console.log(`🗺️ 站点地图已生成 → ${SITEMAP_FILE}`);
}

build();
