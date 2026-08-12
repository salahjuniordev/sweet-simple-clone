-- Explicitly revoke all privileges and regrant only to necessary roles
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM public, authenticated, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;
