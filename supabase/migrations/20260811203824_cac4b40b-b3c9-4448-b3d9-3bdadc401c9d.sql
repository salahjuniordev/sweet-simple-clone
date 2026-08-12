-- Add source column to lead_submissions if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'lead_submissions'
        AND column_name = 'source'
    ) THEN
        ALTER TABLE public.lead_submissions ADD COLUMN source TEXT DEFAULT 'direct';
    END IF;
END $$;

-- Ensure grants are correct
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_submissions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_submissions TO anon;
GRANT ALL ON public.lead_submissions TO service_role;
