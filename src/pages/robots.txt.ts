import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib/urls';

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.toString() || 'https://tokiro16.github.io';

  return new Response(`User-agent: *
Allow: /

Sitemap: ${absoluteUrl('/sitemap.xml', origin)}
`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
