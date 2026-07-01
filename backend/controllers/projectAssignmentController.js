const ProjectAssignment = require("../models/ProjectAssignment");
const Project = require("../models/Project");

// Create Assignment
const createAssignment = async (req, res) => {
  try {
    const {
      projectId,
      memberId,
      role,
      allocatedHours,
      startDate,
    } = req.body;

    // Check Project Exists
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Calculate already allocated hours
    const assignments = await ProjectAssignment.find({ projectId });

    const totalAllocated =
      assignments.reduce(
        (sum, item) => sum + item.allocatedHours,
        0
      ) + allocatedHours;
      let allocationStatus = "Partial";

if (totalAllocated === project.totalHours) {
  allocationStatus = "Complete";
}

    // Validation
    if (totalAllocated > project.totalHours) {
      return res.status(400).json({
        success: false,
        message: `Only ${project.totalHours} hours can be allocated. Already allocated: ${totalAllocated - allocatedHours}`,
      });
    }

    const assignment = await ProjectAssignment.create({
      projectId,
      memberId,
      role,
      allocatedHours,
      startDate,
    });

    res.status(201).json({
       success: true,
    message: "Member Assigned Successfully",
    totalAllocated,
    projectHours: project.totalHours,
    allocationStatus,
    data: assignment,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Assignments
const getAssignments = async (req, res) => {
  try {

    const assignments = await ProjectAssignment.find()
      .populate("projectId")
      .populate("memberId");

    res.status(200).json({
      success: true,
      data: assignments,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  createAssignment,
  getAssignments,
};