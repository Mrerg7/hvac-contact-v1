interface Env {
  ASSETS: Fetcher;
}

const CANONICAL_HOST = 'hvac.contact';

// Normalize every request to a single canonical URL (https://hvac.contact/).
// http/www/index.html variants 301 here so they are never served with a
// duplicate 200 + canonical — GSC reports those as "Page with redirect".
// Trailing slashes are handled by `html_handling = "force-trailing-slash"`.
function toCanonicalUrl(requestUrl: URL): URL {
  const target = new URL(requestUrl.href);
  target.protocol = 'https:';
  target.hostname = CANONICAL_HOST;
  target.port = '';

  if (target.pathname === '/index.html' || target.pathname === '/index.htm') {
    target.pathname = '/';
  }

  return target;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const canonical = toCanonicalUrl(url);

    if (canonical.href !== url.href) {
      return Response.redirect(canonical.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
