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

ALTER TABLE IF EXISTS public.cms_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cms_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cms_case_studies ENABLE ROW LEVEL SECURITY;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own roles') THEN
        CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage all roles') THEN
        CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
    END IF;
END $$;

-- Seed Services
INSERT INTO public.cms_services (slug, title, icon, desc_short, tagline, intro, benefits, deliverables, plans)
VALUES 
('web-development', 'Web Development', 'Code2', 'Fast, scalable sites and web apps built to convert.', 'Sites that load fast and sell harder', 'We build marketing sites, e-commerce stores and web apps with clean code, real performance budgets and a CMS your team can actually use.', ARRAY['Sub-2s load times on real mobile networks', 'SEO-ready structure, metadata and sitemaps', 'Editable content without calling a developer', 'Analytics and conversion tracking wired in'], ARRAY['Responsive build', 'CMS integration', 'Performance report', '30 days post-launch support'], '[{"name": "Landing", "price": "$900", "note": "one-off", "features": ["1 page", "Contact form", "Basic SEO", "2 revisions"]}, {"name": "Business Site", "price": "$2,400", "note": "one-off", "features": ["Up to 8 pages", "CMS", "SEO setup", "Speed optimisation"], "featured": true}, {"name": "Custom App", "price": "from $6,000", "note": "project", "features": ["Custom features", "Database & auth", "Integrations", "Dedicated PM"]}]'::jsonb),
('graphic-design', 'Graphic Design', 'PenTool', 'Print and social assets with a sharp, consistent voice.', 'Design that looks intentional everywhere', 'From social templates to packaging and print, we produce artwork that stays on-brand across every format and size.', ARRAY['Consistent visual voice across channels', 'Source files you own and can reuse', 'Templates your team can edit', 'Print-ready exports checked for colour'], ARRAY['Source files', 'Export pack', 'Editable templates', 'Usage notes'], '[{"name": "Single Asset", "price": "$120", "note": "per asset", "features": ["1 design", "2 revisions", "Print + digital export"]}, {"name": "Campaign Pack", "price": "$780", "note": "per campaign", "features": ["10 assets", "Social templates", "3 revisions"], "featured": true}, {"name": "Design Retainer", "price": "$1,500", "note": "/month", "features": ["Unlimited requests", "2 active at a time", "48h turnaround"]}]'::jsonb),
('identity-branding', 'Identity Branding', 'Sparkles', 'Logos, systems and guidelines that hold up everywhere.', 'A brand system, not just a logo file', 'We define how your brand looks, sounds and behaves — then document it so every future asset stays coherent.', ARRAY['Distinct positioning against competitors', 'Logo suite for every placement and size', 'Colour, type and tone documented', 'Faster future design work'], ARRAY['Logo suite', 'Colour & type system', 'Brand guidelines PDF', 'Stationery set'], '[{"name": "Starter Identity", "price": "$1,200", "note": "one-off", "features": ["Logo suite", "Colour & type", "Mini guidelines"]}, {"name": "Full Identity", "price": "$3,500", "note": "one-off", "features": ["Strategy workshop", "Full logo system", "Guidelines book", "Launch assets"], "featured": true}, {"name": "Rebrand", "price": "from $7,000", "note": "project", "features": ["Audit & research", "Naming support", "Rollout plan", "Team training"]}]'::jsonb);

-- Seed Blog Posts
INSERT INTO public.cms_posts (slug, title, excerpt, category, date, read_time, body)
VALUES
('brand-audit-checklist', 'The brand audit checklist we run before any redesign', 'Before we touch a single pixel we run a nine-point audit. Here is the exact checklist, so you can run it yourself.', 'Branding', '2026-07-28', '6 min read', ARRAY['Most redesigns fail because they start with taste instead of evidence.', 'We start with inventory...', 'Next comes consistency scoring...', 'Then we look outward...', 'Finally we test comprehension.']),
('website-speed-conversions', 'Why a one-second delay quietly costs you customers', 'Performance is a conversion feature. Here is how we get sites under one second without stripping the design.', 'Web Development', '2026-07-14', '5 min read', ARRAY['Speed is not a technical vanity metric.', 'The biggest wins are rarely exotic.', 'We serve pages rendered on the server...', 'Third-party scripts deserve special attention.', 'We treat performance as a budget...']);

-- Seed Case Studies
INSERT INTO public.cms_case_studies (slug, client, title, summary, industry, year, services, service_slugs, challenge, approach, results, quote)
VALUES
('northwind-saas', 'Northwind SaaS', 'A rebrand and rebuild that doubled demo requests', 'New identity, new marketing site and a conversion-focused demo funnel, shipped in six weeks.', 'B2B software', '2026', ARRAY['Identity Branding', 'Web Development', 'UI/UX Design'], ARRAY['identity-branding', 'web-development', 'ui-ux-design'], 'Northwind looked like a side project...', ARRAY['Ran a nine-point brand audit...', 'Built a full identity system...', 'Rebuilt the site...', 'Wired analytics...'], '[{"label": "Demo requests", "value": "+108%"}, {"label": "Load time", "value": "0.9s"}]'::jsonb, '{"text": "Mario Studio rebuilt our site and identity in six weeks.", "name": "Lina Okafor", "role": "Co-founder"}');

REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM public, authenticated, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

-- Storage Policies for cms-assets
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Public Access" ON storage.objects FOR SELECT TO public USING (bucket_id = 'cms-assets');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated Upload' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'cms-assets');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated Update' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Authenticated Update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'cms-assets');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated Delete' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'cms-assets');
    END IF;
END $$;

-- Update Web Development plans
UPDATE public.cms_services
SET plans = '[
  {"name": "Basic", "price": "00", "note": "one-off", "features": ["1 page", "Contact form", "Basic SEO", "2 revisions"]},
  {"name": "Starter", "price": ",400", "note": "one-off", "features": ["Up to 8 pages", "CMS", "SEO setup", "Speed optimisation"], "featured": true},
  {"name": "Premium", "price": "from ,000", "note": "project", "features": ["Custom features", "Database & auth", "Integrations", "Dedicated PM"]}
]'::jsonb
WHERE slug = 'web-development';

-- sort_order column
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'cms_services' AND column_name = 'sort_order') THEN
        ALTER TABLE public.cms_services ADD COLUMN sort_order INTEGER DEFAULT 100;
        GRANT UPDATE (sort_order) ON public.cms_services TO authenticated;
        GRANT SELECT ON public.cms_services TO authenticated;
        GRANT SELECT ON public.cms_services TO anon;
    END IF;
END $$;

UPDATE public.cms_services SET sort_order = 1 WHERE slug = 'web-development';
UPDATE public.cms_services SET sort_order = 2 WHERE slug = 'graphic-design';
UPDATE public.cms_services SET sort_order = 3 WHERE slug = 'identity-branding';
UPDATE public.cms_services SET sort_order = 4 WHERE slug = 'ui-ux-design';
UPDATE public.cms_services SET sort_order = 5 WHERE slug = 'video-editing';
UPDATE public.cms_services SET sort_order = 6 WHERE slug = 'brand-audit';
UPDATE public.cms_services SET sort_order = 7 WHERE slug = 'web-maintenance';
UPDATE public.cms_services SET sort_order = 8 WHERE slug = 'web-security';
UPDATE public.cms_services SET sort_order = 9 WHERE slug = 'digital-marketing';

INSERT INTO public.cms_services (slug, icon, title, desc_short, tagline, intro, benefits, deliverables, plans, sort_order) VALUES
(
  'motion-design',
  'PlayCircle',
  'Motion Design',
  'Animated logos, explainer videos, and UI animations that bring interfaces to life.',
  'Design that moves, literally',
  'We create high-end animations that bridge the gap between static design and interactive experiences.',
  ARRAY['Higher engagement rates on social', 'Clearer user guidance through UI motion', 'More premium brand perception', 'Custom-timed to sound'],
  ARRAY['Animated logo set', 'Lottie files for web', '4K video exports', 'Source project files'],
  '[{"name": "Basic", "price": "$400", "note": "per asset", "features": ["1 animation", "Lottie/GIF", "2 revisions"]}, {"name": "Starter", "price": "$1,400", "note": "per video", "features": ["60s explainer", "Sound design", "3 revisions"], "featured": true}, {"name": "Premium", "price": "from $3,000", "note": "project", "features": ["Full set of brand motion", "UI interactions", "SLA support"]}]',
  10
),
(
  'ecommerce-strategy',
  'ShoppingCart',
  'E-commerce Strategy',
  'Specialized CRO and optimization to turn your online store into a sales engine.',
  'Sell more, without spending more on ads',
  'We audit your funnel, optimize your checkout, and set up the retention systems that keep customers coming back.',
  ARRAY['Reduced cart abandonment', 'Higher Average Order Value (AOV)', 'Data-backed design decisions', 'Automated email flows'],
  ARRAY['Funnel audit report', 'A/B test results', 'Retention flow setup', 'Revenue dashboard'],
  '[{"name": "Basic", "price": "$800", "note": "audit", "features": ["Store audit", "Fix roadmap", "Speed report"]}, {"name": "Starter", "price": "$2,200", "note": "per month", "features": ["Monthly A/B testing", "Email flows", "CRO updates"], "featured": true}, {"name": "Premium", "price": "from $5,000", "note": "project", "features": ["Custom checkout build", "Loyalty program", "ERP integration"]}]',
  11
),
(
  'ai-automation',
  'Cpu',
  'AI Automation',
  'Custom chatbots and workflows that save your team hours of manual work.',
  'Automate the boring parts of your business',
  'We build custom AI integrations that handle customer support, data entry, and content generation while you sleep.',
  ARRAY['Hours of manual labor saved weekly', '24/7 instant customer support', 'Lower operational overhead', 'Scalable data processing'],
  ARRAY['Custom AI chatbot', 'Zapier/Make workflows', 'Documentation', 'Team training'],
  '[{"name": "Basic", "price": "$1,200", "note": "setup", "features": ["1 chatbot", "Knowledge base", "Basic integration"]}, {"name": "Starter", "price": "$3,500", "note": "project", "features": ["3 core workflows", "Advanced AI", "CRM sync"], "featured": true}, {"name": "Premium", "price": "from $8,000", "note": "custom", "features": ["Custom LLM training", "Full system audit", "Ongoing maintenance"]}]',
  12
),
(
  'sem-paid-social',
  'BarChart3',
  'SEM & Paid Social',
  'High-performance ad campaigns managed for maximum ROI and pipeline.',
  'Ad spend that actually returns',
  'We manage your Google and Meta budgets with a focus on profit, not just clicks or impressions.',
  ARRAY['Direct attribution to revenue', 'Optimized cost-per-acquisition', 'Constant creative testing', 'Transparent reporting'],
  ARRAY['Campaign setup', 'Ad creative', 'Weekly optimization', 'Live dashboard'],
  '[{"name": "Basic", "price": "$1,000", "note": "/month", "features": ["1 platform", "Ad copy", "Monthly report"]}, {"name": "Starter", "price": "$2,500", "note": "/month", "features": ["Multi-platform", "Video ads", "Weekly sync"], "featured": true}, {"name": "Premium", "price": "10% of spend", "note": "/month", "features": ["Unlimited platforms", "Creative production", "Dedicated team"]}]',
  13
),
(
  'content-strategy',
  'PenLine',
  'Content Strategy',
  'High-authority writing and strategy that builds trust and drives conversions.',
  'Words that work as hard as your design',
  'We map out your content funnel and write the copy that turns skeptics into loyal customers.',
  ARRAY['Consistent brand voice', 'SEO-driven topical authority', 'High-converting sales pages', 'Reusable content pillars'],
  ARRAY['Content roadmap', 'Sales page copy', 'Email sequences', 'Blog posts'],
  '[{"name": "Basic", "price": "$900", "note": "per asset", "features": ["1 sales page", "SEO optimization", "2 revisions"]}, {"name": "Starter", "price": "$2,800", "note": "/month", "features": ["4 long-form posts", "Email setup", "Strategy"], "featured": true}, {"name": "Premium", "price": "from $6,000", "note": "project", "features": ["Full site rewrite", "Whitepaper", "Ongoing PR"]}]',
  14
),
(
  'saas-product-strategy',
  'Target',
  'SaaS Product Strategy',
  'Strategic consulting to find product-market fit and scale your software.',
  'Build the right thing, the first time',
  'We help you define your MVP, prioritize your roadmap, and design the monetization models that scale.',
  ARRAY['Reduced wasted dev time', 'Clearer product-market fit', 'Data-backed roadmap', 'Investor-ready docs'],
  ARRAY['Product roadmap', 'User research report', 'Pricing model', 'MVP scope'],
  '[{"name": "Basic", "price": "$1,500", "note": "workshop", "features": ["1-day intensive", "Summary report", "Action plan"]}, {"name": "Starter", "price": "$4,500", "note": "per month", "features": ["Ongoing advisory", "User testing", "Sprint support"], "featured": true}, {"name": "Premium", "price": "from $15,000", "note": "project", "features": ["Full market entry", "Growth engine", "Fractional CPO"]}]',
  15
);

-- 1. Create lead_submissions table
create table public.lead_submissions (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    name text not null,
    email text not null,
    service_slug text not null,
    tier text not null,
    message text,
    status text default 'new'
);

-- 2. Grant permissions
grant select, insert, update, delete on public.lead_submissions to authenticated;
grant all on public.lead_submissions to service_role;
grant insert on public.lead_submissions to anon;

-- 3. Enable RLS
alter table public.lead_submissions enable row level security;

-- 4. Policies
create policy "Authenticated users can read all leads"
on public.lead_submissions for select to authenticated using (true);

create policy "Authenticated users can update leads"
on public.lead_submissions for update to authenticated using (true);

create policy "Anyone can insert a lead"
on public.lead_submissions for insert to anon with check (true);

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;

ALTER TABLE public.lead_submissions ADD COLUMN source TEXT DEFAULT 'direct';
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_submissions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_submissions TO anon;
GRANT ALL ON public.lead_submissions TO service_role;

CREATE TABLE IF NOT EXISTS public.notification_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

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

GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_submissions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_submissions TO anon;
GRANT ALL ON public.lead_submissions TO service_role;