import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Validates a bootstrap token against the environment variable.
 * Use this to allow one-time operations like creating the first admin.
 */
export const validateBootstrapToken = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ token: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const bootstrapToken = process.env["ADMIN_BOOTSTRAP_TOKEN"];
    
    if (!bootstrapToken) {
      console.error("ADMIN_BOOTSTRAP_TOKEN not set in environment");
      return { success: false, error: "System not configured for bootstrap" };
    }

    if (data.token !== bootstrapToken) {
      return { success: false, error: "Invalid bootstrap token" };
    }

    return { success: true };
  });

/**
 * Grants admin role to a user if the bootstrap token is valid.
 * This bypasses RLS checks and should only be used for the initial setup.
 */
export const bootstrapAdminUser = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ 
    token: z.string(),
    userId: z.string().uuid()
  }).parse(data))
  .handler(async ({ data }) => {
    const bootstrapToken = process.env["ADMIN_BOOTSTRAP_TOKEN"];
    
    if (!bootstrapToken || data.token !== bootstrapToken) {
      return { success: false, error: "Unauthorized" };
    }

    // Use the admin client to bypass RLS and assign the role
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    // First check if the user exists
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(data.userId);
    if (userError || !user) {
      return { success: false, error: "User not found" };
    }

    // Upsert the admin role
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .upsert({ 
        user_id: data.userId, 
        role: "admin" 
      }, { onConflict: "user_id, role" });

    if (roleError) {
      console.error("Error assigning admin role:", roleError);
      return { success: false, error: "Failed to assign role" };
    }

    return { success: true };
  });
