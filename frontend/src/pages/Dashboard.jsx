import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 🚀 1️⃣ Added routing engine hook
import MainLayout from "../layouts/MainLayout";
import DashboardCard from "../components/DashboardCard";
import RecentProjects from "../components/RecentProjects";
import axios from "../api/axios";
import { showError } from "../components/AppToast";

function Dashboard() {
  const navigate = useNavigate(); // 🚀 1️⃣ Instantiate routing hook

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
      showError(error.response?.data?.message || "Failed to load dashboard");
    }
  };

  return (
    <MainLayout>
      {/* 1️⃣ Modern Dashboard Header Section with Nav Action */}
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1">Dashboard</h2>
          <p className="text-muted mb-0">
            Welcome back! Here's what's happening in your workspace today.
          </p>
        </div>
        <button 
          className="btn btn-primary rounded-pill px-4 shadow-sm fw-medium"
          onClick={() => navigate("/projects")} // 🚀 Navigate to Projects page
        >
          + New Project
        </button>
      </div>

      {/* Responsive Stats Grid */}
      <div className="row g-4 mb-5">
        <DashboardCard
          title="Projects"
          value={stats.totalProjects}
          subtitle="Total Projects"
          icon="📁"
          color="primary"
        />
        <DashboardCard
          title="Members"
          value={stats.totalMembers}
          subtitle="Active Contributors"
          icon="👥"
          color="success"
        />
        <DashboardCard
          title="Tasks"
          value={stats.totalTasks}
          subtitle="Assigned work items"
          icon="✅"
          color="warning"
        />
        <DashboardCard
          title="Completed"
          value={stats.completedTasks}
          subtitle="Closed milestones"
          icon="🎯"
          color="danger"
        />
        <DashboardCard
          title="Allocated Hours"
          value={stats.allocatedHours}
          subtitle="Total sprint budget"
          icon="⏱"
          color="info"
        />
        <DashboardCard
          title="Used Hours"
          value={stats.usedHours}
          subtitle="Logged effort to date"
          icon="📈"
          color="secondary"
        />
      </div>

      {/* Sub-Sections Container */}
      <div className="row g-4">
        
        {/* 2️⃣ Recent Projects Card */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 rounded-4 shadow-sm h-100">
            <div className="card-body p-4 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0 text-dark">Recent Projects</h5>
                  <button 
                    className="btn btn-sm btn-outline-primary rounded-pill px-3"
                    onClick={() => navigate("/projects")}
                  >
                    View All
                  </button>
                </div>
                
                {recentProjects.length > 0 ? (
                  /* 🚀 Pass down click handler framework inside mapping context or loop wrapper */
                  <div className="recent-projects-list-wrapper cursor-pointer">
                    <RecentProjects 
                      projects={recentProjects} 
                      onProjectClick={(projectId) => navigate(`/projects/${projectId || ""}`)} 
                    />
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div className="fs-1 mb-2">📂</div>
                    <h6 className="fw-semibold text-dark mb-1">No recent projects found</h6>
                    <p className="text-muted small mb-0 px-3">Start by creating your first project.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3️⃣ Top Performers Card */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card border-0 rounded-4 shadow-sm h-100">
            <div className="card-body p-4 d-flex flex-column justify-content-between">
              <div>
                <h5 className="fw-bold mb-3 text-dark">Top Performers</h5>

                {topPerformers.length > 0 ? (
                  <ul className="list-group list-group-flush mb-3">
                    {topPerformers.map((performer, idx) => (
                      <li key={idx} className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent border-light">
                        <div className="fw-medium text-secondary">{performer.name}</div>
                        <span className="badge bg-success-subtle text-success rounded-pill px-2.5 py-1">
                          {performer.tasksCompleted} Tasks Done
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-4">
                    <div className="fs-1 mb-2">🏆</div>
                    <h6 className="fw-semibold text-dark mb-1">No performance logs</h6>
                    <p className="text-muted small mb-0 px-3">Data updates as team tasks resolve.</p>
                  </div>
                )}
              </div>

              {/* 🚀 Dedicated Button Route Interface - Card itself is safe from generic click triggers */}
              {topPerformers.length > 0 && (
                <button 
                  className="btn btn-link text-primary p-0 text-decoration-none fw-semibold text-start border-0 mt-2 bg-transparent"
                  onClick={() => navigate("/performance")}
                >
                  View Performance →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4️⃣ Delayed Tasks Card */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card border-0 rounded-4 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0 text-dark">Delayed Tasks</h5>
                <button 
                  className="btn btn-sm btn-outline-danger rounded-pill px-3"
                  onClick={() => navigate("/tasks")}
                >
                  Review All
                </button>
              </div>

              {delayedTasks.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {delayedTasks.map((task, idx) => (
                    <li 
                      key={idx} 
                      className="list-group-item d-flex flex-column px-0 bg-transparent border-light gap-1 cursor-pointer hover-bg-light transition-all rounded-3 p-2"
                      onClick={() => navigate(`/tasks/${task._id || ""}`)} // 🚀 Task specific link trigger template
                    >
                      <div className="fw-medium text-dark text-truncate">{task.title}</div>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-danger fw-semibold">{task.daysOverdue} days overdue</small>
                        <small className="text-muted">Owner: {task.assignee || "Unassigned"}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-5">
                  <div className="fs-1 mb-2">🎉</div>
                  <h6 className="fw-semibold text-success mb-1">All clear!</h6>
                  <p className="text-muted small mb-0 px-3">No tasks are currently overdue.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}

export default Dashboard;
