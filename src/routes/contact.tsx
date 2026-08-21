import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";

import { Mail, Clock, Globe, Phone, ArrowUpRight } from "lucide-react";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z"/>
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}
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
            <div className="rounded-2xl border border-border p-7">
              <h2 className="font-bold">Follow us</h2>
              <p className="mt-1 text-sm text-muted-foreground">Stay connected on social media</p>
              <div className="mt-4 flex gap-2.5">
                {([
                  { href: "https://www.facebook.com", label: "Facebook", Icon: FacebookIcon, color: "hover:text-[#1877F2]" },
                  { href: "https://www.instagram.com", label: "Instagram", Icon: InstagramIcon, color: "hover:text-[#E4405F]" },
                  { href: "https://www.tiktok.com", label: "TikTok", Icon: TikTokIcon, color: "hover:text-[#000000]" },
                  { href: "https://www.linkedin.com", label: "LinkedIn", Icon: LinkedInIcon, color: "hover:text-[#0A66C2]" },
                ] as const).map(({ href, label, Icon, color }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/50 text-muted-foreground transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 hover:border-transparent hover:shadow-lg ${color}`}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
