import { supabase } from "@/supabaseClient";

export const fetchAllProjects = async () => {
  const { data, error } = await supabase
    .from("projects")
    .select("id, name, duration, category, link, cover");

  if (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }

  return data;
};

export const fetchProjectById = async (id) => {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching project by ID:", error);
    throw error;
  }

  return data;
};
