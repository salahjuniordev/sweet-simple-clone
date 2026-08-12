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