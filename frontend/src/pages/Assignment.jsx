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
    
    // Step 5 Upgrades: State to manage editing existing records
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    
    // Step 1 Upgrades: Search state
    const [searchTerm, setSearchTerm] = useState("");

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

    // Open modal for a clean creation form
    const handleAddClick = () => {
        setSelectedAssignment(null);
        setShowModal(true);
    };

    // Open modal pre-populated with active row data
    const handleEditClick = (assignment) => {
        setSelectedAssignment(assignment);
        setShowModal(true);
    };

    const handleDeleteClick = (id) => {
        console.log("Delete triggered for ID:", id);
        // Will wire this call to the API once the backend route is exposed
    };

    // Client-side search filtration engine
    const filteredAssignments = assignments.filter((assign) => {
        const matchProject = assign.projectId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchMember = assign.memberId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchProject || matchMember;
    });

    return (
        <MainLayout>
            <PageHeader
                title="Project Assignment"
                buttonText="+ Assign Member"
                onClick={handleAddClick}
            />

            {/* Step 1: Search UI Bar */}
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
                <table className="table table-bordered align-middle">
                    {/* Step 2: Remodeled Table Headers */}
                    <thead className="table-dark">
                        <tr>
                            <th>Project</th>
                            <th>Member</th>
                            <th>Role</th>
                            <th>Allocated Hours</th>
                            <th>Hours Used</th>
                            <th>Remaining Hours</th>
                            <th>Status</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAssignments.map((assign) => {
                            const remainingHours = assign.allocatedHours - assign.hoursUsed;
                            const isCompleted = assign.hoursUsed >= assign.allocatedHours;

                            return (
                                <tr key={assign._id}>
                                    <td>{assign.projectId?.name}</td>
                                    <td>{assign.memberId?.name}</td>
                                    <td>{assign.role}</td>
                                    <td>{assign.allocatedHours}</td>
                                    <td>{assign.hoursUsed}</td>
                                    
                                    {/* Step 3: Calculation Output */}
                                    <td>{remainingHours}</td>
                                    
                                    {/* Step 4: Visual Badging State Layout */}
                                    <td>
                                        {isCompleted ? (
                                            <span className="badge bg-success">Completed</span>
                                        ) : (
                                            <span className="badge bg-warning text-dark">Working</span>
                                        )}
                                    </td>
                                    
                                    {/* Step 5: Placeholder Trigger Actions */}
                                    <td className="text-center">
                                        <button 
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() => handleEditClick(assign)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDeleteClick(assign._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            <AddAssignmentModal
                show={showModal}
                assignmentData={selectedAssignment} // Passing active selection forward to support structural duality
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