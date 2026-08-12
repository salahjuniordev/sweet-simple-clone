import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Filter, Settings, X, Plus } from "lucide-react";
import { exportLeadsCsv, getNotificationSettings, updateNotificationSettings } from "@/lib/leads.functions";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { isWithinInterval, parseISO, startOfDay, endOfDay } from "date-fns";

export const Route = createFileRoute("/_admin/admin/analytics")({
  component: AdminAnalytics,
});

const COLORS = ["#c5ff33", "#000000", "#666666", "#999999", "#cccccc"];

function AdminAnalytics() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    service: "all",
    tier: "all",
    source: "all",
    startDate: "",
    endDate: ""
  });

  const { data: leads, isLoading } = useQuery({
    queryKey: ["admin-leads-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase.from("lead_submissions").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: settings } = useQuery({
    queryKey: ["notification-settings"],
    queryFn: () => getNotificationSettings()
  });

  const updateSettingsMutation = useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
      toast.success("Notification settings updated");
    }
  });

  const filteredLeads = useMemo(() => {
    if (!leads) return [];
    return leads.filter(lead => {
      const matchesService = filters.service === "all" || lead.service_slug === filters.service;
      const matchesTier = filters.tier === "all" || lead.tier === filters.tier;
      const matchesSource = filters.source === "all" || (lead as any).source === filters.source;
      
      let matchesDate = true;
      if (filters.startDate || filters.endDate) {
        const leadDate = parseISO(lead.created_at!);
        const start = filters.startDate ? startOfDay(parseISO(filters.startDate)) : new Date(0);
        const end = filters.endDate ? endOfDay(parseISO(filters.endDate)) : new Date();
        matchesDate = isWithinInterval(leadDate, { start, end });
      }

      return matchesService && matchesTier && matchesSource && matchesDate;
    });
  }, [leads, filters]);

  const handleExport = async () => {
    try {
      const { csv } = await exportLeadsCsv({
        data: {
          service: filters.service === "all" ? undefined : filters.service,
          tier: filters.tier === "all" ? undefined : filters.tier,
          source: filters.source === "all" ? undefined : filters.source,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined
        }
      });
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("hidden", "");
      a.setAttribute("href", url);
      a.setAttribute("download", `leads-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Leads exported to CSV");
    } catch (error) {
      toast.error("Failed to export leads");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  // Options for filters
  const services = Array.from(new Set(leads?.map(l => l.service_slug) || []));
  const tiers = Array.from(new Set(leads?.map(l => l.tier) || []));
  const sources = Array.from(new Set(leads?.map(l => (l as any).source || 'direct') || []));

  // Chart data
  const serviceData = filteredLeads.reduce((acc: any[], lead) => {
    const existing = acc.find(i => i.name === lead.service_slug);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: lead.service_slug, value: 1 });
    }
    return acc;
  }, []);

  const tierData = filteredLeads.reduce((acc: any[], lead) => {
    const existing = acc.find(i => i.name === lead.tier);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: lead.tier, value: 1 });
    }
    return acc;
  }, []);

  const sourceData = filteredLeads.reduce((acc: any[], lead) => {
    const source = (lead as any).source || 'direct';
    const existing = acc.find(i => i.name === source);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: source, value: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Lead Analytics</h1>
          <p className="text-muted-foreground mt-2">Visualize your studio's performance and inquiries.</p>
        </div>
        <div className="flex gap-2">
          <NotificationSettings settings={(settings as any)?.value} onSave={(v) => updateSettingsMutation.mutate({ data: v })} />
          <Button onClick={handleExport} className="bg-brand text-brand-foreground font-bold">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid gap-4 md:grid-cols-5">
          <div className="space-y-2">
            <Label>Service</Label>
            <Select value={filters.service} onValueChange={(v) => setFilters(f => ({ ...f, service: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {services.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tier</Label>
            <Select value={filters.tier} onValueChange={(v) => setFilters(f => ({ ...f, tier: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Tiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                {tiers.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Source</Label>
            <Select value={filters.source} onValueChange={(v) => setFilters(f => ({ ...f, source: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {sources.map(s => <SelectItem key={s} value={s as string}>{s as string}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input type="date" value={filters.startDate} onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input type="date" value={filters.endDate} onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value }))} />
          </div>
        </div>
        {(filters.service !== 'all' || filters.tier !== 'all' || filters.source !== 'all' || filters.startDate || filters.endDate) && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-4 text-xs h-8" 
            onClick={() => setFilters({ service: 'all', tier: 'all', source: 'all', startDate: '', endDate: '' })}
          >
            <X className="mr-2 h-3 w-3" /> Clear Filters
          </Button>
        )}
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Leads by Service</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="value" fill="#c5ff33" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Leads by Tier</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tierData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length] || "#c5ff33"} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Leads by Source</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <RechartsTooltip />
                <Bar dataKey="value" fill="#000000" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NotificationSettings({ settings, onSave }: { settings: any, onSave: (v: any) => void }) {
  const [local, setLocal] = useState(settings || {
    team_emails: ["hello@mariostudio.com"],
    auto_reply_enabled: true,
    team_notification_enabled: true
  });
  const [newEmail, setNewEmail] = useState("");

  const addEmail = () => {
    if (!newEmail || !newEmail.includes("@")) return;
    setLocal((prev: any) => ({ ...prev, team_emails: [...prev.team_emails, newEmail] }));
    setNewEmail("");
  };

  const removeEmail = (email: string) => {
    setLocal((prev: any) => ({ ...prev, team_emails: prev.team_emails.filter((e: string) => e !== email) }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><Settings className="mr-2 h-4 w-4" /> Notifications</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Notification Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="team-notify">Team Notifications</Label>
            <Switch 
              id="team-notify" 
              checked={local.team_notification_enabled} 
              onCheckedChange={(c) => setLocal((prev: any) => ({ ...prev, team_notification_enabled: c }))} 
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="auto-reply">Customer Auto-Reply</Label>
            <Switch 
              id="auto-reply" 
              checked={local.auto_reply_enabled} 
              onCheckedChange={(c) => setLocal((prev: any) => ({ ...prev, auto_reply_enabled: c }))} 
            />
          </div>
          <div className="space-y-3">
            <Label>Recipient Emails</Label>
            <div className="flex gap-2">
              <Input 
                placeholder="email@example.com" 
                value={newEmail} 
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addEmail()}
              />
              <Button size="icon" variant="secondary" onClick={addEmail}><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-2">
              {local.team_emails.map((email: string) => (
                <div key={email} className="flex items-center justify-between bg-secondary p-2 rounded-md text-xs">
                  {email}
                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => removeEmail(email)}><X className="h-3 w-3" /></Button>
                </div>
              ))}
            </div>
          </div>
          <Button className="w-full bg-brand text-brand-foreground font-bold" onClick={() => onSave(local)}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
