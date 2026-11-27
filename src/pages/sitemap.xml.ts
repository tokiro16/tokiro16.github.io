import type { APIRoute } from 'astro';
import { getAllPosts, getAllTags } from '../lib/posts';
import { absoluteUrl } from '../lib/urls';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.toString() || 'https://tokiro16.github.io';
  const posts = getAllPosts();
  const tags = getAllTags();
  const latest = posts[0]?.date ?? new Date().toISOString();

  const entries: { path: string; lastmod: string; priority: string }[] = [
    { path: '/', lastmod: latest, priority: '1.0' },
    { path: '/blog/', lastmod: latest, priority: '0.9' },
    { path: '/tags/', lastmod: latest, priority: '0.6' },
    { path: '/about/', lastmod: latest, priority: '0.5' },
    ...posts.map((post) => ({
      path: `/blog/${post.slug}/`,
      lastmod: post.updated ?? post.date,
      priority: '0.8',
    })),
    ...tags.map(({ tag }) => ({
      path: `/tags/${tag}/`,
      lastmod: latest,
      priority: '0.4',
    })),
  ];

  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${absoluteUrl(entry.path, origin)}</loc>
    <lastmod>${new Date(entry.lastmod).toISOString().slice(0, 10)}</lastmod>
    <priority>${entry.priority}</priority>
  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
