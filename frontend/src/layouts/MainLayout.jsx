import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "./MainLayout.css";

function MainLayout({ children }) {
  return (
    <div className="min-vh-100 position-relative">
      {/* 1. Fixed Sticky Sidebar (260px Desktop / Offcanvas Mobile) */}
      <Sidebar />

      {/* 2. Synced Content Area (Automatically offsets 260px on Desktop) */}
      <div className="orbit-main-wrapper">
        <Navbar />

        {/* 3. Dynamic Page Viewport */}
        <main className="orbit-page-content">
          {/* Supports both React Router <Outlet /> and direct {children} wrapper patterns */}
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;