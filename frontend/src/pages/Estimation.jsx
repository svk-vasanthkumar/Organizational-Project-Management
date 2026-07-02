import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import AddEstimationModal from "../components/AddEstimationModal";

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

    useEffect(() => {
        loadEstimations();
    }, []);

    const loadEstimations = async () => {
        try {
            const res = await getEstimations();
            setEstimations(res.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await approveEstimation(id);
            loadEstimations();
        } catch (err) {
            console.log(err);
        }
    };

    const handleReject = async (id) => {
        try {
            await rejectEstimation(id);
            loadEstimations();
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete Estimation?")) return;
        try {
            await deleteEstimation(id);
            loadEstimations();
        } catch (err) {
            console.log(err);
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
                                <td>₹ {item.hourlyRate}</td>
                                <td>₹ {item.quotedPrice}</td>
                                <td>{item.status || item.approvalStatus}</td>
                                <td>
                                    <button
                                        className="btn btn-success btn-sm me-2"
                                        onClick={() => handleApprove(item._id)}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleReject(item._id)}
                                    >
                                        Reject
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <AddEstimationModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                refreshEstimations={loadEstimations}
            />
        </MainLayout>
    );
}

export default Estimation;