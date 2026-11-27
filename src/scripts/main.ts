interface SearchItem {
  title: string;
  description: string;
  href: string;
  category: string;
  tags: string[];
  date: string;
  readingTime: number;
}

const root = document.documentElement;
const body = document.body;
const base = (body.dataset.base || '/').replace(/\/+$/, '');
const siteBase = base || '';

function q<T extends Element>(selector: string, parent: ParentNode = document): T | null {
  return parent.querySelector<T>(selector);
}

function qa<T extends Element>(selector: string, parent: ParentNode = document): T[] {
  return Array.from(parent.querySelectorAll<T>(selector));
}

/* -------------------------------------------------------------------------- */
/* Theme                                                                      */
/* -------------------------------------------------------------------------- */

const themeToggle = q<HTMLButtonElement>('[data-theme-toggle]');

function setTheme(theme: 'light' | 'dark') {
  root.dataset.theme = theme;
  themeToggle?.setAttribute('aria-label', theme === 'dark' ? '切换到浅色模式' : '切换到深色模式');
  try {
    localStorage.setItem('shiliu-theme', theme);
  } catch {
    /* localStorage 可能被禁用，忽略即可 */
  }
}

setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');

themeToggle?.addEventListener('click', () => {
  setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
});

/* -------------------------------------------------------------------------- */
/* Header + mobile menu                                                       */
/* -------------------------------------------------------------------------- */

const header = q<HTMLElement>('[data-header]');
const menuToggle = q<HTMLButtonElement>('[data-menu-toggle]');
const mobileMenu = q<HTMLElement>('#mobile-menu');

function onScrollHeader() {
  header?.classList.toggle('is-scrolled', window.scrollY > 8);
}

onScrollHeader();
window.addEventListener('scroll', onScrollHeader, { passive: true });

function setMenu(open: boolean) {
  if (!menuToggle || !mobileMenu) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
  mobileMenu.classList.toggle('is-open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  body.classList.toggle('no-scroll', open);
}

menuToggle?.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});

qa<HTMLAnchorElement>('#mobile-menu a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

/* -------------------------------------------------------------------------- */
/* Search                                                                     */
/* -------------------------------------------------------------------------- */

const searchDialog = q<HTMLDialogElement>('#search-dialog');
const searchInput = q<HTMLInputElement>('[data-search-input]');
const searchResults = q<HTMLElement>('[data-search-results]');
const searchCount = q<HTMLElement>('[data-search-count]');
const searchClose = q<HTMLButtonElement>('[data-search-close]');

let searchIndex: SearchItem[] | null = null;
let searchRequest: Promise<void> | null = null;
let visibleResults: SearchItem[] = [];
let activeIndex = 0;
let searchTimer: number | undefined;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function loadSearchIndex(): Promise<void> {
  if (searchIndex) return Promise.resolve();
  if (searchRequest) return searchRequest;

  searchRequest = fetch(`${siteBase}/search.json`)
    .then((response) => {
      if (!response.ok) throw new Error(`Search index returned ${response.status}`);
      return response.json() as Promise<SearchItem[]>;
    })
    .then((items) => {
      searchIndex = items;
      runSearch(searchInput?.value ?? '');
    })
    .catch(() => {
      if (searchResults) {
        searchResults.innerHTML = '<p class="search-empty">搜索索引加载失败，请刷新页面后重试。</p>';
      }
    });

  return searchRequest;
}

function scoreItem(item: SearchItem, query: string): number {
  const needle = query.trim().toLowerCase();
  if (!needle) return 1;

  const title = item.title.toLowerCase();
  const description = item.description.toLowerCase();
  const tags = item.tags.join(' ').toLowerCase();
  const category = item.category.toLowerCase();
  const tokens = needle.split(/\s+/).filter(Boolean);

  let score = 0;
  for (const token of tokens) {
    if (title.includes(token)) score += 10;
    if (tags.includes(token)) score += 6;
    if (category.includes(token)) score += 4;
    if (description.includes(token)) score += 2;
    if (title.startsWith(token)) score += 4;
  }
  return score;
}

function renderSearch(query: string) {
  if (!searchResults) return;

  if (!searchIndex) {
    searchResults.innerHTML = '<p class="search-loading">正在建立索引…</p>';
    return;
  }

  const normalized = query.trim();
  visibleResults = normalized
    ? searchIndex
        .map((item) => ({ item, score: scoreItem(item, normalized) }))
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score || b.item.date.localeCompare(a.item.date))
        .slice(0, 8)
        .map((entry) => entry.item)
    : searchIndex.slice(0, 6);

  activeIndex = Math.min(activeIndex, Math.max(visibleResults.length - 1, 0));

  if (searchCount) {
    searchCount.textContent = normalized
      ? `${visibleResults.length} 个结果`
      : `最近 ${visibleResults.length} 篇`;
  }

  if (visibleResults.length === 0) {
    searchResults.innerHTML = `
      <div class="search-empty">
        没有找到「${escapeHtml(normalized)}」<br />
        <span style="font-size: .75rem; opacity: .7">试试更短的关键词，或浏览全部文章。</span>
      </div>
    `;
    return;
  }

  searchResults.innerHTML = visibleResults
    .map(
      (item, index) => `
        <a class="search-result${index === activeIndex ? ' is-active' : ''}" href="${item.href}">
          <span class="search-result-index">${String(index + 1).padStart(2, '0')}</span>
          <span>
            <span class="search-result-title">${escapeHtml(item.title)}</span>
            <span class="search-result-desc">${escapeHtml(item.description)}</span>
          </span>
          <span class="search-result-tag">${escapeHtml(item.category)}</span>
        </a>
      `,
    )
    .join('');

  qa<HTMLAnchorElement>('.search-result', searchResults).forEach((link, index) => {
    link.addEventListener('mouseenter', () => {
      activeIndex = index;
      qa('.search-result', searchResults).forEach((entry, entryIndex) => {
        entry.classList.toggle('is-active', entryIndex === index);
      });
    });
  });
}

function runSearch(query: string) {
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => renderSearch(query), 60);
}

function openSearch() {
  if (!searchDialog) return;
  setMenu(false);
  if (!searchDialog.open) {
    searchDialog.showModal();
  }
  if (searchInput) {
    searchInput.value = '';
    window.setTimeout(() => searchInput.focus(), 35);
  }
  activeIndex = 0;
  renderSearch('');
  void loadSearchIndex();
}

function closeSearch() {
  if (searchDialog?.open) searchDialog.close();
}

qa<HTMLElement>('[data-search-open]').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    openSearch();
  });
});

searchClose?.addEventListener('click', closeSearch);
searchInput?.addEventListener('input', () => runSearch(searchInput.value));

searchDialog?.addEventListener('click', (event) => {
  if (event.target === searchDialog) closeSearch();
});

searchDialog?.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeSearch();
});

searchDialog?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeSearch();
    return;
  }

  if (!visibleResults.length) return;

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    activeIndex =
      event.key === 'ArrowDown'
        ? (activeIndex + 1) % visibleResults.length
        : (activeIndex - 1 + visibleResults.length) % visibleResults.length;

    qa<HTMLAnchorElement>('.search-result', searchDialog).forEach((link, index) => {
      link.classList.toggle('is-active', index === activeIndex);
      if (index === activeIndex) link.scrollIntoView({ block: 'nearest' });
    });
  }

  if (event.key === 'Enter' && document.activeElement === searchInput) {
    const target = visibleResults[activeIndex];
    if (target) {
      event.preventDefault();
      window.location.href = target.href;
    }
  }
});

document.addEventListener('keydown', (event) => {
  const target = event.target as HTMLElement | null;
  const isTyping =
    target?.tagName === 'INPUT' ||
    target?.tagName === 'TEXTAREA' ||
    target?.getAttribute('contenteditable') === 'true';

  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    openSearch();
    return;
  }

  if (event.key === '/' && !isTyping && !searchDialog?.open) {
    event.preventDefault();
    openSearch();
  }

  if (event.key === 'Escape' && searchDialog?.open) {
    closeSearch();
    return;
  }

  if (event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuToggle.focus();
  }
});

/* -------------------------------------------------------------------------- */
/* Reveal on scroll                                                           */
/* -------------------------------------------------------------------------- */

const revealElements = qa<HTMLElement>('[data-reveal]');

if ('IntersectionObserver' in window && revealElements.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

/* -------------------------------------------------------------------------- */
/* Reading progress + TOC                                                     */
/* -------------------------------------------------------------------------- */

const progressBar = q<HTMLElement>('[data-reading-progress]');
const article = q<HTMLElement>('.prose');

function updateProgress() {
  if (!progressBar || !article) return;
  const rect = article.getBoundingClientRect();
  const start = window.scrollY + rect.top;
  const distance = Math.max(article.offsetHeight - window.innerHeight * 0.35, 1);
  const ratio = Math.min(Math.max((window.scrollY - start + window.innerHeight * 0.2) / distance, 0), 1);
  progressBar.style.transform = `scaleX(${ratio})`;
}

if (progressBar && article) {
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
}

const tocLinks = qa<HTMLAnchorElement>('.toc a');

if (tocLinks.length > 0 && 'IntersectionObserver' in window) {
  const headings = tocLinks
    .map((link) => {
      const hash = link.getAttribute('href')?.slice(1) ?? '';
      try {
        return document.getElementById(decodeURIComponent(hash));
      } catch {
        return document.getElementById(hash);
      }
    })
    .filter((heading): heading is HTMLElement => Boolean(heading));

  const tocObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        tocLinks.forEach((link) => {
          const hash = link.getAttribute('href')?.slice(1) ?? '';
          let target: HTMLElement | null = null;
          try {
            target = document.getElementById(decodeURIComponent(hash));
          } catch {
            target = document.getElementById(hash);
          }
          link.classList.toggle('is-active', target === entry.target);
        });
      }
    },
    { rootMargin: '-15% 0px -70% 0px', threshold: 0 },
  );

  headings.forEach((heading) => tocObserver.observe(heading));
}

/* -------------------------------------------------------------------------- */
/* Copy code                                                                  */
/* -------------------------------------------------------------------------- */

qa<HTMLPreElement>('.prose pre').forEach((pre) => {
  if (pre.querySelector('.copy-code')) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'copy-code';
  button.textContent = '复制';
  pre.appendChild(button);

  button.addEventListener('click', async () => {
    const code = pre.querySelector('code')?.textContent ?? pre.textContent ?? '';
    try {
      await navigator.clipboard.writeText(code);
      button.textContent = '已复制';
      window.setTimeout(() => {
        button.textContent = '复制';
      }, 1600);
    } catch {
      button.textContent = '复制失败';
      window.setTimeout(() => {
        button.textContent = '复制';
      }, 1600);
    }
  });
});
