-- ==============================================================================
-- TechAssassin Database - Table Creation (pgAdmin 4 Compatible)
-- ==============================================================================
-- 
-- This script creates all the tables for the techassassin database
-- Run this script AFTER creating the database and selecting it in pgAdmin 4
-- 
-- Usage:
-- 1. In pgAdmin 4, select the "techassassin" database
-- 2. Run this script to create all tables
-- 3. Then run 02_database_authentication_fixed.sql
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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
-- USER_AUTH TABLE (for password storage)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.user_auth (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  password_hash TEXT NOT NULL,
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
    
    RAISE NOTICE 'Tables and user setup completed successfully';
END $$;

-- ==============================================================================
-- COMPLETION MESSAGE
-- ==============================================================================

DO $$
BEGIN
    RAISE NOTICE '==============================================================================';
    RAISE NOTICE 'TechAssassin Tables Created Successfully';
    RAISE NOTICE '==============================================================================';
    RAISE NOTICE '';
    RAISE NOTICE '✅ All tables created';
    RAISE NOTICE '✅ Indexes created for performance';
    RAISE NOTICE '✅ Application user "techassassin_app" created';
    RAISE NOTICE '✅ Permissions granted';
    RAISE NOTICE '';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '1. Run the authentication script: 02_database_authentication_fixed.sql';
    RAISE NOTICE '2. Test the database connection';
    RAISE NOTICE '3. Start your application';
    RAISE NOTICE '';
    RAISE NOTICE 'Database Connection String:';
    RAISE NOTICE 'postgresql://techassassin_app:secure_password_123@localhost:5432/techassassin';
    RAISE NOTICE '';
    RAISE NOTICE '==============================================================================';
END $$;
