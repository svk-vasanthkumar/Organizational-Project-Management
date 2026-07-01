import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { getMembers, deleteMember } from "../api/teamMemberApi";
import AddMemberModal from "../components/AddMemberModal";

function TeamMembers() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        try {
            const res = await getMembers();
            setMembers(res.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this member?")) return;

        try {
            await deleteMember(id);
            loadMembers();
        } catch (err) {
            console.log(err);
        }
    };

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
            ) : members.length === 0 ? (
                <EmptyState message="No Members Found" />
            ) : (
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
                        {members
                            .filter(member =>
                                member.name.toLowerCase().includes(search.toLowerCase()) ||
                                member.email.toLowerCase().includes(search.toLowerCase())
                            )
                            .map(member => (
                                <tr key={member._id}>
                                    <td>{member.name}</td>
                                    <td>{member.email}</td>
                                    <td>{member.role}</td>
                                    <td>{member.department}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(member._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            )}

            <AddMemberModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                refreshMembers={loadMembers}
            />
        </MainLayout>
    );
}

export default TeamMembers;