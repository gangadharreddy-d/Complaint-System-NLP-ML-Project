const supabase = require("../config/db");

const KnowledgeBase = {
  async findAll() {
    const { data, error } = await supabase
      .from("knowledge_base")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async findByCategory(category) {
    const { data, error } = await supabase
      .from("knowledge_base")
      .select("*")
      .eq("category", category);
    if (error) throw error;
    return data || [];
  },

  async create(item) {
    const { data, error } = await supabase
      .from("knowledge_base")
      .insert([item])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

module.exports = KnowledgeBase;
