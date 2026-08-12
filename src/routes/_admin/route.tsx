import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_admin")({
  beforeLoad: async ({ location }) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw redirect({
        to: "/auth/login",
        search: {
          redirect: location.href,
        },
      });
    }

    // Check for admin/editor role
    const { data: hasRole } = await supabase.rpc("has_role", {
      _user_id: session.user.id,
      _role: "admin",
    });

    const { data: hasEditorRole } = await supabase.rpc("has_role", {
      _user_id: session.user.id,
      _role: "editor",
    });

    if (!hasRole && !hasEditorRole) {
      // The very first signed-in user automatically becomes admin
      const { data: claimed } = await supabase.rpc("claim_first_admin");

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
  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-background border-r border-border p-6 hidden md:block">
          <div className="flex items-center gap-2 mb-10">
            <div className="h-8 w-8 bg-brand rounded-lg" />
            <span className="font-black tracking-tight">MARIO CMS</span>
          </div>
          
          <nav className="space-y-1">
            <AdminNavLink to="/admin" label="Dashboard" />
            <AdminNavLink to="/admin/services" label="Services" />
            <AdminNavLink to="/admin/analytics" label="Analytics" />
            <AdminNavLink to="/admin/leads" label="Leads & Inquiries" />
            <AdminNavLink to="/admin/blog" label="Blog Posts" />
            <AdminNavLink to="/admin/work" label="Case Studies" />
            <AdminNavLink to="/admin/roles" label="Roles & Permissions" />
            <AdminNavLink to="/admin/signup" label="Add New Admin" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function AdminNavLink({ to, label }: { to: string; label: string }) {
  return (
    <a
      href={to}
      className="block px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
    >
      {label}
    </a>
  );
}
