import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import { getTasks, deleteTask } from "../api/taskApi";
import AddTaskModal from "../components/AddTaskModal";
import ConfirmModal from "../components/ConfirmModal";
import { showError, showSuccess } from "../components/AppToast";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const res = await getTasks();
            setTasks(res.data.data || res.data);
        } catch (err) {
            showError(err.response?.data?.message || "Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedId || deleting) return;
        setDeleting(true);
        try {
            await deleteTask(selectedId);
            await loadTasks();
            showSuccess("Task Deleted Successfully");
        } catch (err) {
            showError(err.response?.data?.message || "Delete Failed");
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
            setSelectedId(null);
        }
    };

    const filteredTasks = tasks.filter(task => {
        const key = search.toLowerCase();
        return (
            task.title?.toLowerCase().includes(key) ||
            task.projectId?.name?.toLowerCase().includes(key) ||
            task.assignedTo?.name?.toLowerCase().includes(key)
        );
    });

    return (
        <MainLayout>
            <PageHeader
                title="Tasks"
                buttonText="+ Add Task"
                onClick={() => setShowModal(true)}
            />

            <div className="mb-3">
                <input
                    className="form-control"
                    placeholder="Search Task, Project or Member..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <Loader />
            ) : filteredTasks.length === 0 ? (
                <EmptyState 
                    message={search ? "No matching task found." : "No tasks available."} 
                />
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>Title</th>
                                <th>Project</th>
                                <th>Assigned To</th>
                                <th>Hours</th>
                                <th>Logged</th>
                                <th>Priority</th>
                                <th>Progress</th>
                                <th>Remaining</th>
                                <th>Deadline</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTasks.map(task => (
                                <tr key={task._id}>
                                    <td>{task.title}</td>
                                    <td>{task.projectId?.name || "N/A"}</td>
                                    <td>{task.assignedTo?.name || "Unassigned"}</td>
                                    <td>{task.estimatedHours}</td>
                                    <td>{task.loggedHours || 0}</td>
                                    <td>{task.priority || "Medium"}</td>
                                    
                                    <td style={{ minWidth: "140px" }}>
                                        <div className="progress" style={{ height: "8px" }}>
                                            <div
                                                className={`progress-bar ${
                                                    task.progress === 100
                                                        ? "bg-success"
                                                        : task.progress >= 50
                                                        ? "bg-primary"
                                                        : "bg-warning"
                                                }`}
                                                style={{ width: `${task.progress || 0}%` }}
                                            />
                                        </div>
                                        <small>{task.progress || 0}%</small>
                                    </td>
                                    
                                    <td>
                                        {Math.max(0, task.remainingHours ?? (task.estimatedHours - (task.loggedHours || 0)))}
                                    </td>
                                    
                                    <td>
                                        {new Date(task.deadline) < new Date() && task.status !== "Completed" ? (
                                            <span className="text-danger fw-semibold">
                                                {task.deadline?.substring(0, 10)}
                                            </span>
                                        ) : (
                                            task.deadline?.substring(0, 10)
                                        )}
                                    </td>
                                    
                                    <td>
                                        <StatusBadge status={task.status} />
                                    </td>
                                    
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => {
                                                setSelectedTask(task);
                                                setShowModal(true);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => {
                                                setSelectedId(task._id);
                                                setShowDeleteModal(true);
                                            }}
                                            disabled={deleting}
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

            <AddTaskModal
                show={showModal}
                handleClose={() => {
                    setShowModal(false);
                    setSelectedTask(null);
                }}
                refreshTasks={loadTasks}
                selectedTask={selectedTask}
            />

            <ConfirmModal
                show={showDeleteModal}
                title="Delete Task"
                message="Are you sure you want to delete this task?"
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

export default Tasks;
