-- Add checked_in_at column to registrations table
-- This supports event check-in functionality for gamification

ALTER TABLE public.registrations
ADD COLUMN IF NOT EXISTS checked_in_at TIMESTAMPTZ;

-- Add index for querying checked-in registrations
CREATE INDEX IF NOT EXISTS idx_registrations_checked_in_at 
ON public.registrations(checked_in_at) 
WHERE checked_in_at IS NOT NULL;

-- Add comment
COMMENT ON COLUMN public.registrations.checked_in_at IS 'Timestamp when the user checked in to the event';
