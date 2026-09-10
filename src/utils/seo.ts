/** Build the single canonical URL for a page (https apex, normalized path). */
export function getCanonicalUrl(site: URL, pathname: string): string {
  let path = pathname || '/';

  if (path === '/index.html') {
    path = '/';
  }

  if (path !== '/' && !path.endsWith('/') && !/\.\w+$/.test(path)) {
    path += '/';
  }

  const canonical = new URL(path, site);
  canonical.protocol = 'https:';
  canonical.hostname = site.hostname.replace(/^www\./, '');

  return canonical.href;
}
