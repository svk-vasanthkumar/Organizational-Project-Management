const mongoose = require("mongoose");

const projectDeliverySchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    deliveryDate: {
      type: Date,
      required: true,
    },

    mode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      required: true,
    },

    clientSignoff: {
      type: Boolean,
      default: false,
    },

    notes: {
      type: String,
    },

    status: {
      type: String,
      enum: ["In Review", "Delivered", "Closed"],
      default: "In Review",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ProjectDelivery",
  projectDeliverySchema
);