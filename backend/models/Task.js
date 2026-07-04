const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    // ✅ Added Assignment Reference: Enforces the strict cascading architecture (Project → Assignment → Task)
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectAssignment",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeamMember",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    estimatedHours: {
      type: Number,
      required: true,
      min: 0,
    },

    loggedHours: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ✅ Added Progress Tracking: Clean integer metric bounded between 0 and 100
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    deadline: {
      type: Date,
      required: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: [
        "Not Started",
        "In Progress",
        "Review",
        "Completed",
        "Blocked",
      ],
      default: "Not Started",
    },

    // ✅ Added Completion Timestamp: Instantly set whenever a task changes to "Completed"
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field to dynamically calculate standard task-level headroom metric on demand
taskSchema.virtual("remainingHours").get(function () {
  return Math.max(0, this.estimatedHours - this.loggedHours);
});

module.exports = mongoose.model("Task", taskSchema);