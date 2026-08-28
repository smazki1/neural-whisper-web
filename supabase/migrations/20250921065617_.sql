-- Create leads table for contact form submissions
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT,
  service_interest TEXT,
  source TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table  
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL,
  currency TEXT DEFAULT 'ILS',
  duration TEXT,
  category TEXT,
  features TEXT[],
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create policies for leads (anyone can insert, only admins can view)
CREATE POLICY "Anyone can submit leads" 
ON public.leads FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all leads" 
ON public.leads FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage leads" 
ON public.leads FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete leads" 
ON public.leads FOR DELETE USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policies for services
CREATE POLICY "Services are viewable by everyone" 
ON public.services FOR SELECT USING (true);

CREATE POLICY "Admins can manage services" 
ON public.services FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();;
