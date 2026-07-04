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
const dashboardRoutes = require("./routes/dashboardRoutes");
const projectDeliveryRoutes = require("./routes/projectDeliveryRoutes");
const breachLogRoutes = require("./routes/breachLogRoutes");
const closureSnapshotRoutes = require("./routes/closureSnapshotRoutes");
const reportRoutes = require("./routes/reportRoutes");
const userRoutes = require("./routes/userRoutes");

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
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/project-delivery", projectDeliveryRoutes);
app.use("/api/breach-logs", breachLogRoutes);
app.use("/api/closure-snapshots", closureSnapshotRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Organizational Project Management API is Running...");
});

module.exports = app;