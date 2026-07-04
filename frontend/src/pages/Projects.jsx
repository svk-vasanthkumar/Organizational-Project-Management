import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import { getProjects, deleteProject } from "../api/projectApi";
import AddProjectModal from "../components/AddProjectModal";
import { showError, showSuccess } from "../components/AppToast";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const res = await getProjects();
            setProjects(res.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmDelete) return;

        try {
            await deleteProject(id);
            loadProjects();
            showSuccess("Project Deleted Successfully");
        } catch (error) {
            console.log(error);
            showError("Failed to delete project");
        }
    };

    const refreshProjects = () => {
        loadProjects();
    };

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
            ) : projects.length === 0 ? (
                <EmptyState message="No Projects Found" />
            ) : (
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
                        {projects
                            .filter(project =>
                                project.name.toLowerCase().includes(search.toLowerCase()) ||
                                project.client.toLowerCase().includes(search.toLowerCase())
                            )
                            .map(project => (
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
                                            onClick={() => handleDelete(project._id)}
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
        </MainLayout>
    );
}

export default Projects;