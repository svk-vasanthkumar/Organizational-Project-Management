const express = require("express");
const router = express.Router();

const {
  createTeamMember,
  getTeamMembers,
  deleteTeamMember,
} = require("../controllers/teamMemberController");

router.post("/", createTeamMember);
router.get("/", getTeamMembers);
router.delete("/:id", deleteTeamMember);

module.exports = router;