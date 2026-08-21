/**
 * Auto-migration for project request tables.
 * Embeds SQL directly (no file system reads) and uses the Supabase SQL API
 * to create tables on first use in production.
 */

const BLOG_IMAGE_SQL = `
-- Add image column to cms_posts if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cms_posts' AND column_name = 'image'
  ) THEN
    ALTER TABLE cms_posts ADD COLUMN image TEXT;
  END IF;
END
$$;
`;

const MIGRATION_SQL = `
-- Project requests (main intake submissions)
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

-- Project request ↔ services join table
CREATE TABLE IF NOT EXISTS project_request_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_request_id UUID NOT NULL REFERENCES project_requests(id) ON DELETE CASCADE,
  service_slug TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(project_request_id, service_slug)
);

-- Project activity log
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

-- RLS
ALTER TABLE project_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_request_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert project requests" ON project_requests
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert project services" ON project_request_services
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert activity" ON project_activity
  FOR INSERT WITH CHECK (true);
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
`;

let migrationStatus: "pending" | "done" | "failed" = "pending";
let blogImageStatus: "pending" | "done" | "failed" = "pending";

/**
 * Attempts to run the project_requests migration automatically.
 * Only succeeds when SUPABASE_SERVICE_ROLE_KEY is available (production deployments).
 */
export async function ensureProjectRequestTables(): Promise<{
  alreadyExists: boolean;
  created: boolean;
  error?: string;
}> {
  if (migrationStatus === "done") {
    // Even if project tables exist, still try to add blog image column
    await ensureBlogImageColumn();
    return { alreadyExists: true, created: false };
  }
  if (migrationStatus === "failed") {
    return {
      alreadyExists: false,
      created: false,
      error: "Previous migration attempt failed. Run SQL manually in Supabase Dashboard.",
    };
  }

  const SUPABASE_URL = process.env["SUPABASE_URL"];
  const SERVICE_KEY = process.env["SUPABASE_SERVICE_ROLE_KEY"];

  if (!SUPABASE_URL || !SERVICE_KEY) {
    return {
      alreadyExists: false,
      created: false,
      error:
        "SUPABASE_SERVICE_ROLE_KEY not available. Run the SQL migration in Supabase Dashboard → SQL Editor.",
    };
  }

  // Check if tables already exist by trying a simple query
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const checkClient = createClient(SUPABASE_URL, SERVICE_KEY);

    const { error } = await checkClient
      .from("project_requests")
      .select("id")
      .limit(1);

    if (!error) {
      migrationStatus = "done";
      return { alreadyExists: true, created: false };
    }

    // Table doesn't exist — need to run migration
    const isMissing =
      error.message?.includes("does not exist") ||
      error.message?.includes("relation") ||
      error.code === "42P01";

    if (!isMissing) {
      // Some other error, table might exist
      migrationStatus = "done";
      return { alreadyExists: true, created: false };
    }
  } catch {
    // Can't check, try to run migration anyway
  }

  // Run migration via Supabase SQL API
  try {
    const response = await fetch(`${SUPABASE_URL}/sql`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        apikey: SERVICE_KEY,
      },
      body: JSON.stringify({ query: MIGRATION_SQL }),
    });

    if (response.ok) {
      migrationStatus = "done";
      console.log("[Migration] Project request tables created successfully");
      return { alreadyExists: false, created: true };
    }

    const text = await response.text();
    console.error(`[Migration] SQL API returned ${response.status}:`, text);

    // If tables already exist, that's fine
    if (
      text.includes("already exists") ||
      text.includes("relation") 
    ) {
      migrationStatus = "done";
      return { alreadyExists: true, created: false };
    }

    migrationStatus = "failed";
    return {
      alreadyExists: false,
      created: false,
      error: `SQL API ${response.status}: ${text.substring(0, 300)}`,
    };
  } catch (err) {
    console.error("[Migration] Error:", err);
    migrationStatus = "failed";
    return {
      alreadyExists: false,
      created: false,
      error: `Migration failed: ${err instanceof Error ? err.message : "unknown"}`,
    };
  }
}

/**
 * Adds an `image` column to cms_posts if it doesn't already exist.
 */
async function ensureBlogImageColumn(): Promise<void> {
  if (blogImageStatus === "done" || blogImageStatus === "failed") return;

  const SUPABASE_URL = process.env["SUPABASE_URL"];
  const SERVICE_KEY = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!SUPABASE_URL || !SERVICE_KEY) return;

  try {
    const response = await fetch(`${SUPABASE_URL}/sql`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        apikey: SERVICE_KEY,
      },
      body: JSON.stringify({ query: BLOG_IMAGE_SQL }),
    });

    if (response.ok) {
      blogImageStatus = "done";
      console.log("[Migration] Blog image column ensured on cms_posts");
    } else {
      const text = await response.text();
      console.warn("[Migration] Blog image column check failed:", text.substring(0, 200));
      blogImageStatus = "failed";
    }
  } catch (err) {
    console.warn("[Migration] Blog image column check skipped:", err instanceof Error ? err.message : "unknown");
    blogImageStatus = "failed";
  }
}
