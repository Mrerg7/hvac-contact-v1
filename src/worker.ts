interface Env {
  ASSETS: Fetcher;
}

const CANONICAL_HOST = 'hvac.contact';

function toCanonicalUrl(requestUrl: URL): URL {
  const target = new URL(requestUrl.href);
  target.protocol = 'https:';
  target.hostname = CANONICAL_HOST;
  target.port = '';

  if (target.pathname === '/index.html' || target.pathname === '/index.htm') {
    target.pathname = '/';
  } else if (
    target.pathname !== '/' &&
    !target.pathname.endsWith('/') &&
    !/\.\w+$/.test(target.pathname)
  ) {
    target.pathname += '/';
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
