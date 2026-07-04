const TimeLog = require("../models/TimeLog");
const Task = require("../models/Task");
const ProjectAssignment = require("../models/ProjectAssignment");
const BreachLog = require("../models/BreachLog");

// Helper function to dynamically update metrics across dependent entities
const recalculateMetrics = async (taskId, assignmentId) => {
  // 1. Recalculate Task Aggregates
  const taskLogs = await TimeLog.find({ taskId });
  const totalLoggedHours = taskLogs.reduce((sum, log) => sum + log.hoursLogged, 0);

  const task = await Task.findById(taskId);
  if (task) {
    task.loggedHours = totalLoggedHours;
    task.progress = Math.min(
      100,
      Math.round((task.loggedHours / task.estimatedHours) * 100) || 0
    );

    // Synchronize statuses based on updated metric boundaries
    if (task.loggedHours >= task.estimatedHours) {
      task.status = "Completed";
      task.progress = 100;
      if (!task.completedAt) task.completedAt = new Date();
    } else {
      if (task.status === "Completed") {
        task.status = "In Progress"; // Roll back status if time is modified/removed below budget
        task.completedAt = undefined;
      }
    }
    await task.save();
  }

  // 2. Recalculate Project Assignment Aggregates
  if (assignmentId) {
    const assignmentLogs = await TimeLog.find({ assignmentId });
    const totalAssignmentHours = assignmentLogs.reduce((sum, log) => sum + log.hoursLogged, 0);

    await ProjectAssignment.findByIdAndUpdate(assignmentId, {
      hoursUsed: totalAssignmentHours
    });
  }
};

// =========================================================================
// 1. CREATE TIME LOG
// =========================================================================
const createTimeLog = async (req, res) => {
  try {
    const { taskId, memberId, date, hoursLogged, notes } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Change 1: Validate active contextual project assignment safely upfront
    const assignment = await ProjectAssignment.findOne({
      projectId: task.projectId,
      memberId,
    });
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    // Change 3: Prevent allocations going above initial estimated bounds
    if (task.loggedHours + Number(hoursLogged) > task.estimatedHours) {
      return res.status(400).json({
        success: false,
        message: "Logged hours exceed estimated task hours.",
      });
    }

    // Change 2: Include validated explicit assignment ID references
    const timeLog = await TimeLog.create({
      taskId,
      assignmentId: assignment._id,
      memberId,
      date,
      hoursLogged: Number(hoursLogged),
      notes,
    });

    // Change 4 & 5: Save mathematical progress calculations safely onto parent document
    task.loggedHours += Number(hoursLogged);
    task.progress = Math.min(
      100,
      Math.round((task.loggedHours / task.estimatedHours) * 100)
    );

    if (task.loggedHours >= task.estimatedHours) {
      task.status = "Completed";
      task.progress = 100;
      task.completedAt = new Date();
    }

    await task.save();

    // Increment allocation aggregates
    assignment.hoursUsed += Number(hoursLogged);
    await assignment.save();

    // Contextual execution of tracking rules for post-deadline submissions
    const today = new Date(date);
    if (task.deadline && today > task.deadline && task.status !== "Completed") {
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
      assignmentHoursUsed: assignment.hoursUsed,
      data: timeLog,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================================================
// 2. GET ALL TIME LOGS
// =========================================================================
const getTimeLogs = async (req, res) => {
  try {
    const logs = await TimeLog.find()
      .populate("taskId")
      .populate("memberId")
      .populate("assignmentId"); // Change 6: Included assignment relation populator hook

    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================================================
// 3. UPDATE TIME LOG
// =========================================================================
const updateTimeLog = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, hoursLogged, notes } = req.body;

    const timeLog = await TimeLog.findById(id);
    if (!timeLog) {
      return res.status(404).json({ success: false, message: "Time log not found" });
    }

    const task = await Task.findById(timeLog.taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Associated task not found" });
    }

    // Validation Check: Ensure modification doesn't exceed bounds relative to other rows
    if (hoursLogged !== undefined) {
      const difference = Number(hoursLogged) - timeLog.hoursLogged;
      if (task.loggedHours + difference > task.estimatedHours) {
        return res.status(400).json({
          success: false,
          message: "Updated hours would exceed estimated task hours.",
        });
      }
      timeLog.hoursLogged = Number(hoursLogged);
    }

    if (date) timeLog.date = date;
    if (notes) timeLog.notes = notes;

    await timeLog.save();

    // Change 8: Recalculate metric pools dynamically downstream
    await recalculateMetrics(timeLog.taskId, timeLog.assignmentId);

    res.status(200).json({
      success: true,
      message: "Time Log Updated Successfully",
      data: timeLog
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================================================
// 4. DELETE TIME LOG
// =========================================================================
const deleteTimeLog = async (req, res) => {
  try {
    const { id } = req.params;

    const timeLog = await TimeLog.findById(id);
    if (!timeLog) {
      return res.status(404).json({ success: false, message: "Time log not found" });
    }

    const targetTaskId = timeLog.taskId;
    const targetAssignmentId = timeLog.assignmentId;

    await TimeLog.findByIdAndDelete(id);

    // Change 8: Recalculate metric pools dynamically downstream
    await recalculateMetrics(targetTaskId, targetAssignmentId);

    res.status(200).json({
      success: true,
      message: "Time Log Deleted Successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Change 9: Exporting expanded modules
module.exports = {
  createTimeLog,
  getTimeLogs,
  updateTimeLog,
  deleteTimeLog,
};