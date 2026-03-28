const supabase = require("../config/db");

const User = {
  async findByEmail(email) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  },

  async create(userData) {
    const { data, error } = await supabase
      .from("users")
      .insert([userData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

module.exports = User;
