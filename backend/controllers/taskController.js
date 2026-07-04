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
      assignmentId, // ❌ Issue 1 Fix: Frontend now explicitly provides the assignment context link
      assignedTo,
      title,
      description,
      estimatedHours,
      deadline,
      priority,
    } = req.body; // ❌ Issue 2 Fix: Removed parentTaskId reference entirely

    // ❌ Issue 1 Fix: Query strictly against the explicit assignment index
    const assignment = await ProjectAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Member not assigned to this project.",
      });
    }

    // Safety Interception: Ensure payload values match the verified assignment bounds
    if (assignment.projectId.toString() !== projectId || assignment.memberId.toString() !== assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Assignment mismatch metadata context values detected.",
      });
    }

    // Capacity Recalculation
    const tasks = await Task.find({ assignmentId });
    const currentAllocatedSum = tasks.reduce((sum, task) => sum + task.estimatedHours, 0);
    const totalTaskHours = currentAllocatedSum + Number(estimatedHours);

    if (totalTaskHours > assignment.allocatedHours) {
      return res.status(400).json({
        success: false,
        message: "Task hours exceed allocated hours.",
      });
    }

    // Create Task
    const task = await Task.create({
      projectId,
      assignmentId, // ❌ Issue 3 Fix: Saved index securely to document structure
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
    // ❌ Issue 4 Fix: Populated assignment reference to expose virtuals downstream
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

    // Swapped findByIdAndUpdate out for full object state handling access
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found." });
    }

    // ❌ Issue 7 Fix: Enforce Strict Budget Threshold Interception on updates
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

    // Map modifications safely (Bypassing parentTaskId completely)
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (deadline !== undefined) task.deadline = deadline;
    if (priority !== undefined) task.priority = priority;
    if (progress !== undefined) task.progress = Number(progress);

    // Apply explicit state status updates
    if (status !== undefined) {
      task.status = status;

      // ❌ Issue 5 Fix: Automatic Progress & Timeline State Machine Processing
      if (status === "Completed") {
        task.progress = 100;
        task.completedAt = new Date();
      } else if (status === "In Progress") {
        if (task.progress === 0 || task.progress === 100) {
          task.progress = 10; // Inject starter baseline traction floor
        }
        task.completedAt = null;
      } else if (status === "Not Started") {
        task.progress = 0;
        task.completedAt = null;
      }
    }

    // Deadline Breach Control evaluation
    const today = new Date();
    if (task.deadline && new Date(task.deadline) < today && task.status !== "Completed") {
      const logExists = await BreachLog.findOne({ taskId: task._id });
      if (!logExists) {
        await BreachLog.create({
          taskId: task._id,
          memberId: task.assignedTo,
          originalDeadline: task.deadline,
          revisedDeadline: today,
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
  // ❌ Issue 6 Fix: Clean implementation to close CRUD contract mapping
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    await Task.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};