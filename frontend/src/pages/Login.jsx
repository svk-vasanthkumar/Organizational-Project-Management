import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { showError, showSuccess } from "../components/AppToast";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaRocket,
} from "react-icons/fa";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser(formData);

      // Save JWT
      localStorage.setItem("token", res.data.token);

      // Save logged-in user
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      showSuccess("Login Successful");

      navigate("/dashboard");
    } catch (err) {
      showError(err.response?.data?.message || "Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        {/* Left Side */}
        <div className="login-left">
          <div className="brand">
            <div className="brand-icon">
              <FaRocket />
            </div>
            <h1>OrbitPM</h1>
            <p>Enterprise Project Management System</p>
          </div>
          <div className="login-content">
            <h2>
              Manage Projects.
              <br />
              Track Progress.
              <br />
              Deliver Faster.
            </h2>
            <p>
              A modern workspace for managing projects, teams and performance.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="login-right">
          <div className="login-card">
            <h3>Welcome Back 👋</h3>
            <p>Sign in to continue to OrbitPM</p>
            <form onSubmit={handleSubmit}>
              <div className="input-group-custom">
                <FaEnvelope />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group-custom">
                <FaLock />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <button
                type="submit"
                className="login-btn"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
            <div className="register-link">
              Don't have an account?{" "}
              <span onClick={() => navigate("/register")}>
                Register
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
