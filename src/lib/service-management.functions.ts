import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/** Toggle service active status */
export const toggleServiceActive = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ id: z.string().uuid(), isActive: z.boolean() }).parse(data)
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin
      .from("cms_services" as any)
      .update({ is_active: data.isActive, updated_at: new Date().toISOString() } as any)
      .eq("id", data.id);

    if (error) throw error;
    return { success: true };
  });

/** Batch update sort order for services */
export const updateServiceSortOrder = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        items: z.array(z.object({ id: z.string().uuid(), sort_order: z.number() })),
      })
      .parse(data)
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    for (const item of data.items) {
      await supabaseAdmin
        .from("cms_services" as any)
        .update({ sort_order: item.sort_order } as any)
        .eq("id", item.id);
    }

    return { success: true };
  });

/** Fetch all intake questions (from DB, with fallback to empty) */
export const getIntakeQuestions = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ serviceSlug: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: questions, error } = await supabaseAdmin
      .from("service_questions" as any)
      .select("*")
      .eq("service_slug", data.serviceSlug)
      .order("sort_order");

    if (error) {
      console.warn("[IntakeQuestions] Fetch failed (table may not exist):", error.message);
      return [];
    }

    return questions || [];
  });

/** Upsert an intake question */
export const upsertIntakeQuestion = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        id: z.string().uuid().optional(),
        serviceSlug: z.string().min(1),
        key: z.string().min(1),
        label: z.string().min(1),
        type: z.enum(["text", "textarea", "select", "multi-select", "radio", "checkbox", "url", "file"]),
        required: z.boolean().optional(),
        placeholder: z.string().optional(),
        options: z.array(z.string()).optional(),
        description: z.string().optional(),
        sortOrder: z.number().optional(),
        conditionKey: z.string().optional(),
        conditionValue: z.string().optional(),
      })
      .parse(data)
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const row: Record<string, unknown> = {
      service_slug: data.serviceSlug,
      key: data.key,
      label: data.label,
      type: data.type,
      required: data.required ?? false,
      placeholder: data.placeholder ?? null,
      options: data.options ?? [],
      description: data.description ?? null,
      sort_order: data.sortOrder ?? 0,
      condition_key: data.conditionKey ?? null,
      condition_value: data.conditionValue ?? null,
    };

    if (data.id) {
      const { error } = await supabaseAdmin
        .from("service_questions" as any)
        .update(row)
        .eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin
        .from("service_questions" as any)
        .insert(row);
      if (error) throw error;
    }

    return { success: true };
  });

/** Delete an intake question */
export const deleteIntakeQuestion = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin
      .from("service_questions" as any)
      .delete()
      .eq("id", data.id);

    if (error) throw error;
    return { success: true };
  });

/** Bulk upsert questions for a service (from admin) */
export const bulkUpsertQuestions = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        serviceSlug: z.string().min(1),
        questions: z.array(
          z.object({
            id: z.string().uuid().optional(),
            key: z.string().min(1),
            label: z.string().min(1),
            type: z.enum(["text", "textarea", "select", "multi-select", "radio", "checkbox", "url", "file"]),
            required: z.boolean().optional(),
            placeholder: z.string().optional(),
            options: z.array(z.string()).optional(),
            description: z.string().optional(),
            sortOrder: z.number().optional(),
            conditionKey: z.string().optional(),
            conditionValue: z.string().optional(),
          })
        ),
      })
      .parse(data)
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Delete existing questions for this service
    await supabaseAdmin
      .from("service_questions" as any)
      .delete()
      .eq("service_slug", data.serviceSlug);

    // Insert all new questions
    const rows = data.questions.map((q, idx) => ({
      service_slug: data.serviceSlug,
      key: q.key,
      label: q.label,
      type: q.type,
      required: q.required ?? false,
      placeholder: q.placeholder ?? null,
      options: q.options ?? [],
      description: q.description ?? null,
      sort_order: q.sortOrder ?? idx,
      condition_key: q.conditionKey ?? null,
      condition_value: q.conditionValue ?? null,
    }));

    const { error } = await supabaseAdmin
      .from("service_questions" as any)
      .insert(rows);

    if (error) throw error;
    return { success: true };
  });
