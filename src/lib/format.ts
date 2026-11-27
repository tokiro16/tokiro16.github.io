const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

const shortDateFormatter = new Intl.DateTimeFormat('zh-CN', {
  month: '2-digit',
  day: '2-digit',
  timeZone: 'UTC',
});

export function formatDate(value: string | Date): string {
  return dateFormatter.format(new Date(value));
}

export function shortDate(value: string | Date): string {
  return shortDateFormatter.format(new Date(value)).replace(/\//g, '.');
}

export function isoDate(value: string | Date): string {
  return new Date(value).toISOString().slice(0, 10);
}

export function readingTime(content: string): number {
  const cjk = (content.match(/[\u4e00-\u9fff]/g) || []).length;
  const words = content
    .replace(/[\u4e00-\u9fff]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(cjk / 350 + words / 220));
}
