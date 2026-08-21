import { createFileRoute, Link, Outlet, redirect, useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { claimFirstAdmin } from "@/lib/admin-bootstrap.functions";
import { LanguageToggle } from "@/components/language-toggle";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const Route = createFileRoute("/_admin")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw redirect({
        to: "/auth/login",
        search: {
          redirect: location.href,
        },
      });
    }

    // Check for admin/editor role
    const { data: hasRole } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    const { data: hasEditorRole } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "editor",
    });

    if (!hasRole && !hasEditorRole) {
      // The very first signed-in user automatically becomes admin
      const { claimed } = await claimFirstAdmin();

      if (!claimed) {
        throw redirect({
          to: "/",
        });
      }
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { t } = useI18n();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.navigate({ to: "/auth/login" });
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-background border-r border-border p-6 hidden md:flex md:flex-col">
          <div className="flex items-center gap-2 mb-10">
            <div className="h-8 w-8 bg-brand rounded-lg" />
            <span className="font-black tracking-tight">{t.admin.brand}</span>
          </div>
          
          <nav className="space-y-1 flex-1">
            <AdminNavLink to="/admin" label={t.admin.nav.dashboard} />
            <AdminNavLink to="/admin/services" label={t.admin.nav.services} />
            <AdminNavLink to="/admin/analytics" label={t.admin.nav.analytics} />
            <AdminNavLink to="/admin/projects" label={t.admin.nav.projects || "Projects"} />
            <AdminNavLink to="/admin/questions" label={t.admin.nav.questions || "Questions"} />
            <AdminNavLink to="/admin/leads" label={t.admin.nav.leads} />
            <AdminNavLink to="/admin/blog" label={t.admin.nav.blog} />
            <AdminNavLink to="/admin/work" label={t.admin.nav.work} />
            <AdminNavLink to="/admin/roles" label={t.admin.nav.roles} />
            <AdminNavLink to="/admin/signup" label={t.admin.nav.addAdmin} />
          </nav>

          <div className="space-y-3 pt-6 border-t border-border">
            <LanguageToggle className="w-full" />
            <Button variant="outline" className="w-full gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> {t.admin.logout}
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="flex md:hidden justify-end mb-6 gap-3">
            <LanguageToggle />
            <Button variant="outline" size="sm" className="gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> {t.admin.logout}
            </Button>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function AdminNavLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="block px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
    >
      {label}
    </Link>
  );
}
