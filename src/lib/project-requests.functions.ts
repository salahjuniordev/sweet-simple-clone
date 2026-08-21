import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/** Generate a unique Mario Studio project reference: MS-YYYY-NNNN */
function generateReference(): string {
  const year = new Date().getFullYear();
  const seq = Math.floor(Math.random() * 9000) + 1000;
  return `MS-${year}-${seq}`;
}

const projectRequestSchema = z.object({
  // Client info
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  company: z.string().trim().max(150).optional(),
  phone: z.string().trim().max(50).optional(),
  country: z.string().trim().max(100).optional(),
  city: z.string().trim().max(100).optional(),
  website: z.string().trim().max(255).optional(),
  socialMedia: z.string().trim().max(500).optional(),
  industry: z.string().trim().max(150).optional(),
  businessDescription: z.string().trim().max(2000).optional(),
  targetAudience: z.string().trim().max(2000).optional(),
  // Project info
  services: z.array(z.string().min(1).max(100)).min(1),
  projectName: z.string().trim().max(200).optional(),
  projectDescription: z.string().trim().min(10).max(5000),
  projectGoals: z.string().trim().max(3000).optional(),
  successCriteria: z.string().trim().max(3000).optional(),
  existingAssets: z.string().trim().max(3000).optional(),
  competitors: z.string().trim().max(2000).optional(),
  inspiration: z.string().trim().max(2000).optional(),
  // Service-specific answers (JSON keyed by service slug)
  serviceAnswers: z.record(z.string(), z.any()).optional(),
  // Budget & timeline
  budgetRange: z.string().trim().min(1),
  desiredStart: z.string().trim().max(100).optional(),
  desiredDeadline: z.string().trim().max(100).optional(),
  // Files
  files: z.array(z.object({
    name: z.string(),
    url: z.string(),
    serviceSlug: z.string().optional(),
  })).optional(),
});

export const submitProjectRequest = createServerFn({ method: "POST" })
  .inputValidator((data) => projectRequestSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    // Auto-run migration on first request (production only)
    try {
      const { ensureProjectRequestTables } = await import("@/lib/auto-migrate");
      const migration = await ensureProjectRequestTables();
      if (migration.error && !migration.alreadyExists) {
        console.warn("[ProjectRequest] Migration note:", migration.error);
      }
    } catch (migErr) {
      console.warn("[ProjectRequest] Auto-migration skipped:", migErr);
    }

    const reference = generateReference();

    // Insert the main project request
    const { data: projectRequest, error: insertError } = await supabaseAdmin
      .from("project_requests" as any)
      .insert({
        reference,
        name: data.name,
        email: data.email,
        company: data.company || null,
        phone: data.phone || null,
        country: data.country || null,
        city: data.city || null,
        website: data.website || null,
        social_media: data.socialMedia || null,
        industry: data.industry || null,
        business_description: data.businessDescription || null,
        target_audience: data.targetAudience || null,
        project_name: data.projectName || null,
        project_description: data.projectDescription,
        project_goals: data.projectGoals || null,
        success_criteria: data.successCriteria || null,
        existing_assets: data.existingAssets || null,
        competitors: data.competitors || null,
        inspiration: data.inspiration || null,
        service_answers: data.serviceAnswers || {},
        budget_range: data.budgetRange,
        desired_start: data.desiredStart || null,
        desired_deadline: data.desiredDeadline || null,
        files: data.files || [],
        status: "new",
      } as any)
      .select("id")
      .single();

    if (insertError) {
      console.error("[ProjectRequest] Insert failed:", insertError);
      throw new Error("Failed to submit project request");
    }

    const requestId = (projectRequest as any)?.id as string;

    // Insert service associations
    const serviceRows = data.services.map((slug) => ({
      project_request_id: requestId,
      service_slug: slug,
    }));

    const { error: servicesError } = await supabaseAdmin
      .from("project_request_services" as any)
      .insert(serviceRows as any);

    if (servicesError) {
      console.error("[ProjectRequest] Services insert failed:", servicesError);
    }

    // Insert initial activity
    await supabaseAdmin.from("project_activity" as any).insert({
      project_request_id: requestId,
      actor: "system",
      action: "created",
      details: `Project request submitted with ${data.services.length} service(s)`,
    } as any);

    // Send email notifications
    const resendApiKey = process.env["RESEND_API_KEY"];
    if (resendApiKey) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendApiKey);
        const fromEmail =
          process.env["RESEND_FROM_EMAIL"] || "onboarding@resend.dev";

        // Team notification
        await resend.emails.send({
          from: `Mario Studio <${fromEmail}>`,
          to: "hello@mariostudio.com",
          replyTo: data.email,
          subject: `[New Project Request] ${reference} — ${data.services.join(", ")}`,
          text: [
            `New project request received`,
            ``,
            `Reference: ${reference}`,
            `Client: ${data.name} (${data.email})`,
            `Company: ${data.company || "N/A"}`,
            `Services: ${data.services.join(", ")}`,
            `Budget: ${data.budgetRange}`,
            `Timeline: ${data.desiredStart || "Flexible"} → ${data.desiredDeadline || "Flexible"}`,
            ``,
            `Project Description:`,
            data.projectDescription,
            ``,
            `Dashboard: https://mariostudio.com/admin/projects/${reference}`,
          ].join("\n"),
        });

        // Client auto-reply
        await resend.emails.send({
          from: `Mario Studio <${fromEmail}>`,
          to: data.email,
          subject: `Project Request Received — ${reference}`,
          text: [
            `Hi ${data.name},`,
            ``,
            `Thank you for your project request! We've received the details and our team will review them shortly.`,
            ``,
            `Your project reference: ${reference}`,
            ``,
            `We'll be in touch within 48 hours with next steps.`,
            ``,
            `Best regards,`,
            `Mario Studio`,
          ].join("\n"),
        });
      } catch (emailErr) {
        console.error("[ProjectRequest] Email notification failed:", emailErr);
      }
    }

    return { success: true, reference, id: requestId };
  });

/** Fetch all project requests (admin) */
export const getProjectRequests = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const { data, error } = await supabaseAdmin
      .from("project_requests" as any)
      .select("*, project_request_services(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[ProjectRequest] Fetch failed:", error);
      return [];
    }

    return data || [];
  });

/** Fetch single project request by reference (admin) */
export const getProjectRequest = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ reference: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const { data: project, error } = await supabaseAdmin
      .from("project_requests" as any)
      .select("*, project_request_services(*), project_activity(*)")
      .eq("reference", data.reference)
      .single();

    if (error) {
      console.error("[ProjectRequest] Fetch single failed:", error);
      return null;
    }

    return project;
  });

/** Update project request status (admin) */
export const updateProjectRequestStatus = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.string().min(1).max(50),
      })
      .parse(data)
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const { error } = await supabaseAdmin
      .from("project_requests" as any)
      .update({ status: data.status, updated_at: new Date().toISOString() })
      .eq("id", data.id);

    if (error) {
      console.error("[ProjectRequest] Status update failed:", error);
      throw error;
    }

    // Log activity
    await supabaseAdmin.from("project_activity" as any).insert({
      project_request_id: data.id,
      actor: "admin",
      action: "status_changed",
      details: `Status changed to ${data.status}`,
    } as any);

    return { success: true };
  });
