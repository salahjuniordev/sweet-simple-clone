-- First, ensure a sort_order column exists to maintain consistent ordering
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cms_services' AND column_name = 'sort_order') THEN
        ALTER TABLE public.cms_services ADD COLUMN sort_order INTEGER DEFAULT 100;
        GRANT UPDATE (sort_order) ON public.cms_services TO authenticated;
        GRANT SELECT ON public.cms_services TO authenticated;
        GRANT SELECT ON public.cms_services TO anon;
    END IF;
END $$;

-- Update sort_order for the requested priority
UPDATE public.cms_services SET sort_order = 1 WHERE slug = 'web-development';
UPDATE public.cms_services SET sort_order = 2 WHERE slug = 'graphic-design';
UPDATE public.cms_services SET sort_order = 3 WHERE slug = 'identity-branding';
UPDATE public.cms_services SET sort_order = 4 WHERE slug = 'ui-ux-design';
UPDATE public.cms_services SET sort_order = 5 WHERE slug = 'video-editing';
UPDATE public.cms_services SET sort_order = 6 WHERE slug = 'brand-audit';
UPDATE public.cms_services SET sort_order = 7 WHERE slug = 'web-maintenance';
UPDATE public.cms_services SET sort_order = 8 WHERE slug = 'web-security';
UPDATE public.cms_services SET sort_order = 9 WHERE slug = 'digital-marketing';