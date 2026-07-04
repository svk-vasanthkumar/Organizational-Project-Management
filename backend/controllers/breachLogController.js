const BreachLog = require("../models/BreachLog");
const Task = require("../models/Task");

// ========================================================================
// GET BREACH LOGS
// ========================================================================
const getBreachLogs = async (req, res) => {
  try {
    // Auto-create missing breach logs for any task past its deadline
    const overdueTasks = await Task.find({
      deadline: { $lt: new Date() },
      status: { $ne: "Completed" },
    });

    for (const task of overdueTasks) {
      const exists = await BreachLog.findOne({
        taskId: task._id,
      });

      if (!exists) {
        await BreachLog.create({
          taskId: task._id,
          memberId: task.assignedTo,
          originalDeadline: task.deadline,
          revisedDeadline: null,
          reason: "Task deadline exceeded",
        });
      }
    }

    const logs = await BreachLog.find()
      .populate("taskId")
      .populate("memberId");

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getBreachLogs,
};