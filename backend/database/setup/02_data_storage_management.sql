-- ==============================================================================
-- TechAssassin Database - Data Storage and Management
-- ==============================================================================
-- 
-- This script provides comprehensive SQL commands for data storage,
-- management, and maintenance operations
-- 
-- Usage:
-- 1. Connect to your PostgreSQL database via pgAdmin 4
-- 2. Run specific sections as needed for data operations
-- 3. Use these commands for ongoing data management
-- ==============================================================================

-- ==============================================================================
-- USER DATA MANAGEMENT
-- ==============================================================================

-- Function to update user profile
CREATE OR REPLACE FUNCTION public.update_user_profile(
    user_id UUID,
    username TEXT DEFAULT NULL,
    full_name TEXT DEFAULT NULL,
    email TEXT DEFAULT NULL,
    phone TEXT DEFAULT NULL,
    aadhaar_number TEXT DEFAULT NULL,
    avatar_url TEXT DEFAULT NULL,
    github_url TEXT DEFAULT NULL,
    bio TEXT DEFAULT NULL,
    address TEXT DEFAULT NULL,
    education TEXT DEFAULT NULL,
    university TEXT DEFAULT NULL,
    graduation_year INTEGER DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.profiles SET
        username = COALESCE(username, username),
        full_name = COALESCE(full_name, full_name),
        email = COALESCE(email, email),
        phone = COALESCE(phone, phone),
        aadhaar_number = COALESCE(aadhaar_number, aadhaar_number),
        avatar_url = COALESCE(avatar_url, avatar_url),
        github_url = COALESCE(github_url, github_url),
        bio = COALESCE(bio, bio),
        address = COALESCE(address, address),
        education = COALESCE(education, education),
        university = COALESCE(university, university),
        graduation_year = COALESCE(graduation_year, graduation_year),
        updated_at = NOW()
    WHERE id = user_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete user and all related data
CREATE OR REPLACE FUNCTION public.delete_user_cascade(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Delete user skills
    DELETE FROM public.user_skills WHERE user_id = user_id;
    
    -- Delete user registrations
    DELETE FROM public.registrations WHERE user_id = user_id;
    
    -- Delete user from leaderboard
    DELETE FROM public.leaderboard WHERE user_id = user_id;
    
    -- Delete user profile
    DELETE FROM public.profiles WHERE id = user_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user profile with all related data
CREATE OR REPLACE FUNCTION public.get_user_complete_profile(user_id UUID)
RETURNS TABLE (
    id UUID,
    username TEXT,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    aadhaar_number TEXT,
    avatar_url TEXT,
    github_url TEXT,
    bio TEXT,
    address TEXT,
    education TEXT,
    university TEXT,
    graduation_year INTEGER,
    is_admin BOOLEAN,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    skills JSON,
    registrations JSON,
    leaderboard_scores JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.*,
        COALESCE(
            json_agg(
                json_build_object(
                    'skill_id', us.skill_id,
                    'skill_name', s.name,
                    'category', s.category,
                    'proficiency_level', us.proficiency_level
                )
            ) FILTER (WHERE s.name IS NOT NULL),
            '[]'::json
        ) as skills,
        COALESCE(
            json_agg(
                json_build_object(
                    'registration_id', r.id,
                    'event_id', r.event_id,
                    'event_title', e.title,
                    'team_name', r.team_name,
                    'project_idea', r.project_idea,
                    'status', r.status,
                    'created_at', r.created_at
                )
            ) FILTER (WHERE r.id IS NOT NULL),
            '[]'::json
        ) as registrations,
        COALESCE(
            json_agg(
                json_build_object(
                    'event_id', l.event_id,
                    'event_title', e.title,
                    'score', l.score,
                    'rank', l.rank,
                    'updated_at', l.updated_at
                )
            ) FILTER (WHERE l.id IS NOT NULL),
            '[]'::json
        ) as leaderboard_scores
    FROM public.profiles p
    LEFT JOIN public.user_skills us ON p.id = us.user_id
    LEFT JOIN public.skills s ON us.skill_id = s.id
    LEFT JOIN public.registrations r ON p.id = r.user_id
    LEFT JOIN public.events e ON r.event_id = e.id
    LEFT JOIN public.leaderboard l ON p.id = l.user_id
    WHERE p.id = user_id
    GROUP BY p.id, p.username, p.full_name, p.email, p.phone, p.aadhaar_number, 
             p.avatar_url, p.github_url, p.bio, p.address, p.education, p.university, 
             p.graduation_year, p.is_admin, p.created_at, p.updated_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- EVENT DATA MANAGEMENT
-- ==============================================================================

-- Function to create event with automatic validation
CREATE OR REPLACE FUNCTION public.create_event_with_validation(
    title TEXT,
    description TEXT,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    location TEXT,
    max_participants INTEGER,
    image_urls TEXT[] DEFAULT '{}',
    prizes JSON DEFAULT '{}',
    themes TEXT[] DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    -- Validate dates
    IF start_date >= end_date THEN
        RAISE EXCEPTION 'Start date must be before end date';
    END IF;
    
    -- Validate participants
    IF max_participants <= 0 THEN
        RAISE EXCEPTION 'Max participants must be greater than 0';
    END IF;
    
    -- Create event
    INSERT INTO public.events (
        title, description, start_date, end_date, location, 
        max_participants, image_urls, prizes, themes, created_at
    ) VALUES (
        title, description, start_date, end_date, location,
        max_participants, image_urls, prizes, themes, NOW()
    ) RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update event registration count
CREATE OR REPLACE FUNCTION public.update_event_registration_count(event_id UUID)
RETURNS INTEGER AS $$
DECLARE
    registration_count INTEGER;
BEGIN
    -- Count confirmed registrations
    SELECT COUNT(*) INTO registration_count
    FROM public.registrations
    WHERE event_id = event_id AND status = 'confirmed';
    
    -- Update event if needed (you might add a registration_count column to events table)
    -- UPDATE public.events SET registration_count = registration_count WHERE id = event_id;
    
    RETURN registration_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get event with full details
CREATE OR REPLACE FUNCTION public.get_event_full_details(event_id UUID)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    location TEXT,
    max_participants INTEGER,
    registration_open BOOLEAN,
    image_urls TEXT[],
    prizes JSON,
    themes TEXT[],
    created_at TIMESTAMPTZ,
    total_registrations INTEGER,
    confirmed_registrations INTEGER,
    pending_registrations INTEGER,
    waitlisted_registrations INTEGER,
    registration_percentage NUMERIC,
    registrations JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.*,
        COUNT(r.id) as total_registrations,
        COUNT(CASE WHEN r.status = 'confirmed' THEN 1 END) as confirmed_registrations,
        COUNT(CASE WHEN r.status = 'pending' THEN 1 END) as pending_registrations,
        COUNT(CASE WHEN r.status = 'waitlisted' THEN 1 END) as waitlisted_registrations,
        ROUND((COUNT(CASE WHEN r.status = 'confirmed' THEN 1 END)::numeric / e.max_participants) * 100, 2) as registration_percentage,
        COALESCE(
            json_agg(
                json_build_object(
                    'registration_id', r.id,
                    'user_id', r.user_id,
                    'username', p.username,
                    'full_name', p.full_name,
                    'team_name', r.team_name,
                    'project_idea', r.project_idea,
                    'status', r.status,
                    'created_at', r.created_at
                )
            ) FILTER (WHERE r.id IS NOT NULL),
            '[]'::json
        ) as registrations
    FROM public.events e
    LEFT JOIN public.registrations r ON e.id = r.event_id
    LEFT JOIN public.profiles p ON r.user_id = p.id
    WHERE e.id = event_id
    GROUP BY e.id, e.title, e.description, e.start_date, e.end_date, e.location,
             e.max_participants, e.registration_open, e.image_urls, e.prizes, e.themes, e.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- REGISTRATION MANAGEMENT
-- ==============================================================================

-- Function to create registration with validation
CREATE OR REPLACE FUNCTION public.create_registration_with_validation(
    user_id UUID,
    event_id UUID,
    team_name TEXT,
    project_idea TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    registration_id UUID;
    event_max_participants INTEGER;
    current_registrations INTEGER;
BEGIN
    -- Check if user is already registered
    IF EXISTS (SELECT 1 FROM public.registrations WHERE user_id = user_id AND event_id = event_id) THEN
        RAISE EXCEPTION 'User is already registered for this event';
    END IF;
    
    -- Get event details
    SELECT max_participants INTO event_max_participants
    FROM public.events
    WHERE id = event_id;
    
    -- Check if event has space
    SELECT COUNT(*) INTO current_registrations
    FROM public.registrations
    WHERE event_id = event_id AND status IN ('confirmed', 'pending');
    
    IF current_registrations >= event_max_participants THEN
        -- Create waitlisted registration
        INSERT INTO public.registrations (user_id, event_id, team_name, project_idea, status, created_at)
        VALUES (user_id, event_id, team_name, project_idea, 'waitlisted', NOW())
        RETURNING id INTO registration_id;
    ELSE
        -- Create pending registration
        INSERT INTO public.registrations (user_id, event_id, team_name, project_idea, status, created_at)
        VALUES (user_id, event_id, team_name, project_idea, 'pending', NOW())
        RETURNING id INTO registration_id;
    END IF;
    
    RETURN registration_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update registration status
CREATE OR REPLACE FUNCTION public.update_registration_status(
    registration_id UUID,
    new_status TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Validate status
    IF new_status NOT IN ('pending', 'confirmed', 'waitlisted', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid registration status';
    END IF;
    
    -- Update registration
    UPDATE public.registrations
    SET status = new_status, updated_at = NOW()
    WHERE id = registration_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- LEADERBOARD MANAGEMENT
-- ==============================================================================

-- Function to update leaderboard with automatic ranking
CREATE OR REPLACE FUNCTION public.update_leaderboard_with_ranking(
    event_id UUID
)
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    -- Update ranks based on scores
    UPDATE public.leaderboard
    SET rank = (
        SELECT COUNT(*) + 1
        FROM public.leaderboard l2
        WHERE l2.event_id = leaderboard.event_id 
        AND l2.score > leaderboard.score
    )
    WHERE event_id = event_id
    AND id IN (
        SELECT id FROM public.leaderboard
        WHERE event_id = event_id
        ORDER BY score DESC
    );
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add or update leaderboard score
CREATE OR REPLACE FUNCTION public.update_leaderboard_score(
    user_id UUID,
    event_id UUID,
    score INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    current_rank INTEGER;
BEGIN
    -- Insert or update score
    INSERT INTO public.leaderboard (user_id, event_id, score, rank, updated_at)
    VALUES (user_id, event_id, score, 
        (SELECT COUNT(*) + 1 FROM public.leaderboard l2 
         WHERE l2.event_id = event_id AND l2.score > score),
        NOW()
    )
    ON CONFLICT (user_id, event_id)
    DO UPDATE SET
        score = EXCLUDED.score,
        rank = (SELECT COUNT(*) + 1 FROM public.leaderboard l2 
                 WHERE l2.event_id = EXCLUDED.event_id AND l2.score > EXCLUDED.score),
        updated_at = NOW();
    
    -- Update all ranks for this event
    PERFORM public.update_leaderboard_with_ranking(event_id);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get global leaderboard
CREATE OR REPLACE FUNCTION public.get_global_leaderboard(limit INTEGER DEFAULT 50)
RETURNS TABLE (
    rank INTEGER,
    user_id UUID,
    username TEXT,
    full_name TEXT,
    avatar_url TEXT,
    total_score INTEGER,
    events_participated INTEGER,
    best_rank INTEGER,
    achievements JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROW_NUMBER() OVER (ORDER BY total_score DESC) as rank,
        user_id,
        username,
        full_name,
        avatar_url,
        total_score,
        events_participated,
        best_rank,
        achievements
    FROM (
        SELECT 
            p.id,
            p.username,
            p.full_name,
            p.avatar_url,
            COALESCE(SUM(l.score), 0) as total_score,
            COUNT(DISTINCT l.event_id) as events_participated,
            MIN(l.rank) as best_rank,
            json_agg(
                json_build_object(
                    'event_id', l.event_id,
                    'score', l.score,
                    'rank', l.rank
                )
            ) FILTER (WHERE l.id IS NOT NULL) as achievements
        FROM public.profiles p
        LEFT JOIN public.leaderboard l ON p.id = l.user_id
        LEFT JOIN public.registrations r ON p.id = r.user_id AND r.status = 'confirmed'
        GROUP BY p.id, p.username, p.full_name, p.avatar_url
    ) ranked_users
    ORDER BY total_score DESC
    LIMIT limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- SKILLS MANAGEMENT
-- ==============================================================================

-- Function to add skill if not exists
CREATE OR REPLACE FUNCTION public.add_skill_if_not_exists(
    skill_name TEXT,
    category TEXT DEFAULT 'Programming'
)
RETURNS UUID AS $$
DECLARE
    skill_id UUID;
BEGIN
    INSERT INTO public.skills (name, category, created_at)
    VALUES (skill_name, category, NOW())
    ON CONFLICT (name) DO NOTHING
    RETURNING id INTO skill_id;
    
    RETURN skill_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user skills
CREATE OR REPLACE FUNCTION public.update_user_skills_bulk(
    user_id UUID,
    skill_data JSON
) RETURNS BOOLEAN AS $$
DECLARE
    skill_record JSON;
    skill_id UUID;
    skill_name TEXT;
    proficiency_level INTEGER;
BEGIN
    -- Remove existing skills
    DELETE FROM public.user_skills WHERE user_id = user_id;
    
    -- Add new skills from JSON data
    FOR skill_record IN SELECT * FROM json_array_elements(skill_data)
    LOOP
        skill_name := skill_record->>'name';
        proficiency_level := COALESCE((skill_record->>'proficiency_level')::INTEGER, 1);
        
        -- Get or create skill
        skill_id := public.add_skill_if_not_exists(skill_name, skill_record->>'category');
        
        -- Add user skill
        INSERT INTO public.user_skills (user_id, skill_id, proficiency_level, created_at)
        VALUES (user_id, skill_id, proficiency_level, NOW());
    END LOOP;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user skill statistics
CREATE OR REPLACE FUNCTION public.get_user_skill_stats(user_id UUID)
RETURNS TABLE (
    total_skills INTEGER,
    skill_categories JSON,
    average_proficiency NUMERIC,
    top_skills JSON
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_skills,
        json_agg(DISTINCT s.category) as skill_categories,
        ROUND(AVG(us.proficiency_level), 2) as average_proficiency,
        (
            SELECT json_agg(
                json_build_object(
                    'skill_name', s.name,
                    'proficiency_level', us.proficiency_level
                )
                ORDER BY us.proficiency_level DESC, s.name
                LIMIT 5
            )
        ) as top_skills
    FROM public.user_skills us
    JOIN public.skills s ON us.skill_id = s.id
    WHERE us.user_id = user_id
    GROUP BY us.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- ANNOUNCEMENTS MANAGEMENT
-- ==============================================================================

-- Function to create announcement with validation
CREATE OR REPLACE FUNCTION public.create_announcement(
    author_id UUID,
    content TEXT
)
RETURNS UUID AS $$
DECLARE
    announcement_id UUID;
BEGIN
    -- Validate content
    IF content IS NULL OR LENGTH(TRIM(content)) = 0 THEN
        RAISE EXCEPTION 'Announcement content cannot be empty';
    END IF;
    
    -- Create announcement
    INSERT INTO public.announcements (author_id, content, created_at, updated_at)
    VALUES (author_id, content, NOW(), NOW())
    RETURNING id INTO announcement_id;
    
    RETURN announcement_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get announcements with pagination
CREATE OR REPLACE FUNCTION public.get_announcements_paginated(
    page_num INTEGER DEFAULT 1,
    page_size INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    author_id UUID,
    content TEXT,
    author_name TEXT,
    author_avatar TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    total_count INTEGER,
    page_num INTEGER,
    page_size INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.author_id,
        a.content,
        p.username as author_name,
        p.avatar_url as author_avatar,
        a.created_at,
        a.updated_at,
        COUNT(*) OVER () as total_count,
        page_num,
        page_size
    FROM public.announcements a
    JOIN public.profiles p ON a.author_id = p.id
    ORDER BY a.created_at DESC
    LIMIT page_size OFFSET ((page_num - 1) * page_size);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- DATA BACKUP AND RESTORE
-- ==============================================================================

-- Function to backup user data
CREATE OR REPLACE FUNCTION public.backup_user_data(user_id UUID)
RETURNS JSON AS $$
DECLARE
    user_data JSON;
BEGIN
    -- Get complete user profile
    SELECT json_agg(row_to_json(t)) INTO user_data
    FROM (
        SELECT * FROM public.get_user_complete_profile(user_id)
    ) t;
    
    RETURN user_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to restore user data
CREATE OR REPLACE FUNCTION public.restore_user_data(user_data JSON)
RETURNS BOOLEAN AS $$
BEGIN
    -- This would implement restoration logic
    -- For security, this is a placeholder
    -- In production, implement proper validation and transaction handling
    
    RAISE NOTICE 'Data restoration not implemented for security reasons';
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- DATA CLEANUP AND MAINTENANCE
-- ==============================================================================

-- Function to clean up old data
CREATE OR REPLACE FUNCTION public.cleanup_old_data(days_old INTEGER DEFAULT 90)
RETURNS TABLE (
    tables_cleaned TEXT[],
    records_deleted INTEGER
) AS $$
DECLARE
    tables_array TEXT[];
    deleted_count INTEGER;
BEGIN
    -- Clean up old registrations
    DELETE FROM public.registrations 
    WHERE created_at < NOW() - INTERVAL '%s days' % days_old;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    IF deleted_count > 0 THEN
        tables_array := array_append(tables_array, ARRAY['registrations']);
    END IF;
    
    -- Clean up old announcements
    DELETE FROM public.announcements 
    WHERE created_at < NOW() - INTERVAL '%s days' % days_old;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    IF deleted_count > 0 THEN
        tables_array := array_append(tables_array, ARRAY['announcements']);
    END IF;
    
    -- Clean up old sessions (if sessions table exists)
    -- DELETE FROM public.sessions 
    -- WHERE created_at < NOW() - INTERVAL '%s days' % days_old;
    
    RETURN SELECT tables_array, SUM(ROW_COUNT) FROM (
        SELECT 'registrations', COUNT(*) FROM public.registrations WHERE created_at < NOW() - INTERVAL '%s days' % days_old
        UNION ALL
        SELECT 'announcements', COUNT(*) FROM public.announcements WHERE created_at < NOW() - INTERVAL '%s days' % days_old
    ) cleanup_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update database statistics
CREATE OR REPLACE FUNCTION public.update_database_statistics()
RETURNS TABLE (
    table_name TEXT,
    record_count INTEGER,
    last_updated TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'profiles' as table_name,
        COUNT(*) as record_count,
        MAX(updated_at) as last_updated
    FROM public.profiles
    
    UNION ALL
    
    SELECT 
        'events' as table_name,
        COUNT(*) as record_count,
        MAX(created_at) as last_updated
    FROM public.events
    
    UNION ALL
    
    SELECT 
        'registrations' as table_name,
        COUNT(*) as record_count,
        MAX(created_at) as last_updated
    FROM public.registrations
    
    UNION ALL
    
    SELECT 
        'skills' as table_name,
        COUNT(*) as record_count,
        MAX(created_at) as last_updated
    FROM public.skills
    
    UNION ALL
    
    SELECT 
        'user_skills' as table_name,
        COUNT(*) as record_count,
        MAX(created_at) as last_updated
    FROM public.user_skills
    
    UNION ALL
    
    SELECT 
        'leaderboard' as table_name,
        COUNT(*) as record_count,
        MAX(updated_at) as last_updated
    FROM public.leaderboard
    
    UNION ALL
    
    SELECT 
        'announcements' as table_name,
        COUNT(*) as record_count,
        MAX(updated_at) as last_updated
    FROM public.announcements
    
    UNION ALL
    
    SELECT 
        'resources' as table_name,
        COUNT(*) as record_count,
        MAX(created_at) as last_updated
    FROM public.resources
    
    UNION ALL
    
    SELECT 
        'sponsors' as table_name,
        COUNT(*) as record_count,
        MAX(created_at) as last_updated
    FROM public.sponsors;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- SAMPLE DATA INSERTION FOR TESTING
-- ==============================================================================

-- Function to insert sample hackathon data
CREATE OR REPLACE FUNCTION public.insert_sample_hackathon_data()
RETURNS BOOLEAN AS $$
DECLARE
    event_id UUID;
    user_ids UUID[];
    i INTEGER;
BEGIN
    -- Get existing user IDs
    SELECT array_agg(id) INTO user_ids FROM public.profiles WHERE is_admin = FALSE LIMIT 10;
    
    -- Create sample event
    event_id := public.create_event_with_validation(
        'Sample Hackathon 2025',
        'A test hackathon for data validation and testing purposes',
        NOW() + INTERVAL '1 day',
        NOW() + INTERVAL '2 days',
        'Online Event',
        50,
        ARRAY['https://picsum.photos/800/400?random=1'],
        '{"first_place": "₹10,000", "second_place": "₹5,000", "third_place": "₹2,500"}',
        ARRAY['Testing', 'Innovation', 'Technology']
    );
    
    -- Create sample registrations
    IF array_length(user_ids) > 0 THEN
        FOR i IN 1..array_length(user_ids) LOOP
            PERFORM public.create_registration_with_validation(
                user_ids[i],
                event_id,
                'Team ' || i,
                'Sample project idea for testing'
            );
        END LOOP;
    END IF;
    
    -- Update leaderboard scores
    FOR i IN 1..array_length(user_ids) LOOP
        PERFORM public.update_leaderboard_score(
            user_ids[i],
            event_id,
            (1000 - (i * 50)) -- Decreasing scores
        );
    END LOOP;
    
    RAISE NOTICE 'Sample hackathon data inserted successfully';
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- USAGE EXAMPLES
-- ==============================================================================

DO $$
BEGIN
    RAISE NOTICE '==============================================================================';
    RAISE NOTICE 'TechAssassin Database - Data Management Commands';
    RAISE NOTICE '==============================================================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Examples:';
    RAISE NOTICE '';
    RAISE NOTICE '1. Update user profile:';
    RAISE NOTICE 'SELECT public.update_user_profile(user_id, ''new_username'', ''New Full Name'');';
    RAISE NOTICE '';
    RAISE NOTICE '2. Get complete user profile:';
    RAISE NOTICE 'SELECT * FROM public.get_user_complete_profile(user_id);';
    RAISE NOTICE '';
    RAISE NOTICE '3. Create event with validation:';
    RAISE NOTICE 'SELECT * FROM public.create_event_with_validation(''Event Name'', ''Description'', NOW(), NOW() + INTERVAL ''1 day'', ''Location'', 100);';
    RAISE NOTICE '';
    RAISE NOTICE '4. Create registration:';
    RAISE NOTICE 'SELECT * FROM public.create_registration_with_validation(user_id, event_id, ''Team Name'', ''Project Idea'');';
    RAISE NOTICE '';
    RAISE NOTICE '5. Update leaderboard score:';
    RAISE NOTICE 'SELECT * FROM public.update_leaderboard_score(user_id, event_id, 1500);';
    RAISE NOTICE '';
    RAISE NOTICE '6. Get global leaderboard:';
    RAISE NOTICE 'SELECT * FROM public.get_global_leaderboard(10);';
    RAISE NOTICE '';
    RAISE NOTICE '7. Update user skills:';
    RAISE NOTICE 'SELECT * FROM public.update_user_skills_bulk(user_id, ''[{"name": "JavaScript", "proficiency_level": 5}]''::json);';
    RAISE NOTICE '';
    RAISE NOTICE '8. Create announcement:';
    RAISE NOTICE 'SELECT * FROM public.create_announcement(author_id, ''Announcement content'');';
    NOTICE '';
    RAISE NOTICE '9. Get paginated announcements:';
    RAISE NOTICE 'SELECT * FROM public.get_announcements_paginated(1, 5);';
    RAISE NOTICE '';
    RAISE NOTICE '10. Update database statistics:';
    RAISE NOTICE 'SELECT * FROM public.update_database_statistics();';
    RAISE NOTICE '';
    RAISE NOTICE '11. Clean up old data:';
    RAISE NOTICE 'SELECT * FROM public.cleanup_old_data(30);';
    RAISE NOTICE '';
    RAISE NOTICE '12. Insert sample data:';
    RAISE NOTICE 'SELECT * FROM public.insert_sample_hackathon_data();';
    RAISE NOTICE '';
    RAISE NOTICE '==============================================================================';
END $$;
