const express = require("express");
const router = express.Router();

const {
  createTeamMember,
  getTeamMembers,
} = require("../controllers/teamMemberController");

router.post("/", createTeamMember);
router.get("/", getTeamMembers);

module.exports = router;