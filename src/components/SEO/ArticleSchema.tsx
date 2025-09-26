import { Helmet } from 'react-helmet-async';

interface ArticleSchemaProps {
  article: {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    slug: string;
    published_at: string;
    created_at: string;
    updated_at?: string;
    featured_image_url?: string;
    category?: string;
    tags?: string[];
    meta_title?: string;
    meta_description?: string;
  };
  author?: {
    name: string;
    image?: string;
    bio?: string;
  };
}

export const ArticleSchema = ({ 
  article, 
  author = { 
    name: "AI Master - Avi Fried",
    image: "/lovable-uploads/ce5b5687-c89c-4546-83ae-f72e291dc216.png",
    bio: "מומחה בתחום הבינה המלאכותית ויועץ עסקי"
  }
}: ArticleSchemaProps) => {
  const articleUrl = `${window.location.origin}/blog/${article.slug}`;
  const imageUrl = article.featured_image_url || "/lovable-uploads/ce5b5687-c89c-4546-83ae-f72e291dc216.png";
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${window.location.origin}${imageUrl}`;
  
  // Calculate reading time (approximate)
  const wordsPerMinute = 200;
  const wordCount = article.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt || article.meta_description || article.content.substring(0, 160),
    "image": [fullImageUrl],
    "datePublished": article.published_at || article.created_at,
    "dateModified": article.updated_at || article.created_at,
    "author": {
      "@type": "Person",
      "name": author.name,
      "image": author.image ? `${window.location.origin}${author.image}` : undefined,
      "description": author.bio
    },
    "publisher": {
      "@type": "Organization",
      "name": "AI Master",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/lovable-uploads/ce5b5687-c89c-4546-83ae-f72e291dc216.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl
    },
    "url": articleUrl,
    "wordCount": wordCount,
    "timeRequired": `PT${readingTime}M`,
    "inLanguage": "he",
    "about": article.category || "בינה מלאכותית",
    "keywords": article.tags?.join(', ') || "בינה מלאכותית, AI, טכנולוגיה"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "בית",
        "item": window.location.origin
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "בלוג",
        "item": `${window.location.origin}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": articleUrl
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};