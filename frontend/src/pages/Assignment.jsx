import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { getAssignments, deleteAssignment } from "../api/assignmentApi";
import AddAssignmentModal from "../components/AddAssignmentModal";

function Assignment() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    
    // State to manage editing existing records
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    
    // Search filter state
    const [searchTerm, setSearchTerm] = useState("");

    // Inline row selection tracker for clean deletion state confirmation
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        loadAssignments();
    }, []);

    const loadAssignments = async () => {
        try {
            const res = await getAssignments();
            setAssignments(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setSelectedAssignment(null);
        setShowModal(true);
    };

    const handleEditClick = (assignment) => {
        setSelectedAssignment(assignment);
        setShowModal(true);
    };

    const executeDelete = async (id) => {
        try {
            await deleteAssignment(id);
            setDeletingId(null);
            await loadAssignments();
        } catch (err) {
            // Fix 1: Removed browser alert, log cleanly to devtools console for toast migration later
            console.error(err);
            setDeletingId(null);
        }
    };

    // Client-side search filtration engine
    const filteredAssignments = assignments.filter((assign) => {
        const matchProject = assign.projectId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchMember = assign.memberId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchProject || matchMember;
    });

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "Completed":
                return "bg-success text-white";
            case "Working":
                return "bg-warning text-dark";
            case "Assigned":
                return "bg-info text-dark";
            default:
                return "bg-secondary text-white";
        }
    };

    return (
        <MainLayout>
            <PageHeader
                title="Project Assignment"
                buttonText="+ Assign Member"
                onClick={handleAddClick}
            />

            {/* Search UI Bar */}
            <div className="row mb-3">
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control rounded-3"
                        placeholder="Search Member or Project..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <Loader />
            ) : filteredAssignments.length === 0 ? (
                <EmptyState message={searchTerm ? "No matching records found" : "No Assignments"} />
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>Project</th>
                                <th>Member</th>
                                <th>Role</th>
                                <th>Allocated Hours</th>
                                <th>Hours Used</th>
                                <th>Remaining Hours</th>
                                <th>Status</th>
                                <th className="text-center" style={{ width: "180px" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAssignments.map((assign) => (
                                <tr key={assign._id}>
                                    <td>{assign.projectId?.name || "N/A"}</td>
                                    <td>{assign.memberId?.name || "N/A"}</td>
                                    <td>{assign.role}</td>
                                    <td>{assign.allocatedHours}</td>
                                    <td>{assign.hoursUsed}</td>
                                    
                                    {/* Fix 3: Clamped math prevents UI from dropping below zero */}
                                    <td>{Math.max(0, assign.allocatedHours - assign.hoursUsed)}</td>
                                    
                                    {/* Fix 2: Fallback protection wrapper handles old historical DB items safely */}
                                    <td>
                                        <span className={`badge ${getStatusBadgeClass(assign.status || "Assigned")}`}>
                                            {assign.status || "Assigned"}
                                        </span>
                                    </td>
                                    
                                    <td className="text-center">
                                        {deletingId === assign._id ? (
                                            <div className="d-flex gap-1 justify-content-center">
                                                <button 
                                                    className="btn btn-sm btn-danger px-2"
                                                    onClick={() => executeDelete(assign._id)}
                                                >
                                                    Confirm
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-secondary px-2"
                                                    onClick={() => setDeletingId(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <button 
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() => handleEditClick(assign)}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => setDeletingId(assign._id)}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <AddAssignmentModal
                show={showModal}
                assignmentData={selectedAssignment}
                handleClose={() => {
                    setShowModal(false);
                    setSelectedAssignment(null);
                }}
                refreshAssignments={loadAssignments}
            />
        </MainLayout>
    );
}

export default Assignment;