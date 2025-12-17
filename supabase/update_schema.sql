-- Add new columns to the users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS username text UNIQUE,
ADD COLUMN IF NOT EXISTS business_name text,
ADD COLUMN IF NOT EXISTS password_hash text;

-- Add index for username lookup
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users (username);
