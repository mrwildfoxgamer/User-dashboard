/**
 * Ensures a URL has a protocol prefix.
 * JSONPlaceholder returns URLs like "hildegard.org" without https://.
 */
export function ensureHttps(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}
