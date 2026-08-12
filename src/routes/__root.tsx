import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider, useI18n } from "@/lib/i18n";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 h-[500px] w-[500px] rounded-full bg-brand/10 blur-[120px]" />
      <div className="absolute bottom-1/4 -right-20 h-[500px] w-[500px] rounded-full bg-brand/5 blur-[120px]" />
      
      <div className="relative z-10 w-full max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block rounded-full bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand ring-1 ring-brand/20">
            Error 404
          </span>
          
          <h1 className="mt-8 text-8xl font-black tracking-tighter text-foreground sm:text-[12rem]">
            LOST<span className="text-brand">.</span>
          </h1>
          
          <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-4xl">
            You've ventured into the void.
          </h2>
          
          <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            The page you're looking for has either drifted into another dimension or never existed in this one.
          </p>
          
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/"
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-brand px-8 py-4 text-sm font-bold text-brand-foreground transition-all hover:scale-105 active:scale-95 sm:w-auto"
            >
              <Home className="h-4 w-4" />
              Back to Base
            </Link>
            <button
              onClick={() => window.history.back()}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background/50 px-8 py-4 text-sm font-bold text-foreground backdrop-blur-sm transition-all hover:bg-secondary sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-20 flex justify-center gap-8 border-t border-border/50 pt-10"
        >
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Studio</p>
            <Link to="/about" className="mt-1 block text-sm font-medium hover:text-brand transition-colors">About Us</Link>
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Support</p>
            <Link to="/faq" className="mt-1 block text-sm font-medium hover:text-brand transition-colors">Help Center</Link>
          </div>
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Contact</p>
            <Link to="/contact" className="mt-1 block text-sm font-medium hover:text-brand transition-colors">Get in Touch</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: (ctx) => {
    const isNotFound = ctx.matches.some(
      (m) =>
        m.routeId === "__root__" &&
        !ctx.matches.find((rm) => rm.routeId !== "__root__"),
    );

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          title: isNotFound
            ? "404 - Page Not Found | Mario Studio"
            : "Mario Studio — Digital Services, Brand Design & Web Development",
        },
        {
          name: "description",
          content: isNotFound
            ? "The page you are looking for has ventured into the void. Return to Mario Studio base."
            : "Mario Studio is a full-service digital partner building sharp brands and fast websites. Experts in web development, identity branding, UI/UX, and digital marketing.",
        },
        { name: "author", content: "Mario Studio" },
        {
          property: "og:title",
          content: isNotFound
            ? "404 - Page Not Found | Mario Studio"
            : "Mario Studio — Digital Services & Brand Design",
        },
        {
          property: "og:description",
          content: isNotFound
            ? "The page you are looking for has ventured into the void."
            : "Web development, identity branding, UI/UX, video editing, brand audit, maintenance, security and digital marketing under one studio.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@mariostudio" },
      ],
      links: [
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossOrigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap",
        },
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "manifest", href: "/site.webmanifest" },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <RootShellInner>{children}</RootShellInner>
    </I18nProvider>
  );
}

function RootShellInner({ children }: { children: ReactNode }) {
  const { lang } = useI18n();

  return (
    <html lang={lang}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster richColors position="top-center" />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
