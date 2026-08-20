import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Mail, Clock, Globe, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { services } from "@/lib/services-data";
import { submitContactForm } from "@/lib/leads.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Start Your Project | Mario Studio" },
      {
        name: "description",
        content:
          "Start a project with Mario Studio. Tell us what you're building and receive a scoped response plus a free brand audit within 48 hours.",
      },
      { property: "og:title", content: "Start a Project | Mario Studio" },
      {
        property: "og:description",
        content: "Start your next project with Mario Studio. Tell us what you're building and receive a scoped response plus a free brand audit within 48 hours.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://mariostudio.com/contact" },
      { property: "og:image", content: "https://mariostudio.com/logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100, "Name must be under 100 characters"),
  email: z.string().trim().email("Enter a valid email address").max(255, "Email must be under 255 characters"),
  company: z.string().trim().max(120, "Company must be under 120 characters").optional(),
  service: z.string().trim().min(1, "Choose a service"),
  budget: z.string().trim().min(1, "Choose a budget range"),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a little more — at least 20 characters")
    .max(2000, "Message must be under 2000 characters"),
});

type Errors = Partial<Record<keyof z.infer<typeof contactSchema>, string>>;

const budgets = ["Under $1,000", "$1,000 – $5,000", "$5,000 – $15,000", "$15,000+", "Not sure yet"];

const fieldClass =
  "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-brand";

function ContactPage() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const form = new FormData(e.currentTarget);
    const parsed = contactSchema.safeParse({
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      company: String(form.get("company") ?? ""),
      service: String(form.get("service") ?? ""),
      budget: String(form.get("budget") ?? ""),
      message: String(form.get("message") ?? ""),
    });

    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    setServerError("");
    setSubmitting(true);

    try {
      await submitContactForm({ data: parsed.data });
      navigate({ to: "/thank-you" });
    } catch (err) {
      console.error("Contact form submission failed:", err);
      setServerError("Something went wrong. Please try again or email us directly.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">Contact</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-black tracking-tight md:text-6xl">
              Tell us what you're <span className="text-brand">building</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Send the brief, however rough. You get a scoped reply and a free brand audit within
              48 hours — no pitch deck, no pressure.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-[1.4fr_0.6fr]">
          <form noValidate onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-8 md:p-10">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="text-sm font-bold">Name</label>
                <input id="name" name="name" maxLength={100} className={fieldClass} placeholder="Jane Cooper" />
                {errors.name && <p className="mt-2 text-xs font-semibold text-destructive">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-bold">Email</label>
                <input id="email" name="email" type="email" maxLength={255} className={fieldClass} placeholder="jane@company.com" />
                {errors.email && <p className="mt-2 text-xs font-semibold text-destructive">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="company" className="text-sm font-bold">Company <span className="font-normal text-muted-foreground">(optional)</span></label>
                <input id="company" name="company" maxLength={120} className={fieldClass} placeholder="Northwind" />
                {errors.company && <p className="mt-2 text-xs font-semibold text-destructive">{errors.company}</p>}
              </div>
              <div>
                <label htmlFor="budget" className="text-sm font-bold">Budget</label>
                <select id="budget" name="budget" defaultValue="" className={fieldClass}>
                  <option value="" disabled>Select a range</option>
                  {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                {errors.budget && <p className="mt-2 text-xs font-semibold text-destructive">{errors.budget}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="service" className="text-sm font-bold">Service needed</label>
                <select id="service" name="service" defaultValue="" className={fieldClass}>
                  <option value="" disabled>Select a service</option>
                  {services.map((s) => <option key={s.slug} value={s.title}>{s.title}</option>)}
                  <option value="Multiple / not sure">Multiple / not sure</option>
                </select>
                {errors.service && <p className="mt-2 text-xs font-semibold text-destructive">{errors.service}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="text-sm font-bold">Project details</label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  maxLength={2000}
                  className={fieldClass}
                  placeholder="What are you building, who is it for, and when does it need to be live?"
                />
                {errors.message && <p className="mt-2 text-xs font-semibold text-destructive">{errors.message}</p>}
              </div>
            </div>

            {serverError && (
              <p className="mt-4 text-sm font-semibold text-destructive">{serverError}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-sm font-bold text-brand-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-70"
            >
              {submitting ? "Sending…" : "Send project brief"} <ArrowUpRight className="h-4 w-4" />
            </button>
            <p className="mt-4 text-xs text-muted-foreground">
              By sending this you agree to our <Link to="/privacy" className="underline hover:text-brand">privacy policy</Link>.
            </p>
          </form>

          <aside className="space-y-8">
            <div className="rounded-2xl border border-border p-7">
              <Mail className="h-6 w-6 text-brand" />
              <h2 className="mt-4 font-bold">Email us directly</h2>
              <a href="mailto:hello@mariostudio.com" className="mt-1 block text-sm text-muted-foreground hover:text-brand">
                hello@mariostudio.com
              </a>
            </div>
            <div className="rounded-2xl border border-border p-7">
              <Clock className="h-6 w-6 text-brand" />
              <h2 className="mt-4 font-bold">Response time</h2>
              <p className="mt-1 text-sm text-muted-foreground">Within 48 hours, Monday to Friday, 09:00–18:00 CET.</p>
            </div>
            <div className="rounded-2xl border border-border p-7">
              <Globe className="h-6 w-6 text-brand" />
              <h2 className="mt-4 font-bold">Where we work</h2>
              <p className="mt-1 text-sm text-muted-foreground">Fully remote across Europe, Africa and North America.</p>
            </div>
          </aside>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
