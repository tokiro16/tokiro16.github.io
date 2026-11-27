import type { APIRoute } from 'astro';
import { getSearchIndex } from '../lib/posts';

export const prerender = true;

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(getSearchIndex()), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
