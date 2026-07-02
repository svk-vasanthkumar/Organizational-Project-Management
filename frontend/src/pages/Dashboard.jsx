import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import DashboardCard from "../components/DashboardCard";
import RecentProjects from "../components/RecentProjects";
import axios from "../api/axios";

function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalMembers: 0,
    totalTasks: 0,
    completedTasks: 0,
    allocatedHours: 0,
    usedHours: 0,
  });

  // 🏗️ Step 2 — Real-time tracking lists states hooks setup
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
      <h2 className="mb-4">Dashboard Overview</h2>

      <div className="row mb-4">
        <DashboardCard
          title="Projects"
          value={stats.totalProjects}
          color="primary"
        />
        <DashboardCard
          title="Members"
          value={stats.totalMembers}
          color="success"
        />
        <DashboardCard
          title="Tasks"
          value={stats.totalTasks}
          color="warning"
        />
        <DashboardCard
          title="Completed"
          value={stats.completedTasks}
          color="danger"
        />
        <DashboardCard
          title="Allocated Hours"
          value={stats.allocatedHours}
          color="info"
        />
        <DashboardCard
          title="Used Hours"
          value={stats.usedHours}
          color="secondary"
        />
      </div>

      {/* 🏗️ Step 4 — Dynamic Sub-Section Container Render Grid */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <RecentProjects projects={recentProjects} />
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;