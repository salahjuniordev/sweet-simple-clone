import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft, DollarSign, Globe, Mail, Phone, Building2,
  Users, FileText, Clock, MessageSquare, Send, ChevronDown, ExternalLink, Briefcase,
} from "lucide-react";
import {
  getProjectRequest, updateProjectRequestStatus,
  assignProjectRequest, addProjectNote,
} from "@/lib/project-requests.functions";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_admin/admin/projects/$reference")({
  loader: async ({ params }) => {
    return { reference: params.reference };
  },
  component: ProjectRequestDetail,
});

const STATUS_OPTIONS = [
  "new", "reviewing", "qualified", "proposal_sent",
  "negotiation", "won", "in_progress", "completed", "lost",
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
  new: "New", reviewing: "Reviewing", qualified: "Qualified",
  proposal_sent: "Proposal Sent", negotiation: "Negotiation",
  won: "Won", in_progress: "In Progress", completed: "Completed", lost: "Lost",
};

function ProjectRequestDetail() {
  const { reference } = Route.useLoaderData();
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [noteText, setNoteText] = useState("");
  const [showAllServices, setShowAllServices] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ["project-request", reference],
    queryFn: () => getProjectRequest({ data: { reference } }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateProjectRequestStatus({ data: { id, status } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-request", reference] });
      queryClient.invalidateQueries({ queryKey: ["project-requests"] });
    },
  });

  const assignMutation = useMutation({
    mutationFn: ({ id, assignedTo }: { id: string; assignedTo: string | null }) =>
      assignProjectRequest({ data: { id, assignedTo } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-request", reference] });
      queryClient.invalidateQueries({ queryKey: ["project-requests"] });
    },
  });

  const noteMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      addProjectNote({ data: { id, note } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-request", reference] });
      setNoteText("");
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <a href="/admin/projects" className="mt-4 inline-flex items-center gap-2 text-brand hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </a>
      </div>
    );
  }

  const req = project as any;
  const services = req.project_request_services || [];
  const activity = (req.project_activity || []).sort(
    (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const serviceAnswers = req.service_answers || {};

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back link */}
      <a
        href="/admin/projects"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-brand transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> All project requests
      </a>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight">{req.reference}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[req.status] || "bg-gray-100 text-gray-800"}`}>
              {STATUS_LABELS[req.status] || req.status}
            </span>
          </div>
          <p className="text-muted-foreground mt-1">{req.name} · {req.email}</p>
          {req.company && <p className="text-sm text-muted-foreground">{req.company}</p>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Created {new Date(req.created_at).toLocaleDateString("en-CA")}
          </span>
        </div>
      </div>

      {/* Status + Assignment Bar */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-secondary/50 rounded-xl border border-border">
        <div className="flex-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</label>
          <div className="relative mt-1">
            <select
              value={req.status}
              onChange={(e) => statusMutation.mutate({ id: req.id, status: e.target.value })}
              className="w-full appearance-none px-3 py-2 bg-background border border-border rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand pr-8"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none opacity-50" />
          </div>
        </div>
        <div className="flex-1">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assigned To</label>
          <input
            type="text"
            placeholder="Team member email or name"
            defaultValue={req.assigned_to || ""}
            onBlur={(e) => {
              const val = e.target.value.trim() || null;
              if (val !== (req.assigned_to || null)) {
                assignMutation.mutate({ id: req.id, assignedTo: val });
              }
            }}
            className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column — Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Info */}
          <Section title="Client Information" icon={<Users className="h-4 w-4" />}>
            <InfoGrid>
              <InfoItem label="Name" value={req.name} />
              <InfoItem label="Email" value={req.email} icon={<Mail className="h-3.5 w-3.5" />} />
              {req.phone && <InfoItem label="Phone" value={req.phone} icon={<Phone className="h-3.5 w-3.5" />} />}
              {req.company && <InfoItem label="Company" value={req.company} icon={<Building2 className="h-3.5 w-3.5" />} />}
              {req.country && <InfoItem label="Country" value={req.country} />}
              {req.city && <InfoItem label="City" value={req.city} />}
              {req.website && (
                <InfoItem label="Website" value={req.website} icon={<Globe className="h-3.5 w-3.5" />} />
              )}
              {req.industry && <InfoItem label="Industry" value={req.industry} />}
              {req.social_media && <InfoItem label="Social Media" value={req.social_media} />}
            </InfoGrid>
            {req.business_description && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Business Description</p>
                <p className="mt-1 text-sm">{req.business_description}</p>
              </div>
            )}
            {req.target_audience && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Target Audience</p>
                <p className="mt-1 text-sm">{req.target_audience}</p>
              </div>
            )}
          </Section>

          {/* Project Info */}
          <Section title="Project Details" icon={<FileText className="h-4 w-4" />}>
            {req.project_name && (
              <InfoItem label="Project Name" value={req.project_name} />
            )}
            <div className="mt-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</p>
              <p className="mt-1 text-sm whitespace-pre-wrap">{req.project_description}</p>
            </div>
            {req.project_goals && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Goals</p>
                <p className="mt-1 text-sm whitespace-pre-wrap">{req.project_goals}</p>
              </div>
            )}
            {req.success_criteria && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Success Criteria</p>
                <p className="mt-1 text-sm whitespace-pre-wrap">{req.success_criteria}</p>
              </div>
            )}
            {req.existing_assets && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Existing Assets</p>
                <p className="mt-1 text-sm whitespace-pre-wrap">{req.existing_assets}</p>
              </div>
            )}
            {req.competitors && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Competitors</p>
                <p className="mt-1 text-sm whitespace-pre-wrap">{req.competitors}</p>
              </div>
            )}
            {req.inspiration && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Inspiration</p>
                <p className="mt-1 text-sm whitespace-pre-wrap">{req.inspiration}</p>
              </div>
            )}
          </Section>

          {/* Service-Specific Answers */}
          {Object.keys(serviceAnswers).length > 0 && (
            <Section title="Service-Specific Requirements" icon={<Briefcase className="h-4 w-4" />}>
              <div className="space-y-4">
                {Object.entries(serviceAnswers).map(([slug, answers]: [string, any]) => (
                  <div key={slug} className="p-3 bg-secondary/50 rounded-lg border border-border">
                    <h4 className="font-bold text-sm capitalize mb-2">
                      {slug.replace(/-/g, " ")}
                    </h4>
                    {typeof answers === "object" && answers !== null ? (
                      <div className="space-y-2">
                        {Object.entries(answers).map(([key, val]) => (
                          <div key={key}>
                            <p className="text-xs font-semibold text-muted-foreground capitalize">
                              {key.replace(/_/g, " ")}
                            </p>
                            <p className="text-sm">
                              {Array.isArray(val) ? val.join(", ") : String(val)}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm">{String(answers)}</p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Files */}
          {req.files && req.files.length > 0 && (
            <Section title="Uploaded Files" icon={<FileText className="h-4 w-4" />}>
              <div className="space-y-2">
                {req.files.map((file: any, i: number) => (
                  <a
                    key={i}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors text-sm"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 truncate">{file.name}</span>
                    {file.serviceSlug && (
                      <span className="text-xs text-muted-foreground">{file.serviceSlug}</span>
                    )}
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Right Column — Sidebar */}
        <div className="space-y-6">
          {/* Budget & Timeline */}
          <Section title="Budget & Timeline" icon={<DollarSign className="h-4 w-4" />}>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Budget</p>
                <p className="mt-1 text-lg font-bold">{req.budget_range}</p>
              </div>
              {req.desired_start && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Desired Start</p>
                  <p className="mt-1 text-sm">{req.desired_start}</p>
                </div>
              )}
              {req.desired_deadline && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Deadline</p>
                  <p className="mt-1 text-sm">{req.desired_deadline}</p>
                </div>
              )}
            </div>
          </Section>

          {/* Services */}
          <Section title="Selected Services" icon={<Briefcase className="h-4 w-4" />}>
            <div className="space-y-2">
              {services.slice(0, showAllServices ? undefined : 5).map((s: any) => (
                <div key={s.id} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand" />
                  <span className="text-sm capitalize">{s.service_slug.replace(/-/g, " ")}</span>
                </div>
              ))}
              {services.length > 5 && !showAllServices && (
                <button
                  onClick={() => setShowAllServices(true)}
                  className="text-xs text-brand font-semibold hover:underline"
                >
                  +{services.length - 5} more
                </button>
              )}
            </div>
          </Section>

          {/* Internal Notes */}
          <Section title="Internal Notes" icon={<MessageSquare className="h-4 w-4" />}>
            {req.internal_notes && (
              <div className="text-sm whitespace-pre-wrap mb-4 p-3 bg-secondary/50 rounded-lg border border-border max-h-60 overflow-y-auto">
                {req.internal_notes}
              </div>
            )}
            <div className="flex gap-2">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note..."
                rows={2}
                className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
              />
              <button
                onClick={() => {
                  if (noteText.trim()) {
                    noteMutation.mutate({ id: req.id, note: noteText.trim() });
                  }
                }}
                disabled={!noteText.trim() || noteMutation.isPending}
                className="px-3 py-2 bg-brand text-brand-foreground rounded-lg text-sm font-semibold hover:bg-brand/90 transition-colors disabled:opacity-50 self-end"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </Section>

          {/* Activity Log */}
          <Section title="Activity" icon={<Clock className="h-4 w-4" />}>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {activity.length === 0 ? (
                <p className="text-sm text-muted-foreground">No activity yet</p>
              ) : (
                activity.map((a: any) => (
                  <div key={a.id} className="flex gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-brand mt-1.5 shrink-0" />
                    <div>
                      <p className="font-semibold capitalize">{a.action.replace(/_/g, " ")}</p>
                      {a.details && <p className="text-muted-foreground text-xs">{a.details}</p>}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {a.actor} · {new Date(a.created_at).toLocaleString("en-CA")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

/* --- Helper Components --- */

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-background border border-border rounded-xl p-5">
      <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
}

function InfoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

function InfoItem({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
        {icon} {label}
      </p>
      <p className="mt-0.5 text-sm">{value}</p>
    </div>
  );
}
