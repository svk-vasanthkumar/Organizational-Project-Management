import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { showError, showSuccess, showWarning } from "../components/AppToast";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaRocket
} from "react-icons/fa";

import "./Login.css";

function Register() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {

      showWarning("Passwords do not match");

      return;

    }

    try {

      setLoading(true);

      await registerUser({

        name: formData.name,

        email: formData.email,

        password: formData.password

      });

      showSuccess("Registration Successful");

      navigate("/login");

    } catch (err) {

      console.log(err);

      showError("Registration Failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="login-page">

      <div className="login-wrapper">

        {/* LEFT */}

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

              Join OrbitPM.

              <br />

              Collaborate Better.

              <br />

              Build Faster.

            </h2>

            <p>

              Create your workspace and start managing
              projects professionally.

            </p>

          </div>

        </div>

        {/* RIGHT */}

        <div className="login-right">

          <div className="login-card">

            <h3>Create Account ✨</h3>

            <p>Create your OrbitPM account.</p>

            <form onSubmit={handleSubmit}>

              <div className="input-group-custom">

                <FaUser />

                <input

                  type="text"

                  placeholder="Full Name"

                  name="name"

                  value={formData.name}

                  onChange={handleChange}

                  required

                />

              </div>

              <div className="input-group-custom">

                <FaEnvelope />

                <input

                  type="email"

                  placeholder="Email Address"

                  name="email"

                  value={formData.email}

                  onChange={handleChange}

                  required

                />

              </div>

              <div className="input-group-custom">

                <FaLock />

                <input

                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }

                  placeholder="Password"

                  name="password"

                  value={formData.password}

                  onChange={handleChange}

                  required

                />

                <button

                  type="button"

                  className="password-toggle"

                  onClick={() =>
                    setShowPassword(!showPassword)
                  }

                >

                  {

                    showPassword

                    ?

                    <FaEyeSlash />

                    :

                    <FaEye />

                  }

                </button>

              </div>

              <div className="input-group-custom">

                <FaLock />

                <input

                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }

                  placeholder="Confirm Password"

                  name="confirmPassword"

                  value={formData.confirmPassword}

                  onChange={handleChange}

                  required

                />

                <button

                  type="button"

                  className="password-toggle"

                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }

                >

                  {

                    showConfirmPassword

                    ?

                    <FaEyeSlash />

                    :

                    <FaEye />

                  }

                </button>

              </div>

              <button

                className="login-btn"

                type="submit"

                disabled={loading}

              >

                {

                  loading

                  ?

                  "Creating Account..."

                  :

                  "Create Account"

                }

              </button>

            </form>

            <div className="register-link">

              Already have an account?

              <span

                onClick={() =>
                  navigate("/login")
                }

              >

                Sign In

              </span>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Register;