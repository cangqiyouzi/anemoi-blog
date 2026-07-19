#!/usr/bin/env node

/**
 * 快速生成新博客文章模板
 * 用法: node scripts/new-post.js "文章标题"
 */

import { writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = join(__dirname, '..', 'src', 'content', 'blog');

const title = process.argv[2];

if (!title) {
  console.error('用法: node scripts/new-post.js "文章标题"');
  process.exit(1);
}

// 生成 slug：日期 + 随机短串，避免中文文件名问题
const now = new Date();
const datePart = now.toLocaleDateString('sv-SE'); // YYYY-MM-DD (local time)
const rand = Math.random().toString(36).slice(2, 6);
const slug = `${datePart}-${rand}`;
const filename = `${slug}.md`;
const filepath = join(BLOG_DIR, filename);

if (existsSync(filepath)) {
  console.error(`文件已存在: ${filepath}`);
  process.exit(1);
}

// YAML 单引号字符串中的单引号需写为两个（''），否则生成非法 frontmatter
const escapedTitle = title.replace(/'/g, "''");

const template = `---
title: '${escapedTitle}'
date: ${datePart}
description: ''
# coverImage: '/images/cover.jpg'
tags: []
---

在这里开始写你的文章内容...
`;

writeFileSync(filepath, template, 'utf-8');
console.log(`已创建: ${filepath}`);
