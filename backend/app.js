const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const estimationRoutes = require("./routes/estimationRoutes");
const teamMemberRoutes = require("./routes/teamMemberRoutes");
const projectAssignmentRoutes = require("./routes/projectAssignmentRoutes");
const taskRoutes = require("./routes/taskRoutes");
const timeLogRoutes=require("./routes/timeLogRoutes");
const performanceRoutes = require("./routes/performanceRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/estimations", estimationRoutes);
app.use("/api/team-members", teamMemberRoutes);
app.use("/api/assignments", projectAssignmentRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/time-logs",timeLogRoutes);
app.use("/api/performance", performanceRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Organizational Project Management API is Running...");
});

module.exports = app;