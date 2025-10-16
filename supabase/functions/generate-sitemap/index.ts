import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Generating sitemap...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const baseUrl = 'https://aimaster-site.lovable.app';

    // Fetch published blog posts
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (postsError) {
      console.error('Error fetching posts:', postsError);
      throw postsError;
    }

    console.log(`Found ${posts?.length || 0} published posts`);

    // Fetch categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('slug, created_at');

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
    }

    // Fetch tags
    const { data: tags, error: tagsError } = await supabase
      .from('blog_tags')
      .select('slug, created_at');

    if (tagsError) {
      console.error('Error fetching tags:', tagsError);
    }

    // Build sitemap XML
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Static pages
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/blog', priority: '0.9', changefreq: 'daily' },
      { url: '/about', priority: '0.8', changefreq: 'monthly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
      { url: '/products', priority: '0.9', changefreq: 'weekly' },
      { url: '/landing/ai-marketing-accelerator', priority: '0.9', changefreq: 'weekly' },
    ];

    staticPages.forEach(page => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}${page.url}</loc>\n`;
      sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
      sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${page.priority}</priority>\n`;
      sitemap += `  </url>\n`;
    });

    // Blog posts
    posts?.forEach(post => {
      const lastmod = post.updated_at || post.published_at || new Date().toISOString();
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
      sitemap += `    <lastmod>${new Date(lastmod).toISOString()}</lastmod>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>0.8</priority>\n`;
      sitemap += `  </url>\n`;
    });

    // Categories
    categories?.forEach(category => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}/blog/category/${category.slug}</loc>\n`;
      sitemap += `    <lastmod>${new Date(category.created_at).toISOString()}</lastmod>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>0.7</priority>\n`;
      sitemap += `  </url>\n`;
    });

    // Tags
    tags?.forEach(tag => {
      sitemap += `  <url>\n`;
      sitemap += `    <loc>${baseUrl}/blog/tag/${tag.slug}</loc>\n`;
      sitemap += `    <lastmod>${new Date(tag.created_at).toISOString()}</lastmod>\n`;
      sitemap += `    <changefreq>weekly</changefreq>\n`;
      sitemap += `    <priority>0.6</priority>\n`;
      sitemap += `  </url>\n`;
    });

    sitemap += '</urlset>';

    console.log('Sitemap generated successfully');

    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});