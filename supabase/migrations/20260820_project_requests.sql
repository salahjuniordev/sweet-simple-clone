-- Mario Studio: Project Requests Schema
-- Run this SQL in your Supabase SQL Editor to create the required tables.

-- 1. Project requests (main intake submissions)
CREATE TABLE IF NOT EXISTS project_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reference TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  country TEXT,
  city TEXT,
  website TEXT,
  social_media TEXT,
  industry TEXT,
  business_description TEXT,
  target_audience TEXT,
  project_name TEXT,
  project_description TEXT,
  project_goals TEXT,
  success_criteria TEXT,
  existing_assets TEXT,
  competitors TEXT,
  inspiration TEXT,
  service_answers JSONB DEFAULT '{}'::jsonb,
  budget_range TEXT,
  desired_start TEXT,
  desired_deadline TEXT,
  files JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'new' NOT NULL,
  assigned_to UUID,
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Project request ↔ services join table
CREATE TABLE IF NOT EXISTS project_request_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_request_id UUID NOT NULL REFERENCES project_requests(id) ON DELETE CASCADE,
  service_slug TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(project_request_id, service_slug)
);

-- 3. Project activity log
CREATE TABLE IF NOT EXISTS project_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_request_id UUID NOT NULL REFERENCES project_requests(id) ON DELETE CASCADE,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_project_requests_status ON project_requests(status);
CREATE INDEX IF NOT EXISTS idx_project_requests_reference ON project_requests(reference);
CREATE INDEX IF NOT EXISTS idx_project_requests_created ON project_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prs_project ON project_request_services(project_request_id);
CREATE INDEX IF NOT EXISTS idx_prs_service ON project_request_services(service_slug);
CREATE INDEX IF NOT EXISTS idx_pa_project ON project_activity(project_request_id);

-- RLS: Public can insert project requests (for the intake form)
ALTER TABLE project_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_request_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_activity ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (intake form is public)
CREATE POLICY "Public can insert project requests" ON project_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert project services" ON project_request_services
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert activity" ON project_activity
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users (admins/editors) full read access
CREATE POLICY "Authenticated can read project requests" ON project_requests
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can read project services" ON project_request_services
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can read activity" ON project_activity
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update project requests" ON project_requests
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete project requests" ON project_requests
  FOR DELETE USING (auth.role() = 'authenticated');
