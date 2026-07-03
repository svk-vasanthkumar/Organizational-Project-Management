const Project = require("../models/Project");
const Task = require("../models/Task");
const ProjectAssignment = require("../models/ProjectAssignment");
const Performance = require("../models/PerformanceRecord");
const BreachLog = require("../models/BreachLog");

// Project Summary
const getProjectSummary = async (req, res) => {
    try {

        const projects = await Project.find();

        const data = await Promise.all(
            projects.map(async (project) => {

                const tasks = await Task.find({
                    projectId: project._id
                });

                const assignments = await ProjectAssignment.find({
                    projectId: project._id
                });

                return {

                    project: project.name,

                    budget: project.budget,

                    estimatedHours: project.totalHours,

                    allocatedHours: assignments.reduce(
                        (sum, item) => sum + item.allocatedHours,
                        0
                    ),

                    usedHours: tasks.reduce(
                        (sum, item) => sum + item.loggedHours,
                        0
                    ),

                    completedTasks: tasks.filter(
                        t => t.status === "Completed"
                    ).length,

                    totalTasks: tasks.length

                };

            })
        );

        res.json({
            success: true,
            data
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// Member Performance
const getMemberPerformance = async (req, res) => {

    try {

        const data = await Performance.find()
            .populate("memberId")
            .populate("projectId");

        res.json({
            success: true,
            data
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// Lag Attribution
const getLagAttribution = async (req, res) => {

    try {

        const data = await BreachLog.find()
            .populate("taskId")
            .populate("memberId");

        res.json({
            success: true,
            data
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

module.exports = {
    getProjectSummary,
    getMemberPerformance,
    getLagAttribution
};