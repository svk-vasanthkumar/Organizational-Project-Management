import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

function Register() {

    const navigate = useNavigate();

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
            alert("Passwords do not match");
            return;
        }

        try {

            await registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            alert("Registration Successful");

            navigate("/login");

        } catch (err) {

            console.log(err);

            alert("Registration Failed");

        }

    };

    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-5">

                    <div className="card shadow">

                        <div className="card-body">

                            <h3 className="text-center mb-4">
                                Register
                            </h3>

                            <form onSubmit={handleSubmit}>

                                <input
                                    className="form-control mb-3"
                                    placeholder="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />

                                <input
                                    className="form-control mb-3"
                                    placeholder="Email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />

                                <input
                                    className="form-control mb-3"
                                    placeholder="Password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />

                                <input
                                    className="form-control mb-3"
                                    placeholder="Confirm Password"
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />

                                <button
                                    className="btn btn-primary w-100"
                                    type="submit"
                                >
                                    Register
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Register;