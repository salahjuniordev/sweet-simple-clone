import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Grants the admin role to the current user only when no admin exists yet.
 * Runs server-side with verified auth; the privileged SQL function is not
 * callable by clients.
 */
export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existing, error: selectError } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("role", "admin")
      .limit(1);

    if (selectError) {
      console.error("[claimFirstAdmin] role lookup failed");
      return { claimed: false };
    }

    if (existing && existing.length > 0) return { claimed: false };

    const { error: insertError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });

    if (insertError) {
      console.error("[claimFirstAdmin] role grant failed");
      return { claimed: false };
    }

    return { claimed: true };
  });
