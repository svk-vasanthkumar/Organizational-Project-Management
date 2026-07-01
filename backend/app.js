const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const estimationRoutes = require("./routes/estimationRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/estimations", estimationRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Organizational Project Management API is Running...");
});

module.exports = app;