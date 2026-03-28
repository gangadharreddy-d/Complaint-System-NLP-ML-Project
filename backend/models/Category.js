const supabase = require("../config/db");

const Category = {
  async findAll() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(name) {
    const { data, error } = await supabase
      .from("categories")
      .insert([{ name }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async findByName(name) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("name", name)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  },
};

module.exports = Category;
