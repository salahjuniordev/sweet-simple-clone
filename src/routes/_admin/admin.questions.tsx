import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { bulkUpsertQuestions, deleteIntakeQuestion } from "@/lib/service-management.functions";

export const Route = createFileRoute("/_admin/admin/questions")({
  component: AdminQuestions,
});

const QUESTION_TYPES = [
  "text", "textarea", "select", "multi-select", "radio", "checkbox", "url", "file",
];

type QuestionRow = {
  id?: string;
  key: string;
  label: string;
  type: string;
  required: boolean;
  placeholder: string;
  options: string[];
  description: string;
  sort_order: number;
  condition_key: string;
  condition_value: string;
};

const emptyQuestion: QuestionRow = {
  key: "",
  label: "",
  type: "text",
  required: false,
  placeholder: "",
  options: [],
  description: "",
  sort_order: 0,
  condition_key: "",
  condition_value: "",
};

function AdminQuestions() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [selectedService, setSelectedService] = useState<string>("");
  const [questions, setQuestions] = useState<QuestionRow[]>([]);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState<QuestionRow>({ ...emptyQuestion });

  const { data: services } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data } = await supabase.from("cms_services").select("slug, title").order("sort_order");
      return data || [];
    },
  });

  const { data: dbQuestions, isLoading: loadingQuestions } = useQuery({
    queryKey: ["admin-questions", selectedService],
    queryFn: async () => {
      if (!selectedService) return [];
      const { data } = await supabase
        .from("service_questions" as any)
        .select("*")
        .eq("service_slug", selectedService)
        .order("sort_order");
      return (data || []) as any[];
    },
    enabled: !!selectedService,
  });

  // Sync DB questions to local state when service changes
  if (dbQuestions && questions.length === 0 && selectedService && !loadingQuestions) {
    const mapped: QuestionRow[] = dbQuestions.map((q: any) => ({
      id: q.id,
      key: q.key,
      label: q.label,
      type: q.type,
      required: q.required,
      placeholder: q.placeholder || "",
      options: q.options || [],
      description: q.description || "",
      sort_order: q.sort_order,
      condition_key: q.condition_key || "",
      condition_value: q.condition_value || "",
    }));
    if (JSON.stringify(mapped) !== JSON.stringify(questions)) {
      setQuestions(mapped);
    }
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!selectedService) throw new Error("No service selected");
      await bulkUpsertQuestions({
        data: {
          serviceSlug: selectedService,
          questions: questions.map((q, idx) => ({
            id: q.id,
            key: q.key,
            label: q.label,
            type: q.type as any,
            required: q.required,
            placeholder: q.placeholder || undefined,
            options: q.options.length > 0 ? q.options : undefined,
            description: q.description || undefined,
            sortOrder: idx,
            conditionKey: q.condition_key || undefined,
            conditionValue: q.condition_value || undefined,
          })),
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-questions", selectedService] });
      toast.success("Questions saved successfully");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to save questions");
    },
  });

  const addQuestion = () => {
    if (!newQuestion.key || !newQuestion.label) {
      toast.error("Key and label are required");
      return;
    }
    // Check for duplicate key
    if (questions.some((q) => q.key === newQuestion.key)) {
      toast.error("A question with this key already exists");
      return;
    }
    setQuestions([
      ...questions,
      {
        key: newQuestion.key,
        label: newQuestion.label,
        type: newQuestion.type || "text",
        required: newQuestion.required || false,
        placeholder: newQuestion.placeholder || "",
        options: newQuestion.options || [],
        description: newQuestion.description || "",
        sort_order: questions.length,
        condition_key: newQuestion.condition_key || "",
        condition_value: newQuestion.condition_value || "",
      },
    ]);
    setNewQuestion({ ...emptyQuestion });
    setIsDialogOpen(false);
  };

  const updateQuestion = (idx: number, updates: Record<string, unknown>) => {
    const q = questions[idx];
    if (!q) return;
    const updated = [...questions];
    updated[idx] = { ...q, ...updates } as QuestionRow;
    setQuestions(updated);
  };

  const removeQuestion = (idx: number) => {
    const q = questions[idx];
    if (q?.id) {
      deleteIntakeQuestion({ data: { id: q.id } });
    }
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const moveQuestion = (idx: number, direction: "up" | "down") => {
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= questions.length) return;
    const current = questions[idx];
    const target = questions[newIdx];
    if (!current || !target) return;
    const updated = [...questions];
    updated[idx] = target;
    updated[newIdx] = current;
    updated.forEach((q, i) => (q.sort_order = i));
    setQuestions(updated);
  };

  // Get other questions in same service for condition source options
  const conditionSourceOptions = questions
    .filter((q) => ["radio", "select", "multi-select"].includes(q.type) && q.options.length > 0)
    .map((q) => ({ key: q.key, label: q.label, options: q.options }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Intake Questions</h1>
          <p className="text-muted-foreground mt-1">Manage intake questions for each service</p>
        </div>
      </div>

      {/* Service selector */}
      <div className="flex items-center gap-4">
        <Label className="text-sm font-semibold">Service</Label>
        <Select
          value={selectedService}
          onValueChange={(val) => {
            setSelectedService(val);
            setQuestions([]);
          }}
        >
          <SelectTrigger className="w-80">
            <SelectValue placeholder="Select a service..." />
          </SelectTrigger>
          <SelectContent>
            {(services || []).map((s: any) => (
              <SelectItem key={s.slug} value={s.slug}>
                {s.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedService && (
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="bg-brand text-brand-foreground font-bold gap-2"
          >
            {saveMutation.isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
            Save Questions
          </Button>
        )}
      </div>

      {selectedService && (
        <>
          {/* Questions list */}
          {questions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <p className="text-lg font-semibold">No questions yet</p>
                <p className="text-sm mt-1">Add intake questions for this service</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {questions.map((q, idx) => (
                <Card key={`${q.key}-${idx}`} className={q.condition_key ? "border-dashed border-accent" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col gap-1 pt-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveQuestion(idx, "up")}
                          disabled={idx === 0}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveQuestion(idx, "down")}
                          disabled={idx === questions.length - 1}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm">{q.label}</span>
                          <Badge variant="outline" className="text-xs">{q.type}</Badge>
                          {q.required && <Badge className="text-xs bg-primary text-primary-foreground">Required</Badge>}
                          {q.condition_key && (
                            <Badge variant="secondary" className="text-xs">
                              Shows when {q.condition_key} = {q.condition_value}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Key: <code className="bg-secondary px-1 rounded">{q.key}</code>
                          {q.placeholder && <> · Placeholder: "{q.placeholder}"</>}
                          {q.options.length > 0 && <> · Options: {q.options.join(", ")}</>}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Switch
                          checked={q.required}
                          onCheckedChange={(checked) => updateQuestion(idx, { required: checked })}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => removeQuestion(idx)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Add question button */}
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4" /> Add Question
          </Button>
        </>
      )}

      {/* Add question dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Question</DialogTitle>
            <DialogDescription>Add a new intake question for this service</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Key *</Label>
                <Input
                  value={newQuestion.key || ""}
                  onChange={(e) => setNewQuestion({ ...newQuestion, key: e.target.value })}
                  placeholder="e.g., project_type"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Label *</Label>
                <Input
                  value={newQuestion.label || ""}
                  onChange={(e) => setNewQuestion({ ...newQuestion, label: e.target.value })}
                  placeholder="What type of project?"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select
                  value={newQuestion.type || "text"}
                  onValueChange={(val) => setNewQuestion({ ...newQuestion, type: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUESTION_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  checked={newQuestion.required || false}
                  onCheckedChange={(checked) => setNewQuestion({ ...newQuestion, required: checked })}
                />
                <Label>Required</Label>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Placeholder</Label>
              <Input
                value={newQuestion.placeholder || ""}
                onChange={(e) => setNewQuestion({ ...newQuestion, placeholder: e.target.value })}
                placeholder="Placeholder text..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description (optional)</Label>
              <Input
                value={newQuestion.description || ""}
                onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
                placeholder="Helper text for this question..."
              />
            </div>
            {["select", "multi-select", "radio", "checkbox"].includes(newQuestion.type || "") && (
              <div className="space-y-1.5">
                <Label>Options (one per line)</Label>
                <Textarea
                  rows={4}
                  value={(newQuestion.options || []).join("\n")}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      options: e.target.value.split("\n").filter((l) => l.trim()),
                    })
                  }
                  placeholder="Option 1&#10;Option 2&#10;Option 3"
                />
              </div>
            )}
            {/* Conditional question setup */}
            {conditionSourceOptions.length > 0 && (
              <div className="p-3 bg-secondary/50 rounded-lg border border-border space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Conditional Display (optional)
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Show when this question...</Label>
                    <Select
                      value={newQuestion.condition_key || ""}
                      onValueChange={(val) =>
                        setNewQuestion({ ...newQuestion, condition_key: val, condition_value: "" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Always show" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Always show</SelectItem>
                        {conditionSourceOptions.map((cs) => (
                          <SelectItem key={cs.key} value={cs.key}>{cs.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {newQuestion.condition_key && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Equals</Label>
                      <Select
                        value={newQuestion.condition_value || ""}
                        onValueChange={(val) => setNewQuestion({ ...newQuestion, condition_value: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select value..." />
                        </SelectTrigger>
                        <SelectContent>
                          {conditionSourceOptions
                            .find((cs) => cs.key === newQuestion.condition_key)
                            ?.options.map((opt) => (
                              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={addQuestion} className="bg-brand text-brand-foreground font-bold">Add Question</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
