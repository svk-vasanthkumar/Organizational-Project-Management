const TeamMember = require("../models/TeamMember");

// Create Team Member
const createTeamMember = async (req, res) => {
  try {
    const { name, email, role, department } = req.body;

    const member = await TeamMember.create({
      name,
      email,
      role,
      department,
    });

    res.status(201).json({
      success: true,
      message: "Team Member Added Successfully",
      data: member,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Team Members
const getTeamMembers = async (req, res) => {
  try {
    const members = await TeamMember.find();

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Team Member
const deleteTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found"
      });
    }

    res.json({
      success: true,
      message: "Member deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createTeamMember,
  getTeamMembers,
  deleteTeamMember,
};