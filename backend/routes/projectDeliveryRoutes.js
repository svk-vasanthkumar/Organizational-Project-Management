const express = require("express");

const router = express.Router();

const {
  createProjectDelivery,
  getProjectDeliveries
} = require("../controllers/projectDeliveryController");

router.get("/", getProjectDeliveries);

router.post("/", createProjectDelivery);

module.exports = router;