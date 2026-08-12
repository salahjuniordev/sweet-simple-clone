CREATE TABLE IF NOT EXISTS public.notification_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed default settings
INSERT INTO public.notification_settings (key, value)
VALUES 
('lead_notifications', '{"team_emails": ["hello@mariostudio.com"], "auto_reply_enabled": true, "team_notification_enabled": true}')
ON CONFLICT (key) DO NOTHING;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notification_settings TO authenticated;
GRANT ALL ON public.notification_settings TO service_role;

ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage settings"
ON public.notification_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Make sure lead_submissions is accessible for our notifications
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_submissions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_submissions TO anon;
GRANT ALL ON public.lead_submissions TO service_role;
