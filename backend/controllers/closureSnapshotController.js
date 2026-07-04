const Project = require("../models/Project");
const Task = require("../models/Task");
const ProjectAssignment = require("../models/ProjectAssignment");

// ========================================================================
// GET CLOSURE SNAPSHOTS
// ========================================================================
const getClosureSnapshots = async (req, res) => {
  try {
    const projects = await Project.find();

    const snapshots = await Promise.all(
      projects.map(async (project) => {
        const tasks = await Task.find({
          projectId: project._id,
        });

        const assignments = await ProjectAssignment.find({
          projectId: project._id,
        });

        const totalTasks = tasks.length;

        const completedTasks = tasks.filter(
          t => t.status === "Completed"
        ).length;

        const completion =
          totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);

        const allocatedHours = assignments.reduce(
          (sum, item) => sum + item.allocatedHours,
          0
        );

        const usedHours = assignments.reduce(
          (sum, item) => sum + item.hoursUsed,
          0
        );

        const snapshotStatus =
          completion === 100 ? "Closed" : "In Progress";

        return {
          _id: project._id,
          projectName: project.name,
          completion,
          totalTasks,
          completedTasks,
          allocatedHours,
          usedHours,
          remainingHours: allocatedHours - usedHours,
          expectedEndDate: project.endDate,
          closedDate: completion === 100 ? new Date() : null,
          status: snapshotStatus,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: snapshots,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getClosureSnapshots,
};