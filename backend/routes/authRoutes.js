const express = require("express");
const router = express.Router();


const { register, login } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth Route Working Successfully",
  });
});

module.exports = router;