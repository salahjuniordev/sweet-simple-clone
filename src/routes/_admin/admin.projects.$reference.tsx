import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
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

function ProjectRequestDetail() {
  const { reference } = Route.useLoaderData();
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const proj = t.admin.projects;
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

  const getStatusLabel = (status: string) => {
    const key = STATUS_I18N[status];
    return key ? (proj as any)[key] : status;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-black tracking-tight">{proj.projectNotFound}</h1>
        <Link to="/admin/projects" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> {proj.backToProjects}
        </Link>
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
      <Link
        to="/admin/projects"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> {proj.backToProjects}
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight">{req.reference}</h1>
            <Badge
              variant="outline"
              className={`${STATUS_COLORS[req.status] || "bg-gray-100 text-gray-800"} border font-bold text-xs`}
            >
              {getStatusLabel(req.status)}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">{req.name} · {req.email}</p>
          {req.company && <p className="text-sm text-muted-foreground">{req.company}</p>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {proj.created.replace("{date}", new Date(req.created_at).toLocaleDateString("en-CA"))}
          </span>
        </div>
      </div>

      {/* Status + Assignment Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{proj.status}</label>
              <Select
                value={req.status}
                onValueChange={(val) => statusMutation.mutate({ id: req.id, status: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{getStatusLabel(s)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{proj.assignedTo}</label>
              <Input
                placeholder={proj.assignedPlaceholder}
                defaultValue={req.assigned_to || ""}
                onBlur={(e) => {
                  const val = e.target.value.trim() || null;
                  if (val !== (req.assigned_to || null)) {
                    assignMutation.mutate({ id: req.id, assignedTo: val });
                  }
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column — Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                <Users className="h-4 w-4" /> {proj.clientInformation}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoItem label={proj.name} value={req.name} />
                <InfoItem label={proj.email} value={req.email} icon={<Mail className="h-3.5 w-3.5" />} />
                {req.phone && <InfoItem label={proj.phone} value={req.phone} icon={<Phone className="h-3.5 w-3.5" />} />}
                {req.company && <InfoItem label={proj.company} value={req.company} icon={<Building2 className="h-3.5 w-3.5" />} />}
                {req.country && <InfoItem label={proj.country} value={req.country} />}
                {req.city && <InfoItem label={proj.city} value={req.city} />}
                {req.website && <InfoItem label={proj.website} value={req.website} icon={<Globe className="h-3.5 w-3.5" />} />}
                {req.industry && <InfoItem label={proj.industry} value={req.industry} />}
                {req.social_media && <InfoItem label={proj.socialMedia} value={req.social_media} />}
              </div>
              {req.business_description && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{proj.businessDescription}</p>
                  <p className="mt-1 text-sm">{req.business_description}</p>
                </div>
              )}
              {req.target_audience && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{proj.targetAudience}</p>
                  <p className="mt-1 text-sm">{req.target_audience}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                <FileText className="h-4 w-4" /> {proj.projectDetails}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {req.project_name && <InfoItem label={proj.projectName} value={req.project_name} />}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{proj.description}</p>
                <p className="mt-1 text-sm whitespace-pre-wrap">{req.project_description}</p>
              </div>
              {req.project_goals && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{proj.goals}</p>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{req.project_goals}</p>
                </div>
              )}
              {req.success_criteria && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{proj.successCriteria}</p>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{req.success_criteria}</p>
                </div>
              )}
              {req.existing_assets && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{proj.existingAssets}</p>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{req.existing_assets}</p>
                </div>
              )}
              {req.competitors && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{proj.competitors}</p>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{req.competitors}</p>
                </div>
              )}
              {req.inspiration && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{proj.inspiration}</p>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{req.inspiration}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service-Specific Answers */}
          {Object.keys(serviceAnswers).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  <Briefcase className="h-4 w-4" /> {proj.serviceRequirements}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(serviceAnswers).map(([slug, answers]: [string, any]) => (
                  <div key={slug} className="p-4 bg-secondary/50 rounded-lg border border-border">
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
              </CardContent>
            </Card>
          )}

          {/* Files */}
          {req.files && req.files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  <FileText className="h-4 w-4" /> {proj.uploadedFiles}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
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
                      <Badge variant="secondary" className="text-xs">{file.serviceSlug}</Badge>
                    )}
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column — Sidebar */}
        <div className="space-y-6">
          {/* Budget & Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                <DollarSign className="h-4 w-4" /> {proj.budgetTimeline}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{proj.budget}</p>
                <p className="mt-1 text-lg font-bold">{req.budget_range}</p>
              </div>
              {req.desired_start && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{proj.desiredStart}</p>
                  <p className="mt-1 text-sm">{req.desired_start}</p>
                </div>
              )}
              {req.desired_deadline && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{proj.deadline}</p>
                  <p className="mt-1 text-sm">{req.desired_deadline}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                <Briefcase className="h-4 w-4" /> {proj.selectedServices}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {services.slice(0, showAllServices ? undefined : 5).map((s: any) => (
                <div key={s.id} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                  <span className="text-sm capitalize">{s.service_slug.replace(/-/g, " ")}</span>
                </div>
              ))}
              {services.length > 5 && !showAllServices && (
                <button
                  onClick={() => setShowAllServices(true)}
                  className="text-xs text-primary font-semibold hover:underline"
                >
                  {proj.moreServices.replace("{count}", String(services.length - 5))}
                </button>
              )}
            </CardContent>
          </Card>

          {/* Internal Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                <MessageSquare className="h-4 w-4" /> {proj.internalNotes}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {req.internal_notes && (
                <div className="text-sm whitespace-pre-wrap p-3 bg-secondary/50 rounded-lg border border-border max-h-60 overflow-y-auto">
                  {req.internal_notes}
                </div>
              )}
              <div className="flex gap-2">
                <Textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder={proj.addNotePlaceholder}
                  rows={2}
                  className="flex-1 resize-none"
                />
                <Button
                  size="icon"
                  onClick={() => {
                    if (noteText.trim()) {
                      noteMutation.mutate({ id: req.id, note: noteText.trim() });
                    }
                  }}
                  disabled={!noteText.trim() || noteMutation.isPending}
                  className="self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                <Clock className="h-4 w-4" /> {proj.activity}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {activity.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{proj.noActivity}</p>
                ) : (
                  activity.map((a: any) => (
                    <div key={a.id} className="flex gap-3 text-sm">
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* --- Helper Components --- */

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
