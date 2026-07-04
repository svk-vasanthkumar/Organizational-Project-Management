import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import AddEstimationModal from "../components/AddEstimationModal";
import ConfirmModal from "../components/ConfirmModal";
import { showError, showSuccess } from "../components/AppToast";

import {
    getEstimations,
    approveEstimation,
    rejectEstimation,
    deleteEstimation
} from "../api/estimationApi";

function Estimation() {
    const [estimations, setEstimations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [actionId, setActionId] = useState(null);
    const [actionType, setActionType] = useState("");

    useEffect(() => {
        loadEstimations();
    }, []);

    const loadEstimations = async () => {
        try {
            const res = await getEstimations();
            setEstimations(res.data.data);
        } catch (err) {
            showError(err.response?.data?.message || "Failed to load estimations");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (actionId) return;
        setActionId(id);
        setActionType("approve");

        try {
            await approveEstimation(id);
            await loadEstimations();
            showSuccess("Estimation Approved Successfully");
        } catch (err) {
            showError(err.response?.data?.message || "Failed to approve estimation");
        } finally {
            setActionId(null);
            setActionType("");
        }
    };

    const handleReject = async (id) => {
        if (actionId) return;
        setActionId(id);
        setActionType("reject");

        try {
            await rejectEstimation(id);
            await loadEstimations();
            showSuccess("Estimation Rejected Successfully");
        } catch (err) {
            showError(err.response?.data?.message || "Failed to reject estimation");
        } finally {
            setActionId(null);
            setActionType("");
        }
    };

    const handleDelete = async () => {
        if (!selectedId || deleting) return;
        setDeleting(true);

        try {
            await deleteEstimation(selectedId);
            await loadEstimations();
            showSuccess("Estimation Deleted Successfully");
        } catch (err) {
            showError(err.response?.data?.message || "Failed to delete estimation");
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
            setSelectedId(null);
        }
    };

    return (
        <MainLayout>
            <PageHeader
                title="Estimations"
                buttonText="+ Add Estimation"
                onClick={() => setShowModal(true)}
            />

            {loading ? (
                <Loader />
            ) : estimations.length === 0 ? (
                <EmptyState message="No Estimations Found" />
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead className="table-dark">
                            <tr>
                                <th>Project</th>
                                <th>Hours</th>
                                <th>Rate</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {estimations.map(item => (
                                <tr key={item._id}>
                                    <td>{item.projectId?.name}</td>
                                    <td>{item.estimatedHours}</td>
                                    <td>â‚¹ {item.hourlyRate}</td>
                                    <td>â‚¹ {item.quotedPrice}</td>
                                    <td>{item.status || item.approvalStatus}</td>
                                    <td>
                                        <button
                                            className="btn btn-success btn-sm me-2"
                                            onClick={() => handleApprove(item._id)}
                                            disabled={!!actionId || deleting}
                                        >
                                            {actionId === item._id && actionType === "approve" ? "Approving..." : "Approve"}
                                        </button>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleReject(item._id)}
                                            disabled={!!actionId || deleting}
                                        >
                                            {actionId === item._id && actionType === "reject" ? "Rejecting..." : "Reject"}
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => {
                                                setSelectedId(item._id);
                                                setShowDeleteModal(true);
                                            }}
                                            disabled={!!actionId || deleting}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <AddEstimationModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                refreshEstimations={loadEstimations}
            />

            <ConfirmModal
                show={showDeleteModal}
                title="Delete Estimation"
                message="Are you sure you want to delete this estimation?"
                confirmText={deleting ? "Deleting..." : "Delete"}
                onClose={() => {
                    if (deleting) return;
                    setShowDeleteModal(false);
                    setSelectedId(null);
                }}
                onConfirm={handleDelete}
            />
        </MainLayout>
    );
}

export default Estimation;
