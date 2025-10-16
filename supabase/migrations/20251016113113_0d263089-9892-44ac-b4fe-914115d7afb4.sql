-- Create blog_tags table
CREATE TABLE IF NOT EXISTS public.blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create blog_post_tags junction table
CREATE TABLE IF NOT EXISTS public.blog_post_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, tag_id)
);

-- Enable RLS on blog_tags
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;

-- RLS policies for blog_tags
CREATE POLICY "Everyone can view tags"
ON public.blog_tags
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage tags"
ON public.blog_tags
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Enable RLS on blog_post_tags
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;

-- RLS policies for blog_post_tags
CREATE POLICY "Everyone can view post tags"
ON public.blog_post_tags
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage post tags"
ON public.blog_post_tags
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for blog_tags updated_at
CREATE TRIGGER update_blog_tags_updated_at
BEFORE UPDATE ON public.blog_tags
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample tags
INSERT INTO public.blog_tags (name, slug, description)
VALUES 
  ('בינה מלאכותית', 'ai', 'מאמרים על בינה מלאכותית וטכנולוגיה'),
  ('שיווק דיגיטלי', 'digital-marketing', 'אסטרטגיות שיווק מתקדמות'),
  ('כלים', 'tools', 'כלים וטכנולוגיות שימושיות'),
  ('מדריכים', 'guides', 'מדריכים מפורטים ומעשיים'),
  ('ChatGPT', 'chatgpt', 'מאמרים על ChatGPT ושימושיו'),
  ('אוטומציה', 'automation', 'אוטומציה עסקית וחיסכון בזמן'),
  ('תוכן', 'content', 'יצירת תוכן ושיווק תוכן'),
  ('SEO', 'seo', 'אופטימיזציה למנועי חיפוש')
ON CONFLICT (slug) DO NOTHING;

-- Add tags to existing blog posts (examples)
INSERT INTO public.blog_post_tags (post_id, tag_id)
SELECT 
  bp.id,
  bt.id
FROM public.blog_posts bp
CROSS JOIN public.blog_tags bt
WHERE 
  (bp.slug = 'ai-transforms-marketing' AND bt.slug IN ('ai', 'digital-marketing', 'content'))
  OR (bp.slug = 'top-5-ai-tools-for-business' AND bt.slug IN ('ai', 'tools', 'guides'))
  OR (bp.slug = 'chatgpt-guide-for-small-business' AND bt.slug IN ('chatgpt', 'guides', 'tools'))
  OR (bp.slug = 'ai-content-marketing-what-works' AND bt.slug IN ('ai', 'content', 'digital-marketing'))
  OR (bp.slug = 'smart-automation-ai-saves-time' AND bt.slug IN ('automation', 'ai', 'tools'))
ON CONFLICT (post_id, tag_id) DO NOTHING;