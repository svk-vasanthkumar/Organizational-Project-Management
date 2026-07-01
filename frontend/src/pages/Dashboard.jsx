import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import DashboardCard from "../components/DashboardCard";
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

  useEffect(() => {

    fetchDashboard();

  }, []);

  const fetchDashboard = async () => {

    try {

      const res = await axios.get("/dashboard");

      setStats(res.data.statistics);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <MainLayout>

      <h2 className="mb-4">
        Dashboard Overview
      </h2>

      <div className="row">

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

    </MainLayout>

  );

}

export default Dashboard;