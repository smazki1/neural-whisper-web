import { Helmet } from 'react-helmet-async';

interface CourseSchemaProps {
  course: {
    id: string;
    title: string;
    description: string;
    duration?: string;
    level?: string;
    category?: string;
    created_at?: string;
    updated_at?: string;
  };
  lessons?: Array<{
    id: string;
    title: string;
    duration?: string | number;
  }>;
}

export const CourseSchema = ({ course, lessons = [] }: CourseSchemaProps) => {
  const courseUrl = `${window.location.origin}/course/${course.id}`;
  const totalDuration = lessons.reduce((total, lesson) => {
    const duration = typeof lesson.duration === 'string' ? 10 : (lesson.duration || 0);
    return total + duration;
  }, 0);
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.description,
    "url": courseUrl,
    "image": "/lovable-uploads/ce5b5687-c89c-4546-83ae-f72e291dc216.png",
    "provider": {
      "@type": "Organization",
      "name": "AI Master",
      "url": window.location.origin,
      "logo": "/lovable-uploads/ce5b5687-c89c-4546-83ae-f72e291dc216.png"
    },
    "educationalLevel": course.level || "כל הרמות",
    "courseMode": "online",
    "inLanguage": "he",
    "about": course.category || "בינה מלאכותית",
    "dateCreated": course.created_at,
    "dateModified": course.updated_at,
    "timeRequired": course.duration || `PT${Math.round(totalDuration / 60)}H`,
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "instructor": {
        "@type": "Person",
        "name": "AI Master",
        "description": "מומחה בתחום הבינה המלאכותית"
      }
    },
    "syllabusSections": lessons.map((lesson, index) => ({
      "@type": "Syllabus",
      "name": lesson.title,
      "position": index + 1,
      "timeRequired": lesson.duration ? (typeof lesson.duration === 'string' ? "PT10M" : `PT${lesson.duration}M`) : "PT10M"
    }))
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
        "name": "קורסים",
        "item": `${window.location.origin}/products`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": course.title,
        "item": courseUrl
      }
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{`${course.title} | קורס בינה מלאכותית - AI Master`}</title>
      <meta name="description" content={`${course.description.substring(0, 155)}...`} />
      <meta name="keywords" content={`בינה מלאכותית, AI, קורס, ${course.category}, ${course.level}, למידה דיגיטלית`} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={courseUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={`${course.title} | AI Master`} />
      <meta property="og:description" content={course.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={courseUrl} />
      <meta property="og:image" content="/lovable-uploads/ce5b5687-c89c-4546-83ae-f72e291dc216.png" />
      <meta property="og:site_name" content="AI Master" />
      <meta property="og:locale" content="he_IL" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${course.title} | AI Master`} />
      <meta name="twitter:description" content={course.description} />
      <meta name="twitter:image" content="/lovable-uploads/ce5b5687-c89c-4546-83ae-f72e291dc216.png" />
      
      {/* Educational Meta Tags */}
      <meta name="educational-level" content={course.level || "כל הרמות"} />
      <meta name="educational-subject" content={course.category || "בינה מלאכותית"} />
      <meta name="content-language" content="he" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};