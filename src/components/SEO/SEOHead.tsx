import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'product' | 'course';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  category?: string;
  noIndex?: boolean;
  structuredData?: object[];
}

export const SEOHead = ({
  title = "AI Master - מומחה בינה מלאכותית לעסקים",
  description = "הפוך את הרעיונות שלך למציאות עם בינה מלאכותית. סדנאות, קורסים וייעוץ אישי לבעלי עסקים",
  keywords = "בינה מלאכותית, AI, קורסים, סדנאות, ייעוץ עסקי, אוטומציה, למידה דיגיטלית",
  image = "/lovable-uploads/ce5b5687-c89c-4546-83ae-f72e291dc216.png",
  canonical,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = "AI Master - Avi Fried",
  category,
  noIndex = false,
  structuredData = []
}: SEOHeadProps) => {
  const location = useLocation();
  const currentUrl = `${window.location.origin}${location.pathname}`;
  const canonicalUrl = canonical || currentUrl;
  const fullImageUrl = image.startsWith('http') ? image : `${window.location.origin}${image}`;
  
  // Truncate description for meta tags
  const metaDescription = description.length > 160 ? 
    description.substring(0, 157) + '...' : description;
  
  // Create title with site name
  const fullTitle = title.includes('AI Master') ? title : `${title} | AI Master`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robot Instructions */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}
      
      {/* Language and Direction */}
      <meta name="content-language" content="he" />
      <meta httpEquiv="content-language" content="he" />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="AI Master" />
      <meta property="og:locale" content="he_IL" />
      
      {/* Article specific OG tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && category && (
        <meta property="article:section" content={category} />
      )}
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:creator" content="@AImaster_il" />
      <meta name="twitter:site" content="@AImaster_il" />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#3b82f6" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
      <meta name="apple-mobile-web-app-title" content="AI Master" />
      
      {/* Schema.org Structured Data */}
      {structuredData.length > 0 && structuredData.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};