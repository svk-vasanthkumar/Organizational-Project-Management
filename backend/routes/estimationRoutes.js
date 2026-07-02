const express = require("express");
const router = express.Router();

const {
  createEstimation,
  getEstimations,
  updateApprovalStatus,
  approveEstimation,
  rejectEstimation
} = require("../controllers/estimationController");

router.post("/", createEstimation);
router.get("/", getEstimations);
router.put("/:id/status", updateApprovalStatus);
router.put("/:id/approve", approveEstimation);
router.put("/:id/reject", rejectEstimation);

module.exports = router;