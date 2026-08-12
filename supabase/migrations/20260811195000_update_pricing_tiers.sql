-- Update Web Development plans
UPDATE public.cms_services
SET plans = '[
  {"name": "Basic", "price": "00", "note": "one-off", "features": ["1 page", "Contact form", "Basic SEO", "2 revisions"]},
  {"name": "Starter", "price": ",400", "note": "one-off", "features": ["Up to 8 pages", "CMS", "SEO setup", "Speed optimisation"], "featured": true},
  {"name": "Premium", "price": "from ,000", "note": "project", "features": ["Custom features", "Database & auth", "Integrations", "Dedicated PM"]}
]'::jsonb
WHERE slug = 'web-development';
