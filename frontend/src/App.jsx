import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Estimation from "./pages/Estimation";
import TeamMembers from "./pages/TeamMembers";
import Assignment from "./pages/Assignment";
import Tasks from "./pages/Tasks";
import TimeLogs from "./pages/TimeLogs";
import Performance from "./pages/Performance";
import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/projects" element={<Projects />} />

        <Route path="/estimation" element={<Estimation />} />

        <Route path="/team-members" element={<TeamMembers />} />

        <Route path="/assignment" element={<Assignment />} />

        <Route path="/tasks" element={<Tasks />} />

        <Route path="/time-logs" element={<TimeLogs />} />

        <Route path="/performance" element={<Performance />} />

        <Route path="/reports" element={<Reports />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;