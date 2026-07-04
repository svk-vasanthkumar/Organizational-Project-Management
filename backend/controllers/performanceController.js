const ProjectAssignment = require("../models/ProjectAssignment");
const Task = require("../models/Task");
const BreachLog = require("../models/BreachLog");
const TeamMember = require("../models/TeamMember");

// =========================================================================
// GET PERFORMANCE (Aggregated Global Team Member Processing Matrix)
// =========================================================================
const getPerformance = async (req, res) => {
  try {
    // Pull down every team member to compile the macro scorecard
    const members = await TeamMember.find();

    const performance = await Promise.all(
      members.map(async (member) => {
        // Gather all project context boundaries assigned to this specific member
        const assignments = await ProjectAssignment.find({
          memberId: member._id
        });

        const allocatedHours = assignments.reduce(
          (sum, item) => sum + item.allocatedHours,
          0
        );

        const usedHours = assignments.reduce(
          (sum, item) => sum + item.hoursUsed,
          0
        );

        // Fetch task execution array spanning all assignments for this user
        const tasks = await Task.find({
          assignedTo: member._id
        });

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(
          t => t.status === "Completed"
        ).length;

        // Use countDocuments directly instead of loading arrays into memory
        const breaches = await BreachLog.countDocuments({
          memberId: member._id
        });

        // Compute completion percentage safely without division by zero errors
        const completion =
          totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);

        // Dynamic formula evaluation with mathematical clamping logic
        let score =
          100 -
          breaches * 10 -
          (totalTasks - completedTasks) * 5 +
          completedTasks * 2;

        score = Math.max(0, Math.min(score, 100));

        // Evaluate performance tiers
        let status = "Critical";
        if (score >= 90) status = "Excellent";
        else if (score >= 70) status = "Good";
        else if (score >= 50) status = "Average";

        return {
          _id: member._id,
          name: member.name,
          role: member.role || "Team Member", // Included role metadata for clean table visualization
          allocatedHours,
          usedHours,
          remainingHours: allocatedHours - usedHours,
          totalTasks,
          completedTasks,
          completion,
          breaches,
          score,
          status,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: performance,
    });
  } catch (error) {
    // Diagnostic log capture tracking block
    console.error("=== PERFORMANCE ROUTE REFACTOR COUPLING FAILURE ===");
    console.error(error);
    console.error("====================================================");

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getPerformance,
};