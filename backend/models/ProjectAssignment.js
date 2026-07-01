const mongoose = require("mongoose");

const projectAssignmentSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeamMember",
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    allocatedHours: {
      type: Number,
      required: true,
    },

    hoursUsed: {
      type: Number,
      default: 0,
    },

    startDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ProjectAssignment",
  projectAssignmentSchema
);