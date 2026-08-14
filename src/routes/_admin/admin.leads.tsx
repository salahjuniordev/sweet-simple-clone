import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Clock, Trash2, Mail, Filter, Eye, X } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_admin/admin/leads")({
  component: AdminLeads,
});

function AdminLeads() {
  const { t } = useI18n();
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const { data: leads, refetch } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: services } = useQuery({
    queryKey: ["admin-services-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cms_services")
        .select("slug, title")
        .order("title", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const filteredLeads = leads?.filter((lead) => {
    const matchesService = serviceFilter === "all" || lead.service_slug === serviceFilter;
    const matchesTier = tierFilter === "all" || lead.tier.toLowerCase() === tierFilter.toLowerCase();
    return matchesService && matchesTier;
  });

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("lead_submissions")
      .update({ status })
      .eq("id", id);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t.admin.leads.toastStatusUpdated.replace("{status}", status));
      refetch();
      if (selectedLead?.id === id) {
        setSelectedLead({ ...selectedLead, status });
      }
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm(t.admin.leads.confirmDelete)) return;
    const { error } = await supabase.from("lead_submissions").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t.admin.leads.toastDeleted);
      setSelectedLead(null);
      refetch();
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'new': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'contacted': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">{t.admin.leads.title}</h1>
          <p className="text-muted-foreground mt-1">{t.admin.leads.subtitle}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder={t.admin.leads.filterByService} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.admin.leads.allServices}</SelectItem>
                {services?.map((s) => (
                  <SelectItem key={s.slug} value={s.slug}>{s.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="w-[150px] bg-background">
              <SelectValue placeholder={t.admin.leads.filterByTier} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.admin.leads.allTiers}</SelectItem>
              <SelectItem value="basic">{t.admin.leads.tierBasic}</SelectItem>
              <SelectItem value="starter">{t.admin.leads.tierStarter}</SelectItem>
              <SelectItem value="premium">{t.admin.leads.tierPremium}</SelectItem>
            </SelectContent>
          </Select>

          {(serviceFilter !== "all" || tierFilter !== "all") && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => { setServiceFilter("all"); setTierFilter("all"); }}
              className="h-9 px-2 lg:px-3"
            >
              {t.admin.leads.reset}
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.admin.leads.tableDate}</TableHead>
              <TableHead>{t.admin.leads.tableContact}</TableHead>
              <TableHead>{t.admin.leads.tableServiceTier}</TableHead>
              <TableHead>{t.admin.leads.tableStatus}</TableHead>
              <TableHead className="text-right">{t.admin.leads.tableActions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads?.map((lead) => (
              <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedLead(lead)}>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : t.admin.leads.notAvailable}
                </TableCell>
                <TableCell>
                  <div className="font-bold">{lead.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {lead.email}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-semibold capitalize">{lead.service_slug.replace(/-/g, ' ')}</div>
                  <Badge variant="secondary" className="mt-1 text-[10px] font-normal">
                    {lead.tier}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`capitalize ${getStatusColor(lead.status)}`}>
                    {lead.status || t.admin.leads.statusNew}
                  </Badge>
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedLead(lead)} title={t.admin.leads.viewDetails}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {lead.status !== 'completed' && (
                      <Button variant="ghost" size="icon" className="text-green-500" onClick={() => updateStatus(lead.id, 'completed')} title={t.admin.leads.markCompleted}>
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteLead(lead.id)} title={t.admin.leads.deleteLead}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredLeads?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  {t.admin.leads.noLeads}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Lead Details Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className={`capitalize ${getStatusColor(selectedLead?.status)}`}>
                {selectedLead?.status || t.admin.leads.statusNew}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {t.admin.leads.idLabel}: {selectedLead?.id.split('-')[0]}...
              </span>
            </div>
            <DialogTitle className="text-2xl font-black">{selectedLead?.name}</DialogTitle>
            <DialogDescription className="flex items-center gap-2 text-primary font-medium">
              <Mail className="h-4 w-4" /> {selectedLead?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.admin.leads.serviceRequested}</h4>
              <p className="font-semibold capitalize">{selectedLead?.service_slug.replace(/-/g, ' ')}</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.admin.leads.pricingTier}</h4>
              <p className="font-semibold capitalize">{selectedLead?.tier}</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.admin.leads.dateSubmitted}</h4>
              <p className="font-semibold">{selectedLead?.created_at ? new Date(selectedLead.created_at).toLocaleString() : t.admin.leads.notAvailable}</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.admin.leads.source}</h4>
              <p className="font-semibold capitalize">{selectedLead?.source || t.admin.leads.direct}</p>
            </div>
          </div>

          <div className="space-y-2 border-t pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.admin.leads.message}</h4>
            <div className="bg-muted/30 rounded-lg p-4 text-sm leading-relaxed whitespace-pre-wrap min-h-[100px]">
              {selectedLead?.message || t.admin.leads.noMessage}
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between gap-2 border-t pt-6">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-destructive border-destructive/20 hover:bg-destructive/10"
                onClick={() => deleteLead(selectedLead.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t.admin.leads.delete}
              </Button>
            </div>
            <div className="flex gap-2">
              {selectedLead?.status !== 'contacted' && selectedLead?.status !== 'completed' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => updateStatus(selectedLead.id, 'contacted')}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {t.admin.leads.markContacted}
                </Button>
              )}
              {selectedLead?.status !== 'completed' && (
                <Button 
                  size="sm" 
                  className="bg-brand text-black hover:bg-brand/90"
                  onClick={() => updateStatus(selectedLead.id, 'completed')}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {t.admin.leads.markCompleted}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
