import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import { getTasks } from "../api/taskApi";
import AddTaskModal from "../components/AddTaskModal";

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const res = await getTasks();
            setTasks(res.data.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

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
                    placeholder="Search Task..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <Loader />
            ) : tasks.length === 0 ? (
                <EmptyState message="No Tasks Found" />
            ) : (
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>Title</th>
                            <th>Project</th>
                            <th>Assigned To</th>
                            <th>Hours</th>
                            <th>Deadline</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks
                            .filter(task =>
                                task.title.toLowerCase().includes(search.toLowerCase())
                            )
                            .map(task => (
                                <tr key={task._id}>
                                    <td>{task.title}</td>
                                    <td>{task.projectId?.name}</td>
                                    <td>{task.assignedTo?.name}</td>
                                    <td>{task.estimatedHours}</td>
                                    <td>{task.deadline?.substring(0, 10)}</td>
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
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
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
        </MainLayout>
    );
}

export default Tasks;