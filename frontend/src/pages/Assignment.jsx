import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { getAssignments } from "../api/assignmentApi";
import AddAssignmentModal from "../components/AddAssignmentModal";

function Assignment() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadAssignments();
    }, []);

    const loadAssignments = async () => {
        try {
            const res = await getAssignments();
            setAssignments(res.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <PageHeader
                title="Project Assignment"
                buttonText="+ Assign Member"
                onClick={() => setShowModal(true)}
            />

            {loading ? (
                <Loader />
            ) : assignments.length === 0 ? (
                <EmptyState message="No Assignments" />
            ) : (
                <table className="table table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>Project</th>
                            <th>Member</th>
                            <th>Role</th>
                            <th>Allocated Hours</th>
                            <th>Hours Used</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map(assign => (
                            <tr key={assign._id}>
                                <td>{assign.projectId?.name}</td>
                                <td>{assign.memberId?.name}</td>
                                <td>{assign.role}</td>
                                <td>{assign.allocatedHours}</td>
                                <td>{assign.hoursUsed}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <AddAssignmentModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                refreshAssignments={loadAssignments}
            />
        </MainLayout>
    );
}

export default Assignment;