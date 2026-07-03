import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import DashboardCard from "../components/DashboardCard";
import RecentProjects from "../components/RecentProjects";
import axios from "../api/axios";

// 💡 Using react-icons (npm install react-icons) - fallback to emojis if not using it
import { 
  FaFolderOpen, 
  FaUsers, 
  FaTasks, 
  FaCheckCircle, 
  FaClock, 
  FaHourglassHalf 
} from "react-icons/fa";

function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalMembers: 0,
    totalTasks: 0,
    completedTasks: 0,
    allocatedHours: 0,
    usedHours: 0,
  });

  const [recentProjects, setRecentProjects] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [delayedTasks, setDelayedTasks] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("/dashboard");
      setStats(res.data.statistics);
      setRecentProjects(res.data.recentProjects || []);
      setTopPerformers(res.data.topPerformers || []);
      setDelayedTasks(res.data.delayedTasks || []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout>
      {/* ✨ Modern Dashboard Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1">Dashboard</h2>
          <p className="text-muted mb-0">
            Welcome back! Here's your project overview.
          </p>
        </div>
        <button className="btn btn-primary rounded-pill px-4 shadow-sm fw-medium">
          + New Project
        </button>
      </div>

      {/* 🚀 Beautiful Stat Cards Grid with Better Spacing */}
      <div className="row g-4 mb-5">
        <DashboardCard
          title="Projects"
          value={stats.totalProjects}
          subtitle="Total active tracks"
          icon={<FaFolderOpen />}
          color="primary"
        />
        <DashboardCard
          title="Members"
          value={stats.totalMembers}
          subtitle="Active contributors"
          icon={<FaUsers />}
          color="success"
        />
        <DashboardCard
          title="Tasks"
          value={stats.totalTasks}
          subtitle="Assigned work items"
          icon={<FaTasks />}
          color="warning"
        />
        <DashboardCard
          title="Completed"
          value={stats.completedTasks}
          subtitle="Closed milestones"
          icon={<FaCheckCircle />}
          color="danger"
        />
        <DashboardCard
          title="Allocated Hours"
          value={stats.allocatedHours}
          subtitle="Total sprint budget"
          icon={<FaClock />}
          color="info"
        />
        <DashboardCard
          title="Used Hours"
          value={stats.usedHours}
          subtitle="Logged effort to date"
          icon={<FaHourglassHalf />}
          color="secondary"
        />
      </div>

      {/* 🏗️ Dynamic Sub-Sections Render Grid */}
      <div className="row g-4">
        {/* Recent Projects */}
        <div className="col-12 col-lg-6 col-xl-4">
          <div className="card border-0 rounded-4 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3 text-dark">Recent Projects</h5>
              <RecentProjects projects={recentProjects} />
            </div>
          </div>
        </div>

        {/* Top Performers Section */}
        <div className="col-12 col-md-6 col-lg-3 col-xl-4">
          <div className="card border-0 rounded-4 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3 text-dark">Top Performers</h5>
              {topPerformers.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {topPerformers.map((performer, idx) => (
                    <li key={idx} className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent border-light">
                      <div className="fw-medium">{performer.name}</div>
                      <span className="badge bg-success-subtle text-success rounded-pill px-2.5 py-1">
                        {performer.tasksCompleted} Tasks Done
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted small my-3">No performance data available yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Delayed Tasks Section */}
        <div className="col-12 col-md-6 col-lg-3 col-xl-4">
          <div className="card border-0 rounded-4 shadow-sm h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3 text-dark">Delayed Tasks</h5>
              {delayedTasks.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {delayedTasks.map((task, idx) => (
                    <li key={idx} className="list-group-item d-flex flex-column px-0 bg-transparent border-light gap-1">
                      <div className="fw-medium text-truncate">{task.title}</div>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-danger fw-semibold">{task.daysOverdue} days overdue</small>
                        <small className="text-muted">Owner: {task.assignee || "Unassigned"}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted small my-3">Awesome! No tasks are currently delayed.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;