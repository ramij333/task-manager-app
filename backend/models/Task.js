const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    recurring: { type: Boolean, default: false },
    recurringType: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      required: false,
    },
    
completedDates: {
  type: [Date],
  default: [],
},

  },
  
  { timestamps: true }
);

module.exports = model("Task", taskSchema);
