import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";

import { Mail, Clock, Globe, Phone, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { services } from "@/lib/services-data";
import { submitContactForm } from "@/lib/leads.functions";
import { useI18n } from "@/lib/i18n";

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

type Errors = Partial<Record<"name" | "email" | "company" | "service" | "budget" | "message", string>>;

const fieldClass =
  "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-brand";

function ContactPage() {
  const { t } = useI18n();
  const { contact } = t;
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const form = new FormData(e.currentTarget);
    const formData = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      company: String(form.get("company") ?? ""),
      service: String(form.get("service") ?? ""),
      budget: String(form.get("budget") ?? ""),
      message: String(form.get("message") ?? ""),
    };

    const next: Errors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) next.name = contact.errors.name;
    else if (formData.name.trim().length > 100) next.name = contact.errors.nameMax;
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) next.email = contact.errors.email;
    else if (formData.email.trim().length > 255) next.email = contact.errors.emailMax;
    if (formData.company.trim().length > 120) next.company = contact.errors.companyMax;
    if (!formData.service.trim()) next.service = contact.errors.service;
    if (!formData.budget.trim()) next.budget = contact.errors.budget;
    if (!formData.message.trim() || formData.message.trim().length < 20) next.message = contact.errors.messageMin;
    else if (formData.message.trim().length > 2000) next.message = contact.errors.messageMax;

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    setErrors({});
    setServerError("");
    setSubmitting(true);

    try {
      await submitContactForm({ data: formData });
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
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">{contact.eyebrow}</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-black tracking-tight md:text-6xl">
              {contact.heroTitlePrefix}<span className="text-brand">{contact.heroTitleHighlight}</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              {contact.heroBody}
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-[1.4fr_0.6fr]">
          <form noValidate onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-8 md:p-10">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="text-sm font-bold">{contact.form.name}</label>
                <input id="name" name="name" maxLength={100} className={fieldClass} placeholder={contact.form.namePlaceholder} />
                {errors.name && <p className="mt-2 text-xs font-semibold text-destructive">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-bold">{contact.form.email}</label>
                <input id="email" name="email" type="email" maxLength={255} className={fieldClass} placeholder={contact.form.emailPlaceholder} />
                {errors.email && <p className="mt-2 text-xs font-semibold text-destructive">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="company" className="text-sm font-bold">{contact.form.company} <span className="font-normal text-muted-foreground">{contact.form.optional}</span></label>
                <input id="company" name="company" maxLength={120} className={fieldClass} placeholder={contact.form.companyPlaceholder} />
                {errors.company && <p className="mt-2 text-xs font-semibold text-destructive">{errors.company}</p>}
              </div>
              <div>
                <label htmlFor="budget" className="text-sm font-bold">{contact.form.budget}</label>
                <select id="budget" name="budget" defaultValue="" className={fieldClass}>
                  <option value="" disabled>{contact.form.selectRange}</option>
                  {contact.budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                {errors.budget && <p className="mt-2 text-xs font-semibold text-destructive">{errors.budget}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="service" className="text-sm font-bold">{contact.form.service}</label>
                <select id="service" name="service" defaultValue="" className={fieldClass}>
                  <option value="" disabled>{contact.form.selectService}</option>
                  {services.map((s) => <option key={s.slug} value={s.title}>{s.title}</option>)}
                  <option value="Multiple / not sure">{contact.form.multipleService}</option>
                </select>
                {errors.service && <p className="mt-2 text-xs font-semibold text-destructive">{errors.service}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="text-sm font-bold">{contact.form.message}</label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  maxLength={2000}
                  className={fieldClass}
                  placeholder={contact.form.messagePlaceholder}
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
              {submitting ? contact.form.sending : contact.form.submit} <ArrowUpRight className="h-4 w-4" />
            </button>
            <p className="mt-4 text-xs text-muted-foreground">
              {contact.form.agreementPrefix} <Link to="/privacy" className="underline hover:text-brand">{contact.form.agreementLink}</Link>{contact.form.agreementSuffix}
            </p>
          </form>

          <aside className="space-y-8">
            <div className="rounded-2xl border border-border p-7">
              <Mail className="h-6 w-6 text-brand" />
              <h2 className="mt-4 font-bold">{contact.aside.emailTitle}</h2>
              <a href="mailto:hello@mariostudio.com" className="mt-1 block text-sm text-muted-foreground hover:text-brand">
                hello@mariostudio.com
              </a>
            </div>
            <div className="rounded-2xl border border-border p-7">
              <Clock className="h-6 w-6 text-brand" />
              <h2 className="mt-4 font-bold">{contact.aside.responseTitle}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{contact.aside.responseBody}</p>
            </div>
            <div className="rounded-2xl border border-border p-7">
              <Phone className="h-6 w-6 text-brand" />
              <h2 className="mt-4 font-bold">Call us</h2>
              <div className="mt-1 space-y-1">
                <a href="tel:+237696262000" className="block text-sm text-muted-foreground hover:text-brand">+237 696 262 000</a>
                <a href="tel:+237683693011" className="block text-sm text-muted-foreground hover:text-brand">+237 683 693 011</a>
              </div>
            </div>
            <div className="rounded-2xl border border-border p-7">
              <Globe className="h-6 w-6 text-brand" />
              <h2 className="mt-4 font-bold">{contact.aside.whereTitle}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{contact.aside.whereBody}</p>
            </div>
          </aside>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
