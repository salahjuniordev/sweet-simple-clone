import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { claimFirstAdmin } from "@/lib/admin-bootstrap.functions";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/auth/login")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: LoginPage,
});

function LoginPage() {
  const { redirect } = Route.useSearch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        // First account to sign in becomes the admin
        const { claimed } = await claimFirstAdmin();
        if (claimed) toast.success("Signed in — you are now the admin");
        else toast.success("Signed in successfully");
        router.navigate({ to: redirect || "/" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Network error — please try again");
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleLogin = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/auth/callback",
    });
    if (result.error) toast.error(result.error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-black tracking-tight">Welcome back</CardTitle>
          <CardDescription>Enter your credentials to access the CMS</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@mariostudio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-brand text-brand-foreground font-bold" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full font-bold" onClick={handleGoogleLogin}>
            Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 text-sm text-muted-foreground">
          <p>
            No account yet? <Link to="/auth/signup" className="text-brand font-bold hover:underline">Create one</Link>
          </p>
          <Link to="/" className="hover:text-brand transition-colors text-xs uppercase tracking-widest font-bold">Back to home</Link>
        </CardFooter>

      </Card>
    </div>
  );
}
