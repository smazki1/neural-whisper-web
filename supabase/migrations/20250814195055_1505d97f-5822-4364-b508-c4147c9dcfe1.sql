-- Create password_resets table for handling reset tokens
CREATE TABLE public.password_resets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.password_resets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "System can manage password resets" 
ON public.password_resets 
FOR ALL 
USING (true);

-- Create index for performance
CREATE INDEX idx_password_resets_token ON public.password_resets(token);
CREATE INDEX idx_password_resets_email ON public.password_resets(email);
CREATE INDEX idx_password_resets_expires_at ON public.password_resets(expires_at);