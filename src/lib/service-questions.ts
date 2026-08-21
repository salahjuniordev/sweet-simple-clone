/**
 * Service-specific intake questions for each of the 15 Mario Studio services.
 * Each question has: key, label, type, required, options (if applicable), placeholder.
 */

export type IntakeQuestion = {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "multi-select" | "radio" | "checkbox" | "url" | "file";
  required?: boolean;
  placeholder?: string;
  options?: string[];
  description?: string;
  conditionKey?: string;
  conditionValue?: string;
};

export const serviceQuestions: Record<string, IntakeQuestion[]> = {
  "identity-branding": [
    { key: "project_type", label: "New brand or rebrand?", type: "radio", required: true, options: ["New brand", "Rebrand", "Not sure"] },
    { key: "has_logo", label: "Do you already have a logo?", type: "radio", options: ["Yes", "No"] },
    { key: "has_guidelines", label: "Do you have existing brand guidelines?", type: "radio", options: ["Yes", "No", "Partial"] },
    { key: "current_problems", label: "What are your current brand problems?", type: "textarea", placeholder: "Describe what's not working with your current brand..." },
    { key: "desired_positioning", label: "How do you want your brand to be positioned?", type: "textarea", placeholder: "Describe the image and perception you want..." },
    { key: "brand_personality", label: "Brand personality", type: "multi-select", options: ["Professional", "Playful", "Bold", "Minimal", "Luxurious", "Friendly", "Technical", "Creative"] },
    { key: "preferred_colors", label: "Do you have preferred colors or styles?", type: "textarea", placeholder: "Mention any colors, styles, or moods you like..." },
    { key: "colors_to_avoid", label: "Any colors or styles to avoid?", type: "textarea" },
    { key: "logo_requirements", label: "Logo requirements", type: "textarea", placeholder: "Any specific requirements for the logo (variations, formats, usage)..." },
    { key: "desired_deliverables", label: "What deliverables do you need?", type: "multi-select", options: ["Logo suite", "Colour system", "Typography system", "Brand guidelines", "Business cards", "Stationery", "Social media kit", "Brand presentation", "All of the above"] },
    { key: "existing_files", label: "Upload any existing brand files", type: "file" },
  ],

  "ui-ux-design": [
    { key: "product_type", label: "What are you building?", type: "radio", required: true, options: ["Website", "Mobile app", "SaaS platform", "Dashboard", "E-commerce", "Other"] },
    { key: "existing_product", label: "Is this a new product or existing?", type: "radio", options: ["New product", "Existing product redesign", "Not sure"] },
    { key: "target_users", label: "Who are your target users?", type: "textarea", placeholder: "Describe your primary user personas..." },
    { key: "main_problems", label: "What user problems are you solving?", type: "textarea", required: true, placeholder: "Describe the main pain points..." },
    { key: "required_features", label: "List the required features", type: "textarea", placeholder: "Feature 1, Feature 2, Feature 3..." },
    { key: "screen_count", label: "Approximate number of screens", type: "select", options: ["1–5", "6–15", "16–30", "30+", "Not sure"] },
    { key: "has_design_system", label: "Do you have an existing design system?", type: "radio", options: ["Yes", "No", "Partial"] },
    { key: "has_figma", label: "Do you have existing Figma files?", type: "radio", options: ["Yes", "No"] },
    { key: "product_url", label: "Existing product URL (if any)", type: "url", placeholder: "https://..." },
    { key: "desired_deliverables", label: "What deliverables do you need?", type: "multi-select", options: ["User flows", "Wireframes", "High-fidelity UI", "Prototypes", "Design system", "All of the above"] },
  ],

  "web-development": [
    { key: "project_type", label: "What type of web project?", type: "radio", required: true, options: ["Marketing website", "E-commerce store", "Landing page", "Web application", "Custom application", "Blog/CMS", "Other"] },
    { key: "existing_website", label: "Do you have an existing website?", type: "radio", options: ["Yes", "No"] },
    { key: "existing_url", label: "Current website URL (if any)", type: "url", placeholder: "https://..." },
    { key: "required_pages", label: "Estimated number of pages", type: "select", options: ["1–5", "6–15", "16–30", "30+", "Not sure"] },
    { key: "required_functionality", label: "Required functionality", type: "multi-select", options: ["Contact forms", "Blog", "E-commerce", "Search", "User accounts", "Booking system", "Chat", "API integration", "Multi-language", "Analytics", "Custom features"] },
    { key: "needs_cms", label: "Do you need a CMS?", type: "radio", options: ["Yes", "No", "Not sure"] },
    { key: "needs_auth", label: "Do you need user authentication?", type: "radio", options: ["Yes", "No", "Not sure"] },
    { key: "needs_payments", label: "Do you need payment processing?", type: "radio", options: ["Yes", "No", "Not sure"] },
    { key: "seo_requirements", label: "SEO requirements", type: "textarea", placeholder: "Any specific SEO needs or target keywords..." },
    { key: "hosting_preferences", label: "Hosting/domain preferences", type: "textarea", placeholder: "Any hosting requirements or existing domain..." },
    { key: "has_designs", label: "Do you have existing designs?", type: "radio", options: ["Yes, in Figma", "Yes, in Photoshop", "Yes, rough sketches", "No, need design too"] },
    { key: "existing_code", label: "Any existing code or assets to reuse?", type: "textarea" },
  ],

  "graphic-design": [
    { key: "design_type", label: "What type of design do you need?", type: "radio", required: true, options: ["Social media graphics", "Print materials", "Packaging", "Presentation design", "Infographics", "Illustrations", "Other"] },
    { key: "asset_count", label: "Number of assets needed", type: "select", options: ["1–5", "6–10", "11–20", "20+", "Not sure"] },
    { key: "format", label: "Digital or print?", type: "radio", options: ["Digital only", "Print only", "Both"] },
    { key: "platform", label: "Where will these be used?", type: "multi-select", options: ["Instagram", "Facebook", "LinkedIn", "Twitter/X", "TikTok", "Website", "Print", "Billboard", "Other"] },
    { key: "dimensions", label: "Any specific dimensions or formats?", type: "textarea", placeholder: "e.g., 1080x1080, A4, business card..." },
    { key: "has_brand_guidelines", label: "Do you have brand guidelines?", type: "radio", options: ["Yes", "No"] },
    { key: "copy_ready", label: "Is the copy/content ready?", type: "radio", options: ["Yes", "No", "Partially"] },
    { key: "reference_designs", label: "Reference designs or styles you like", type: "textarea", placeholder: "Links or descriptions of designs you admire..." },
    { key: "desired_style", label: "Describe the desired style", type: "textarea", placeholder: "Modern, vintage, minimal, bold..." },
    { key: "needs_source_files", label: "Do you need editable source files?", type: "radio", options: ["Yes", "No"] },
    { key: "existing_assets", label: "Upload any existing assets", type: "file" },
  ],

  "video-editing": [
    { key: "video_type", label: "What type of video?", type: "radio", required: true, options: ["Social media short-form", "Product demo", "Brand film", "Event recap", "Tutorial/explainer", "Testimonial", "Ad/campaign", "Other"] },
    { key: "video_count", label: "Number of videos needed", type: "select", options: ["1", "2–5", "6–12", "12+", "Not sure"] },
    { key: "duration", label: "Target duration per video", type: "select", options: ["Under 30 seconds", "30–60 seconds", "1–3 minutes", "3–5 minutes", "5+ minutes", "Varies"] },
    { key: "platform", label: "Where will the videos be published?", type: "multi-select", options: ["Instagram Reels", "TikTok", "YouTube", "Facebook", "LinkedIn", "Website", "TV/Broadcast", "Other"] },
    { key: "aspect_ratio", label: "Aspect ratio needed", type: "multi-select", options: ["16:9 (landscape)", "9:16 (vertical)", "1:1 (square)", "4:5 (portrait)", "Varies per platform"] },
    { key: "has_footage", label: "Do you have raw footage?", type: "radio", options: ["Yes", "No", "Partial"] },
    { key: "footage_volume", label: "Approximate amount of raw footage", type: "select", options: ["Under 10 minutes", "10–30 minutes", "30–60 minutes", "1–2 hours", "2+ hours", "Not sure"] },
    { key: "needs_captions", label: "Do you need captions/subtitles?", type: "radio", options: ["Yes", "No", "Depends"] },
    { key: "needs_motion_graphics", label: "Do you need motion graphics?", type: "radio", options: ["Yes", "No", "Maybe"] },
    { key: "music_preference", label: "Music preferences", type: "textarea", placeholder: "Genre, mood, or specific tracks..." },
    { key: "reference_videos", label: "Reference videos you like", type: "textarea", placeholder: "Links or descriptions of videos with the style you want..." },
    { key: "export_formats", label: "Required export formats", type: "multi-select", options: ["MP4", "MOV", "GIF", "WebM", "Platform-specific exports"] },
    { key: "upload_footage", label: "Upload footage or assets", type: "file" },
  ],

  "brand-audit": [
    { key: "website_url", label: "Website URL", type: "url", required: true, placeholder: "https://..." },
    { key: "social_urls", label: "Social media URLs", type: "textarea", placeholder: "Paste your main social media profile links..." },
    { key: "business_objective", label: "Main business objective", type: "textarea", required: true, placeholder: "What are you trying to achieve?" },
    { key: "biggest_challenge", label: "Biggest current challenge", type: "textarea", placeholder: "What's the main problem you're facing?" },
    { key: "target_audience", label: "Target audience", type: "textarea", placeholder: "Who are your ideal customers?" },
    { key: "competitors", label: "Main competitors", type: "textarea", placeholder: "List your main competitors..." },
    { key: "brand_concerns", label: "Brand concerns", type: "multi-select", options: ["Logo", "Colours", "Typography", "Voice/tone", "Consistency", "Positioning", "All of the above"] },
    { key: "website_concerns", label: "Website concerns", type: "multi-select", options: ["Speed", "Design", "Mobile experience", "SEO", "Conversion", "Content", "All of the above"] },
    { key: "content_concerns", label: "Content concerns", type: "multi-select", options: ["Blog", "Social media", "Email", "Ad copy", "Website copy", "All of the above"] },
    { key: "review_areas", label: "Specific areas you want reviewed", type: "textarea", placeholder: "Be specific about what you want us to focus on..." },
    { key: "reference_materials", label: "Upload reference materials", type: "file" },
  ],

  "web-maintenance": [
    { key: "website_url", label: "Website URL", type: "url", required: true, placeholder: "https://..." },
    { key: "platform", label: "Website platform/CMS", type: "select", required: true, options: ["WordPress", "Shopify", "Custom/HTML", "Squarespace", "Wix", "Webflow", "Next.js/React", "Other"] },
    { key: "main_concerns", label: "Main maintenance concerns", type: "multi-select", options: ["Security updates", "Plugin updates", "Performance", "Backups", "Uptime monitoring", "Content updates", "Bug fixes", "All of the above"] },
    { key: "update_frequency", label: "How often do you update content?", type: "select", options: ["Daily", "Weekly", "Monthly", "Rarely", "Never"] },
    { key: "has_staging", label: "Do you have a staging environment?", type: "radio", options: ["Yes", "No", "Not sure"] },
    { key: "current_issues", label: "Any current issues?", type: "textarea", placeholder: "Describe any problems you're experiencing..." },
    { key: "maintenance_level", label: "What level of maintenance do you need?", type: "select", options: ["Essential (monthly updates, backups)", "Care (weekly updates, content edits)", "Enterprise (24/7, dedicated dev time)", "Not sure — help me choose"] },
  ],

  "web-security": [
    { key: "website_url", label: "Website URL", type: "url", required: true, placeholder: "https://..." },
    { key: "platform", label: "Website platform", type: "select", required: true, options: ["WordPress", "Shopify", "Custom/HTML", "Squarespace", "Wix", "Webflow", "Next.js/React", "Other"] },
    { key: "security_concerns", label: "Specific security concerns", type: "multi-select", options: ["SSL/HTTPS", "Firewall", "Malware", "DDoS protection", "Data breaches", "Login security", "File uploads", "API security", "Compliance"] },
    { key: "had_incidents", label: "Have you had security incidents before?", type: "radio", options: ["Yes", "No", "Not sure"] },
    { key: "incident_details", label: "If yes, describe the incidents", type: "textarea", placeholder: "What happened and when..." },
    { key: "sensitive_data", label: "Does the site handle sensitive data?", type: "radio", options: ["Yes (personal data, payments)", "No", "Not sure"] },
    { key: "compliance_needs", label: "Any compliance requirements?", type: "multi-select", options: ["GDPR", "PCI DSS", "SOC 2", "HIPAA", "None", "Not sure"] },
  ],

  "digital-marketing": [
    { key: "marketing_goals", label: "Main marketing goals", type: "multi-select", required: true, options: ["Lead generation", "Brand awareness", "Sales/conversions", "Traffic", "Engagement", "App installs", "Other"] },
    { key: "current_channels", label: "Current marketing channels", type: "multi-select", options: ["Google Ads", "Facebook/Meta", "Instagram", "LinkedIn", "TikTok", "Email", "SEO", "Content marketing", "None yet"] },
    { key: "monthly_budget", label: "Monthly ad spend budget", type: "select", options: ["Under $500", "$500–$1,000", "$1,000–$3,000", "$3,000–$10,000", "$10,000+", "Not sure"] },
    { key: "target_audience", label: "Target audience", type: "textarea", required: true, placeholder: "Describe your ideal customers..." },
    { key: "geographic_target", label: "Geographic targeting", type: "textarea", placeholder: "Countries, regions, or cities you want to target..." },
    { key: "has_landing_pages", label: "Do you have landing pages?", type: "radio", options: ["Yes", "No", "Need them built"] },
    { key: "past_results", label: "Any past campaign results?", type: "textarea", placeholder: "CPC, CTR, ROAS, or other metrics..." },
    { key: "preferred_platform", label: "Preferred advertising platform", type: "radio", options: ["Google Ads", "Meta (Facebook/Instagram)", "Both", "Not sure"] },
  ],

  "motion-design": [
    { key: "animation_type", label: "What type of animation do you need?", type: "radio", required: true, options: ["Animated logo", "UI animation", "Explainer video", "Lottie files", "Social media motion", "Product animation", "Other"] },
    { key: "animation_count", label: "Number of animations needed", type: "select", options: ["1", "2–5", "6–10", "10+", "Not sure"] },
    { key: "duration", label: "Target duration (if video)", type: "select", options: ["Under 5 seconds", "5–15 seconds", "15–30 seconds", "30–60 seconds", "1+ minutes", "N/A (not video)"] },
    { key: "style", label: "Desired animation style", type: "multi-select", options: ["Minimal/flat", "3D", "Kinetic typography", "Liquid/morph", "Geometric", "Organic", "Retro/vintage", "Futuristic"] },
    { key: "platform", label: "Where will it be used?", type: "multi-select", options: ["Website", "Mobile app", "Social media", "Video intro/outro", "Presentations", "TV/Broadcast", "Other"] },
    { key: "needs_sound", label: "Does it need sound design?", type: "radio", options: ["Yes", "No", "Maybe"] },
    { key: "has_existing_assets", label: "Do you have existing design files?", type: "radio", options: ["Yes (Figma)", "Yes (PSD/AI)", "No", "Other format"] },
    { key: "reference_animations", label: "Reference animations you like", type: "textarea", placeholder: "Links or descriptions of animations with the style you want..." },
  ],

  "ecommerce-strategy": [
    { key: "store_url", label: "Your store URL", type: "url", required: true, placeholder: "https://..." },
    { key: "platform", label: "E-commerce platform", type: "select", required: true, options: ["Shopify", "WooCommerce", "Magento", "Custom", "Not launched yet", "Other"] },
    { key: "monthly_revenue", label: "Approximate monthly revenue", type: "select", options: ["Under $1,000", "$1,000–$5,000", "$5,000–$20,000", "$20,000–$100,000", "$100,000+", "Pre-launch"] },
    { key: "main_goals", label: "Main goals", type: "multi-select", required: true, options: ["Increase conversions", "Reduce cart abandonment", "Improve AOV", "Customer retention", "Email marketing", "Product listings", "Overall strategy"] },
    { key: "biggest_challenge", label: "Biggest current challenge", type: "textarea", placeholder: "What's the main problem with your store?" },
    { key: "has_analytics", label: "Do you have analytics set up?", type: "radio", options: ["Yes (GA4)", "Yes (other)", "No"] },
    { key: "has_email_marketing", label: "Do you have email marketing?", type: "radio", options: ["Yes ( Klaviyo)", "Yes (other)", "No", "Need to set up"] },
    { key: "product_count", label: "Number of products", type: "select", options: ["1–10", "11–50", "51–200", "200+", "Not launched yet"] },
  ],

  "ai-automation": [
    { key: "automation_type", label: "What do you want to automate?", type: "multi-select", required: true, options: ["Customer support", "Data entry", "Content generation", "Email workflows", "Social media", "Lead qualification", "Reporting", "Internal processes", "Other"] },
    { key: "current_process", label: "Describe your current process", type: "textarea", required: true, placeholder: "How do you handle this today? How much time does it take?" },
    { key: "time_saved", label: "How many hours per week do you want to save?", type: "select", options: ["1–5 hours", "5–10 hours", "10–20 hours", "20+ hours", "Not sure"] },
    { key: "tech_stack", label: "Your current tech stack", type: "textarea", placeholder: "CRM, email tools, chat platform, databases..." },
    { key: "has_chatbot", label: "Do you want a chatbot?", type: "radio", options: ["Yes", "No", "Maybe"] },
    { key: "chatbot_scope", label: "Chatbot scope", type: "textarea", placeholder: "What should the chatbot handle?" },
    { key: "integrations_needed", label: "Integrations needed", type: "multi-select", options: ["Zapier", "Make", "Slack", "CRM", "Email", "Google Sheets", "Calendar", "Payment", "Custom API", "Other"] },
    { key: "data_volume", label: "Approximate data volume", type: "select", options: ["Small (<100 records/day)", "Medium (100–1,000/day)", "Large (1,000–10,000/day)", "Very large (10,000+/day)", "Not sure"] },
  ],

  "sem-paid-social": [
    { key: "ad_platform", label: "Which platforms?", type: "multi-select", required: true, options: ["Google Ads", "Meta (Facebook/Instagram)", "LinkedIn Ads", "TikTok Ads", "Twitter/X Ads", "Not sure"] },
    { key: "campaign_goals", label: "Campaign goals", type: "multi-select", required: true, options: ["Conversions/sales", "Lead generation", "Brand awareness", "Traffic", "App installs", "Retargeting"] },
    { key: "monthly_budget", label: "Monthly ad spend budget", type: "select", required: true, options: ["Under $500", "$500–$1,000", "$1,000–$3,000", "$3,000–$10,000", "$10,000+", "Not sure"] },
    { key: "target_audience", label: "Target audience", type: "textarea", required: true, placeholder: "Describe your ideal customers..." },
    { key: "has_ads_account", label: "Do you have existing ad accounts?", type: "radio", options: ["Yes", "No"] },
    { key: "past_performance", label: "Past ad performance (if any)", type: "textarea", placeholder: "CPC, CTR, ROAS, monthly spend..." },
    { key: "landing_pages", label: "Do you have landing pages?", type: "radio", options: ["Yes", "No", "Need them built"] },
    { key: "creative_assets", label: "Do you have ad creative?", type: "radio", options: ["Yes", "No", "Need creative production"] },
  ],

  "content-strategy": [
    { key: "content_goals", label: "Content goals", type: "multi-select", required: true, options: ["SEO/organic traffic", "Lead generation", "Brand authority", "Social media growth", "Email marketing", "Sales support", "Education"] },
    { key: "content_types", label: "Content types needed", type: "multi-select", required: true, options: ["Blog posts", "Sales pages", "Email sequences", "Social media", "Case studies", "Whitepapers", "Video scripts", "Website copy"] },
    { key: "industry", label: "Your industry/niche", type: "text", placeholder: "e.g., SaaS, e-commerce, healthcare..." },
    { key: "target_audience", label: "Target audience", type: "textarea", required: true, placeholder: "Who are you writing for?" },
    { key: "current_content", label: "Current content situation", type: "textarea", placeholder: "Do you have existing content? What's working/not working?" },
    { key: "brand_voice", label: "Brand voice preferences", type: "textarea", placeholder: "Professional, casual, technical, friendly..." },
    { key: "competitors_content", label: "Competitors' content you admire", type: "textarea", placeholder: "Links or descriptions..." },
    { key: "budget_for_content", label: "Content production budget", type: "select", options: ["Under $1,000", "$1,000–$3,000", "$3,000–$6,000", "$6,000+", "Not sure"] },
  ],

  "saas-product-strategy": [
    { key: "product_stage", label: "Product stage", type: "radio", required: true, options: ["Idea/concept", "MVP in development", "Launched, seeking growth", "Established, optimizing", "Not sure"] },
    { key: "target_users", label: "Target users", type: "textarea", required: true, placeholder: "Who are your primary users?" },
    { key: "problem_solved", label: "What problem does your product solve?", type: "textarea", required: true, placeholder: "Describe the core problem..." },
    { key: "existing_competition", label: "Existing competitors", type: "textarea", placeholder: "List competitors and how you differentiate..." },
    { key: "monetization_model", label: "Monetization model", type: "multi-select", options: ["Subscription (monthly)", "Subscription (annual)", "Freemium", "Usage-based", "One-time purchase", "Marketplace fees", "Not decided"] },
    { key: "current_mrr", label: "Current MRR (if launched)", type: "select", options: ["Pre-revenue", "Under $1,000", "$1,000–$10,000", "$10,000–$50,000", "$50,000+", "Prefer not to say"] },
    { key: "team_size", label: "Development team size", type: "select", options: ["Just me", "2–3 people", "4–10 people", "10+", "Need to hire"] },
    { key: "key_metrics", label: "Key metrics you track", type: "multi-select", options: ["MRR", "Churn rate", "CAC", "LTV", "Activation rate", "DAU/MAU", "NPS", "None yet"] },
    { key: "product_url", label: "Product URL (if launched)", type: "url", placeholder: "https://..." },
  ],
};

/** Get intake questions for a given service slug (hardcoded fallback) */
export function getQuestionsForService(slug: string): IntakeQuestion[] {
  return serviceQuestions[slug] || [];
}

/** Get all questions for multiple selected services (hardcoded fallback) */
export function getQuestionsForServices(slugs: string[]): Record<string, IntakeQuestion[]> {
  const result: Record<string, IntakeQuestion[]> = {};
  for (const slug of slugs) {
    const questions = getQuestionsForService(slug);
    if (questions.length > 0) {
      result[slug] = questions;
    }
  }
  return result;
}

/** Check if a question should be visible based on current answers and conditional rules */
export function isQuestionVisible(
  question: IntakeQuestion,
  allAnswers: Record<string, Record<string, unknown>>,
  serviceSlug: string
): boolean {
  if (!question.conditionKey || !question.conditionValue) return true;

  // Look for the condition source question's answer in any service's answers
  for (const slug of Object.keys(allAnswers)) {
    const serviceAnswers = allAnswers[slug] || {};
    const sourceAnswer = serviceAnswers[question.conditionKey];
    if (sourceAnswer !== undefined) {
      if (Array.isArray(sourceAnswer)) {
        return sourceAnswer.includes(question.conditionValue);
      }
      return String(sourceAnswer) === question.conditionValue;
    }
  }

  return false;
}
