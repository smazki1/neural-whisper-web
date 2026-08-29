-- Enable realtime for core tables
-- Set REPLICA IDENTITY FULL so UPDATE events include previous values
ALTER TABLE public.courses REPLICA IDENTITY FULL;
ALTER TABLE public.modules REPLICA IDENTITY FULL;
ALTER TABLE public.lessons REPLICA IDENTITY FULL;
ALTER TABLE public.resources REPLICA IDENTITY FULL;
ALTER TABLE public.user_roles REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add tables to the supabase_realtime publication (idempotent)
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.courses;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.modules;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.lessons;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.resources;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.user_roles;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;;
