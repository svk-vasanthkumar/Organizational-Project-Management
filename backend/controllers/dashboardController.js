const Project = require("../models/Project");
const TeamMember = require("../models/TeamMember");
const Task = require("../models/Task");
const ProjectAssignment = require("../models/ProjectAssignment");

const getDashboard = async (req, res) => {
  try {

    const totalProjects = await Project.countDocuments();

    const totalMembers = await TeamMember.countDocuments();

    const totalTasks = await Task.countDocuments();

    const completedTasks = await Task.countDocuments({
      status: "Completed",
    });

    const activeProjects = await Project.countDocuments({
      status: "Active",
    });

    const totalAllocatedHours = await ProjectAssignment.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$allocatedHours",
          },
        },
      },
    ]);

    const totalUsedHours = await ProjectAssignment.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$hoursUsed",
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,

      statistics: {

        totalProjects,

        activeProjects,

        totalMembers,

        totalTasks,

        completedTasks,

        allocatedHours:
          totalAllocatedHours[0]?.total || 0,

        usedHours:
          totalUsedHours[0]?.total || 0,

      }

    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  getDashboard,
};