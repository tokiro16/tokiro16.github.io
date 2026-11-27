export const SITE = {
  title: '时六',
  name: '时六',
  latin: 'SHILIU',
  tagline: '游戏、物理、计算机，还有一些日常。',
  description:
    '时六的个人博客。写玩乐、游戏、物理、八卦、计算机和美妆穿搭，想到什么写什么。',
  author: '时六',
  location: '互联网 · 某处',
  since: 2026,
  nav: [
    { label: '首页', href: '/' },
    { label: '文章', href: '/blog/' },
    { label: '相册', href: '/photos/' },
    { label: '标签', href: '/tags/' },
    { label: '关于', href: '/about/' },
  ],
  socials: [
    { label: 'GitHub', href: 'https://github.com/tokiro16', handle: '@tokiro16' },
  ],
  topics: [
    { name: '玩乐', description: '桌游、散步、旅行，想到什么玩什么。', count: '01' },
    { name: '游戏', description: '最近在玩什么，卡在哪，怎么过的。', count: '02' },
    { name: '物理', description: '一些物理问题，和怎么也讲不明白的日常。', count: '03' },
    { name: '八卦', description: '听来的故事，和一点自己的看法。', count: '04' },
    { name: '计算机', description: '代码、工具，还有折腾电脑的日常。', count: '05' },
    { name: '美妆穿搭', description: '今天穿什么，以及为什么。', count: '06' },
    { name: '日常', description: '猫、房间，还有每天的小事。', count: '07' },
  ],
} as const;

export const NAV = SITE.nav;
