interface Env {
  ASSETS: Fetcher;
}

const CANONICAL_HOST = 'hvac.contact';
const SALES_EMAIL = 'sales@desertrich.com';

const SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

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
  } else if (target.pathname.endsWith('/index.html')) {
    target.pathname = target.pathname.slice(0, -'index.html'.length);
  }

  return target;
}

function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function jsonResponse(body: unknown, status = 200): Response {
  return withSecurityHeaders(
    new Response(JSON.stringify(body), {
      status,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    }),
  );
}

interface InquiryPayload {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  interest?: string;
  message?: string;
  source?: string;
}

async function handleInquiry(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return withSecurityHeaders(
      new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': `https://${CANONICAL_HOST}`,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }),
    );
  }

  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Method not allowed' }, 405);
  }

  let payload: InquiryPayload;
  try {
    payload = (await request.json()) as InquiryPayload;
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  const name = (payload.name || '').trim();
  const email = (payload.email || '').trim();
  const company = (payload.company || '').trim();
  const phone = (payload.phone || '').trim();
  const interest = (payload.interest || '').trim();
  const message = (payload.message || '').trim();
  const source = (payload.source || 'inquiry-modal').trim();

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse({ ok: false, error: 'Name and valid email are required' }, 400);
  }

  const subject = encodeURIComponent(`hvac.contact inquiry — ${name}`);
  const body = encodeURIComponent(
    [
      `Name: ${name}`,
      `Email: ${email}`,
      company ? `Company: ${company}` : null,
      phone ? `Phone: ${phone}` : null,
      interest ? `Interest: ${interest}` : null,
      `Source: ${source}`,
      '',
      message || '(no message provided)',
    ]
      .filter(Boolean)
      .join('\n'),
  );

  // Free-plan friendly: return a mailto handoff so the buyer’s client
  // delivers the inquiry without paid email/API bindings.
  return jsonResponse({
    ok: true,
    mailto: `mailto:${SALES_EMAIL}?subject=${subject}&body=${body}`,
    email: SALES_EMAIL,
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const canonical = toCanonicalUrl(url);

    if (canonical.href !== url.href) {
      return withSecurityHeaders(Response.redirect(canonical.toString(), 301));
    }

    if (url.pathname === '/api/inquiry' || url.pathname === '/api/inquiry/') {
      return handleInquiry(request);
    }

    const assetResponse = await env.ASSETS.fetch(request);
    return withSecurityHeaders(assetResponse);
  },
};
