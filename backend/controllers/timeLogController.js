const TimeLog = require("../models/TimeLog");
const Task = require("../models/Task");
const ProjectAssignment = require("../models/ProjectAssignment");
const BreachLog = require("../models/BreachLog");

// Create Time Log
const createTimeLog = async (req, res) => {
  try {
    const {
      taskId,
      memberId,
      date,
      hoursLogged,
      notes
    } = req.body;

    // Check Task
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Save Time Log
    const timeLog = await TimeLog.create({
      taskId,
      memberId,
      date,
      hoursLogged,
      notes,
    });

    // Update Task Logged Hours
    task.loggedHours += hoursLogged;

    // Auto Complete Task
    if (task.loggedHours >= task.estimatedHours) {
      task.status = "Completed";
    }

    await task.save();

    // Update Assignment Hours Used
    const assignment = await ProjectAssignment.findOne({
      projectId: task.projectId,
      memberId,
    });

    if (assignment) {
      assignment.hoursUsed += hoursLogged;
      await assignment.save();
    }

    // Deadline Check
    const today = new Date(date);

    if (
      task.deadline &&
      today > task.deadline &&
      task.status !== "Completed"
    ) {
      await BreachLog.create({
        taskId: task._id,
        memberId,
        originalDeadline: task.deadline,
        revisedDeadline: task.deadline,
        reason: "Task completed after deadline",
      });
    }

    res.status(201).json({
      success: true,
      message: "Time Log Added Successfully",
      taskLoggedHours: task.loggedHours,
      assignmentHoursUsed: assignment
        ? assignment.hoursUsed
        : 0,
      data: timeLog,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Get All Time Logs
const getTimeLogs = async (req, res) => {

  try {

    const logs = await TimeLog.find()
      .populate("taskId")
      .populate("memberId");

    res.status(200).json({
      success: true,
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
  createTimeLog,
  getTimeLogs,
};