const Estimation = require("../models/Estimation");

// Create Estimation
const createEstimation = async (req, res) => {
  try {
    const {
      projectId,
      estimatedHours,
      hourlyRate,
      approvalStatus,
    } = req.body;

    // Calculate quoted price automatically
    const quotedPrice = estimatedHours * hourlyRate;

    const estimation = await Estimation.create({
      projectId,
      estimatedHours,
      hourlyRate,
      quotedPrice,
      approvalStatus: "Draft",
    });

    res.status(201).json({
      success: true,
      message: "Estimation Created Successfully",
      data: estimation,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Estimations
const getEstimations = async (req, res) => {
  try {
    const estimations = await Estimation.find().populate("projectId");

    res.status(200).json({
      success: true,
      count: estimations.length,
      data: estimations,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// UPDATE ESTIMATION
// =====================================
const updateEstimation = async (req, res) => {
  try {
    const {
      estimatedHours,
      hourlyRate,
      approvalStatus,
    } = req.body;

    const quotedPrice = estimatedHours * hourlyRate;

    const estimation = await Estimation.findByIdAndUpdate(
      req.params.id,
      {
        estimatedHours,
        hourlyRate,
        quotedPrice,
        approvalStatus,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!estimation) {
      return res.status(404).json({
        success: false,
        message: "Estimation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Estimation updated successfully.",
      data: estimation,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// DELETE ESTIMATION
// =====================================
const deleteEstimation = async (req, res) => {
  try {
    const estimation = await Estimation.findByIdAndDelete(req.params.id);

    if (!estimation) {
      return res.status(404).json({
        success: false,
        message: "Estimation not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Estimation deleted successfully.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Approval Status
const updateApprovalStatus = async (req, res) => {
  try {
    const { approvalStatus } = req.body;

    const estimation = await Estimation.findByIdAndUpdate(
      req.params.id,
      { approvalStatus },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Approval Status Updated",
      data: estimation,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Approve Estimation
const approveEstimation = async (req, res) => {
  try {
    const estimation = await Estimation.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: "Approved" },
      { new: true }
    );

    if (!estimation) {
      return res.status(404).json({
        success: false,
        message: "Estimation not found"
      });
    }

    res.json({
      success: true,
      data: estimation
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Reject Estimation
const rejectEstimation = async (req, res) => {
  try {
    const estimation = await Estimation.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: "Rejected" },
      { new: true }
    );

    if (!estimation) {
      return res.status(404).json({
        success: false,
        message: "Estimation not found"
      });
    }

    res.json({
      success: true,
      data: estimation
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createEstimation,
  getEstimations,
  updateEstimation,
  deleteEstimation,
  updateApprovalStatus,
  approveEstimation,
  rejectEstimation,
};