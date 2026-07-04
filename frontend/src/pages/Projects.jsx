import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import { getProjects, deleteProject } from "../api/projectApi";
import AddProjectModal from "../components/AddProjectModal";
import ConfirmModal from "../components/ConfirmModal";
import { showError, showSuccess } from "../components/AppToast";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const res = await getProjects();
            setProjects(res.data.data);
        } catch (err) {
            showError(err.response?.data?.message || "Failed to load projects");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedId || deleting) return;
        setDeleting(true);
        try {
            await deleteProject(selectedId);
            await loadProjects();
            showSuccess("Project Deleted Successfully");
        } catch (error) {
            showError(
                error.response?.data?.message ||
                "Failed to delete project"
            );
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
            setSelectedId(null);
        }
    };

    const refreshProjects = () => {
        loadProjects();
    };

    const filteredProjects = projects.filter(project => {
        const key = search.toLowerCase();
        return (
            project.name?.toLowerCase().includes(key) ||
            project.client?.toLowerCase().includes(key) ||
            project.priority?.toLowerCase().includes(key) ||
            project.status?.toLowerCase().includes(key)
        );
    });

    return (
        <MainLayout>
            <PageHeader
                title="Projects"
                buttonText="+ Add Project"
                onClick={() => setShowModal(true)}
            />
            
            <AddProjectModal
                show={showModal}
                handleClose={() => {
                    setShowModal(false);
                    setSelectedProject(null);
                }}
                refreshProjects={refreshProjects}
                selectedProject={selectedProject}
            />

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search Project..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <Loader />
            ) : filteredProjects.length === 0 ? (
                <EmptyState message={search ? "No matching projects found" : "No Projects Found"} />
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Name</th>
                                <th>Client</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Budget</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjects.map(project => (
                                    <tr key={project._id}>
                                        <td>{project.name}</td>
                                        <td>{project.client}</td>
                                        <td>{project.priority}</td>
                                        <td>
                                            <StatusBadge status={project.status} />
                                        </td>
                                        <td>₹ {project.budget}</td>
                                        <td>
                                            <button 
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => {
                                                    setSelectedProject(project);
                                                    setShowModal(true);
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => {
                                                    setSelectedId(project._id);
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

            <ConfirmModal
                show={showDeleteModal}
                title="Delete Project"
                message="Are you sure you want to delete this project?"
                confirmText={deleting ? "Deleting..." : "Delete"}
                onClose={() => {
                    if (deleting) return;
                    setShowDeleteModal(false);
                    setSelectedId(null);
                }}
                onConfirm={handleConfirmDelete}
            />
        </MainLayout>
    );
}

export default Projects;
