import { Helmet } from 'react-helmet-async';

interface ProductSchemaProps {
  product: {
    id: string;
    title: string;
    description: string;
    short_description?: string;
    price?: number;
    slug: string;
    thumbnail_url?: string;
    category?: string;
    product_type?: string;
    created_at: string;
    updated_at?: string;
    meta_title?: string;
    meta_description?: string;
  };
  reviews?: Array<{
    rating: number;
    author: string;
    text: string;
    date: string;
  }>;
  offers?: {
    availability: 'InStock' | 'OutOfStock' | 'PreOrder';
    price: number;
    priceCurrency: 'ILS';
    validFrom?: string;
    validThrough?: string;
  };
}

export const ProductSchema = ({ 
  product, 
  reviews = [],
  offers
}: ProductSchemaProps) => {
  const productUrl = `${window.location.origin}/products/${product.slug}`;
  const imageUrl = product.thumbnail_url || "/lovable-uploads/ce5b5687-c89c-4546-83ae-f72e291dc216.png";
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${window.location.origin}${imageUrl}`;
  
  // Calculate aggregate rating if reviews exist
  const aggregateRating = reviews.length > 0 ? {
    "@type": "AggregateRating",
    "ratingValue": (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1),
    "reviewCount": reviews.length,
    "bestRating": 5,
    "worstRating": 1
  } : undefined;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": product.product_type === 'course' ? "Course" : "Product",
    "name": product.title,
    "description": product.description,
    "image": [fullImageUrl],
    "url": productUrl,
    "sku": product.id,
    "category": product.category || "בינה מלאכותית",
    "brand": {
      "@type": "Brand",
      "name": "AI Master"
    },
    "provider": {
      "@type": "Organization",
      "name": "AI Master",
      "url": window.location.origin
    },
    "dateCreated": product.created_at,
    "dateModified": product.updated_at || product.created_at,
    "inLanguage": "he",
    ...(aggregateRating && { "aggregateRating": aggregateRating }),
    ...(offers && {
      "offers": {
        "@type": "Offer",
        "price": offers.price.toString(),
        "priceCurrency": offers.priceCurrency,
        "availability": `https://schema.org/${offers.availability}`,
        "seller": {
          "@type": "Organization",
          "name": "AI Master"
        },
        ...(offers.validFrom && { "validFrom": offers.validFrom }),
        ...(offers.validThrough && { "validThrough": offers.validThrough })
      }
    })
  };

  // Add course-specific properties
  if (product.product_type === 'course') {
    Object.assign(productSchema, {
      "educationalLevel": "כל הרמות",
      "courseMode": "online",
      "about": product.category || "בינה מלאכותית",
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "online",
        "instructor": {
          "@type": "Person",
          "name": "AI Master - Avi Fried",
          "description": "מומחה בתחום הבינה המלאכותית"
        }
      }
    });
  }

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
        "name": "מוצרים",
        "item": `${window.location.origin}/products`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.title,
        "item": productUrl
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};