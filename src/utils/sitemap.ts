interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

interface SitemapData {
  posts?: Array<{
    slug: string;
    updated_at?: string;
    published_at?: string;
  }>;
  products?: Array<{
    slug: string;
    updated_at?: string;
    created_at?: string;
  }>;
}

export const generateSitemap = (data: SitemapData = {}): string => {
  const baseUrl = window.location.origin;
  const urls: SitemapUrl[] = [];

  // Static pages
  const staticPages = [
    { path: '/', priority: 1.0, changefreq: 'daily' as const },
    { path: '/about', priority: 0.8, changefreq: 'monthly' as const },
    { path: '/contact', priority: 0.7, changefreq: 'monthly' as const },
    { path: '/products', priority: 0.9, changefreq: 'weekly' as const },
    { path: '/blog', priority: 0.9, changefreq: 'daily' as const },
    { path: '/ai-marketing-accelerator', priority: 0.9, changefreq: 'weekly' as const },
    { path: '/ai-strategy-course', priority: 0.9, changefreq: 'weekly' as const },
    { path: '/business-workshop', priority: 0.8, changefreq: 'weekly' as const },
    { path: '/privacy-policy', priority: 0.3, changefreq: 'yearly' as const },
    { path: '/terms-of-service', priority: 0.3, changefreq: 'yearly' as const }
  ];

  staticPages.forEach(page => {
    urls.push({
      loc: `${baseUrl}${page.path}`,
      changefreq: page.changefreq,
      priority: page.priority,
      lastmod: new Date().toISOString().split('T')[0]
    });
  });

  // Dynamic blog posts
  if (data.posts) {
    data.posts.forEach(post => {
      urls.push({
        loc: `${baseUrl}/blog/${post.slug}`,
        lastmod: post.updated_at || post.published_at,
        changefreq: 'monthly',
        priority: 0.7
      });
    });
  }

  // Dynamic products
  if (data.products) {
    data.products.forEach(product => {
      urls.push({
        loc: `${baseUrl}/products/${product.slug}`,
        lastmod: product.updated_at || product.created_at,
        changefreq: 'weekly',
        priority: 0.8
      });
    });
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `
    <lastmod>${url.lastmod}</lastmod>` : ''}${url.changefreq ? `
    <changefreq>${url.changefreq}</changefreq>` : ''}${url.priority ? `
    <priority>${url.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

// Generate robots.txt content
export const generateRobotsTxt = (): string => {
  const baseUrl = window.location.origin;
  
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /auth/
Disallow: /checkout/
Disallow: /api/
Disallow: /_*

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for polite crawling
Crawl-delay: 1

# Additional bot-specific rules
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /`;
};

// Function to download sitemap (for development/testing)
export const downloadSitemap = (data: SitemapData) => {
  const sitemap = generateSitemap(data);
  const blob = new Blob([sitemap], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Function to download robots.txt
export const downloadRobotsTxt = () => {
  const robotsTxt = generateRobotsTxt();
  const blob = new Blob([robotsTxt], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'robots.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};