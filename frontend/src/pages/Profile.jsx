import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import {
    getProfile,
    updateProfile,
    changePassword,
} from "../api/userApi";
import { showSuccess, showError } from "../components/AppToast";

function Profile() {
    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        createdAt: ""
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const res = await getProfile();
            setFormData(res.data.data);
        } catch (err) {
            showError(err.response?.data?.message || "Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async () => {
        if (savingProfile) return;
        setSavingProfile(true);
        try {
            await updateProfile({
                name: formData.name,
                email: formData.email,
            });
            showSuccess("Profile Updated");
            await loadProfile();
        } catch (err) {
            showError(err.response?.data?.message || "Update Failed");
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showError("Passwords do not match.");
            return;
        }

        if (changingPassword) return;
        setChangingPassword(true);
        try {
            await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });

            showSuccess("Password changed successfully.");

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err) {
            showError(err.response?.data?.message || "Password change failed.");
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <Loader />
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <PageHeader title="My Profile" />

            <div className="card shadow-sm">
                <div className="card-body">
                    <div className="text-center mb-4">
                        <div
                            className="rounded-circle bg-primary text-white d-inline-flex justify-content-center align-items-center"
                            style={{
                                width: "90px",
                                height: "90px",
                                fontSize: "32px"
                            }}
                        >
                            {formData.name?.charAt(0).toUpperCase()}
                        </div>
                        <h4 className="mt-3">{formData.name}</h4>
                        <p className="text-muted">{formData.role}</p>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label>Name</label>
                            <input
                                className="form-control"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Email</label>
                            <input
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Role</label>
                            <input
                                className="form-control"
                                value={formData.role}
                                disabled
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label>Joined</label>
                            <input
                                className="form-control"
                                value={formData.createdAt?.substring(0, 10)}
                                disabled
                            />
                        </div>
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={savingProfile}
                    >
                        {savingProfile ? "Updating..." : "Update Profile"}
                    </button>

                    <hr className="my-4" />

                    <h5>Change Password</h5>

                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label>Current Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>

                        <div className="col-md-4 mb-3">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>
                    </div>

                    <button
                        className="btn btn-warning"
                        onClick={handleChangePassword}
                        disabled={changingPassword}
                    >
                        {changingPassword ? "Updating..." : "Change Password"}
                    </button>
                </div>
            </div>
        </MainLayout>
    );
}

export default Profile;
