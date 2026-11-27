const rawBase = import.meta.env.BASE_URL || '/';
const base = rawBase === '/' ? '' : rawBase.replace(/\/+$/, '');

/**
 * 给站内链接加上部署路径。
 * GitHub 项目页会部署在 /<repo>/ 下，所以不能在模板里直接写死 /blog/。
 */
export function url(path = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}` || '/';
}

export function absoluteUrl(path = '/', site?: URL | string): string {
  const fallback = import.meta.env.SITE || 'https://tokiro16.github.io';
  const origin = site ? new URL(site.toString()) : new URL(fallback);
  return new URL(url(path), origin).href;
}
