const express = require("express");
const router = express.Router();

const {
    getProjectDeliveries,
} = require("../controllers/projectDeliveryController");

// Get Project Delivery Dashboard
router.get("/", getProjectDeliveries);

module.exports = router;