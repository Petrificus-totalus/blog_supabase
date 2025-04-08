import { supabase } from "@/supabaseClient";

/**
 * 获取所有 dish 的简略信息
 */
export const fetchAllDishes = async () => {
  const { data, error } = await supabase
    .from("dish")
    .select("id, name, category, image");

  if (error) {
    console.error("Error fetching dishes:", error);
    throw error;
  }

  return data;
};

/**
 * 根据 ID 获取完整的 dish 信息
 * @param {number} id
 */
export const fetchDishById = async (id) => {
  const { data, error } = await supabase
    .from("dish")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching dish by ID:", error);
    throw error;
  }

  return data;
};
