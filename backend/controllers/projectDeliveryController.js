const Project = require("../models/Project");
const Task = require("../models/Task");
const ProjectAssignment = require("../models/ProjectAssignment");

// Get Project Delivery Dashboard
const getProjectDeliveries = async (req, res) => {
  try {
    const projects = await Project.find();

    const deliveryData = await Promise.all(
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

        const allocatedHours = assignments.reduce(
          (sum, item) => sum + item.allocatedHours,
          0
        );

        const usedHours = assignments.reduce(
          (sum, item) => sum + item.hoursUsed,
          0
        );

        const completion =
          totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);

        let status = "On Track";

        if (completion === 100) {
          status = "Completed";
        } else if (new Date(project.endDate) < new Date()) {
          status = "Delayed";
        }

        return {
          _id: project._id,
          projectName: project.name,
          client: project.clientName || "-",
          totalTasks,
          completedTasks,
          completion,
          allocatedHours,
          usedHours,
          remainingHours: allocatedHours - usedHours,
          expectedEndDate: project.endDate,
          status,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: deliveryData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProjectDeliveries,
};