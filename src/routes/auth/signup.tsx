import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { claimFirstAdmin } from "@/lib/admin-bootstrap.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/auth/signup")({
  component: SignupPage,
  head: () => ({
    meta: [
      { title: "Create your account | Mario Studio CMS" },
      { name: "description", content: "Create an account to manage Mario Studio content, services, case studies and leads." },
      { property: "og:title", content: "Create your account | Mario Studio CMS" },
      { property: "og:description", content: "Create an account to manage Mario Studio content, services, case studies and leads." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function SignupPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + "/auth/callback" },
      });

      if (error) {
        toast.error(error.message);
      } else if (data.session) {
        const { claimed } = await claimFirstAdmin();
        toast.success(claimed ? t.auth.accountCreatedAdmin : t.auth.accountCreated);
        router.navigate({ to: "/admin" });
      } else {
        setSent(true);
        toast.success(t.auth.confirmEmail);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.auth.networkError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-black tracking-tight">{t.auth.signupTitle}</CardTitle>
          <CardDescription>{t.auth.signupDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <p className="text-sm text-muted-foreground text-center">
              {t.auth.confirmEmailSent} <strong>{email}</strong>. {t.auth.confirmEmailClick}
            </p>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t.auth.email}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t.auth.password}</Label>
                <Input id="password" type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full bg-brand text-brand-foreground font-bold" disabled={loading}>
                {loading ? t.auth.creatingAccount : t.auth.createAccount}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 text-sm text-muted-foreground">
          <p>
            {t.auth.haveAccount} <Link to="/auth/login" className="text-brand font-bold hover:underline">{t.auth.signInLink}</Link>
          </p>
          <Link to="/" className="hover:text-brand transition-colors text-xs uppercase tracking-widest font-bold">{t.auth.backToHome}</Link>
        </CardFooter>
      </Card>
    </div>
  );
}
