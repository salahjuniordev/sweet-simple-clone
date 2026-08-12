import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_admin/admin")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [services, posts, caseStudies, leads] = await Promise.all([
        supabase.from("cms_services").select("id", { count: "exact" }),
        supabase.from("cms_posts").select("id", { count: "exact" }),
        supabase.from("cms_case_studies").select("id", { count: "exact" }),
        supabase.from("lead_submissions").select("id", { count: "exact" }),
      ]);
      return {
        services: services.count || 0,
        posts: posts.count || 0,
        caseStudies: caseStudies.count || 0,
        leads: leads.count || 0,
      };
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to your studio control center.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <StatsCard title="Services" value={stats?.services || 0} link="/admin/services" />
        <StatsCard title="Inquiries" value={stats?.leads || 0} link="/admin/leads" />
        <StatsCard title="Blog Posts" value={stats?.posts || 0} link="/admin/blog" />
        <StatsCard title="Case Studies" value={stats?.caseStudies || 0} link="/admin/work" />
      </div>
    </div>
  );
}

function StatsCard({ title, value, link }: { title: string; value: number; link: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <Link to={link} className="text-xs text-brand font-semibold hover:underline mt-2 inline-block">Manage {title.toLowerCase()}</Link>
      </CardContent>
    </Card>
  );
}
