import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

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
        const { data: claimed } = await supabase.rpc("claim_first_admin");
        toast.success(claimed ? "Account created — you are now the admin" : "Account created");
        router.navigate({ to: "/admin" });
      } else {
        setSent(true);
        toast.success("Check your email to confirm your account");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Network error — please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-black tracking-tight">Create your account</CardTitle>
          <CardDescription>The first account to sign in becomes the admin</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <p className="text-sm text-muted-foreground text-center">
              We sent a confirmation link to <strong>{email}</strong>. Click it, then sign in.
            </p>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full bg-brand text-brand-foreground font-bold" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 text-sm text-muted-foreground">
          <p>
            Already have an account? <Link to="/auth/login" className="text-brand font-bold hover:underline">Sign in</Link>
          </p>
          <Link to="/" className="hover:text-brand transition-colors text-xs uppercase tracking-widest font-bold">Back to home</Link>
        </CardFooter>
      </Card>
    </div>
  );
}
