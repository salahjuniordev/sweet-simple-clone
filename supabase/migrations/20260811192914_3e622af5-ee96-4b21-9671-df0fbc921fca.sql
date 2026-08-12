-- Enable RLS on CMS tables (fixes ERROR 1, 2, 3, 5, 6, 7)
ALTER TABLE IF EXISTS public.cms_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cms_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cms_case_studies ENABLE ROW LEVEL SECURITY;

-- Secure has_role function by revoking public execute (fixes WARN 8, 9)
-- The function remains security definer but can only be executed by specific roles
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

-- Add RLS policy for user_roles (fixes INFO 4)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own roles') THEN
        CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage all roles') THEN
        CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
    END IF;
END $$;
