import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, ChevronDown, Eye, Briefcase, Clock } from "lucide-react";
import { getProjectRequests, updateProjectRequestStatus } from "@/lib/project-requests.functions";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_admin/admin/projects")({
  component: AdminProjects,
});

const STATUS_OPTIONS = [
  "new",
  "reviewing",
  "qualified",
  "proposal_sent",
  "negotiation",
  "won",
  "in_progress",
  "completed",
  "lost",
];

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  reviewing: "bg-yellow-100 text-yellow-800",
  qualified: "bg-purple-100 text-purple-800",
  proposal_sent: "bg-indigo-100 text-indigo-800",
  negotiation: "bg-orange-100 text-orange-800",
  won: "bg-green-100 text-green-800",
  in_progress: "bg-emerald-100 text-emerald-800",
  completed: "bg-gray-100 text-gray-800",
  lost: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  reviewing: "Reviewing",
  qualified: "Qualified",
  proposal_sent: "Proposal Sent",
  negotiation: "Negotiation",
  won: "Won",
  in_progress: "In Progress",
  completed: "Completed",
  lost: "Lost",
};

function AdminProjects() {
  const { t } = useI18n();
  const queryClient = useQueryClient();

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight">Project Requests</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {filtered.length} request{filtered.length !== 1 ? "s" : ""}
          {statusFilter !== "all" && ` · ${STATUS_LABELS[statusFilter]}`}
        </p>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            statusFilter === "all"
              ? "bg-brand text-brand-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          All ({(requests as any[])?.length || 0})
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              statusFilter === s
                ? "bg-brand text-brand-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {STATUS_LABELS[s]} ({statusCounts[s] || 0})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by client, company, email, or reference..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold">No project requests found</p>
          <p className="text-sm mt-1">
            {search || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Project requests will appear here once submitted"}
          </p>
        </div>
      ) : (
        <div className="bg-background border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Reference</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Client</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Services</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Budget</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Date</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((req: any) => (
                  <tr
                    key={req.id}
                    className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <a
                        href={`/admin/projects/${req.reference}`}
                        className="font-mono font-bold text-brand hover:underline"
                      >
                        {req.reference}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold">{req.name}</p>
                        <p className="text-xs text-muted-foreground">{req.email}</p>
                        {req.company && (
                          <p className="text-xs text-muted-foreground">{req.company}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(req.project_request_services || []).slice(0, 3).map((s: any) => (
                          <span
                            key={s.id}
                            className="inline-block px-2 py-0.5 rounded-full bg-brand-soft text-brand text-xs font-medium"
                          >
                            {s.service_slug}
                          </span>
                        ))}
                        {(req.project_request_services || []).length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{(req.project_request_services || []).length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm">{req.budget_range}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <select
                          value={req.status}
                          onChange={(e) =>
                            statusMutation.mutate({ id: req.id, status: e.target.value })
                          }
                          className={`appearance-none px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer border-0 focus:outline-none focus:ring-2 focus:ring-brand/20 ${
                            STATUS_COLORS[req.status] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABELS[s]}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none opacity-50" />
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-muted-foreground">
                        {new Date(req.created_at).toLocaleDateString("en-CA")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={`/admin/projects/${req.reference}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary hover:bg-secondary/80 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
