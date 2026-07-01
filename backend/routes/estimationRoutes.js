const express = require("express");
const router = express.Router();

const {
  createEstimation,
  getEstimations,
  updateApprovalStatus
} = require("../controllers/estimationController");

router.post("/", createEstimation);
router.get("/", getEstimations);
router.put("/:id/status", updateApprovalStatus);

module.exports = router;