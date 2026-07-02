const Project = require("../models/Project");
const TeamMember = require("../models/TeamMember");
const Task = require("../models/Task");
const ProjectAssignment = require("../models/ProjectAssignment");
// Performance model required for the Top Performer collection fetch query
const PerformanceRecord = require("../models/PerformanceRecord"); 

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

    // 🏗️ Step 1 — Add Supplemental Sub-Queries
    const recentProjects = await Project
      .find()
      .sort({ createdAt: -1 })
      .limit(5);

    const delayedTasks = await Task
      .find({
        status: { $ne: "Completed" },
        deadline: { $lt: new Date() }
      })
      .populate("assignedTo")
      .limit(5);

    const topPerformers = await PerformanceRecord
      .find()
      .sort({ score: -1 })
      .limit(5)
      .populate("memberId");

    res.status(200).json({
      success: true,
      statistics: {
        totalProjects,
        activeProjects,
        totalMembers,
        totalTasks,
        completedTasks,
        allocatedHours: totalAllocatedHours[0]?.total || 0,
        usedHours: totalUsedHours[0]?.total || 0,
      },
      recentProjects,
      delayedTasks,
      topPerformers,
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