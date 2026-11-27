import { defineConfig } from 'astro/config';

// GitHub Actions 会注入这两个变量；本地开发时使用默认值。
const site = process.env.SITE_URL || 'https://tokiro16.github.io';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  compressHTML: true,
});
