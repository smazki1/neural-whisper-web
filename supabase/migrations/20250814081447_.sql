-- Fix security vulnerability in password_resets table
-- Remove the overly permissive policy
DROP POLICY IF EXISTS "System can manage password resets" ON public.password_resets;

-- Create secure policies that prevent public access
-- Only allow service role (edge functions) to manage password resets
CREATE POLICY "Service role can manage password resets"
ON public.password_resets
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Completely block access for authenticated and anonymous users
CREATE POLICY "Block public access to password resets"
ON public.password_resets
FOR ALL
TO authenticated, anon
USING (false)
WITH CHECK (false);;
