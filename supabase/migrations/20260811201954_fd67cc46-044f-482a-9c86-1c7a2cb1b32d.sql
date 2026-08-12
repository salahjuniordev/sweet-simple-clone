-- Revoke all privileges from public
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;

-- Grant execute to authenticated and service_role only
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
