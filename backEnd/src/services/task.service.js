import Task from "../models/Task.js";

export default {
  async createTask(input) {
    return await Task.create(input);
  },

  async updateTask(id, data) {
    return await Task.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteTask(id) {
    return await Task.findByIdAndDelete(id);
  },

  async getTask(id) {
    return await Task.findById(id);
  },

  async listTasks(filters = {}, search = "") {
    const query = {};

    if (filters.status && filters.status !== "All") {
      query.status = filters.status;
    }

    if (filters.priority && filters.priority !== "All") {
      query.priority = filters.priority;
    }

    if (filters.dueDate) {
      query.dueDate = { $lte: new Date(filters.dueDate) };
    }

    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
    }

    return Task.find(query).sort({ createdAt: -1 });
  },
};
