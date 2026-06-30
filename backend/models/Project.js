const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    client: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    scope: {
      type: String,
    },

    totalHours: {
      type: Number,
      required: true,
    },

    budget: {
      type: Number,
      required: true,
    },

    startDate: Date,

    endDate: Date,

    status: {
      type: String,
      default: "Draft",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);