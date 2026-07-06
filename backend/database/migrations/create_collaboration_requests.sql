-- Create collaboration request intake table for companies, sponsors, mentors, and partners.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.collaboration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  organization_name TEXT NOT NULL,
  organization_type TEXT NOT NULL CHECK (
    organization_type IN (
      'company',
      'startup',
      'sponsor',
      'mentor',
      'tech_organization',
      'university',
      'community',
      'other'
    )
  ),
  contact_name TEXT NOT NULL,
  role_title TEXT,
  work_email TEXT NOT NULL,
  phone TEXT,
  website_url TEXT,
  collaboration_interests TEXT[] NOT NULL DEFAULT '{}',
  budget_range TEXT,
  timeline TEXT,
  student_audience TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'contacted', 'accepted', 'closed')),
  source_page TEXT NOT NULL DEFAULT 'collaborate',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT collaboration_requests_email_format CHECK (work_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  CONSTRAINT collaboration_requests_interest_required CHECK (array_length(collaboration_interests, 1) >= 1)
);

CREATE INDEX IF NOT EXISTS idx_collaboration_requests_status_created_at
ON public.collaboration_requests(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_collaboration_requests_work_email
ON public.collaboration_requests(work_email);

CREATE INDEX IF NOT EXISTS idx_collaboration_requests_organization_type
ON public.collaboration_requests(organization_type);

DROP TRIGGER IF EXISTS set_collaboration_requests_updated_at ON public.collaboration_requests;
CREATE TRIGGER set_collaboration_requests_updated_at
BEFORE UPDATE ON public.collaboration_requests
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.collaboration_requests IS 'Inbound collaboration requests from companies, sponsors, mentors, startups, and tech organizations.';
