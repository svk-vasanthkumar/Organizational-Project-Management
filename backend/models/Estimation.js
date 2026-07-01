const mongoose = require("mongoose");

const estimationSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    estimatedHours: {
      type: Number,
      required: true,
    },

    hourlyRate: {
      type: Number,
      required: true,
    },

    quotedPrice: {
      type: Number,
      required: true,
    },

    approvalStatus: {
      type: String,
      enum: [
        "Draft",
        "Under Review",
        "Approved",
        "Rejected"
      ],
      default: "Draft",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Estimation",
  estimationSchema
);