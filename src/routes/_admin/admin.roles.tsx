import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Shield, Trash2, ShieldCheck, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export const Route = createFileRoute("/_admin/admin/roles")({
  component: AdminRoles,
});

function AdminRoles() {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("editor");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: userRoles, refetch } = useQuery({
    queryKey: ["admin-user-roles"],
    queryFn: async () => {
      // Joining with auth.users is tricky from client-side without a profiles table,
      // so we'll just show the raw roles for now.
      const { data, error } = await supabase
        .from("user_roles")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  const handleUpdateRole = async () => {
    if (!userId) {
      toast.error("Please enter a User ID");
      return;
    }

    const { error } = await supabase
      .from("user_roles")
      .upsert({ 
        user_id: userId, 
        role: role as any 
      }, { 
        onConflict: 'user_id,role' 
      });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("User role updated successfully");
      setIsDialogOpen(false);
      setUserId("");
      refetch();
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (!confirm("Are you sure you want to remove this role?")) return;
    
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("id", id);
      
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Role removed");
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Roles & Permissions</h1>
          <p className="text-muted-foreground mt-1">Control who can manage your studio content.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand text-brand-foreground font-bold gap-2">
              <UserPlus className="h-4 w-4" /> Add User Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Role to User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">User ID (UUID)</label>
                <Input 
                  placeholder="Paste Supabase User ID here" 
                  value={userId} 
                  onChange={e => setUserId(e.target.value)} 
                />
                <p className="text-xs text-muted-foreground">You can find User IDs in your Lovable Cloud user list.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin (Full Access)</SelectItem>
                    <SelectItem value="editor">Editor (Can edit content)</SelectItem>
                    <SelectItem value="user">User (Read-only access)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleUpdateRole} className="w-full bg-brand text-brand-foreground font-bold">
                Assign Role
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userRoles?.map((ur) => (
              <TableRow key={ur.id}>
                <TableCell className="font-mono text-xs">{ur.user_id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {ur.role === 'admin' ? (
                      <ShieldCheck className="h-4 w-4 text-brand" />
                    ) : (
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="capitalize font-semibold">{ur.role}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive" 
                    onClick={() => handleDeleteRole(ur.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {userRoles?.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  No roles assigned yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="bg-secondary/20 p-6 rounded-xl border border-border">
        <h3 className="text-sm font-bold flex items-center gap-2 mb-2">
          <ShieldAlert className="h-4 w-4 text-brand" />
          Permission Levels
        </h3>
        <ul className="text-xs space-y-2 text-muted-foreground">
          <li><span className="font-bold text-foreground">Admin:</span> Full control over all content, services, blog, work, and user roles.</li>
          <li><span className="font-bold text-foreground">Editor:</span> Can create, edit, and delete blog posts, services, and case studies. Cannot manage user roles.</li>
          <li><span className="font-bold text-foreground">User:</span> Basic authenticated access, typically for internal team members to view drafts (if implemented).</li>
        </ul>
      </div>
    </div>
  );
}