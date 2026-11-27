export const SITE = {
  title: '时六',
  name: '时六',
  latin: 'SHILIU',
  tagline: '在游戏与公式之间，随手记点。',
  description:
    '时六的个人博客：玩乐、游戏、物理、八卦、计算机与美妆穿搭。没有垂直领域，只有持续好奇。',
  author: '时六',
  location: '互联网 · 某处',
  since: 2026,
  nav: [
    { label: '首页', href: '/' },
    { label: '文章', href: '/blog/' },
    { label: '标签', href: '/tags/' },
    { label: '关于', href: '/about/' },
  ],
  socials: [
    { label: 'GitHub', href: 'https://github.com/tokiro16', handle: '@tokiri16' },
  ],
  topics: [
    { name: '玩乐', description: '桌游、散步、旅行，认真玩耍也是正事。', count: '01' },
    { name: '游戏', description: '通关记录、机制拆解，以及一些废话。', count: '02' },
    { name: '物理', description: '用公式解释生活，也接受解释不了。', count: '03' },
    { name: '八卦', description: '人物、故事、传闻，保持好奇但不下判断。', count: '04' },
    { name: '计算机', description: '代码、工具、折腾电脑的日常。', count: '05' },
    { name: '美妆穿搭', description: '颜色、材质，以及今天穿什么。', count: '06' },
  ],
} as const;

export const NAV = SITE.nav;
