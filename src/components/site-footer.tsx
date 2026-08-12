import { Link } from "@tanstack/react-router";
import { 
  ArrowUpRight,
  Send,
  Globe,
  Camera,
  MessageCircle,
  LucideIcon
} from "lucide-react";

import { services } from "@/lib/services-data";

// Fallbacks for missing icons
const Twitter = Globe;
const Instagram = Camera;
const Linkedin = Globe;
const Dribbble = Globe;

const socials = [
  { href: "https://www.linkedin.com", label: "LinkedIn", Icon: Linkedin },
  { href: "https://www.instagram.com", label: "Instagram", Icon: Instagram },
  { href: "https://twitter.com", label: "X / Twitter", Icon: Twitter },
  { href: "https://dribbble.com", label: "Dribbble", Icon: Dribbble },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-block transition-opacity hover:opacity-80">
              <img src="/logo.png" alt="Mario Studio" className="h-[90px] w-auto" />
            </Link>
            <p className="mt-5 max-w-xs text-sm text-muted-foreground">
              A full-service digital studio: identity, design, development, video and marketing —
              built by one team that stays after launch.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:border-brand hover:text-brand"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Services</h2>
            <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
              {services.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="transition-colors hover:text-brand"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/services" className="font-semibold transition-colors hover:text-brand">
                  All services
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Studio</h2>
            <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-brand">About</Link></li>
              <li><Link to="/work" className="hover:text-brand">Work</Link></li>
              <li><Link to="/pricing" className="hover:text-brand">Pricing</Link></li>
              <li><Link to="/blog" className="hover:text-brand">Blog</Link></li>
              <li><Link to="/faq" className="hover:text-brand">FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-brand">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Contact</h2>
            <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a href="mailto:hello@mariostudio.com" className="hover:text-brand">
                  hello@mariostudio.com
                </a>
              </li>
              <li>Remote — Europe, Africa &amp; North America</li>
              <li>Mon–Fri, 09:00–18:00 CET</li>
              <li><Link to="/privacy" className="hover:text-brand">Privacy policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand">Terms of service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-border pt-7 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Mario Studio. All rights reserved.</p>
          <p>Built in-house. No vendor lock-in.</p>
        </div>
      </div>
    </footer>
  );
}