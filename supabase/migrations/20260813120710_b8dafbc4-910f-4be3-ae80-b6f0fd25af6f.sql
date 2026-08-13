-- Lead submissions: restrict reads/updates to admins & editors
DROP POLICY IF EXISTS "Authenticated users can read all leads" ON public.lead_submissions;
DROP POLICY IF EXISTS "Authenticated users can update leads" ON public.lead_submissions;
DROP POLICY IF EXISTS "Authenticated users can delete leads" ON public.lead_submissions;

CREATE POLICY "Admins/Editors can read leads"
ON public.lead_submissions FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins/Editors can update leads"
ON public.lead_submissions FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins/Editors can delete leads"
ON public.lead_submissions FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Storage: cms-assets restricted to admins & editors
DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

CREATE POLICY "CMS assets read for staff"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'cms-assets' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')));

CREATE POLICY "CMS assets upload for staff"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'cms-assets' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')));

CREATE POLICY "CMS assets update for staff"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'cms-assets' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')))
WITH CHECK (bucket_id = 'cms-assets' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')));

CREATE POLICY "CMS assets delete for staff"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'cms-assets' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')));

-- Lock down the privileged SECURITY DEFINER bootstrap function
REVOKE ALL ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO service_role;