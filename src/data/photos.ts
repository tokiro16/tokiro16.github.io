export interface Photo {
  id: string;
  src: string;
  alt: string;
  title: string;
  description: string;
  date: string;
  kind: '猫咪' | '时六' | '空间';
  tags: string[];
  href: string;
  pageLabel: string;
  width: number;
  height: number;
}

export const PHOTOS: Photo[] = [
  {
    id: 'shaniu-shelf',
    src: '/images/cats/shaniu-shelf.jpg',
    alt: '傻妞趴在架子上看镜头',
    title: '傻妞',
    description: '奶牛猫，小母猫。平时像个小公主，不太理人。',
    date: '2026-11-27',
    kind: '猫咪',
    tags: ['猫', '傻妞', '奶牛猫'],
    href: '/blog/shaniu-zhuangzhuang/',
    pageLabel: '傻妞和壮壮',
    width: 900,
    height: 1200,
  },
  {
    id: 'zhuangzhuang-sleep',
    src: '/images/cats/zhuangzhuang-sleep.jpg',
    alt: '壮壮枕着手柄睡觉',
    title: '壮壮的手柄枕头',
    description: '狸花猫，公猫。吨位不小，打架打不过傻妞。',
    date: '2026-11-27',
    kind: '猫咪',
    tags: ['猫', '壮壮', '狸花猫'],
    href: '/blog/shaniu-zhuangzhuang/',
    pageLabel: '傻妞和壮壮',
    width: 1200,
    height: 900,
  },
  {
    id: 'zhuangzhuang-help',
    src: '/images/cats/zhuangzhuang-help.jpg',
    alt: '壮壮被按住，瞪大眼睛',
    title: '救我！！',
    description: '壮壮被按住的时候，眼睛瞪得很大。',
    date: '2026-11-27',
    kind: '猫咪',
    tags: ['猫', '壮壮', '表情包'],
    href: '/blog/shaniu-zhuangzhuang/',
    pageLabel: '傻妞和壮壮',
    width: 671,
    height: 707,
  },
  {
    id: 'shiliu-cool',
    src: '/images/shiliu-cool.jpg',
    alt: '时六的照片',
    title: '首页照片',
    description: '网站首页用的照片。',
    date: '2026-11-27',
    kind: '时六',
    tags: ['时六', '首页'],
    href: '/',
    pageLabel: '首页',
    width: 900,
    height: 1200,
  },
  {
    id: 'shiliu-sweet',
    src: '/images/shiliu-sweet.jpg',
    alt: '时六的生活照',
    title: '关于页照片',
    description: '关于页用的照片。',
    date: '2026-11-27',
    kind: '时六',
    tags: ['时六', '关于'],
    href: '/about/',
    pageLabel: '关于页',
    width: 900,
    height: 1200,
  },
  {
    id: 'tablet-second-screen',
    src: '/covers/tablet-second-screen.jpg',
    alt: '主屏、平板副屏和手柄',
    title: '平板副屏和手柄',
    description: '串流折腾的桌面实拍。',
    date: '2026-11-27',
    kind: '空间',
    tags: ['桌面', '串流', '平板'],
    href: '/blog/tablet-second-screen/',
    pageLabel: '平板变副屏和手柄',
    width: 1200,
    height: 900,
  },
];
