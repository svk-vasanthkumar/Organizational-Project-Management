const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    getProjectDeliveries,
} = require("../controllers/projectDeliveryController");

// Get Project Delivery Dashboard
router.get("/", authMiddleware,  getProjectDeliveries);

module.exports = router;