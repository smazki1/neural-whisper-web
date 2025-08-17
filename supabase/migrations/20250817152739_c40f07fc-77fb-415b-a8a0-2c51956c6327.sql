-- Create table for content and services management
CREATE TABLE public.content_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('הרצאה', 'סדנה', 'קורס דיגיטלי', 'ליווי אישי', 'מאמר', 'מדריך')),
  short_description TEXT,
  detailed_description TEXT,
  price NUMERIC,
  duration TEXT,
  main_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'טיוטה' CHECK (status IN ('פעיל', 'טיוטה', 'לא פעיל')),
  page_title TEXT,
  suitable_for TEXT,
  what_included TEXT,
  content_structure TEXT,
  prerequisites TEXT,
  additional_info TEXT,
  action_link TEXT,
  search_tags TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.content_services ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage all content services" 
ON public.content_services 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Published content services are viewable by everyone" 
ON public.content_services 
FOR SELECT 
USING (status = 'פעיל');

-- Create trigger for updated_at
CREATE TRIGGER update_content_services_updated_at
BEFORE UPDATE ON public.content_services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create categories table for filtering
CREATE TABLE public.content_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for categories
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Admins can manage categories" 
ON public.content_categories 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Categories are viewable by everyone" 
ON public.content_categories 
FOR SELECT 
USING (true);

-- Insert default categories
INSERT INTO public.content_categories (name, slug) VALUES 
('הרצאות', 'lectures'),
('סדנאות', 'workshops'),
('קורסים דיגיטליים', 'digital-courses'),
('ליווי אישי', 'personal-mentoring'),
('מאמרים ומדריכים', 'articles-guides');