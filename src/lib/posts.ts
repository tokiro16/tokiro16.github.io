import matter from 'gray-matter';
import { marked } from 'marked';
import { readingTime as estimateReadingTime } from './format';
import { url } from './urls';

export interface TocItem {
  depth: 2 | 3;
  id: string;
  text: string;
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
  category: string;
  cover: string;
  featured: boolean;
  draft: boolean;
  html: string;
  toc: TocItem[];
  readingTime: number;
  href: string;
  timestamp: number;
}

interface PostFrontmatter {
  title?: unknown;
  description?: unknown;
  date?: unknown;
  updated?: unknown;
  tags?: unknown;
  category?: unknown;
  cover?: unknown;
  featured?: unknown;
  draft?: unknown;
}

const modules = import.meta.glob('../content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function toDate(value: unknown, fallback = new Date()): Date {
  if (value instanceof Date) return value;
  const parsed = new Date(String(value ?? ''));
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function slugify(input: string): string {
  return (
    input
      .replace(/<[^>]*>/g, '')
      .replace(/&[a-z#0-9]+;/gi, '')
      .normalize('NFKC')
      .toLowerCase()
      .trim()
      .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 64) || 'section'
  );
}

function renderMarkdown(raw: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const seen = new Map<string, number>();

  let html = marked.parse(raw, {
    async: false,
    gfm: true,
  }) as string;

  html = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_match, depth: string, inner: string) => {
    const text = inner.replace(/<[^>]*>/g, '').trim();
    const base = slugify(text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;

    toc.push({ depth: Number(depth) as 2 | 3, id, text });

    return `<h${depth} id="${id}">${inner}<a class="heading-anchor" href="#${id}" aria-label="链接到本节" tabindex="-1">#</a></h${depth}>`;
  });

  // 让文章里的外链在新标签页打开。
  html = html.replace(/<a href="(https?:\/\/[^"]+)">/g, '<a href="$1" target="_blank" rel="noopener noreferrer">');

  // Markdown 里手写的站内绝对链接也要带上部署子路径。
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (basePath) {
    const prefix = basePath.slice(1);
    html = html.replace(/href="\/(?!\/)([^"]*)"/g, (full, path: string) => {
      if (path === prefix || path.startsWith(`${prefix}/`)) return full;
      return `href="${basePath}/${path}"`;
    });
  }

  return { html, toc };
}

function parsePost(filePath: string, raw: string): Post {
  const slug = filePath.split('/').pop()?.replace(/\.md$/, '') ?? 'untitled';
  const { data, content } = matter(raw) as { data: PostFrontmatter; content: string };
  const rendered = renderMarkdown(content);
  const date = toDate(data.date);
  const updated = data.updated ? toDate(data.updated) : undefined;

  return {
    slug,
    title: String(data.title ?? '无题'),
    description: String(data.description ?? ''),
    date: date.toISOString(),
    updated: updated?.toISOString(),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    category: String(data.category ?? '随笔'),
    cover: String(data.cover ?? 'orbit'),
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
    html: rendered.html,
    toc: rendered.toc,
    readingTime: estimateReadingTime(content),
    href: url(`/blog/${slug}/`),
    timestamp: date.getTime(),
  };
}

const allPosts = Object.entries(modules)
  .map(([filePath, raw]) => parsePost(filePath, raw))
  .filter((post) => (import.meta.env.PROD ? !post.draft : true))
  .sort((a, b) => b.timestamp - a.timestamp);

export function getAllPosts(): Post[] {
  return allPosts;
}

export function getPostBySlug(slug: string): Post | undefined {
  return allPosts.find((post) => post.slug === slug);
}

export function getFeaturedPost(): Post {
  return allPosts.find((post) => post.featured) ?? allPosts[0];
}

export function getRecentPosts(limit = 5, exclude?: string): Post[] {
  return allPosts.filter((post) => post.slug !== exclude).slice(0, limit);
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of allPosts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-CN'));
}

export function getPostsByTag(tag: string): Post[] {
  return allPosts.filter((post) => post.tags.includes(tag));
}

export function getAdjacentPosts(slug: string): { previous?: Post; next?: Post } {
  const index = allPosts.findIndex((post) => post.slug === slug);
  if (index === -1) return {};
  return {
    previous: allPosts[index + 1],
    next: allPosts[index - 1],
  };
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  const scored = allPosts
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) => post.tags.includes(tag)).length;
      return {
        post: candidate,
        score: sharedTags * 3 + (candidate.category === post.category ? 2 : 0),
      };
    })
    .sort((a, b) => b.score - a.score || b.post.timestamp - a.post.timestamp);

  return scored.slice(0, limit).map((entry) => entry.post);
}

export function getSearchIndex() {
  return allPosts.map((post) => ({
    title: post.title,
    description: post.description,
    href: post.href,
    category: post.category,
    tags: post.tags,
    date: post.date,
    readingTime: post.readingTime,
  }));
}
