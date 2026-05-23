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
 */

const fs = require('fs');
const path = require('path');

// ──────────────────────────────────────────────
// 配置
// ──────────────────────────────────────────────
const MD_DIR = path.join(__dirname, 'posts', 'md');
const DATA_FILE = path.join(__dirname, 'posts', 'data.js');

// ──────────────────────────────────────────────
// Markdown → HTML 转换器
// ──────────────────────────────────────────────

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

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

  let listType = '';
  let listBuf = [];

  function flushList() {
    if (listBuf.length === 0) return;
    const tag = listType;
    out.push(`<${tag}>\n${listBuf.join('')}</${tag}>\n`);
    listBuf = [];
    listType = '';
  }

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

  while (i < lines.length) {
    const raw = lines[i];
    const t = raw.trim();

    // ── 代码块 ──
    if (t.startsWith('```')) {
      if (inCode) {
        const cls = codeLang ? ` class="language-${escapeHtml(codeLang)}"` : '';
        out.push(`<pre${cls}><code>${escapeHtml(codeBuf.join('\n'))}</code></pre>\n`);
        codeBuf = [];
        codeLang = '';
        inCode = false;
      } else {
        flushList();
        flushTable();
        codeLang = t.slice(3).trim();
        inCode = true;
      }
      i++;
      continue;
    }
    if (inCode) { codeBuf.push(raw); i++; continue; }

    // ── 空行 ──
    if (t === '') {
      flushList();
      flushTable();
      i++;
      continue;
    }

    // ── 分隔线 ──
    if (/^[-*_]{3,}$/.test(t)) {
      flushList();
      flushTable();
      out.push('<hr>\n');
      i++;
      continue;
    }

    // ── 标题 ──
    const hm = t.match(/^(#{1,6})\s+(.+)/);
    if (hm) {
      flushList();
      flushTable();
      out.push(`<h${hm[1].length}>${parseInline(hm[2])}</h${hm[1].length}>\n`);
      i++;
      continue;
    }

    // ── 表格 ──
    if (t.startsWith('|') && t.endsWith('|')) {
      const cells = t.split('|').slice(1, -1).map(c => c.trim());
      // 跳过分隔行
      if (/^[\s:|-]+$/.test(t)) { i++; continue; }
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
    if (t.startsWith('> ')) {
      flushList();
      out.push(`<blockquote><p>${parseInline(t.slice(2).trim())}</p></blockquote>\n`);
      i++;
      continue;
    }
    if (t === '>') {
      flushList();
      out.push('<blockquote></blockquote>\n');
      i++;
      continue;
    }

    // ── 无序列表 ──
    const ulm = t.match(/^[-*+]\s+(.+)/);
    if (ulm) {
      if (listType && listType !== 'ul') flushList();
      listType = 'ul';
      listBuf.push(`<li>${parseInline(ulm[1])}</li>\n`);
      i++;
      continue;
    }

    // ── 有序列表 ──
    const olm = t.match(/^\d+\.\s+(.+)/);
    if (olm) {
      if (listType && listType !== 'ol') flushList();
      listType = 'ol';
      listBuf.push(`<li>${parseInline(olm[1])}</li>\n`);
      i++;
      continue;
    }

    // ── 段落 ──
    flushList();
    out.push(`<p>${parseInline(t)}</p>\n`);
    i++;
  }

  flushList();
  flushTable();
  if (inCode) {
    const cls = codeLang ? ` class="language-${escapeHtml(codeLang)}"` : '';
    out.push(`<pre${cls}><code>${escapeHtml(codeBuf.join('\n'))}</code></pre>\n`);
  }

  return out.join('').replace(/\n{3,}/g, '\n\n');
}

// ──────────────────────────────────────────────
// YAML 前置元数据解析
// ──────────────────────────────────────────────

function parseFrontmatter(content) {
  const meta = { title: '', date: '', tags: [], excerpt: '' };

  // 统一换行符，兼容 Windows (\r\n) 和 Unix (\n)
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
// 主构建逻辑
// ──────────────────────────────────────────────

function build() {
  // 读取 all .md files
  if (!fs.existsSync(MD_DIR)) {
    console.error(`\u274c 目录不存在: ${MD_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(MD_DIR)
    .filter(f => f.endsWith('.md'))
    .sort();

  if (files.length === 0) {
    console.log('\uD83D\uDCED 没有找到 .md 文件。');
    return;
  }

  const posts = [];

  for (const file of files) {
    const filePath = path.join(MD_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { meta, body } = parseFrontmatter(content);

    if (!meta.title) {
      console.warn(`\u26a0\uFE0F 跳过 ${file}: 缺少 title`);
      continue;
    }

    const htmlContent = markdownToHtml(body);

    // 如果没有 excerpt，从正文前 150 字取
    let excerpt = meta.excerpt;
    if (!excerpt) {
      excerpt = htmlContent.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 150);
      if (excerpt.length >= 150) excerpt += '\u2026';
    }

    // 缩进 content 内容，保持 data.js 中模板字符串的格式
    const indentedHtml = htmlContent.split('\n').map(line => `      ${line}`).join('\n');

    // 转义模板字面量中的特殊字符：$`{'${'}${'}'} → \${', backticks → \`, 反斜杠 → \\\\
    const safeContent = indentedHtml
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\${/g, '\\${');

    posts.push({
      file,
      title: meta.title,
      excerpt,
      date: meta.date || '2026-01-01',
      tags: meta.tags.length > 0 ? meta.tags : ['\u672A\u5206\u7C7B'],
      content: safeContent
    });

    console.log(`\uD83D\uDCC4 + ${file} \u2192 "${meta.title}"`);
  }

  // 按日期降序排列（同日期按文件名排序）
  posts.sort((a, b) => {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return a.file.localeCompare(b.file);
  });

  // 分配 ID 并生成 data.js
  const sb = [];
  sb.push(`/**\n`);
  sb.push(` * 博客文章数据 — 由 build.js 自动生成\n`);
  sb.push(` * 请勿手动编辑此文件\n`);
  sb.push(` * 生成时间: ${new Date().toISOString()}\n`);
  sb.push(` * 文章数量: ${posts.length}\n`);
  sb.push(` */\n`);
  sb.push(`const posts = [\n`);

  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    const id = i + 1;
    const comma = i < posts.length - 1 ? ',' : '';

    sb.push(`  {\n`);
    sb.push(`    id: ${id},\n`);
    sb.push(`    title: '${p.title.replace(/'/g, "\\'")}',\n`);
    sb.push(`    excerpt: '${p.excerpt.replace(/'/g, "\\'")}',\n`);
    sb.push(`    date: '${p.date}',\n`);
    sb.push(`    tags: ${JSON.stringify(p.tags)},\n`);
    sb.push(`    content: \`\n`);
    sb.push(`${p.content}\n`);
    sb.push(`    \`${comma}\n`);
    sb.push(`  }${comma}\n`);
  }

  sb.push(`];\n`);

  fs.writeFileSync(DATA_FILE, sb.join(''), 'utf-8');
  console.log(`\n\u2705 构建完成！${posts.length} 篇文章已生成 \u2192 ${DATA_FILE}`);
}

build();
