import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Resend } from "resend";

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((data) => 
    z.object({
      name: z.string(),
      email: z.string().email(),
      message: z.string(),
      service_slug: z.string(),
      tier: z.string(),
      source: z.string().optional(),
    }).parse(data)
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    
    // Save to database
    const { error: dbError } = await supabaseAdmin
      .from("lead_submissions")
      .insert({
        name: data.name,
        email: data.email,
        message: data.message,
        service_slug: data.service_slug,
        tier: data.tier,
        source: data.source || 'direct'
      } as any);

    if (dbError) {
      console.error("Error saving lead to database:", dbError);
      throw dbError;
    }

    // Fetch notification settings
    const { data: settings } = await (supabaseAdmin.from("notification_settings" as any) as any)
      .select("value")
      .eq("key", "lead_notifications")
      .maybeSingle();

    const config = (settings?.value as any) || {
      team_emails: ["hello@mariostudio.com"],
      auto_reply_enabled: true,
      team_notification_enabled: true
    };

    if (config.team_notification_enabled) {
      const resendApiKey = process.env["RESEND_API_KEY"];
      if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        const fromEmail = process.env["RESEND_FROM_EMAIL"] || "onboarding@resend.dev";
        await resend.emails.send({
          from: `Mario Studio <${fromEmail}>`,
          to: config.team_emails,
          replyTo: data.email,
          subject: `New Lead: ${data.service_slug} (${data.tier})`,
          text: `New lead from ${data.name} (${data.email}).\n\nService: ${data.service_slug}\nTier: ${data.tier}\nMessage: ${data.message}`,
        });
      } else {
        console.warn("[Email] RESEND_API_KEY not configured — skipping team notification");
      }
    }

    if (config.auto_reply_enabled) {
      const resendApiKey = process.env["RESEND_API_KEY"];
      if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        const fromEmail = process.env["RESEND_FROM_EMAIL"] || "onboarding@resend.dev";
        await resend.emails.send({
          from: `Mario Studio <${fromEmail}>`,
          to: data.email,
          subject: "Thanks for reaching out to Mario Studio!",
          text: `Hi ${data.name},\n\nThanks for reaching out! We've received your project brief and will review it shortly.\n\nA member of our team will get back to you within 48 hours with a scoped reply — including a timeline, price range, and a free brand audit.\n\nBest regards,\nMario Studio`,
        });
      } else {
        console.warn("[Email] RESEND_API_KEY not configured — skipping auto-reply");
      }
    }
    
    return { success: true };
  });

export const submitContactForm = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({
      name: z.string().trim().min(2).max(100),
      email: z.string().trim().email().max(255),
      company: z.string().trim().max(120).optional(),
      service: z.string().trim().min(1),
      budget: z.string().trim().min(1),
      message: z.string().trim().min(20).max(2000),
    }).parse(data)
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Save to database
    const { error: dbError } = await supabaseAdmin
      .from("lead_submissions")
      .insert({
        name: data.name,
        email: data.email,
        message: `[Company: ${data.company || "N/A"}]\n[Service: ${data.service}]\n[Budget: ${data.budget}]\n\n${data.message}`,
        service_slug: data.service,
        tier: data.budget,
        source: "contact-form",
      } as any);

    if (dbError) {
      console.error("Error saving contact form submission:", dbError);
      throw dbError;
    }

    // Fetch notification settings
    const { data: settings } = await (supabaseAdmin.from("notification_settings" as any) as any)
      .select("value")
      .eq("key", "lead_notifications")
      .maybeSingle();

    const config = (settings?.value as any) || {
      team_emails: ["hello@mariostudio.com"],
      auto_reply_enabled: true,
      team_notification_enabled: true,
    };

    const resendApiKey = process.env["RESEND_API_KEY"];

    if (config.team_notification_enabled && resendApiKey) {
      const resend = new Resend(resendApiKey);
      const fromEmail = process.env["RESEND_FROM_EMAIL"] || "onboarding@resend.dev";
      await resend.emails.send({
        from: `Mario Studio <${fromEmail}>`,
        to: config.team_emails,
        replyTo: data.email,
        subject: `New Contact Inquiry — ${data.service}`,
        text: [
          `New contact form submission`,
          ``,
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          `Company: ${data.company || "N/A"}`,
          `Service: ${data.service}`,
          `Budget: ${data.budget}`,
          ``,
          `Message:`,
          data.message,
        ].join("\n"),
      });
    }

    if (config.auto_reply_enabled && resendApiKey) {
      const resend = new Resend(resendApiKey);
      const fromEmail = process.env["RESEND_FROM_EMAIL"] || "onboarding@resend.dev";
      await resend.emails.send({
        from: `Mario Studio <${fromEmail}>`,
        to: data.email,
        subject: "Thanks for reaching out to Mario Studio!",
        text: `Hi ${data.name},\n\nThanks for reaching out! We've received your project brief and will review it shortly.\n\nA member of our team will get back to you within 48 hours with a scoped reply — including a timeline, price range, and a free brand audit.\n\nBest regards,\nMario Studio`,
      });
    }

    return { success: true };
  });

export const getNotificationSettings = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await (supabaseAdmin
      .from("notification_settings" as any) as any)
      .select("*")
      .eq("key", "lead_notifications")
      .maybeSingle();
    return data;
  });

export const updateNotificationSettings = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({
    team_emails: z.array(z.string().email()),
    auto_reply_enabled: z.boolean(),
    team_notification_enabled: z.boolean()
  }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await (supabaseAdmin
      .from("notification_settings" as any) as any)
      .upsert({ key: "lead_notifications", value: data });
    if (error) throw error;
    return { success: true };
  });

export const exportLeadsCsv = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({
    service: z.string().optional(),
    tier: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional()
  }).optional().parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let query = supabaseAdmin.from("lead_submissions").select("*").order("created_at", { ascending: false });

    if (data?.service) query = query.eq("service_slug", data.service);
    if (data?.tier) query = query.eq("tier", data.tier);
    if (data?.startDate) query = query.gte("created_at", data.startDate);
    if (data?.endDate) query = query.lte("created_at", data.endDate);

    const { data: leads } = await query;
    
    if (!leads || leads.length === 0) return { csv: "No data" };

    const headers = ["Date", "Name", "Email", "Service", "Tier", "Source", "Status"];
    const rows = leads.map(l => [
      l.created_at,
      l.name,
      l.email,
      l.service_slug,
      l.tier,
      (l as any).source || 'direct',
      l.status
    ].join(","));

    return { csv: [headers.join(","), ...rows].join("\n") };
  });