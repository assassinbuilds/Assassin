-- Migration: Add missing edit-profile fields to profiles
-- Description: Keeps the profiles table aligned with the frontend edit profile form.
-- Date: 2026-05-26

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS aadhaar_number TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS twitter_url TEXT,
ADD COLUMN IF NOT EXISTS portfolio_url TEXT,
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS readme TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS tshirt_size TEXT,
ADD COLUMN IF NOT EXISTS dietary_preference TEXT,
ADD COLUMN IF NOT EXISTS allergies TEXT,
ADD COLUMN IF NOT EXISTS has_education BOOLEAN DEFAULT TRUE NOT NULL,
ADD COLUMN IF NOT EXISTS education TEXT,
ADD COLUMN IF NOT EXISTS university TEXT,
ADD COLUMN IF NOT EXISTS degree_type TEXT,
ADD COLUMN IF NOT EXISTS graduation_year INTEGER,
ADD COLUMN IF NOT EXISTS graduation_month TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS roles TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS resume_url TEXT,
ADD COLUMN IF NOT EXISTS has_experience BOOLEAN DEFAULT FALSE NOT NULL,
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS is_email_public BOOLEAN DEFAULT FALSE NOT NULL,
ADD COLUMN IF NOT EXISTS is_phone_public BOOLEAN DEFAULT FALSE NOT NULL,
ADD COLUMN IF NOT EXISTS is_address_public BOOLEAN DEFAULT FALSE NOT NULL,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Backfill first/last names for users that only have full_name from Clerk sync.
UPDATE public.profiles
SET first_name = NULLIF(split_part(full_name, ' ', 1), '')
WHERE (first_name IS NULL OR first_name = '')
  AND full_name IS NOT NULL
  AND full_name <> '';

UPDATE public.profiles
SET last_name = NULLIF(trim(regexp_replace(full_name, '^\S+\s*', '')), '')
WHERE (last_name IS NULL OR last_name = '')
  AND full_name IS NOT NULL
  AND full_name <> ''
  AND position(' ' in full_name) > 0;

COMMENT ON COLUMN public.profiles.first_name IS 'User first/given name';
COMMENT ON COLUMN public.profiles.last_name IS 'User last/family name';
COMMENT ON COLUMN public.profiles.gender IS 'User gender identity or preference';
COMMENT ON COLUMN public.profiles.tshirt_size IS 'Event T-shirt size preference';
COMMENT ON COLUMN public.profiles.twitter_url IS 'URL to the user''s Twitter/X profile';
COMMENT ON COLUMN public.profiles.readme IS 'Long-form profile README content';
COMMENT ON COLUMN public.profiles.dietary_preference IS 'Dietary preference for event logistics';
COMMENT ON COLUMN public.profiles.allergies IS 'Allergy notes for event logistics';
COMMENT ON COLUMN public.profiles.has_education IS 'Whether the user has formal education details';
COMMENT ON COLUMN public.profiles.degree_type IS 'Type of degree or academic credential';
COMMENT ON COLUMN public.profiles.graduation_month IS 'Expected or completed graduation month';
COMMENT ON COLUMN public.profiles.roles IS 'Roles that describe the user';
COMMENT ON COLUMN public.profiles.resume_url IS 'URL to the user''s resume';
COMMENT ON COLUMN public.profiles.has_experience IS 'Whether the user has experience details';
COMMENT ON COLUMN public.profiles.emergency_contact_name IS 'Emergency contact name';
COMMENT ON COLUMN public.profiles.emergency_contact_phone IS 'Emergency contact phone number';
