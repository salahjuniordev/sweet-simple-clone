import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { submitLead } from "@/lib/leads.functions";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

interface LeadCaptureFormProps {
  serviceSlug: string;
  tier: string;
}

export function LeadCaptureForm({ serviceSlug, tier }: LeadCaptureFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  // Effect to reset form when tier changes to keep it updated with user interaction
  useEffect(() => {
    // We don't want to reset user input, just ensure the prompt matches the selected tier
  }, [tier]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const source = typeof window !== 'undefined' ? 
        (window.location.search.includes('source=') ? 
          new URLSearchParams(window.location.search).get('source') : 
          'direct') : 
        'direct';

      await submitLead({
        data: {
          name: values.name,
          email: values.email,
          message: values.message,
          service_slug: serviceSlug,
          tier: tier,
          source: source || 'direct'
        }
      });

      // Analytics Tracking
      if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'generate_lead', {
          'service': serviceSlug,
          'tier': tier,
          'source': source || 'direct'
        });
      }
      console.log(`[Analytics] Lead captured: ${serviceSlug} - ${tier}`);

      toast.success("Inquiry sent! We'll be in touch soon.");
      form.reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div id="quote" className="rounded-2xl border border-border bg-card p-8 shadow-sm sticky top-24">
      <h3 className="text-xl font-bold tracking-tight">Request a Quote</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        Interested in the <span className="font-bold text-brand">{tier}</span> tier? 
        Fill out the form below and we'll get back to you within 48 hours.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4 text-left">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How can we help?</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us about your project goals..." 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="w-full bg-brand text-brand-foreground font-bold py-6"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Submit Inquiry
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
