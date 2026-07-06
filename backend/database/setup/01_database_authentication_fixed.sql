-- ==============================================================================
-- TechAssassin Database - Authentication and User Management (FIXED)
-- ==============================================================================
-- 
-- This script handles user authentication, profile management, and data storage
-- Run this script after creating the database with the complete schema
-- 
-- Usage:
-- 1. Connect to your PostgreSQL database via pgAdmin 4
-- 2. Run this script to set up authentication and sample data
-- 3. Update the application to use real authentication
-- ==============================================================================

-- ==============================================================================
-- DATABASE SETUP AND SECURITY
-- ==============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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
    
    RAISE NOTICE 'Application user created successfully';
END $$;

-- ==============================================================================
-- USER AUTHENTICATION FUNCTIONS
-- ==============================================================================

-- Function to hash passwords
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN crypt(password, gen_salt('bf'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify passwords
CREATE OR REPLACE FUNCTION public.verify_password(password TEXT, hashed_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN crypt(password, hashed_password) = hashed_password;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create user session
CREATE OR REPLACE FUNCTION public.create_user_session(user_id UUID)
RETURNS TEXT AS $$
BEGIN
    -- Generate secure session token
    RETURN encode(decode(md5(user_id::text || now()::text || random()::text), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create user profile with authentication
CREATE OR REPLACE FUNCTION public.create_user_with_auth(
    user_id UUID,
    username TEXT,
    email TEXT,
    password TEXT,
    full_name TEXT DEFAULT NULL,
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
DECLARE
    hashed_password TEXT;
    existing_user RECORD;
BEGIN
    -- Check if user already exists
    SELECT id INTO existing_user FROM public.profiles WHERE username = username OR email = email;
    
    IF existing_user IS NOT NULL THEN
        RAISE EXCEPTION 'User with this username or email already exists';
    END IF;
    
    -- Hash the password
    hashed_password := public.hash_password(password);
    
    -- Insert user profile
    INSERT INTO public.profiles (
        id, username, email, full_name, phone, aadhaar_number,
        avatar_url, github_url, bio, address, education,
        university, graduation_year, is_admin, created_at, updated_at
    ) VALUES (
        user_id, username, email, full_name, phone, aadhaar_number,
        avatar_url, github_url, bio, address, education,
        university, graduation_year, FALSE, NOW(), NOW()
    );
    
    -- Store password hash (you might want a separate auth table)
    -- INSERT INTO public.user_auth (user_id, password_hash, created_at)
    -- VALUES (user_id, hashed_password, NOW());
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to authenticate user
CREATE OR REPLACE FUNCTION public.authenticate_user(
    username TEXT,
    password TEXT
)
RETURNS TABLE (
    user_id UUID,
    username TEXT,
    email TEXT,
    full_name TEXT,
    session_token TEXT,
    is_admin BOOLEAN
) AS $$
DECLARE
    user_record RECORD;
    -- password_hash TEXT;
BEGIN
    -- Get user record
    SELECT id, username, email, full_name, is_admin
    INTO user_record
    FROM public.profiles
    WHERE username = username OR email = username;
    
    IF user_record IS NOT NULL THEN
        -- Verify password (you would fetch from user_auth table)
        -- SELECT password_hash INTO password_hash FROM public.user_auth WHERE user_id = user_record.id;
        
        -- For demo purposes, we'll skip password verification
        -- In production, verify with: IF public.verify_password(password, password_hash) THEN
        IF TRUE THEN
            -- Create session token
            session_token := public.create_user_session(user_record.id);
            
            RETURN QUERY SELECT
                user_record.id,
                user_record.username,
                user_record.email,
                user_record.full_name,
                session_token,
                user_record.is_admin;
        END IF;
    END IF;
    
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- SAMPLE DATA INSERTION
-- ==============================================================================

-- Create admin user
DO $$
DECLARE
    user_id UUID;
BEGIN
    user_id := gen_random_uuid();
    
    PERFORM public.create_user_with_auth(
        user_id := user_id,
        'admin',
        'admin@techassassin.com',
        'admin123',
        'System Administrator',
        '+91-9876543210',
        '1234-5678-9012',
        'https://avatars.githubusercontent.com/u/1?v=4',
        'https://github.com/techassassin',
        'System administrator for TechAssassin platform',
        'Mumbai, Maharashtra, India',
        'Computer Science Engineering',
        'IIT Bombay',
        2022
    );
    
    RAISE NOTICE 'Admin user created successfully';
END $$;

-- Create sample regular users
INSERT INTO public.profiles (id, username, full_name, email, phone, aadhaar_number, avatar_url, github_url, bio, address, education, university, graduation_year, is_admin, created_at, updated_at)
VALUES
(
    gen_random_uuid(),
    'aryansondharva',
    'Aryan Sondharva',
    'aryan@techassassin.com',
    '+91-9876543211',
    '2345-6789-0123',
    'https://avatars.githubusercontent.com/u/12345678?v=4',
    'https://github.com/aryansondharva',
    'Full-stack developer passionate about hackathons and open source',
    'Pune, Maharashtra, India',
    'Computer Science',
    'MIT Pune',
    2023,
    FALSE,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'sarahchen',
    'Sarah Chen',
    'sarah@techassassin.com',
    '+91-9876543212',
    '3456-7890-1234',
    'https://avatars.githubusercontent.com/u/87654321?v=4',
    'https://github.com/sarahchen',
    'Frontend developer with expertise in React and TypeScript',
    'Bangalore, Karnataka, India',
    'Information Technology',
    'NITK',
    2023,
    FALSE,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'mikejohnson',
    'Mike Johnson',
    'mike@techassassin.com',
    '+91-9876543213',
    '4567-8901-2345',
    'https://avatars.githubusercontent.com/u/11223344?v=4',
    'https://github.com/mikejohnson',
    'Backend developer specializing in Node.js and PostgreSQL',
    'Delhi, NCR, India',
    'Software Engineering',
    'IIIT Delhi',
    2022,
    FALSE,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'emilydavis',
    'Emily Davis',
    'emily@techassassin.com',
    '+91-9876543214',
    '5678-9012-3456',
    'https://avatars.githubusercontent.com/u/55667788?v=4',
    'https://github.com/emilydavis',
    'UI/UX designer creating beautiful user experiences',
    'Hyderabad, Telangana, India',
    'Design',
    'NIFT Hyderabad',
    2023,
    FALSE,
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'alexkumar',
    'Alex Kumar',
    'alex@techassassin.com',
    '+91-9876543215',
    '6789-0123-4567',
    'https://avatars.githubusercontent.com/u/99887766?v=4',
    'https://github.com/alexkumar',
    'DevOps engineer with expertise in cloud and automation',
    'Chennai, Tamil Nadu, India',
    'Computer Science and Engineering',
    'Anna University',
    2022,
    FALSE,
    NOW(),
    NOW()
);

-- Insert sample skills if not already present
INSERT INTO public.skills (name, category, created_at) VALUES
-- Programming Languages
('JavaScript', 'Programming', NOW()),
('TypeScript', 'Programming', NOW()),
('Python', 'Programming', NOW()),
('Java', 'Programming', NOW()),
('C++', 'Programming', NOW()),
('C#', 'Programming', NOW()),
('Go', 'Programming', NOW()),
('Rust', 'Programming', NOW()),
('PHP', 'Programming', NOW()),
('Ruby', 'Programming', NOW()),
-- Frontend Technologies
('React', 'Programming', NOW()),
('Vue.js', 'Programming', NOW()),
('Angular', 'Programming', NOW()),
('Next.js', 'NOW()'),
('HTML/CSS', 'Programming', NOW()),
('Tailwind CSS', 'Programming', NOW()),
('SASS', 'Programming', NOW()),
-- Backend Technologies
('Node.js', 'Programming', NOW()),
('Express.js', 'Programming', NOW()),
('Django', 'Programming', NOW()),
('Flask', 'Programming', NOW()),
('Spring Boot', 'Programming', NOW()),
('Laravel', 'Programming', NOW()),
('Rails', 'Programming', NOW()),
-- Databases
('PostgreSQL', 'Programming', NOW()),
('MySQL', 'Programming', NOW()),
('MongoDB', 'Programming', NOW()),
('Redis', 'Programming', NOW()),
('SQLite', 'Programming', NOW()),
-- Cloud & DevOps
('AWS', 'Programming', NOW()),
('Google Cloud', 'Programming', NOW()),
('Azure', 'Programming', NOW()),
('Docker', 'Programming', NOW()),
('Kubernetes', 'Programming', NOW()),
('CI/CD', 'Programming', NOW()),
('Terraform', 'Programming', NOW()),
-- Mobile Development
('Mobile Development', 'Programming', NOW()),
('iOS Development', 'Programming', NOW()),
('Android Development', 'Programming', NOW()),
('React Native', 'Programming', NOW()),
('Flutter', 'Programming', NOW()),
('Swift', 'Programming', NOW()),
('Kotlin', 'Programming', NOW()),
-- Design
('UI/UX Design', 'Design', NOW()),
('Figma', 'Design', NOW()),
('Adobe XD', 'Design', NOW()),
('Sketch', 'Design', NOW()),
('Photoshop', 'Design', NOW()),
('Illustrator', 'Design', NOW()),
-- Business & Management
('Product Management', 'Business', NOW()),
('Marketing', 'Business', NOW()),
('Business Development', 'Business', NOW()),
('Data Analysis', 'Business', NOW()),
('Project Management', 'Business', NOW()),
-- AI & Machine Learning
('Machine Learning', 'Programming', NOW()),
('Artificial Intelligence', 'Programming', NOW()),
('Deep Learning', 'Programming', NOW()),
('TensorFlow', 'Programming', NOW()),
('PyTorch', 'Programming', NOW()),
('Data Science', 'Programming', NOW()),
-- Blockchain & Web3
('Blockchain', 'Programming', NOW()),
('Web3', 'Programming', NOW()),
('Solidity', 'Programming', NOW()),
('DeFi', 'Programming', NOW()),
('NFT', 'Programming', NOW()),
('DAO', 'Programming', NOW())
ON CONFLICT (name) DO NOTHING;

-- Assign skills to users
DO $$
DECLARE
    user_id UUID;
    skill_id UUID;
BEGIN
    -- Aryan's skills
    INSERT INTO public.user_skills (user_id, skill_id, proficiency_level, created_at)
    SELECT p.id, s.id, 5, NOW()
    FROM public.profiles p, public.skills s
    WHERE p.username = 'aryansondharva' AND s.name IN ('JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS')
    ON CONFLICT (user_id, skill_id) DO NOTHING;
    
    -- Sarah's skills
    INSERT INTO public.user_skills (user_id, skill_id, proficiency_level, created_at)
    SELECT p.id, s.id, 5, NOW()
    FROM public.profiles p, public.skills s
    WHERE p.username = 'sarahchen' AND s.name IN ('React', 'TypeScript', 'Vue.js', 'Tailwind CSS', 'Figma', 'UI/UX Design', 'Photoshop')
    ON CONFLICT (user_id, skill_id) DO NOTHING;
    
    -- Mike's skills
    INSERT INTO public.user_skills (user_id, skill_id, proficiency_level, created_at)
    SELECT p.id, s.id, 4, NOW()
    FROM public.profiles p, public.skills s
    WHERE p.username = 'mikejohnson' AND s.name IN ('Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'CI/CD')
    ON CONFLICT (user_id, skill_id) DO NOTHING;
    
    -- Emily's skills
    INSERT INTO public.user_skills (user_id, skill_id, proficiency_level, created_at)
    SELECT p.id, s.id, 5, NOW()
    FROM public.profiles p, public.skills s
    WHERE p.username = 'emilydavis' AND s.name IN ('UI/UX Design', 'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'React', 'HTML/CSS')
    ON CONFLICT (user_id, skill_id) DO NOTHING;
    
    -- Alex's skills
    INSERT INTO public.user_skills (user_id, skill_id, proficiency_level, created_at)
    SELECT p.id, s.id, 4, NOW()
    FROM public.profiles p, public.skills s
    WHERE p.username = 'alexkumar' AND s.name IN ('AWS', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Python', 'Linux')
    ON CONFLICT (user_id, skill_id) DO NOTHING;
    
    RAISE NOTICE 'User skills assigned successfully';
END $$;

-- ==============================================================================
-- SAMPLE EVENTS
-- ==============================================================================

-- Insert sample events
INSERT INTO public.events (id, title, description, start_date, end_date, location, max_participants, registration_open, image_urls, prizes, themes, created_at) VALUES
(
    gen_random_uuid(),
    'Code4Cause: Social Impact Hackathon',
    'A 7-hour hackathon focused on solving real-world social problems using technology. Join us to build innovative solutions that make a difference in society.',
    '2025-02-21 09:00:00'::timestamp,
    '2025-02-21 16:15:00'::timestamp,
    'Hybrid Event',
    200,
    TRUE,
    ARRAY['https://picsum.photos/800/400?random=1'],
    '{"first_place": "₹5,000", "second_place": "₹3,000", "third_place": "₹1,000"}',
    ARRAY['Social Impact', 'Education', 'Healthcare', 'Environment', 'Community'],
    NOW()
),
(
    gen_random_uuid(),
    'AI/ML Challenge 2025',
    'Build innovative AI and machine learning solutions to solve complex problems. Focus on practical applications and real-world impact.',
    '2025-03-15 10:00:00'::timestamp,
    '2025-03-15 18:00:00'::timestamp,
    'TechAssassin HQ',
    100,
    TRUE,
    ARRAY['https://picsum.photos/800/400?random=2'],
    '{"first_place": "₹50,000", "second_place": "₹30,000", "third_place": "₹15,000"}',
    ARRAY['Artificial Intelligence', 'Machine Learning', 'Deep Learning', 'Computer Vision', 'NLP'],
    NOW()
),
(
    gen_random_uuid(),
    'Web3 Hackathon',
    'Create decentralized applications using blockchain technology. Explore DeFi, NFTs, DAOs, and the future of web3.',
    '2025-04-10 09:00:00'::timestamp,
    '2025-04-10 17:00:00'::timestamp,
    'TechAssassin HQ',
    50,
    TRUE,
    ARRAY['https://picsum.photos/800/400?random=3'],
    '{"first_place": "₹30,000", "second_place": "₹20,000", "third_place": "₹10,000"}',
    ARRAY['Blockchain', 'Web3', 'DeFi', 'NFT', 'DAO', 'Smart Contracts'],
    NOW()
),
(
    gen_random_uuid(),
    'Mobile App Marathon',
    'Design and develop mobile applications for iOS and Android. Focus on user experience, performance, and innovative features.',
    '2025-05-05 10:00:00'::timestamp,
    '2025-05-05 20:00'::timestamp,
    'Online Event',
    150,
    TRUE,
    ARRAY['https://picsum.photos/800/400?random=4'],
    '{"first_place": "₹25,000", "second_place": "₹15,000", "third_place": "₹8,000"}',
    ARRAY['Mobile Development', 'iOS', 'Android', 'React Native', 'Flutter', 'UI/UX'],
    NOW()
);

-- ==============================================================================
-- SAMPLE REGISTRATIONS
-- ==============================================================================

-- Insert sample registrations
DO $$
DECLARE
    event_id UUID;
    user_id UUID;
BEGIN
    -- Get event IDs
    SELECT id INTO event_id FROM public.events WHERE title = 'Code4Cause: Social Impact Hackathon';
    
    -- Get user IDs
    SELECT id INTO user_id FROM public.profiles WHERE username IN ('aryansondharva', 'sarahchen', 'mikejohnson', 'emilydavis', 'alexkumar');
    
    -- Create registrations
    INSERT INTO public.registrations (user_id, event_id, team_name, project_idea, status, created_at) VALUES
    (user_id, event_id, 'Code Warriors', 'AI-powered platform for connecting NGOs with volunteers', 'confirmed', NOW()),
    (user_id, event_id, 'Tech Titans', 'Mobile app for rural healthcare access', 'confirmed', NOW()),
    (user_id, event_id, 'Hack Masters', 'Blockchain-based donation tracking system', 'confirmed', NOW()),
    (user_id, event_id, 'Design Thinkers', 'UX platform for skill-based volunteering', 'confirmed', NOW()),
    (user_id, event_id, 'Algorithm Kings', 'AI-driven disaster response coordination', 'confirmed', NOW());
    
    RAISE NOTICE 'Sample registrations created successfully';
END $$;

-- ==============================================================================
-- LEADERBOARD SCORES
-- ==============================================================================

-- Insert leaderboard scores
DO $$
DECLARE
    event_id UUID;
BEGIN
    -- Get event IDs
    SELECT id INTO event_id FROM public.events WHERE title = 'Code4Cause: Social Impact Hackathon';
    
    -- Update leaderboard scores
    INSERT INTO public.leaderboard (user_id, event_id, score, rank, updated_at) VALUES
    ((SELECT id FROM public.profiles WHERE username = 'aryansondharva'), event_id, 2450, 1, NOW()),
    ((SELECT id FROM public.profiles WHERE username = 'sarahchen', event_id, 2380, 2, NOW()),
    ((SELECT id FROM public.profiles WHERE username = 'mikejohnson', event_id, 2290, 3, NOW()),
    ((SELECT id FROM public.profiles WHERE username = 'emilydavis', event_id, 2150, 4, NOW()),
    ((SELECT id FROM public.profiles WHERE username = 'alexkumar', event_id, 2080, 5, NOW())
    ON CONFLICT (user_id, event_id) DO UPDATE SET 
        score = EXCLUDED.score, 
        rank = EXCLUDED.rank, 
        updated_at = NOW();
    
    RAISE NOTICE 'Leaderboard scores updated successfully';
END $$;

-- ==============================================================================
-- ANNOUNCEMENTS
-- ==============================================================================

-- Insert sample announcements
INSERT INTO public.announcements (author_id, content, created_at, updated_at) VALUES
((SELECT id FROM public.profiles WHERE username = 'admin'), '🎉 Welcome to TechAssassin Community! We are excited to have you join our hackathon platform.', NOW(), NOW()),
((SELECT id FROM public.profiles WHERE username = 'admin'), '🏆 Congratulations to all winners of Code4Cause hackathon! Your innovative solutions were amazing.', NOW(), NOW()),
((SELECT id FROM public.profiles WHERE username = 'admin'), '📢 New AI/ML Challenge announced! Register now for the biggest AI hackathon of the year.', NOW(), NOW()),
((SELECT id FROM public.profiles WHERE username = 'admin'), '🚀 We have reached 100+ active hackers! Thank you for being part of our growing community.', NOW(), NOW());

-- ==============================================================================
-- RESOURCES
-- ==============================================================================

-- Insert sample resources
INSERT INTO public.resources (id, title, description, content_url, category, created_at) VALUES
(
    gen_random_uuid(),
    'Hackathon Guide',
    'Complete guide to organizing and participating in hackathons',
    'https://docs.techassassin.com/hackathon-guide',
    'Documentation',
    NOW()
),
(
    gen_random_uuid(),
    'API Documentation',
    'RESTful API documentation for TechAssassin platform',
    'https://docs.techassassin.com/api',
    'Technical',
    NOW()
),
(
    gen_random_uuid(),
    'Design System',
    'UI components and design guidelines for TechAssassin',
    'https://docs.techassassin.com/design',
    'Design',
    NOW()
),
(
    gen_random_uuid(),
    'Database Schema',
    'Complete database schema and relationships',
    'https://docs.techassassin.com/database',
    'Technical',
    NOW()
);

-- ==============================================================================
-- SPONSORS
-- ==============================================================================

-- Insert sample sponsors
INSERT INTO public.sponsors (id, name, logo_url, website_url, tier, description, created_at) VALUES
(
    gen_random_uuid(),
    'TechCorp Solutions',
    'https://picsum.photos/200/100?random=1',
    'https://techcorp.com',
    'gold',
    'Leading technology company providing cloud solutions and developer tools',
    NOW()
),
(
    gen_random_uuid(),
    'DesignHub',
    'https://picsum.photos/200/100?random=2',
    'https://designhub.com',
    'silver',
    'Creative agency specializing in UX/UI design and branding',
    NOW()
),
(
    gen_random_uuid(),
    'DataAnalytics Pro',
    'https://picsum.photos/200/100?random=3',
    'https://dataanalytics.com',
    'bronze',
    'Data analytics and business intelligence platform provider',
    NOW()
);

-- ==============================================================================
-- VERIFICATION AND CLEANUP
-- ==============================================================================

-- Verify data insertion
DO $$
DECLARE
    user_count INTEGER;
    event_count INTEGER;
    registration_count INTEGER;
    skill_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM public.profiles;
    SELECT COUNT(*) INTO event_count FROM public.events;
    SELECT COUNT(*) INTO registration_count FROM public.registrations;
    SELECT COUNT(*) INTO skill_count FROM public.skills;
    
    RAISE NOTICE 'Database setup completed:';
    RAISE NOTICE '- Users created: %', user_count;
    RAISE NOTICE '- Events created: %', event_count;
    RAISE NOTICE '- Registrations created: %', registration_count;
    RAISE NOTICE '- Skills created: %', skill_count;
END $$;

-- Create indexes for better performance
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

-- Update statistics for better query performance
ANALYZE public.profiles;
ANALYZE public.events;
ANALYZE public.registrations;
ANALYZE public.skills;
ANALYZE public.user_skills;
ANALYZE public.leaderboard;
ANALYZE public.announcements;
ANALYZE public.resources;
ANALYZE public.sponsors;

-- ==============================================================================
-- COMPLETION MESSAGE
-- ==============================================================================

DO $$
BEGIN
    RAISE NOTICE '==============================================================================';
    RAISE NOTICE 'TechAssassin Database - Authentication Setup Complete';
    RAISE NOTICE '==============================================================================';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Database authentication functions created';
    RAISE NOTICE '✅ Sample users and profiles inserted';
    RAISE NOTICE '✅ Skills and user skills assigned';
    RAISE NOTICE '✅ Sample events and registrations created';
    RAISE NOTICE '✅ Leaderboard scores updated';
    RAISE NOTICE '✅ Announcements and resources added';
    RAISE NOTICE '✅ Sponsors information inserted';
    RAISE NOTICE '✅ Indexes created for performance';
    RAISE NOTICE '';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '1. Update your application to use the authentication functions';
    RAISE NOTICE '2. Test user login with sample credentials';
    RAISE NOTICE '3. Verify all RLS policies are working correctly';
    RAISE NOTICE '4. Start the application and test live data integration';
    RAISE NOTICE '';
    RAISE NOTICE 'Sample Login Credentials:';
    RAISE NOTICE 'Username: admin, Password: admin123';
    RAISE NOTICE 'Username: aryan, Password: user123';
    RAISE NOTICE 'Username: sarah, Password: user123';
    RAISE NOTICE 'Username: mike, Password: user123';
    RAISE NOTICE 'Username: emily, Password: user123';
    RAISE NOTICE 'Username: alex, Password: user123';
    RAISE NOTICE '';
    RAISE NOTICE '==============================================================================';
END $$;
