import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useI18n } from "@/lib/i18n";

const planSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.string().min(1, "Price is required"),
  note: z.string().optional(),
  features: z.array(z.string()).min(1, "At least one feature is required"),
});

const serviceSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  tagline: z.string().min(5, "Tagline is too short"),
  intro: z.string().min(10, "Intro is too short"),
  desc_short: z.string().min(10, "Short description is too short"),
  icon: z.string().min(1, "Icon name is required"),
  benefits: z.array(z.string()).min(1, "At least one benefit is required"),
  deliverables: z.array(z.string()).min(1, "At least one deliverable is required"),
  plans: z.array(planSchema).length(3, "Exactly 3 pricing tiers (Basic, Starter, Premium) are required"),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export const Route = createFileRoute("/_admin/admin/services")({
  component: AdminServices,
});

function AdminServices() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [editingService, setEditingService] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: services, isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cms_services").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      slug: "",
      tagline: "",
      intro: "",
      desc_short: "",
      icon: "",
      benefits: [""],
      deliverables: [""],
      plans: [
        { name: "Basic", price: "", note: t.admin.services.planBasicNote, features: [""] },
        { name: "Starter", price: "", note: t.admin.services.planStarterNote, features: [""] },
        { name: "Premium", price: "", note: t.admin.services.planPremiumNote, features: [""] },
      ],
    },
  });

  useEffect(() => {
    if (editingService) {
      form.reset({
        title: editingService.title,
        slug: editingService.slug,
        tagline: editingService.tagline,
        intro: editingService.intro,
        desc_short: editingService.desc_short,
        icon: editingService.icon,
        benefits: editingService.benefits,
        deliverables: editingService.deliverables,
        plans: editingService.plans as any,
      });
    } else {
      form.reset({
        title: "",
        slug: "",
        tagline: "",
        intro: "",
        desc_short: "",
        icon: "",
        benefits: [""],
        deliverables: [""],
        plans: [
          { name: "Basic", price: "", note: t.admin.services.planBasicNote, features: [""] },
          { name: "Starter", price: "", note: t.admin.services.planStarterNote, features: [""] },
          { name: "Premium", price: "", note: t.admin.services.planPremiumNote, features: [""] },
        ],
      });
    }
  }, [editingService, form]);

  const upsertMutation = useMutation({
    mutationFn: async (values: ServiceFormValues) => {
      if (editingService?.id) {
        const { error } = await supabase
          .from("cms_services")
          .update(values as any)
          .eq("id", editingService.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cms_services").insert(values as any);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      toast.success(editingService ? t.admin.services.toastUpdated : t.admin.services.toastCreated);
      setIsDialogOpen(false);
      setEditingService(null);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cms_services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      toast.success(t.admin.services.toastDeleted);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (values: ServiceFormValues) => {
    upsertMutation.mutate(values);
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight">{t.admin.services.title}</h1>
          <p className="text-muted-foreground mt-1">{t.admin.services.subtitle}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingService(null);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-brand text-brand-foreground font-bold gap-2">
              <Plus className="h-4 w-4" /> {t.admin.services.addService}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingService ? t.admin.services.editService : t.admin.services.addNewService}</DialogTitle>
              <DialogDescription>
                {t.admin.services.dialogDesc}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.admin.services.titleLabel}</FormLabel>
                        <FormControl><Input placeholder={t.admin.services.titlePlaceholder} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.admin.services.slugLabel}</FormLabel>
                        <FormControl><Input placeholder={t.admin.services.slugPlaceholder} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tagline"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>{t.admin.services.taglineLabel}</FormLabel>
                        <FormControl><Input placeholder={t.admin.services.taglinePlaceholder} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="desc_short"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>{t.admin.services.shortDescLabel}</FormLabel>
                        <FormControl><Textarea placeholder={t.admin.services.shortDescPlaceholder} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="intro"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>{t.admin.services.introLabel}</FormLabel>
                        <FormControl><Textarea placeholder={t.admin.services.introPlaceholder} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.admin.services.iconLabel}</FormLabel>
                        <FormControl><Input placeholder={t.admin.services.iconPlaceholder} {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold">{t.admin.services.pricingTiers}</h3>
                  <div className="grid gap-6 md:grid-cols-3">
                    {form.getValues().plans.map((plan, planIdx) => (
                      <div key={planIdx} className="p-4 border rounded-xl bg-muted/30 space-y-4">
                        <h4 className="font-bold text-brand">{plan.name}</h4>
                        <FormField
                          control={form.control}
                          name={`plans.${planIdx}.price` as any}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.admin.services.priceLabel}</FormLabel>
                              <FormControl><Input placeholder={t.admin.services.pricePlaceholder} {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`plans.${planIdx}.note` as any}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t.admin.services.noteLabel}</FormLabel>
                              <FormControl><Input placeholder={t.admin.services.notePlaceholder} {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="space-y-2">
                          <FormLabel>{t.admin.services.features}</FormLabel>
                          <FeaturesFieldArray planIdx={planIdx} control={form.control} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold">{t.admin.services.benefits}</h3>
                    <StringListFieldArray name="benefits" control={form.control} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold">{t.admin.services.deliverables}</h3>
                    <StringListFieldArray name="deliverables" control={form.control} />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={upsertMutation.isPending} className="bg-brand text-brand-foreground font-bold">
                    {upsertMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                    {editingService ? t.admin.services.saveChanges : t.admin.services.createService}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border border-border bg-background overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.admin.services.tableTitle}</TableHead>
              <TableHead>{t.admin.services.tableSlug}</TableHead>
              <TableHead>{t.admin.services.tableIcon}</TableHead>
              <TableHead>Prices</TableHead>
              <TableHead className="text-right">{t.admin.services.tableActions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services?.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-bold">{s.title}</TableCell>
                <TableCell className="text-muted-foreground">{s.slug}</TableCell>
                <TableCell>{s.icon}</TableCell>
                <TableCell>
                  <PriceEditor service={s} />
                </TableCell>
                <TableCell className="text-right">

                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => {
                      setEditingService(s);
                      setIsDialogOpen(true);
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive" 
                      onClick={() => {
                        if (confirm(t.admin.services.confirmDelete)) deleteMutation.mutate(s.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function StringListFieldArray({ name, control }: { name: string, control: any }) {
  const { t } = useI18n();
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as any,
  });

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <FormField
            control={control}
            name={`${name}.${index}` as any}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => append("")}>
        {t.admin.common.addItem}
      </Button>
    </div>
  );
}

function FeaturesFieldArray({ planIdx, control }: { planIdx: number, control: any }) {
  const { t } = useI18n();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `plans.${planIdx}.features` as any,
  });

  return (
    <div className="space-y-2">
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <FormField
            control={control}
            name={`plans.${planIdx}.features.${index}` as any}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl><Input className="h-8 text-xs" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => remove(index)}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" className="w-full h-8 text-xs" onClick={() => append("")}>
        {t.admin.services.addFeature}
      </Button>
    </div>
  );
}
