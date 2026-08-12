import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        // First account to sign in becomes the admin
        void supabase.rpc("claim_first_admin").then(() => {
          const searchParams = new URLSearchParams(window.location.search);
          const next = searchParams.get("next") || "/admin";
          router.navigate({ to: next });
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand mx-auto mb-4" />
        <p className="text-muted-foreground font-medium">Finalizing authentication...</p>
      </div>
    </div>
  );
}
