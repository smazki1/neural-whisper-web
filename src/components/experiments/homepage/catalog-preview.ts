import aiBeginnersImage from '@/assets/workshops/ai-beginners.jpg';
import chatMasteryImage from '@/assets/workshops/chat-mastery.jpg';
import aiAdvancedImage from '@/assets/workshops/ai-advanced.jpg';
import type { Tables } from '@/integrations/supabase/types';

type Product = Pick<Tables<'products'>, 'id' | 'title' | 'slug' | 'description' | 'short_description' | 'thumbnail_url' | 'external_url' | 'product_type' | 'category' | 'persona' | 'is_published' | 'display_order'>;

// Local visual fixtures copied from CorporateWorkshops.tsx. Never inserted into the database.
const workshops: Product[] = [
{ id: "preview-workshop-0", title: "סדנת AI בינה מלאכותית למתחילים", short_description: "היכרות עם עולם ה-AI, כלים מדהימים זמינים לשימוש מיידי, ותרגול מעשי. מתאימה לצוותים ולמנהלים בכל המקצועות.", thumbnail_url: aiBeginnersImage, slug: '', external_url: '/corporate-workshops', product_type: 'workshop', category: 'business', persona: null, description: null, is_published: true, display_order: 0 },
{ id: "preview-workshop-1", title: "קורס להוציא את המיטב מהצ'טים", short_description: "שליטה מתקדמת ב-ChatGPT, Claude, Copilot ו-Gemini ליצירת תוכן, תכנון פרויקטים ואוטומציה של תהליכים.", thumbnail_url: chatMasteryImage, slug: '', external_url: '/corporate-workshops', product_type: 'workshop', category: 'business', persona: null, description: null, is_published: true, display_order: 1 },
{ id: "preview-workshop-2", title: "סדנת AI למתקדמים", short_description: "שליטה מתקדמת בטכנולוגיות Generative AI, יצירת תוכן, אוטומציה ושיפור תהליכי עבודה. יתרון תחרותי משמעותי.", thumbnail_url: aiAdvancedImage, slug: '', external_url: '/corporate-workshops', product_type: 'workshop', category: 'business', persona: null, description: null, is_published: true, display_order: 2 },
];

export function previewCatalog(live: Product[], mode: string): Product[] {
  if (mode === 'empty') return [];
  const courses = live.filter((p) => p.product_type === 'course');
  const courseSamples = mode === 'multiple' && courses[0] ? [0, 1, 2].map((i) => ({ ...courses[0], id: `preview-course-${i}` })) : courses.slice(0, 1);
  return [...courseSamples, ...(mode === 'single' ? workshops.slice(0, 1) : workshops), ...(courses[0] ? [{ ...courses[0], id: 'preview-draft', title: 'טיוטת בדיקה שלא תוצג', is_published: false }] : [])];
}
