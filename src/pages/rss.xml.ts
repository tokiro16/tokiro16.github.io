import type { APIRoute } from 'astro';
import { SITE } from '../config';
import { getAllPosts } from '../lib/posts';
import { absoluteUrl } from '../lib/urls';

export const prerender = true;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.toString() || 'https://tokiro16.github.io';
  const posts = getAllPosts();
  const feedUrl = absoluteUrl('/rss.xml', origin);

  const items = posts
    .map((post) => {
      const link = new URL(post.href, origin).href;
      const content = post.html
        .replace(/(href|src)="(\/[^"]*)"/g, (_full, attribute: string, path: string) => {
          return `${attribute}="${new URL(path, origin).href}"`;
        })
        .replace(/]]>/g, ']]]]><![CDATA[>');

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(post.description)}</description>
      <content:encoded><![CDATA[${content}]]></content:encoded>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('')}
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.title)} · ${escapeXml(SITE.tagline)}</title>
    <link>${new URL(absoluteUrl('/', origin), origin).href}</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
