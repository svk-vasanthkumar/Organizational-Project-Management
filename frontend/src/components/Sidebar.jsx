import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      className="bg-dark text-white p-3"
      style={{
        width: "250px",
        minHeight: "100vh"
      }}
    >

      <h4 className="text-center mb-4">
        OPMS
      </h4>

      <ul className="nav flex-column">

        <li className="nav-item">
          <Link className="nav-link text-white" to="/dashboard">
            Dashboard
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white" to="/projects">
            Projects
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white" to="/estimation">
            Estimation
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white" to="/team-members">
            Team Members
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white" to="/assignment">
            Assignment
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white" to="/tasks">
            Tasks
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white" to="/time-logs">
            Time Logs
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white" to="/performance">
            Performance
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link text-white" to="/reports">
            Reports
          </Link>
        </li>

      </ul>

    </div>
  );
}

export default Sidebar;