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

/** Parse a display price like "$400,000" into a numeric string for schema. */
export function parsePriceNumeric(price: string): string {
  return price.replace(/[^0-9.]/g, '') || '0';
}

export function buildOrganizationSchema(domain: string, url: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: domain,
    url,
    description,
    logo: 'https://imagedelivery.net/-sPAUAWeA405NiWJ0SNIQA/335b1bdd-ec88-44ef-8d19-b87ae2d69700/public',
    email: 'sales@desertrich.com',
    sameAs: ['https://x.com/ERG963'],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'sales@desertrich.com',
      contactType: 'sales',
      availableLanguage: 'English',
    },
  };
}

export function buildWebPageSchema(opts: {
  domain: string;
  url: string;
  title: string;
  description: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${opts.url}#webpage`,
    url: opts.url,
    name: opts.title,
    description: opts.description,
    isPartOf: {
      '@type': 'WebSite',
      name: opts.domain,
      url: opts.url,
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: 'https://imagedelivery.net/-sPAUAWeA405NiWJ0SNIQA/335b1bdd-ec88-44ef-8d19-b87ae2d69700/public',
    },
    inLanguage: 'en-US',
  };
}

export function buildProductSchema(opts: {
  domain: string;
  url: string;
  description: string;
  priceNumeric: string;
  currency: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: opts.domain,
    description: opts.description,
    url: opts.url,
    image: 'https://imagedelivery.net/-sPAUAWeA405NiWJ0SNIQA/335b1bdd-ec88-44ef-8d19-b87ae2d69700/public',
    sku: opts.domain,
    brand: {
      '@type': 'Brand',
      name: opts.domain,
    },
    category: 'Premium Domain Name',
    offers: {
      '@type': 'Offer',
      url: opts.url,
      priceCurrency: opts.currency,
      price: opts.priceNumeric,
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Desert Rich',
        email: 'sales@desertrich.com',
      },
    },
  };
}
