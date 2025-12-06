import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do"
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "None"],
      default: "None",
    },

    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Task", TaskSchema);
