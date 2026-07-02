const mongoose = require("mongoose");

const closureSnapshotSchema = new mongoose.Schema({

    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },

    totalBudget: {
        type: Number,
        required: true
    },

    estimatedHours: {
        type: Number,
        required: true
    },

    usedHours: {
        type: Number,
        required: true
    },

    completedTasks: {
        type: Number,
        required: true
    },

    totalTasks: {
        type: Number,
        required: true
    },

    remarks: {
        type: String,
        default: ""
    }

}, {

    timestamps: true

});

module.exports = mongoose.model(
    "ClosureSnapshot",
    closureSnapshotSchema
);