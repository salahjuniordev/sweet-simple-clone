import { readFileSync } from "node:fs";
import { join } from "node:path";

let migrationRun = false;

const MIGRATION_SQL_PATH = join(
  process.cwd(),
  "supabase/migrations/20260820_project_requests.sql",
);

/**
 * Attempts to run the project_requests migration automatically.
 * Only succeeds when SUPABASE_SERVICE_ROLE_KEY is available (production deployments).
 * Called from server functions on first request.
 */
export async function ensureProjectRequestTables(): Promise<{
  alreadyExists: boolean;
  created: boolean;
  error?: string;
}> {
  // If we already checked this session, skip
  if (migrationRun) return { alreadyExists: true, created: false };

  const SUPABASE_URL = process.env["SUPABASE_URL"];
  const SERVICE_KEY = process.env["SUPABASE_SERVICE_ROLE_KEY"];

  if (!SUPABASE_URL || !SERVICE_KEY) {
    return {
      alreadyExists: false,
      created: false,
      error:
        "SUPABASE_SERVICE_ROLE_KEY not available in this environment. Run the SQL migration manually in Supabase Dashboard → SQL Editor.",
    };
  }

  // Check if tables already exist
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const checkClient = createClient(SUPABASE_URL, SERVICE_KEY);

    const { error } = await checkClient
      .from("project_requests")
      .select("id")
      .limit(1);

    if (!error) {
      migrationRun = true;
      return { alreadyExists: true, created: false };
    }

    // Table doesn't exist — run migration
    if (!error.message?.includes("does not exist")) {
      migrationRun = true;
      return { alreadyExists: true, created: false };
    }
  } catch {
    // Can't check, try to run migration anyway
  }

  // Read and execute the SQL migration
  let sql: string;
  try {
    sql = readFileSync(MIGRATION_SQL_PATH, "utf-8");
  } catch (readErr) {
    return {
      alreadyExists: false,
      created: false,
      error: `Could not read migration file: ${readErr instanceof Error ? readErr.message : "unknown"}`,
    };
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/sql`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        apikey: SERVICE_KEY,
      },
      body: JSON.stringify({ query: sql }),
    });

    if (response.ok) {
      migrationRun = true;
      return { alreadyExists: false, created: true };
    }

    const text = await response.text();
    return {
      alreadyExists: false,
      created: false,
      error: `SQL API returned ${response.status}: ${text.substring(0, 500)}`,
    };
  } catch (err) {
    return {
      alreadyExists: false,
      created: false,
      error: `Migration failed: ${err instanceof Error ? err.message : "unknown"}`,
    };
  }
}
