-- Initial Clerk Schema for TechAssassin
-- Includes custom Member ID generation and Username change limits

-- 1. Helper Function: Generate Member ID using a specific date
-- Example: 2026 (Year) + 18 (Day) + 04 (Month) + 001 (Serial) = 20261804001
CREATE OR REPLACE FUNCTION generate_member_id(target_date TIMESTAMPTZ) RETURNS TEXT AS $$
DECLARE
    today_prefix TEXT;
    next_serial INTEGER;
BEGIN
    -- Format: YYYYDDMM
    today_prefix := to_char(target_date, 'YYYYDDMM'); 
    
    -- Count users created on that specific day with this prefix
    SELECT COALESCE(COUNT(*), 0) + 1 
    INTO next_serial
    FROM public.profiles 
    WHERE member_id LIKE today_prefix || '%';
    
    RETURN today_prefix || lpad(next_serial::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY, -- Clerk User ID
    member_id TEXT UNIQUE, -- Generated YYYYDDMMSSS
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    bio TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    total_xp INTEGER DEFAULT 0,
    username_change_count INTEGER DEFAULT 0,
    last_username_change TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT username_min_length CHECK (char_length(username) >= 3)
);

-- 3. Trigger: Auto-generate Member ID on Creation
CREATE OR REPLACE FUNCTION trg_generate_member_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.member_id IS NULL THEN
        -- Use the record's created_at (which we sync from Clerk) to determine the ID prefix
        NEW.member_id := generate_member_id(COALESCE(NEW.created_at, NOW()));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_member_id ON public.profiles;
CREATE TRIGGER trigger_generate_member_id
    BEFORE INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION trg_generate_member_id();

-- 4. Trigger: Prevent Member ID change (Immutable Primary Member ID)
CREATE OR REPLACE FUNCTION trg_prevent_member_id_change() RETURNS TRIGGER AS $$
BEGIN
    IF OLD.member_id IS NOT NULL AND OLD.member_id <> NEW.member_id THEN
        RAISE EXCEPTION 'Member ID is immutable and cannot be changed.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_prevent_member_id_change ON public.profiles;
CREATE TRIGGER trigger_prevent_member_id_change
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION trg_prevent_member_id_change();

-- 5. Trigger: Limit Username changes (2 per month)
CREATE OR REPLACE FUNCTION trg_enforce_username_change_limit() RETURNS TRIGGER AS $$
DECLARE
    current_month_start TIMESTAMPTZ;
BEGIN
    -- Only check if username is actually changing
    IF OLD.username <> NEW.username THEN
        current_month_start := date_trunc('month', NOW());
        
        -- Reset counter if the last change was in a different month
        IF OLD.last_username_change IS NULL OR OLD.last_username_change < current_month_start THEN
            NEW.username_change_count := 1;
        ELSE
            -- Increment counter if in the same month
            IF OLD.username_change_count >= 2 THEN
                RAISE EXCEPTION 'Username can only be changed twice per month.';
            END IF;
            NEW.username_change_count := OLD.username_change_count + 1;
        END IF;
        
        NEW.last_username_change := NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_enforce_username_change_limit ON public.profiles;
CREATE TRIGGER trigger_enforce_username_change_limit
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION trg_enforce_username_change_limit();

-- 6. Grant Permissions
GRANT ALL ON TABLE public.profiles TO postgres;
GRANT SELECT ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;

-- 7. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 8. Policies for Clerk Authentication
-- Requirement: The Clerk JWT template named 'supabase' must map 'sub' to '{{user.id}}'

-- Allow anyone to view profiles (needed for community features)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT 
    USING (true);

-- Allow users to update ONLY their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid()::text = id);

-- Allow service_role (Admin/Sync Scripts) to bypass RLS
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY; -- Ensures even service role follows policies unless specified
-- Actually, service_role usually bypasses RLS by default in Supabase unless FORCE is used, 
-- but we want our sync scripts to work regardless.
