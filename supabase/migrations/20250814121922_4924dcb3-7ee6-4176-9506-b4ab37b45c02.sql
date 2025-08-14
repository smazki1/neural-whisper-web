-- Create products_courses junction table
CREATE TABLE public.products_courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, course_id)
);

-- Create user_course_access table
CREATE TABLE public.user_course_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, course_id)
);

-- Enable RLS on both tables
ALTER TABLE public.products_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_course_access ENABLE ROW LEVEL SECURITY;

-- RLS policies for products_courses
CREATE POLICY "Everyone can view products_courses" 
ON public.products_courses 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage products_courses" 
ON public.products_courses 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for user_course_access
CREATE POLICY "Users can view their own course access" 
ON public.user_course_access 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all course access" 
ON public.user_course_access 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert course access" 
ON public.user_course_access 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_products_courses_product_id ON public.products_courses(product_id);
CREATE INDEX idx_products_courses_course_id ON public.products_courses(course_id);
CREATE INDEX idx_user_course_access_user_id ON public.user_course_access(user_id);
CREATE INDEX idx_user_course_access_course_id ON public.user_course_access(course_id);