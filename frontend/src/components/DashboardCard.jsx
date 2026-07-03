import React from "react";

function DashboardCard({ title, value, subtitle, icon, color }) {
  return (
    <div className="col-12 col-sm-6 col-xl-4 col-xxl-2">
      <div className={`card dashboard-card border-start border-${color} border-4 h-100`}>
        <div className="card-body d-flex flex-column justify-content-between p-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="text-muted fw-semibold small text-uppercase tracking-wider">
              {title}
            </span>
            <div className={`text-${color} fs-4 bg-${color} bg-opacity-10 p-2 rounded-3 lh-1 d-flex align-items-center justify-content-center`}>
              {icon}
            </div>
          </div>
          <div>
            <h2 className="fw-bold mb-1 tracking-tight">{value}</h2>
            {subtitle && (
              <p className="text-muted small mb-0 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;