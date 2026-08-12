import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/admin/work")({
  component: AdminWork,
});

function AdminWork() {
  const { data: projects, refetch } = useQuery({
    queryKey: ["admin-work"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cms_case_studies").select("*").order("year", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case study?")) return;
    const { error } = await supabase.from("cms_case_studies").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Project deleted");
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Case Studies</h1>
          <p className="text-muted-foreground mt-1">Manage your portfolio projects.</p>
        </div>
        <Button className="bg-brand text-brand-foreground font-bold gap-2">
          <Plus className="h-4 w-4" /> Add Project
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects?.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-bold">{p.title}</TableCell>
                <TableCell>{p.client}</TableCell>
                <TableCell>{p.year}</TableCell>
                <TableCell>
                  <span className="bg-secondary px-2 py-1 rounded text-xs font-semibold">
                    {p.industry}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {projects?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No projects found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}