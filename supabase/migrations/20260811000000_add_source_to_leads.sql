ALTER TABLE public.lead_submissions ADD COLUMN source TEXT DEFAULT 'direct';
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_submissions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_submissions TO anon;
GRANT ALL ON public.lead_submissions TO service_role;
