import { supabase } from "@/integrations/supabase/client";

export const getServices = async () => {
  const { data, error } = await supabase
    .from("cms_services")
    .select("*")
    .order("sort_order", { ascending: true });
  
  if (error) throw error;
  return data;
};

export const getServiceBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("cms_services")
    .select("*")
    .eq("slug", slug)
    .single();
  
  if (error) throw error;
  return data;
};

export const getPosts = async (category?: string) => {
  let query = supabase
    .from("cms_posts")
    .select("*")
    .order("date", { ascending: false });
  
  if (category) {
    query = query.eq("category", category);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getPostBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("cms_posts")
    .select("*")
    .eq("slug", slug)
    .single();
  
  if (error) throw error;
  return data;
};

export const getCaseStudies = async () => {
  const { data, error } = await supabase
    .from("cms_case_studies")
    .select("*")
    .order("year", { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getCaseStudyBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("cms_case_studies")
    .select("*")
    .eq("slug", slug)
    .single();
  
  if (error) throw error;
  return data;
};
