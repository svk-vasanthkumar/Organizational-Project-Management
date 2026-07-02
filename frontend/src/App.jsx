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
import ProjectDelivery from "./pages/ProjectDelivery";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/projects" 
          element={<ProtectedRoute><Projects /></ProtectedRoute>} 
        />
        <Route 
          path="/estimation" 
          element={<ProtectedRoute><Estimation /></ProtectedRoute>} 
        />
        <Route 
          path="/team-members" 
          element={<ProtectedRoute><TeamMembers /></ProtectedRoute>} 
        />
        <Route 
          path="/assignment" 
          element={<ProtectedRoute><Assignment /></ProtectedRoute>} 
        />
        <Route 
          path="/tasks" 
          element={<ProtectedRoute><Tasks /></ProtectedRoute>} 
        />
        <Route 
          path="/time-logs" 
          element={<ProtectedRoute><TimeLogs /></ProtectedRoute>} 
        />
        <Route 
          path="/performance" 
          element={<ProtectedRoute><Performance /></ProtectedRoute>} 
        />
        <Route 
          path="/reports" 
          element={<ProtectedRoute><Reports /></ProtectedRoute>} 
        />
        <Route 
          path="/project-delivery" 
          element={<ProtectedRoute><ProjectDelivery /></ProtectedRoute>} 
        />

        <Route path="/estimations" 
        element={ <ProtectedRoute> <Estimation/> </ProtectedRoute>}
        />

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;