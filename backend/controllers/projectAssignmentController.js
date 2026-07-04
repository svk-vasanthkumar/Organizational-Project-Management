const ProjectAssignment = require("../models/ProjectAssignment");
const Project = require("../models/Project");
const TeamMember = require("../models/TeamMember");
const Task = require("../models/Task");

// =========================================================================
// 1. CREATE ASSIGNMENT
// =========================================================================
const createAssignment = async (req, res) => {
  try {
    const { projectId, memberId, role, allocatedHours, startDate } = req.body;

    // Explicit application-level duplicate validation
    const existingAssignment = await ProjectAssignment.findOne({ projectId, memberId });
    if (existingAssignment) {
      return res.status(400).json({
        success: false,
        message: "Member is already assigned to this project.",
      });
    }

    // Member Validation
    const memberExists = await TeamMember.findById(memberId);
    if (!memberExists) {
      return res.status(404).json({
        success: false,
        message: "Team member not found.",
      });
    }

    // Project Validation
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    // Calculate total allocated hours across this project context
    const assignments = await ProjectAssignment.find({ projectId });
    const currentAllocatedSum = assignments.reduce((sum, item) => sum + item.allocatedHours, 0);
    const totalAllocated = currentAllocatedSum + Number(allocatedHours);

    // Budget check validation
    if (totalAllocated > project.totalHours) {
      return res.status(400).json({
        success: false,
        message: "Allocated hours exceed available project hours.",
      });
    }

    // Creation includes status field tracking natively
    const assignment = await ProjectAssignment.create({
      projectId,
      memberId,
      role,
      allocatedHours,
      startDate,
      status: "Assigned"
    });

    res.status(201).json({
      success: true,
      message: "Member assigned successfully.",
      data: assignment,
    });
  } catch (error) {
    console.error("Error in createAssignment:", error); 
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================================================
// 2. GET ALL ASSIGNMENTS (Simplified Baseline Implementation)
// =========================================================================
const getAssignments = async (req, res) => {
  try {
    const assignments = await ProjectAssignment.find()
      .populate("projectId")
      .populate("memberId");

    const data = assignments.map((assign) => {
      const obj = assign.toObject();

      // Reliable inline mathematical lookup safely isolated from N+1 DB calls
      obj.remainingProjectHours = (obj.projectId?.totalHours || 0) - obj.allocatedHours;

      return obj;
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error in getAssignments:", error); 
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================================================
// 3. GET ASSIGNMENTS BY PROJECT ID (Contextual Filtering Support)
// =========================================================================
const getAssignmentsByProject = async (req, res) => {
  try {
    const assignments = await ProjectAssignment.find({
      projectId: req.params.projectId,
    }).populate("memberId");

    res.status(200).json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    console.error("Error in getAssignmentsByProject:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================================================================
// 4. UPDATE ASSIGNMENT
// =========================================================================
const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectId, memberId, role, allocatedHours, startDate } = req.body;

    const currentAssignment = await ProjectAssignment.findById(id);
    if (!currentAssignment) {
      return res.status(404).json({ success: false, message: "Assignment record not found." });
    }

    // Protection constraints against payload switching
    if (projectId && projectId.toString() !== currentAssignment.projectId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Changing projects on an active assignment is restricted.",
      });
    }

    if (memberId && memberId.toString() !== currentAssignment.memberId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Changing team members on an active assignment is restricted.",
      });
    }

    // Recalculate capacity bounds safely if hours are targeted for update
    if (allocatedHours !== undefined) {
      const project = await Project.findById(currentAssignment.projectId);
      const otherAssignments = await ProjectAssignment.find({
        projectId: currentAssignment.projectId,
        _id: { $ne: id }
      });

      const baselineAllocations = otherAssignments.reduce((sum, item) => sum + item.allocatedHours, 0);
      const newTotalAllocated = baselineAllocations + Number(allocatedHours);

      if (newTotalAllocated > project.totalHours) {
        return res.status(400).json({
          success: false,
          message: "Allocated hours exceed available project hours.",
        });
      }
      
      currentAssignment.allocatedHours = Number(allocatedHours);

      // Dynamic Lifecycle State Evaluation
      if (currentAssignment.hoursUsed >= Number(allocatedHours)) {
        currentAssignment.status = "Completed";
      } else if (currentAssignment.hoursUsed > 0) {
        currentAssignment.status = "Working";
      } else {
        currentAssignment.status = "Assigned";
      }
    }

    currentAssignment.role = role || currentAssignment.role;
    currentAssignment.startDate = startDate || currentAssignment.startDate;

    await currentAssignment.save();

    res.status(200).json({
      success: true,
      message: "Assignment updated successfully.",
      data: currentAssignment,
    });
  } catch (error) {
    console.error("Error in updateAssignment:", error); 
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================================================================
// 5. DELETE ASSIGNMENT
// =========================================================================
const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await ProjectAssignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment record not found." });
    }

    // Short-circuit search using findOne instead of heavy full-table count scans
    const activeTaskExists = await Task.findOne({
      projectId: assignment.projectId,
      assignedTo: assignment.memberId,
    });

    if (activeTaskExists) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete assignment. Member has active tasks in this project.",
      });
    }

    await ProjectAssignment.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Assignment deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleteAssignment:", error); 
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentsByProject,
  updateAssignment,
  deleteAssignment,
};