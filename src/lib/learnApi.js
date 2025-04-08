import { supabase } from "@/supabaseClient";

export const fetchLearnByCategory = async (category) => {
  const { data, error } = await supabase
    .from("learn")
    .select("id, title, des")
    .eq("category", category);

  if (error) {
    console.error("Error fetching learn items:", error);
    throw error;
  }
  return data;
};

export const fetchLearnById = async (id) => {
  const { data, error } = await supabase
    .from("learn")
    .select("id, title, des, content")
    .eq("id", id);

  if (error) {
    console.error("Error fetching learn items:", error);
    throw error;
  }
  return data;
};
