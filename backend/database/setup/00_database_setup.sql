-- ==============================================================================
-- TechAssassin Database - Initial Setup (pgAdmin 4 Compatible)
-- ==============================================================================
-- 
-- This script creates the database and runs the complete schema
-- Run this script FIRST before running the authentication script
-- 
-- Usage:
-- 1. Connect to PostgreSQL as superuser (usually postgres) in pgAdmin 4
-- 2. Run this script to create the database
-- 3. Select the techassassin database in pgAdmin 4
-- 4. Run the table creation part of this script
-- 5. Then run 01_database_authentication_fixed.sql
-- ==============================================================================

-- Step 1: Create the techassassin database
CREATE DATABASE techassassin;

-- ==============================================================================
-- IMPORTANT: After creating the database, you must:
-- 1. In pgAdmin 4, refresh the database list
-- 2. Select the "techassassin" database
-- 3. Run the table creation commands below
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- RUN THE COMPLETE SCHEMA
-- ==============================================================================

-- Note: You should run the complete schema migration here
-- Copy the contents of: backend/supabase/migrations/20260213000001_complete_database_schema.sql
-- and paste it here, or run it separately

-- For now, let's create the basic tables needed for authentication
-- ==============================================================================
-- PROFILES TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  aadhaar_number TEXT UNIQUE,
  avatar_url TEXT,
  github_url TEXT,
  bio TEXT,
  address TEXT,
  education TEXT,
  university TEXT,
  graduation_year INTEGER,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- SKILLS TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT DEFAULT 'Programming',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- USER_SKILLS TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.user_skills (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency_level INTEGER DEFAULT 1 CHECK (proficiency_level >= 1 AND proficiency_level <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, skill_id)
);

-- ==============================================================================
-- EVENTS TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  max_participants INTEGER NOT NULL DEFAULT 100,
  registration_open BOOLEAN DEFAULT TRUE,
  image_urls TEXT[] DEFAULT '{}',
  prizes JSON DEFAULT '{}',
  themes TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- REGISTRATIONS TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  project_idea TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'waitlisted', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- ==============================================================================
-- LEADERBOARD TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0,
  rank INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- ==============================================================================
-- ANNOUNCEMENTS TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- RESOURCES TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content_url TEXT,
  category TEXT DEFAULT 'Documentation',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- SPONSORS TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('platinum', 'gold', 'silver', 'bronze')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- CREATE INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_aadhaar ON public.profiles(aadhaar_number);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);

CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_location ON public.events(location);
CREATE INDEX IF NOT EXISTS idx_events_registration_open ON public.events(registration_open);

CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON public.registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON public.registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.registrations(status);

CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON public.user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill_id ON public.user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_proficiency ON public.user_skills(proficiency_level);

CREATE INDEX IF NOT EXISTS idx_leaderboard_event_rank ON public.leaderboard(event_id, rank);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON public.leaderboard(user_id);

CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON public.announcements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_author_id ON public.announcements(author_id);

CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category);
CREATE INDEX IF NOT EXISTS idx_sponsors_tier ON public.sponsors(tier);

-- ==============================================================================
-- CREATE APPLICATION USER
-- ==============================================================================

-- Create application user with proper permissions
DO $$
BEGIN
    -- Drop user if exists
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'techassassin_app') THEN
        DROP USER techassassin_app;
    END IF;
    
    -- Create application user
    CREATE USER techassassin_app WITH PASSWORD 'secure_password_123';
    
    -- Grant necessary permissions
    GRANT CONNECT ON DATABASE techassassin TO techassassin_app;
    GRANT USAGE ON SCHEMA public TO techassassin_app;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO techassassin_app;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO techassassin_app;
    
    -- Grant permissions on future tables and sequences
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO techassassin_app;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO techassassin_app;
    
    RAISE NOTICE 'Database and user setup completed successfully';
END $$;

-- ==============================================================================
-- COMPLETION MESSAGE
-- ==============================================================================

DO $$
BEGIN
    RAISE NOTICE '==============================================================================';
    RAISE NOTICE 'TechAssassin Database Setup Complete';
    RAISE NOTICE '==============================================================================';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Database "techassassin" created';
    RAISE NOTICE '✅ Basic schema tables created';
    RAISE NOTICE '✅ Indexes created for performance';
    RAISE NOTICE '✅ Application user "techassassin_app" created';
    RAISE NOTICE '✅ Permissions granted';
    RAISE NOTICE '';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '1. Run the authentication script: 01_database_authentication_fixed.sql';
    RAISE NOTICE '2. Test the database connection';
    RAISE NOTICE '3. Start your application';
    RAISE NOTICE '';
    RAISE NOTICE 'Database Connection String:';
    RAISE NOTICE 'postgresql://techassassin_app:secure_password_123@localhost:5432/techassassin';
    RAISE NOTICE '';
    RAISE NOTICE '==============================================================================';
END $$;
