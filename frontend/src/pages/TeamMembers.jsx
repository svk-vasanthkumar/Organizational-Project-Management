import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { getMembers, deleteMember } from "../api/teamMemberApi";
import AddMemberModal from "../components/AddMemberModal";
import ConfirmModal from "../components/ConfirmModal";
import { showError, showSuccess } from "../components/AppToast";

function TeamMembers() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        try {
            const res = await getMembers();
            setMembers(res.data.data);
        } catch (err) {
            showError(err.response?.data?.message || "Failed to load members");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedId || deleting) return;
        setDeleting(true);
        try {
            await deleteMember(selectedId);
            await loadMembers();
            showSuccess("Member Deleted Successfully");
        } catch (err) {
            showError(err.response?.data?.message || "Failed to delete member");
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
            setSelectedId(null);
        }
    };

    const filteredMembers = members.filter(member => {
        const key = search.toLowerCase();
        return (
            member.name?.toLowerCase().includes(key) ||
            member.email?.toLowerCase().includes(key) ||
            member.role?.toLowerCase().includes(key) ||
            member.department?.toLowerCase().includes(key)
        );
    });

    return (
        <MainLayout>
            <PageHeader
                title="Team Members"
                buttonText="+ Add Member"
                onClick={() => setShowModal(true)}
            />

            <div className="mb-3">
                <input
                    className="form-control"
                    placeholder="Search Member..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <Loader />
            ) : filteredMembers.length === 0 ? (
                <EmptyState message={search ? "No matching members found" : "No Members Found"} />
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Department</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.map(member => (
                                    <tr key={member._id}>
                                        <td>{member.name}</td>
                                        <td>{member.email}</td>
                                        <td>{member.role}</td>
                                        <td>{member.department}</td>
                                        <td>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => {
                                                    setSelectedId(member._id);
                                                    setShowDeleteModal(true);
                                                }}
                                                disabled={deleting}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            )}

            <AddMemberModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                refreshMembers={loadMembers}
            />

            <ConfirmModal
                show={showDeleteModal}
                title="Delete Member"
                message="Are you sure you want to delete this member?"
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

export default TeamMembers;
