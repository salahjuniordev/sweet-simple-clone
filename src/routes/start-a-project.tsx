import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useCallback, useRef } from "react";
import { ArrowUpRight, ArrowLeft, Check, Upload, X, FileText, Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { useI18n } from "@/lib/i18n";
import { services, type Service } from "@/lib/services-data";
import { getQuestionsForServices, type IntakeQuestion } from "@/lib/service-questions";
import { submitProjectRequest } from "@/lib/project-requests.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/start-a-project")({
  validateSearch: (search: Record<string, unknown>) => ({
    service: (search["service"] as string) || undefined,
  }),
  component: StartAProject,
});

type FormData = {
  // Services
  selectedServices: string[];
  // Client info
  name: string;
  email: string;
  company: string;
  phone: string;
  country: string;
  city: string;
  website: string;
  socialMedia: string;
  industry: string;
  businessDescription: string;
  targetAudience: string;
  // Project info
  projectName: string;
  projectDescription: string;
  projectGoals: string;
  successCriteria: string;
  existingAssets: string;
  competitors: string;
  inspiration: string;
  // Service answers
  serviceAnswers: Record<string, Record<string, string>>;
  // Budget & timeline
  budgetRange: string;
  desiredStart: string;
  desiredDeadline: string;
  // Files
  files: { name: string; url: string; serviceSlug?: string }[];
};

const initialFormData: FormData = {
  selectedServices: [],
  name: "",
  email: "",
  company: "",
  phone: "",
  country: "",
  city: "",
  website: "",
  socialMedia: "",
  industry: "",
  businessDescription: "",
  targetAudience: "",
  projectName: "",
  projectDescription: "",
  projectGoals: "",
  successCriteria: "",
  existingAssets: "",
  competitors: "",
  inspiration: "",
  serviceAnswers: {},
  budgetRange: "",
  desiredStart: "",
  desiredDeadline: "",
  files: [],
};

const budgetOptions = [
  "Under 100,000 FCFA",
  "100,000–250,000 FCFA",
  "250,000–500,000 FCFA",
  "500,000–1,000,000 FCFA",
  "1,000,000–2,500,000 FCFA",
  "2,500,000+ FCFA",
  "Not sure yet",
];

const timelineOptions = [
  { key: "asap", value: "ASAP" },
  { key: "2weeks", value: "Within 2 weeks" },
  { key: "1month", value: "Within 1 month" },
  { key: "1-3months", value: "1–3 months" },
  { key: "flexible", value: "Flexible" },
];

const fieldClass =
  "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-brand";

function StartAProject() {
  const { t } = useI18n();
  const { intake } = t;
  const navigate = useNavigate();
  const { service: initialService } = Route.useSearch() as { service?: string };

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(() => ({
    ...initialFormData,
    selectedServices: initialService ? [initialService] : [],
  }));
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [projectRef, setProjectRef] = useState("");
  type ErrorKey = "services" | "name" | "email" | "projectDesc" | "budget";
  const [errors, setErrors] = useState<Partial<Record<ErrorKey, string>>>({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allServices = services;
  const selectedServicesData = allServices.filter((s) =>
    formData.selectedServices.includes(s.slug)
  );
  const serviceQuestionsMap = getQuestionsForServices(formData.selectedServices);

  const steps = [
    intake.stepServices,
    intake.stepClient,
    intake.stepProject,
    ...(Object.keys(serviceQuestionsMap).length > 0 ? [intake.stepServiceQuestions] : []),
    intake.stepBudget,
    intake.stepFiles,
    intake.stepReview,
  ];

  const totalSteps = steps.length;

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setErrors({});
  }, []);

  const toggleService = (slug: string) => {
    setFormData((prev) => {
      const selected = prev.selectedServices.includes(slug)
        ? prev.selectedServices.filter((s) => s !== slug)
        : [...prev.selectedServices, slug];
      return { ...prev, selectedServices: selected };
    });
    setErrors({});
  };

  const updateServiceAnswer = (serviceSlug: string, key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceAnswers: {
        ...prev.serviceAnswers,
        [serviceSlug]: {
          ...(prev.serviceAnswers[serviceSlug] || {}),
          [key]: value,
        },
      },
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const fileName = `project-uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage
          .from("project-files")
          .upload(fileName, file);

        if (error) {
          toast.error(intake.uploadFailed);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from("project-files")
          .getPublicUrl(fileName);

        updateFormData({
          files: [...formData.files, { name: file.name, url: urlData.publicUrl }],
        });
      }
    } catch {
      toast.error(intake.uploadFailed);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    updateFormData({
      files: formData.files.filter((_, i) => i !== index),
    });
  };

  const validateStep = (): boolean => {
    const newErrors: Partial<Record<ErrorKey, string>> = {};

    if (step === 0 && formData.selectedServices.length === 0) {
      newErrors["services"] = intake.validation.serviceRequired;
    }
    if (step === 1) {
      if (!formData.name.trim()) newErrors["name"] = intake.validation.nameRequired;
      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors["email"] = intake.validation.emailInvalid;
      }
    }
    if (step === 2) {
      if (!formData.projectDescription.trim()) {
        newErrors["projectDesc"] = intake.validation.projectDescRequired;
      }
    }
    if (step === steps.length - 2) {
      if (!formData.budgetRange) newErrors["budget"] = intake.validation.budgetRequired;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep((s) => Math.min(s + 1, totalSteps - 1));
    }
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      const result = await submitProjectRequest({
        data: {
          name: formData.name,
          email: formData.email,
          company: formData.company || undefined,
          phone: formData.phone || undefined,
          country: formData.country || undefined,
          city: formData.city || undefined,
          website: formData.website || undefined,
          socialMedia: formData.socialMedia || undefined,
          industry: formData.industry || undefined,
          businessDescription: formData.businessDescription || undefined,
          targetAudience: formData.targetAudience || undefined,
          services: formData.selectedServices,
          projectName: formData.projectName || undefined,
          projectDescription: formData.projectDescription,
          projectGoals: formData.projectGoals || undefined,
          successCriteria: formData.successCriteria || undefined,
          existingAssets: formData.existingAssets || undefined,
          competitors: formData.competitors || undefined,
          inspiration: formData.inspiration || undefined,
          serviceAnswers: formData.serviceAnswers,
          budgetRange: formData.budgetRange,
          desiredStart: formData.desiredStart || undefined,
          desiredDeadline: formData.desiredDeadline || undefined,
          files: formData.files,
        },
      });

      setProjectRef(result.reference);
      setSubmitted(true);
      toast.success(intake.successTitle);
    } catch (err) {
      console.error("Project request failed:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-6 py-24 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand/10">
            <Check className="h-10 w-10 text-brand" />
          </div>
          <h1 className="mt-8 text-4xl font-black tracking-tight md:text-5xl">
            {intake.successTitle}
          </h1>
          <p className="mt-2 text-lg font-bold text-brand">
            {intake.successRef}: {projectRef}
          </p>
          <p className="mt-4 text-muted-foreground">{intake.successBody}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-sm font-bold text-brand-foreground transition-transform hover:-translate-y-0.5"
            >
              {intake.backToHome} <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              to="/work"
              className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-4 text-sm font-bold transition-colors hover:border-brand hover:text-brand"
            >
              {intake.viewWork}
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main>
        {/* Progress bar */}
        <section className="border-b border-border bg-secondary/50">
          <div className="mx-auto max-w-4xl px-6 py-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {steps.map((label, i) => (
                <div key={label} className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => i < step && setStep(i)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      i === step
                        ? "bg-brand text-brand-foreground"
                        : i < step
                        ? "bg-brand/20 text-brand"
                        : "bg-border text-muted-foreground"
                    } ${i < step ? "cursor-pointer" : ""}`}
                  >
                    {i < step ? <Check className="h-4 w-4" /> : i + 1}
                  </button>
                  <span
                    className={`text-sm font-medium ${
                      i === step ? "text-foreground" : "text-muted-foreground"
                    } hidden sm:inline`}
                  >
                    {label}
                  </span>
                  {i < steps.length - 1 && (
                    <div
                      className={`h-px w-6 ${
                        i < step ? "bg-brand" : "bg-border"
                      } hidden sm:block`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-6 py-12">
          {/* Step 0: Services */}
          {step === 0 && (
            <div>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                {intake.servicesTitle}
              </h1>
              <p className="mt-3 text-muted-foreground">{intake.servicesSubtitle}</p>

              {formData.selectedServices.length > 0 && (
                <p className="mt-6 text-sm font-bold text-brand">
                  {intake.selectedServices}: {formData.selectedServices.length}
                </p>
              )}                {errors["services"] && (
                  <p className="mt-2 text-sm font-semibold text-destructive">{errors["services"]}</p>
                )}

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {allServices.map((s) => {
                  const selected = formData.selectedServices.includes(s.slug);
                  return (
                    <button
                      key={s.slug}
                      type="button"
                      onClick={() => toggleService(s.slug)}
                      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                        selected
                          ? "border-brand bg-brand/5"
                          : "border-border hover:border-brand/50"
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                          selected ? "border-brand bg-brand text-white" : "border-border"
                        }`}
                      >
                        {selected && <Check className="h-3 w-3" />}
                      </div>
                      <div>
                        <div className="font-bold">{s.title}</div>
                        <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {s.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 rounded-xl border border-dashed border-border bg-secondary/30 p-6">
                <p className="font-bold">{intake.notSure}</p>
                <p className="mt-1 text-sm text-muted-foreground">{intake.notSureDesc}</p>
              </div>
            </div>
          )}

          {/* Step 1: Client Info */}
          {step === 1 && (
            <div>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                {intake.clientTitle}
              </h1>
              <p className="mt-3 text-muted-foreground">{intake.clientSubtitle}</p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-sm font-bold">
                    {intake.nameLabel} <span className="text-destructive">*</span>
                  </label>
                  <input
                    className={fieldClass}
                    value={formData.name}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                    placeholder={intake.namePlaceholder}
                  />
                  {errors["name"] && <p className="mt-1 text-xs text-destructive">{errors["name"]}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-bold">
                    {intake.emailLabel} <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    className={fieldClass}
                    value={formData.email}
                    onChange={(e) => updateFormData({ email: e.target.value })}
                    placeholder={intake.emailPlaceholder}
                  />
                  {errors["email"] && <p className="mt-1 text-xs text-destructive">{errors["email"]}</p>}
                </div>
                <div>
                  <label className="text-sm font-bold">
                    {intake.companyLabel} <span className="text-xs font-normal text-muted-foreground">{intake.companyOptional}</span>
                  </label>
                  <input className={fieldClass} value={formData.company} onChange={(e) => updateFormData({ company: e.target.value })} placeholder={intake.companyPlaceholder} />
                </div>
                <div>
                  <label className="text-sm font-bold">{intake.phoneLabel}</label>
                  <input className={fieldClass} value={formData.phone} onChange={(e) => updateFormData({ phone: e.target.value })} placeholder={intake.phonePlaceholder} />
                </div>
                <div>
                  <label className="text-sm font-bold">{intake.countryLabel}</label>
                  <input className={fieldClass} value={formData.country} onChange={(e) => updateFormData({ country: e.target.value })} placeholder={intake.countryPlaceholder} />
                </div>
                <div>
                  <label className="text-sm font-bold">{intake.cityLabel}</label>
                  <input className={fieldClass} value={formData.city} onChange={(e) => updateFormData({ city: e.target.value })} placeholder={intake.cityPlaceholder} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-bold">{intake.websiteLabel}</label>
                  <input className={fieldClass} value={formData.website} onChange={(e) => updateFormData({ website: e.target.value })} placeholder={intake.websitePlaceholder} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-bold">{intake.socialLabel}</label>
                  <input className={fieldClass} value={formData.socialMedia} onChange={(e) => updateFormData({ socialMedia: e.target.value })} placeholder={intake.socialPlaceholder} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-bold">{intake.industryLabel}</label>
                  <input className={fieldClass} value={formData.industry} onChange={(e) => updateFormData({ industry: e.target.value })} placeholder={intake.industryPlaceholder} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-bold">{intake.businessDescLabel}</label>
                  <textarea className={fieldClass} rows={3} value={formData.businessDescription} onChange={(e) => updateFormData({ businessDescription: e.target.value })} placeholder={intake.businessDescPlaceholder} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-bold">{intake.targetAudienceLabel}</label>
                  <textarea className={fieldClass} rows={3} value={formData.targetAudience} onChange={(e) => updateFormData({ targetAudience: e.target.value })} placeholder={intake.targetAudiencePlaceholder} />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Project Info */}
          {step === 2 && (
            <div>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                {intake.projectTitle}
              </h1>
              <p className="mt-3 text-muted-foreground">{intake.projectSubtitle}</p>

              <div className="mt-8 grid gap-5">
                <div>
                  <label className="text-sm font-bold">{intake.projectNameLabel}</label>
                  <input className={fieldClass} value={formData.projectName} onChange={(e) => updateFormData({ projectName: e.target.value })} placeholder={intake.projectNamePlaceholder} />
                </div>
                <div>
                  <label className="text-sm font-bold">
                    {intake.projectDescLabel} <span className="text-destructive">*</span>
                  </label>
                  <textarea className={fieldClass} rows={5} value={formData.projectDescription} onChange={(e) => updateFormData({ projectDescription: e.target.value })} placeholder={intake.projectDescPlaceholder} />
                  {errors["projectDesc"] && <p className="mt-1 text-xs text-destructive">{errors["projectDesc"]}</p>}
                </div>
                <div>
                  <label className="text-sm font-bold">{intake.projectGoalsLabel}</label>
                  <textarea className={fieldClass} rows={3} value={formData.projectGoals} onChange={(e) => updateFormData({ projectGoals: e.target.value })} placeholder={intake.projectGoalsPlaceholder} />
                </div>
                <div>
                  <label className="text-sm font-bold">{intake.successLabel}</label>
                  <textarea className={fieldClass} rows={3} value={formData.successCriteria} onChange={(e) => updateFormData({ successCriteria: e.target.value })} placeholder={intake.successPlaceholder} />
                </div>
                <div>
                  <label className="text-sm font-bold">{intake.existingAssetsLabel}</label>
                  <textarea className={fieldClass} rows={3} value={formData.existingAssets} onChange={(e) => updateFormData({ existingAssets: e.target.value })} placeholder={intake.existingAssetsPlaceholder} />
                </div>
                <div>
                  <label className="text-sm font-bold">{intake.competitorsLabel}</label>
                  <textarea className={fieldClass} rows={3} value={formData.competitors} onChange={(e) => updateFormData({ competitors: e.target.value })} placeholder={intake.competitorsPlaceholder} />
                </div>
                <div>
                  <label className="text-sm font-bold">{intake.inspirationLabel}</label>
                  <textarea className={fieldClass} rows={3} value={formData.inspiration} onChange={(e) => updateFormData({ inspiration: e.target.value })} placeholder={intake.inspirationPlaceholder} />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Service-Specific Questions */}
          {step === 3 && Object.keys(serviceQuestionsMap).length > 0 && (
            <div>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                {intake.serviceQuestionsTitle}
              </h1>
              <p className="mt-3 text-muted-foreground">{intake.serviceQuestionsSubtitle}</p>

              {Object.entries(serviceQuestionsMap).map(([slug, questions]) => {
                const serviceData = allServices.find((s) => s.slug === slug);
                return (
                  <div key={slug} className="mt-10">
                    <h2 className="text-xl font-bold text-brand">{serviceData?.title || slug}</h2>
                    <div className="mt-4 grid gap-5">
                      {questions.map((q) => (
                        <ServiceQuestionField
                          key={q.key}
                          question={q}
                          value={formData.serviceAnswers[slug]?.[q.key] || ""}
                          onChange={(val) => updateServiceAnswer(slug, q.key, val)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Step 4: Budget & Timeline */}
          {step === steps.indexOf(intake.stepBudget) && (
            <div>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                {intake.budgetTitle}
              </h1>
              <p className="mt-3 text-muted-foreground">{intake.budgetSubtitle}</p>

              <div className="mt-8 grid gap-6">
                <div>
                  <label className="text-sm font-bold">
                    {intake.budgetLabel} <span className="text-destructive">*</span>
                  </label>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {budgetOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateFormData({ budgetRange: opt })}
                        className={`rounded-xl border p-3 text-left text-sm font-medium transition-colors ${
                          formData.budgetRange === opt
                            ? "border-brand bg-brand/5 text-brand"
                            : "border-border hover:border-brand/50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {errors["budget"] && <p className="mt-2 text-xs text-destructive">{errors["budget"]}</p>}
                </div>

                <div>
                  <label className="text-sm font-bold">{intake.startLabel}</label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {timelineOptions.map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => updateFormData({ desiredStart: opt.value })}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                          formData.desiredStart === opt.value
                            ? "border-brand bg-brand/5 text-brand"
                            : "border-border hover:border-brand/50"
                        }`}
                      >
                        {opt.value}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold">{intake.deadlineLabel}</label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {timelineOptions.map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => updateFormData({ desiredDeadline: opt.value })}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                          formData.desiredDeadline === opt.value
                            ? "border-brand bg-brand/5 text-brand"
                            : "border-border hover:border-brand/50"
                        }`}
                      >
                        {opt.value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Files */}
          {step === steps.indexOf(intake.stepFiles) && (
            <div>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                {intake.filesTitle}
              </h1>
              <p className="mt-3 text-muted-foreground">{intake.filesSubtitle}</p>
              <p className="mt-1 text-xs text-muted-foreground">{intake.filesDesc}</p>

              <div className="mt-8">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-border p-12 text-center transition-colors hover:border-brand/50"
                >
                  {uploading ? (
                    <Loader2 className="h-8 w-8 text-brand animate-spin" />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground" />
                  )}
                  <p className="mt-3 text-sm font-medium">{intake.dragOrClick}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{intake.maxFileSize}</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx,.zip,.fig,.mp4,.mov"
                />
              </div>

              {formData.files.length > 0 && (
                <div className="mt-6 space-y-2">
                  {formData.files.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl border border-border bg-secondary/50 px-4 py-3"
                    >
                      <FileText className="h-4 w-4 shrink-0 text-brand" />
                      <span className="flex-1 truncate text-sm">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 6: Review */}
          {step === totalSteps - 1 && (
            <div>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                {intake.reviewTitle}
              </h1>
              <p className="mt-3 text-muted-foreground">{intake.reviewSubtitle}</p>

              <div className="mt-8 space-y-6">
                {/* Selected services */}
                <ReviewSection
                  title={intake.selectedServicesLabel}
                  onEdit={() => setStep(0)}
                  editLabel={intake.editStep}
                >
                  <div className="flex flex-wrap gap-2">
                    {selectedServicesData.map((s) => (
                      <span
                        key={s.slug}
                        className="rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand"
                      >
                        {s.title}
                      </span>
                    ))}
                  </div>
                </ReviewSection>

                {/* Client info */}
                <ReviewSection
                  title={intake.clientInfo}
                  onEdit={() => setStep(1)}
                  editLabel={intake.editStep}
                >
                  <div className="grid gap-2 text-sm">
                    <p><span className="text-muted-foreground">{intake.nameLabel}:</span> {formData.name}</p>
                    <p><span className="text-muted-foreground">{intake.emailLabel}:</span> {formData.email}</p>
                    {formData.company && <p><span className="text-muted-foreground">{intake.companyLabel}:</span> {formData.company}</p>}
                    {formData.phone && <p><span className="text-muted-foreground">{intake.phoneLabel}:</span> {formData.phone}</p>}
                    {formData.country && <p><span className="text-muted-foreground">{intake.countryLabel}:</span> {formData.country}</p>}
                    {formData.industry && <p><span className="text-muted-foreground">{intake.industryLabel}:</span> {formData.industry}</p>}
                  </div>
                </ReviewSection>

                {/* Project info */}
                <ReviewSection
                  title={intake.projectInfo}
                  onEdit={() => setStep(2)}
                  editLabel={intake.editStep}
                >
                  <div className="space-y-3 text-sm">
                    {formData.projectName && <p><span className="text-muted-foreground">{intake.projectNameLabel}:</span> {formData.projectName}</p>}
                    <p><span className="text-muted-foreground">{intake.projectDescLabel}:</span></p>
                    <p className="text-muted-foreground whitespace-pre-wrap">{formData.projectDescription}</p>
                    {formData.projectGoals && <p><span className="text-muted-foreground">{intake.projectGoalsLabel}:</span> {formData.projectGoals}</p>}
                    {formData.competitors && <p><span className="text-muted-foreground">{intake.competitorsLabel}:</span> {formData.competitors}</p>}
                  </div>
                </ReviewSection>

                {/* Budget & timeline */}
                <ReviewSection
                  title={intake.budgetAndTimeline}
                  onEdit={() => setStep(steps.indexOf(intake.stepBudget))}
                  editLabel={intake.editStep}
                >
                  <div className="grid gap-2 text-sm">
                    <p><span className="text-muted-foreground">{intake.budgetRange}:</span> <span className="font-medium">{formData.budgetRange}</span></p>
                    {formData.desiredStart && <p><span className="text-muted-foreground">{intake.start}:</span> {formData.desiredStart}</p>}
                    {formData.desiredDeadline && <p><span className="text-muted-foreground">{intake.deadline}:</span> {formData.desiredDeadline}</p>}
                  </div>
                </ReviewSection>

                {/* Files */}
                {formData.files.length > 0 && (
                  <ReviewSection
                    title={intake.uploadedFiles}
                    onEdit={() => setStep(steps.indexOf(intake.stepFiles))}
                    editLabel={intake.editStep}
                  >
                    <div className="space-y-1">
                      {formData.files.map((f, i) => (
                        <p key={i} className="flex items-center gap-2 text-sm">
                          <FileText className="h-3 w-3 text-brand" /> {f.name}
                        </p>
                      ))}
                    </div>
                  </ReviewSection>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
            {step > 0 ? (
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-bold transition-colors hover:border-brand hover:text-brand"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < totalSteps - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-bold text-brand-foreground transition-transform hover:-translate-y-0.5"
              >
                Continue <ArrowUpRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-bold text-brand-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> {intake.submitting}
                  </>
                ) : (
                  <>
                    {intake.submitButton} <ArrowUpRight className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

function ServiceQuestionField({
  question,
  value,
  onChange,
}: {
  question: IntakeQuestion;
  value: string;
  onChange: (val: string) => void;
}) {
  const { t } = useI18n();
  const intake = (t as any).intake;

  if (question.type === "textarea") {
    return (
      <div>
        <label className="text-sm font-bold">
          {question.label}
          {question.required && <span className="text-destructive ml-1">*</span>}
        </label>
        {question.description && (
          <p className="mt-1 text-xs text-muted-foreground">{question.description}</p>
        )}
        <textarea
          className={fieldClass}
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
        />
      </div>
    );
  }

  if (question.type === "text" || question.type === "url") {
    return (
      <div>
        <label className="text-sm font-bold">
          {question.label}
          {question.required && <span className="text-destructive ml-1">*</span>}
        </label>
        <input
          type={question.type === "url" ? "url" : "text"}
          className={fieldClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
        />
      </div>
    );
  }

  if (question.type === "select" && question.options) {
    return (
      <div>
        <label className="text-sm font-bold">
          {question.label}
          {question.required && <span className="text-destructive ml-1">*</span>}
        </label>
        <select
          className={fieldClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select...</option>
          {question.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }

  if (question.type === "radio" && question.options) {
    return (
      <div>
        <label className="text-sm font-bold">
          {question.label}
          {question.required && <span className="text-destructive ml-1">*</span>}
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {question.options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                value === opt
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-border hover:border-brand/50"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (question.type === "multi-select" && question.options) {
    const selected = value ? value.split(", ") : [];
    const toggleOption = (opt: string) => {
      const next = selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt];
      onChange(next.join(", "));
    };
    return (
      <div>
        <label className="text-sm font-bold">
          {question.label}
          {question.required && <span className="text-destructive ml-1">*</span>}
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {question.options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => toggleOption(opt)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                selected.includes(opt)
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-border hover:border-brand/50"
              }`}
            >
              {selected.includes(opt) && <Check className="mr-1 inline h-3 w-3" />}
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (question.type === "file") {
    return (
      <div>
        <label className="text-sm font-bold">{question.label}</label>
        <p className="mt-1 text-xs text-muted-foreground">{intake.filesDesc}</p>
      </div>
    );
  }

  return null;
}

function ReviewSection({
  title,
  onEdit,
  editLabel,
  children,
}: {
  title: string;
  onEdit: () => void;
  editLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-bold text-brand hover:underline"
        >
          {editLabel}
        </button>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}
