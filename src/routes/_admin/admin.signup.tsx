import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/admin/signup")({
  component: SignupPage,
});

function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: window.location.origin + "/auth/callback",
      }
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Check your email to confirm your account!");
      router.navigate({ to: "/auth/login" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-6 font-sans">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-black tracking-tight uppercase">Join Mario Studio</CardTitle>
          <CardDescription>Create your account to start managing content</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@mariostudio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-xl"
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
                className="rounded-xl"
              />
            </div>
            <Button type="submit" className="w-full bg-brand text-brand-foreground font-black py-6 text-lg hover:scale-[1.02] transition-transform" disabled={loading}>
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-sm text-muted-foreground border-t pt-6">
          <p>
            Already have an account?{" "}
            <Link to="/auth/login" className="text-brand font-bold hover:underline">Sign in</Link>
          </p>
          <Link to="/" className="hover:text-brand transition-colors text-xs uppercase tracking-widest font-bold">Back to home</Link>
        </CardFooter>
      </Card>
    </div>
  );
}
