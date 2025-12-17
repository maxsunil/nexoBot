-- Create native users table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create OTP codes table
CREATE TABLE IF NOT EXISTS public.otp_codes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  code text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add index for faster OTP lookups
CREATE INDEX IF NOT EXISTS idx_otp_codes_email_code ON public.otp_codes (email, code);

-- Enable RLS on new tables (start strict)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- Note: We will access these tables via Service Role in API routes, 
-- but we should deny public access by default.
CREATE POLICY "Deny public access to users" ON public.users FOR ALL USING (false);
CREATE POLICY "Deny public access to otp_codes" ON public.otp_codes FOR ALL USING (false);

-- MIGRATION: Update profiles to reference public.users instead of auth.users
-- WARNING: This is a breaking change for existing constraints if you have data.
-- We will relax the constraint first or you might need to drop and recreate the FK.

-- Step 1: Drop existing FK to auth.users if it exists
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Step 2: Add FK to public.users (Optional: if we want to enforce it strictly)
-- ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Note: For now, we will just ensure that when we create a public.user, we create a profile with the SAME ID.
