const Task = require("../models/Task");
const ProjectAssignment = require("../models/ProjectAssignment");
const BreachLog = require("../models/BreachLog");

// =========================================================================
// 1. CREATE TASK
// =========================================================================
const createTask = async (req, res) => {
  try {
    const {
      projectId,
      assignmentId,
      assignedTo,
      title,
      description,
      estimatedHours,
      deadline,
      priority,
    } = req.body;

    const assignment = await ProjectAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Member not assigned to this project.",
      });
    }

    // ✅ Fix 1: Bulletproof ObjectId-to-string conversion check
    if (
      assignment.projectId.toString() !== projectId.toString() ||
      assignment.memberId.toString() !== assignedTo.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "Assignment mismatch metadata context values detected.",
      });
    }

    const tasks = await Task.find({ assignmentId });
    const currentAllocatedSum = tasks.reduce((sum, task) => sum + task.estimatedHours, 0);
    const totalTaskHours = currentAllocatedSum + Number(estimatedHours);

    if (totalTaskHours > assignment.allocatedHours) {
      return res.status(400).json({
        success: false,
        message: "Task hours exceed allocated hours.",
      });
    }

    const task = await Task.create({
      projectId,
      assignmentId,
      assignedTo,
      title,
      description,
      estimatedHours,
      deadline,
      priority,
      status: "Not Started",
      progress: 0,
      completedAt: null
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully.",
      data: task,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================================================
// 2. GET ALL TASKS
// =========================================================================
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("projectId")
      .populate("assignedTo")
      .populate("assignmentId");

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================================================
// 3. UPDATE TASK
// =========================================================================
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, estimatedHours, deadline, priority, status, progress } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found." });
    }

    if (estimatedHours !== undefined && Number(estimatedHours) !== task.estimatedHours) {
      const assignment = await ProjectAssignment.findById(task.assignmentId);
      const brotherTasks = await Task.find({ assignmentId: task.assignmentId, _id: { $ne: id } });
      
      const baseTaskHours = brotherTasks.reduce((sum, t) => sum + t.estimatedHours, 0);
      const targetAllocationTotal = baseTaskHours + Number(estimatedHours);

      if (targetAllocationTotal > assignment.allocatedHours) {
        return res.status(400).json({
          success: false,
          message: "Task hours exceed allocated hours.",
        });
      }
      task.estimatedHours = Number(estimatedHours);
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (deadline !== undefined) task.deadline = deadline;
    if (priority !== undefined) task.priority = priority;

    // ✅ Fix 2: Strict numerical value checking on incoming progress parameters
    if (progress !== undefined) {
      const numProgress = Number(progress);
      if (numProgress < 0 || numProgress > 100) {
        return res.status(400).json({
          success: false,
          message: "Progress must be between 0 and 100.",
        });
      }
      task.progress = numProgress;
    }

    if (status !== undefined) {
      task.status = status;

      if (status === "Completed") {
        task.progress = 100;
        task.completedAt = new Date();
      } else if (status === "In Progress") {
        if (task.progress === 0 || task.progress === 100) {
          task.progress = 10;
        }
        task.completedAt = null;
      } else if (status === "Not Started") {
        task.progress = 0;
        task.completedAt = null;
      }
    }

    // ✅ Fix 3: Standardized boundary alignment via normalized day values
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDeadline = new Date(task.deadline);
    taskDeadline.setHours(0, 0, 0, 0);

    if (taskDeadline < today && task.status !== "Completed") {
      const logExists = await BreachLog.findOne({ taskId: task._id });
      if (!logExists) {
        await BreachLog.create({
          taskId: task._id,
          memberId: task.assignedTo,
          originalDeadline: task.deadline,
          revisedDeadline: new Date(), // Active baseline registration record stamp
          reason: "Task deadline exceeded.",
        });
      }
    }

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      data: task,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================================================
// 4. DELETE TASK
// =========================================================================
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    // [Note for Fix 4]: TimeLog isolation lock logic hooks right here once model is generated.
    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
    });
  } catch (error) {
    console.log(error);
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
  deleteTask,
};