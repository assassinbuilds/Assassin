-- ==============================================================================
-- TechAssassin Database Schema v1
-- ==============================================================================
-- 
-- A clean, modernized schema targeting Supabase PostgreSQL.
-- Clerk user IDs are stored as TEXT.
--
-- ==============================================================================

BEGIN;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- TRIGGERS & UTILITY FUNCTIONS
-- ==============================================================================

-- Generic updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- PROFILES TABLE
-- ==============================================================================
-- Stores user data synced from Clerk + extended application profile data.

CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY, -- Clerk User ID
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  
  -- Personal Info
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  bio TEXT,
  
  -- Media
  avatar_url TEXT,
  banner_url TEXT,
  
  -- Network Links
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  portfolio_url TEXT,
  
  -- Background
  university TEXT,
  degree_type TEXT,
  graduation_year INTEGER,
  address TEXT,
  
  -- Application Settings & Status
  skills TEXT[] NOT NULL DEFAULT '{}',
  roles TEXT[] NOT NULL DEFAULT '{}',
  interests TEXT[] NOT NULL DEFAULT '{}',
  
  -- Privacy
  is_email_public BOOLEAN NOT NULL DEFAULT FALSE,
  is_address_public BOOLEAN NOT NULL DEFAULT FALSE,
  is_phone_public BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Permissions & Gamification
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT username_min_length CHECK (char_length(username) >= 3)
);

-- Trigger for updated_at on profiles
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_total_xp ON public.profiles(total_xp DESC);

COMMIT;
