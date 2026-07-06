-- Phase 1: Realtime Notifications Schema
-- Supports event notifications, XP awards, badge unlocks, and rank ups

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT,          -- Used by API / Frontend
    message TEXT,          -- Used by some legacy test suits
    metadata JSONB DEFAULT '{}'::jsonb,
    action_url TEXT,
    is_read BOOLEAN DEFAULT false, -- Used by API / Frontend
    read BOOLEAN DEFAULT false,    -- Used by test suits
    expires_at TIMESTAMPTZ DEFAULT (now() + interval '30 days'),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view their own notifications"
    ON public.notifications
    FOR SELECT
    USING (auth.uid()::text = user_id OR (SELECT username FROM public.profiles WHERE id = user_id) = auth.jwt()->>'preferred_username');

CREATE POLICY "Users can update their own notifications"
    ON public.notifications
    FOR UPDATE
    USING (auth.uid()::text = user_id);

CREATE POLICY "System/Service Role can manage all notifications"
    ON public.notifications
    FOR ALL
    USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(user_id) WHERE is_read = false;

-- Enable Realtime Replication
-- Check if publication exists first, then add table to it
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        NULL; -- Ignore if publication doesn't exist or table already added
END $$;
