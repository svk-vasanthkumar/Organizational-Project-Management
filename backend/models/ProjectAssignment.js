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

    status: {
      type: String,
      enum: ["Assigned", "Working", "Completed"],
      default: "Assigned",
    },

    startDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Database Layer Duplicate Protection
projectAssignmentSchema.index({ projectId: 1, memberId: 1 }, { unique: true });

// Dynamic Calculated Field (0% Storage Footprint)
projectAssignmentSchema.virtual("remainingHours").get(function () {
  return this.allocatedHours - this.hoursUsed;
});

module.exports = mongoose.model("ProjectAssignment", projectAssignmentSchema);