const Task = require("../models/Task");
const ProjectAssignment = require("../models/ProjectAssignment");
const BreachLog = require("../models/BreachLog");

// Create Task
const createTask = async (req, res) => {
  try {
    const {
      projectId,
      assignedTo,
      title,
      description,
      estimatedHours,
      deadline,
      priority,
      parentTaskId,
    } = req.body;

    const assignment = await ProjectAssignment.findOne({
      projectId,
      memberId: assignedTo,
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Member not assigned to this project",
      });
    }

    const tasks = await Task.find({ projectId, assignedTo });

    const totalTaskHours =
      tasks.reduce((sum, task) => sum + task.estimatedHours, 0) +
      estimatedHours;

    if (totalTaskHours > assignment.allocatedHours) {
      return res.status(400).json({
        success: false,
        message: "Task hours exceed allocated hours",
      });
    }

    const task = await Task.create({
      projectId,
      assignedTo,
      title,
      description,
      estimatedHours,
      deadline,
      priority,
      parentTaskId,
    });

    res.status(201).json({
      success: true,
      message: "Task Created Successfully",
      data: task,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("projectId")
      .populate("assignedTo");

    res.json({
      success: true,
      data: tasks,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const today = new Date();

    if (
      task.deadline &&
      new Date(task.deadline) < today &&
      task.status !== "Completed"
    ) {
      const exists = await BreachLog.findOne({
        taskId: task._id
      });

      if (!exists) {
        await BreachLog.create({
          taskId: task._id,
          memberId: task.assignedTo,
          originalDeadline: task.deadline,
          revisedDeadline: today,
          reason: "Task deadline exceeded"
        });
      }
    }

    res.status(200).json({
      success: true,
      data: task
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
};