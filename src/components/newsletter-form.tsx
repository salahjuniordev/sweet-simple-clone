import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowUpRight } from "lucide-react";

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
});

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }
    setError(null);
    setDone(true);
    setEmail("");
    toast.success("You're subscribed — check your inbox to confirm.");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full">
      <label htmlFor="newsletter-email" className="text-sm font-semibold">
        Email address
      </label>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          id="newsletter-email"
          type="email"
          value={email}
          maxLength={255}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          aria-invalid={Boolean(error)}
          className="w-full rounded-full border border-border bg-background px-5 py-3.5 text-sm outline-none focus:border-brand"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand px-7 py-3.5 text-sm font-bold text-brand-foreground transition-transform hover:-translate-y-0.5"
        >
          Subscribe <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      {done && !error && (
        <p className="mt-2 text-sm text-brand">Thanks — you're on the list.</p>
      )}
    </form>
  );
}
