import { Helmet } from 'react-helmet-async';

export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "AI Master",
    "alternateName": "AI Master - בינה מלאכותית לעסקים",
    "url": window.location.origin,
    "logo": `${window.location.origin}/lovable-uploads/ce5b5687-c89c-4546-83ae-f72e291dc216.png`,
    "description": "מומחה בתחום הבינה המלאכותית לעסקים. מציע קורסים, סדנאות וייעוץ אישי לעזור לעסקים להטמיע בינה מלאכותית",
    "founder": {
      "@type": "Person",
      "name": "Avi Fried",
      "jobTitle": "AI Consultant & Educator",
      "description": "מומחה בינה מלאכותית ויועץ עסקי"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "areaServed": "IL",
      "availableLanguage": ["Hebrew", "English"]
    },
    "areaServed": {
      "@type": "Country",
      "name": "Israel"
    },
    "knowsAbout": [
      "Artificial Intelligence",
      "Machine Learning",
      "Business Automation",
      "Digital Transformation",
      "AI Strategy",
      "ChatGPT",
      "OpenAI",
      "AI Tools"
    ],
    "serviceType": [
      "AI Consulting",
      "AI Training",
      "Business Workshops",
      "Digital Courses",
      "AI Strategy Development"
    ],
    "sameAs": [
      "https://www.linkedin.com/in/avi-fried",
      "https://www.youtube.com/@AImaster",
      "https://www.facebook.com/AIMasterIL"
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};