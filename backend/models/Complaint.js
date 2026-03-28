const supabase = require("../config/db");

const Complaint = {
  async create(data) {
    const { data: row, error } = await supabase
      .from("complaints")
      .insert([
        {
          user_id: data.userId,
          complaint_text: data.complaintText,
          emotion: data.emotion,
          category: data.category,
          ai_response: data.aiResponse,
          status: data.status || "Pending",
        },
      ])
      .select(`*, users(id, name, email)`)
      .single();
    if (error) throw error;
    return formatComplaint(row);
  },

  async find(query = {}) {
    let builder = supabase
      .from("complaints")
      .select(`*, users(id, name, email)`)
      .order("created_at", { ascending: false });

    if (query.userId) {
      builder = builder.eq("user_id", query.userId);
    }

    const { data, error } = await builder;
    if (error) throw error;
    return (data || []).map(formatComplaint);
  },

  async findByIdAndUpdate(id, updateData) {
    const updatePayload = {};
    if (updateData.status !== undefined)
      updatePayload.status = updateData.status;
    if (updateData.complaintText !== undefined)
      updatePayload.complaint_text = updateData.complaintText;
    if (updateData.category !== undefined)
      updatePayload.category = updateData.category;
    if (updateData.emotion !== undefined)
      updatePayload.emotion = updateData.emotion;
    if (updateData.aiResponse !== undefined)
      updatePayload.ai_response = updateData.aiResponse;

    const { data, error } = await supabase
      .from("complaints")
      .update(updatePayload)
      .eq("id", id)
      .select(`*, users(id, name, email)`)
      .single();
    if (error) throw error;
    return formatComplaint(data);
  },

  async findByIdAndDelete(id) {
    const { error } = await supabase.from("complaints").delete().eq("id", id);
    if (error) throw error;
    return true;
  },

  async insertMany(rows) {
    const formatted = rows.map((d) => ({
      user_id: d.userId,
      complaint_text: d.complaintText,
      emotion: d.emotion,
      category: d.category,
      ai_response: d.aiResponse,
      status: d.status || "Pending",
    }));
    const { data, error } = await supabase
      .from("complaints")
      .insert(formatted)
      .select();
    if (error) throw error;
    return data;
  },

  async getEmotionCounts() {
    const { data, error } = await supabase.from("complaints").select("emotion");
    if (error) throw error;
    const counts = {};
    for (const row of data) {
      counts[row.emotion] = (counts[row.emotion] || 0) + 1;
    }
    return Object.entries(counts).map(([_id, count]) => ({ _id, count }));
  },

  async getCategoryCounts() {
    const { data, error } = await supabase
      .from("complaints")
      .select("category");
    if (error) throw error;
    const counts = {};
    for (const row of data) {
      counts[row.category] = (counts[row.category] || 0) + 1;
    }
    return Object.entries(counts).map(([_id, count]) => ({ _id, count }));
  },
};

// Normalise Supabase snake_case rows to match old Mongoose camelCase shape
function formatComplaint(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    userId: row.user_id,
    complaintText: row.complaint_text,
    emotion: row.emotion,
    category: row.category,
    aiResponse: row.ai_response,
    status: row.status,
    createdAt: row.created_at,
    // populated user (mimics Mongoose .populate('userId', 'name email'))
    ...(row.users ? { userId: row.users } : {}),
  };
}

module.exports = Complaint;
