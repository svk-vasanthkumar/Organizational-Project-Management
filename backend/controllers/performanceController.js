const ProjectAssignment = require("../models/ProjectAssignment");
const Task = require("../models/Task");
const BreachLog = require("../models/BreachLog");
const TeamMember = require("../models/TeamMember");

const getPerformance = async (req, res) => {
  try {

    const { memberId, projectId } = req.params;

    // Assignment
    const assignment = await ProjectAssignment.findOne({
      memberId,
      projectId,
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Tasks
    const tasks = await Task.find({
      assignedTo: memberId,
      projectId,
    });

    const completedTasks = tasks.filter(
      task => task.status === "Completed"
    ).length;

    const totalTasks = tasks.length;

    // Breaches
    const breaches = await BreachLog.find({
      memberId,
    });

    const breachCount = breaches.length;

    // Hours
    const allocatedHours = assignment.allocatedHours;
    const usedHours = assignment.hoursUsed;
    const remainingHours = allocatedHours - usedHours;

    // Completion %
    const completionPercentage =
      totalTasks === 0
        ? 0
        : Math.round(
            (completedTasks / totalTasks) * 100
          );

    // Score
    let score =
      100 -
      breachCount * 10 -
      (totalTasks - completedTasks) * 5 +
      completedTasks * 2;

    if (score > 100) score = 100;
    if (score < 0) score = 0;

    // Status
    let status = "";

    if (score >= 90)
      status = "Exceeding";
    else if (score >= 70)
      status = "On Track";
    else if (score >= 50)
      status = "Lagging";
    else
      status = "Critical";

    const member = await TeamMember.findById(memberId);

    res.status(200).json({
      success: true,
      member: member.name,
      allocatedHours,
      usedHours,
      remainingHours,
      tasksAssigned: totalTasks,
      tasksCompleted: completedTasks,
      completionPercentage,
      breachCount,
      score,
      status,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  getPerformance,
};