import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items?: BreadcrumbItem[];
}

export const BreadcrumbSchema = ({ items }: BreadcrumbSchemaProps) => {
  const location = useLocation();
  
  // Generate breadcrumbs from URL if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'בית', url: window.location.origin }
    ];
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Map common paths to Hebrew names
      const pathNames: { [key: string]: string } = {
        'products': 'מוצרים',
        'blog': 'בלוג',
        'about': 'אודות',
        'contact': 'יצירת קשר',
        'course': 'קורס',
        'ai-marketing-accelerator': 'מאיץ שיווק AI',
        'ai-strategy-course': 'קורס אסטרטגיית AI',
        'business-workshop': 'סדנת עסקים'
      };
      
      const name = pathNames[segment] || segment.replace(/-/g, ' ');
      breadcrumbs.push({
        name,
        url: `${window.location.origin}${currentPath}`
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbItems = items || generateBreadcrumbs();
  
  if (breadcrumbItems.length <= 1) return null;
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};