import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { validateBootstrapToken, bootstrapAdminUser } from "@/lib/auth-bootstrap.functions";

export const Route = createFileRoute("/auth/bootstrap")({
  component: BootstrapPage,
});

function BootstrapPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"token" | "signup">("token");
  const [loading, setLoading] = useState(false);

  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await validateBootstrapToken({ data: { token } });
      if (result.success) {
        setStep("signup");
        toast.success("Token verified!");
      } else {
        toast.error(result.error || "Invalid token");
      }
    } catch (err) {
      toast.error("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupAndBootstrap = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Create the user account
      const { data: authData, error: signupError } = await supabase.auth.signUp({ 
        email, 
        password 
      });

      if (signupError) {
        toast.error(signupError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        toast.error("Failed to create user account");
        setLoading(false);
        return;
      }

      // 2. Assign admin role using the bootstrap function
      const result = await bootstrapAdminUser({ 
        data: { 
          token, 
          userId: authData.user.id 
        } 
      });

      if (result.success) {
        toast.success("Admin account created successfully!");
        router.navigate({ to: "/auth/login" });
      } else {
        toast.error(result.error || "Failed to assign admin role");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-6 font-sans">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-black tracking-tight uppercase">
            System Bootstrap
          </CardTitle>
          <CardDescription>
            {step === "token" 
              ? "Enter your secure bootstrap token to proceed" 
              : "Create the initial administrator account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "token" ? (
            <form onSubmit={handleVerifyToken} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">Bootstrap Token</Label>
                <Input
                  id="token"
                  type="password"
                  placeholder="Enter secure token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                  className="rounded-xl"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-brand text-brand-foreground font-black py-6 text-lg hover:scale-[1.02] transition-transform" 
                disabled={loading}
              >
                {loading ? "VERIFYING..." : "CONTINUE"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignupAndBootstrap} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
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
              <Button 
                type="submit" 
                className="w-full bg-brand text-brand-foreground font-black py-6 text-lg hover:scale-[1.02] transition-transform" 
                disabled={loading}
              >
                {loading ? "CREATING..." : "CREATE ADMIN ACCOUNT"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground border-t pt-6">
          <p>
            Secure access only. This path is for initial setup.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
