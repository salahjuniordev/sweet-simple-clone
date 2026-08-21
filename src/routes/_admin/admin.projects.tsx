import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Eye, Briefcase, X } from "lucide-react";
import { getProjectRequests, updateProjectRequestStatus } from "@/lib/project-requests.functions";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_admin/admin/projects")({
  component: AdminProjects,
});

const STATUS_OPTIONS = [
  "new", "reviewing", "qualified", "proposal_sent",
  "negotiation", "won", "in_progress", "completed", "lost",
];

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 border-blue-200",
  reviewing: "bg-yellow-100 text-yellow-800 border-yellow-200",
  qualified: "bg-purple-100 text-purple-800 border-purple-200",
  proposal_sent: "bg-indigo-100 text-indigo-800 border-indigo-200",
  negotiation: "bg-orange-100 text-orange-800 border-orange-200",
  won: "bg-green-100 text-green-800 border-green-200",
  in_progress: "bg-emerald-100 text-emerald-800 border-emerald-200",
  completed: "bg-gray-100 text-gray-800 border-gray-200",
  lost: "bg-red-100 text-red-800 border-red-200",
};

const STATUS_I18N: Record<string, string> = {
  new: "statusNew",
  reviewing: "statusReviewing",
  qualified: "statusQualified",
  proposal_sent: "statusProposalSent",
  negotiation: "statusNegotiation",
  won: "statusWon",
  in_progress: "statusInProgress",
  completed: "statusCompleted",
  lost: "statusLost",
};

function AdminProjects() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const proj = t.admin.projects;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: requests, isLoading } = useQuery({
    queryKey: ["project-requests"],
    queryFn: () => getProjectRequests(),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateProjectRequestStatus({ data: { id, status } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["project-requests"] }),
  });

  const filtered = useMemo(() => {
    if (!requests) return [];
    let result = [...(requests as any[])];

    if (statusFilter !== "all") {
      result = result.filter((r: any) => r.status === statusFilter);
    }

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (r: any) =>
          r.name?.toLowerCase().includes(s) ||
          r.email?.toLowerCase().includes(s) ||
          r.company?.toLowerCase().includes(s) ||
          r.reference?.toLowerCase().includes(s)
      );
    }

    return result;
  }, [requests, search, statusFilter]);

  const statusCounts = useMemo(() => {
    if (!requests) return {};
    const counts: Record<string, number> = {};
    for (const r of requests as any[]) {
      counts[r.status] = (counts[r.status] || 0) + 1;
    }
    return counts;
  }, [requests]);

  const getStatusLabel = (status: string) => {
    const key = STATUS_I18N[status];
    return key ? (proj as any)[key] : status;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">{proj.title}</h1>
        <p className="text-muted-foreground mt-2">{proj.subtitle}</p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={statusFilter === "all" ? "default" : "secondary"}
          onClick={() => setStatusFilter("all")}
        >
          {proj.allStatuses} ({(requests as any[])?.length || 0})
        </Button>
        {STATUS_OPTIONS.map((s) => (
          <Button
            key={s}
            size="sm"
            variant={statusFilter === s ? "default" : "secondary"}
            onClick={() => setStatusFilter(s)}
          >
            {getStatusLabel(s)} ({statusCounts[s] || 0})
          </Button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={proj.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold">{proj.noProjects}</p>
          <p className="text-sm mt-1">
            {search || statusFilter !== "all"
              ? proj.noProjectsHint
              : proj.noProjectsEmpty}
          </p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{proj.tableReference}</TableHead>
                    <TableHead>{proj.tableClient}</TableHead>
                    <TableHead className="hidden md:table-cell">{proj.tableServices}</TableHead>
                    <TableHead className="hidden lg:table-cell">{proj.tableBudget}</TableHead>
                    <TableHead>{proj.tableStatus}</TableHead>
                    <TableHead className="hidden lg:table-cell">{proj.tableDate}</TableHead>
                    <TableHead className="text-right">{proj.tableActions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((req: any) => (
                    <TableRow key={req.id}>
                      <TableCell>
                        <a
                          href={`/admin/projects/${req.reference}`}
                          className="font-mono font-bold text-primary hover:underline"
                        >
                          {req.reference}
                        </a>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{req.name}</p>
                          <p className="text-xs text-muted-foreground">{req.email}</p>
                          {req.company && (
                            <p className="text-xs text-muted-foreground">{req.company}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {(req.project_request_services || []).slice(0, 3).map((s: any) => (
                            <Badge key={s.id} variant="secondary" className="text-xs">
                              {s.service_slug}
                            </Badge>
                          ))}
                          {(req.project_request_services || []).length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{(req.project_request_services || []).length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-sm">{req.budget_range}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${STATUS_COLORS[req.status] || "bg-gray-100 text-gray-800"} border font-semibold text-xs`}
                        >
                          {getStatusLabel(req.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {new Date(req.created_at).toLocaleDateString("en-CA")}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <a
                          href={`/admin/projects/${req.reference}`}
                        >
                          <Button variant="secondary" size="sm" className="gap-1">
                            <Eye className="h-3.5 w-3.5" /> {proj.view}
                          </Button>
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
