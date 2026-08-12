-- Create app_role enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');
    END IF;
END $$;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security Definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- CMS Content Tables
CREATE TABLE IF NOT EXISTS public.cms_services (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text UNIQUE NOT NULL,
    title text NOT NULL,
    icon text NOT NULL,
    desc_short text NOT NULL,
    tagline text NOT NULL,
    intro text NOT NULL,
    benefits text[] NOT NULL DEFAULT '{}',
    deliverables text[] NOT NULL DEFAULT '{}',
    plans jsonb NOT NULL DEFAULT '[]',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cms_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text UNIQUE NOT NULL,
    title text NOT NULL,
    excerpt text NOT NULL,
    category text NOT NULL,
    date date NOT NULL DEFAULT current_date,
    read_time text NOT NULL,
    body text[] NOT NULL DEFAULT '{}',
    author_id uuid REFERENCES auth.users(id),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cms_case_studies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text UNIQUE NOT NULL,
    client text NOT NULL,
    title text NOT NULL,
    summary text NOT NULL,
    industry text not null,
    year text not null,
    services text[] not null default '{}',
    service_slugs text[] not null default '{}',
    challenge text not null,
    approach text[] not null default '{}',
    results jsonb not null default '[]',
    quote jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Grants
GRANT SELECT ON public.cms_services TO anon, authenticated;
GRANT ALL ON public.cms_services TO authenticated;
GRANT ALL ON public.cms_services TO service_role;

GRANT SELECT ON public.cms_posts TO anon, authenticated;
GRANT ALL ON public.cms_posts TO authenticated;
GRANT ALL ON public.cms_posts TO service_role;

GRANT SELECT ON public.cms_case_studies TO anon, authenticated;
GRANT ALL ON public.cms_case_studies TO authenticated;
GRANT ALL ON public.cms_case_studies TO service_role;

-- RLS Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can read services') THEN
        CREATE POLICY "Anyone can read services" ON public.cms_services FOR SELECT TO public USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins/Editors can manage services') THEN
        CREATE POLICY "Admins/Editors can manage services" ON public.cms_services FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'editor'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can read posts') THEN
        CREATE POLICY "Anyone can read posts" ON public.cms_posts FOR SELECT TO public USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins/Editors can manage posts') THEN
        CREATE POLICY "Admins/Editors can manage posts" ON public.cms_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'editor'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can read case studies') THEN
        CREATE POLICY "Anyone can read case studies" ON public.cms_case_studies FOR SELECT TO public USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins/Editors can manage case studies') THEN
        CREATE POLICY "Admins/Editors can manage case studies" ON public.cms_case_studies FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'editor'));
    END IF;
END $$;
