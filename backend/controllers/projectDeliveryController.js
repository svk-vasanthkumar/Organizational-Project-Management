const ProjectDelivery = require("../models/ProjectDelivery");
const Project = require("../models/Project");

// Create Delivery
const createProjectDelivery = async (req, res) => {
  try {

    const delivery = await ProjectDelivery.create(req.body);

    await Project.findByIdAndUpdate(
      req.body.projectId,
      {
        status: req.body.status || "Delivered"
      }
    );

    res.status(201).json({
      success: true,
      data: delivery
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// Get All Deliveries
const getProjectDeliveries = async (req, res) => {

  try {

    const deliveries = await ProjectDelivery
      .find()
      .populate("projectId");

    res.json({
      success: true,
      count: deliveries.length,
      data: deliveries
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

module.exports = {
  createProjectDelivery,
  getProjectDeliveries
};