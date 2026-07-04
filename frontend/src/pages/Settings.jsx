import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmModal from "../components/ConfirmModal";

function Settings() {

    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const handleLogout = async () => {

        localStorage.clear();

        navigate("/login");

    };

    return (

        <MainLayout>

            <PageHeader title="Settings" />

            <div className="row">

                <div className="col-lg-6">

                    <div className="card shadow-sm mb-4">

                        <div className="card-body">

                            <h5 className="mb-3">
                                Account
                            </h5>

                            <button
                                className="btn btn-outline-primary w-100 mb-2"
                                onClick={() => navigate("/profile")}
                            >
                                My Profile
                            </button>

                            <button
                                className="btn btn-outline-danger w-100"
                                onClick={() => {
                                    setSelectedId("logout");
                                    setShowDeleteModal(true);
                                }}
                            >
                                Logout
                            </button>

                        </div>

                    </div>

                </div>

                <div className="col-lg-6">

                    <div className="card shadow-sm mb-4">

                        <div className="card-body">

                            <h5 className="mb-3">
                                Application
                            </h5>

                            <div className="table-responsive">
                                <table className="table">

                                    <tbody>

                                        <tr>
                                            <td>Version</td>
                                            <td>1.0.0</td>
                                        </tr>

                                        <tr>
                                            <td>Framework</td>
                                            <td>React + Node.js</td>
                                        </tr>

                                        <tr>
                                            <td>Database</td>
                                            <td>MongoDB</td>
                                        </tr>

                                        <tr>
                                            <td>Status</td>
                                            <td>
                                                <span className="badge bg-success">
                                                    Running
                                                </span>
                                            </td>
                                        </tr>

                                    </tbody>

                                </table>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <ConfirmModal
                show={showDeleteModal}
                title="Logout"
                message="Are you sure you want to logout?"
                confirmText="Logout"
                onClose={() => {
                    setShowDeleteModal(false);
                    setSelectedId(null);
                }}
                onConfirm={() => {
                    if (selectedId === "logout") {
                        handleLogout();
                    }
                }}
            />

        </MainLayout>

    );

}

export default Settings;
