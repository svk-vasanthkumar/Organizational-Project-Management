const Task = require("../models/Task");
const ProjectAssignment = require("../models/ProjectAssignment");

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

module.exports = {
  createTask,
  getTasks,
};