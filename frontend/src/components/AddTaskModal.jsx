import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

import { getProjects } from "../api/projectApi";
import { getMembers } from "../api/teamMemberApi";
import { createTask, getTasks, updateTask } from "../api/taskApi";

function AddTaskModal({ show, handleClose, refreshTasks, selectedTask }) {
    const [projects, setProjects] = useState([]);
    const [members, setMembers] = useState([]);
    const [tasks, setTasks] = useState([]);

    const [formData, setFormData] = useState({
        projectId: "",
        assignedTo: "",
        title: "",
        description: "",
        estimatedHours: "",
        deadline: "",
        priority: "Medium",
        parentTaskId: ""
    });

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (selectedTask) {
            setFormData({
                projectId: selectedTask.projectId?._id || selectedTask.projectId || "",
                assignedTo: selectedTask.assignedTo?._id || selectedTask.assignedTo || "",
                title: selectedTask.title || "",
                description: selectedTask.description || "",
                estimatedHours: selectedTask.estimatedHours || "",
                deadline: selectedTask.deadline?.substring(0, 10) || "",
                priority: selectedTask.priority || "Medium",
                status: selectedTask.status || "",
                parentTaskId: selectedTask.parentTaskId || ""
            });
        } else {
            setFormData({
                projectId: "",
                assignedTo: "",
                title: "",
                description: "",
                estimatedHours: "",
                deadline: "",
                priority: "Medium",
                parentTaskId: ""
            });
        }
    }, [selectedTask, show]);

    const loadData = async () => {
        try {
            const p = await getProjects();
            const m = await getMembers();
            const taskRes = await getTasks();

            setProjects(p.data.data);
            setMembers(m.data.data);
            setTasks(taskRes.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        try {
            if (selectedTask) {
                await updateTask(selectedTask._id, formData);
            } else {
                await createTask(formData);
            }
            refreshTasks();
            handleClose();
        } catch (err) {
            console.log(err);
            alert("Failed");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {selectedTask ? "Edit Task" : "Add Task"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Project</Form.Label>
                        <Form.Select
                            name="projectId"
                            value={formData.projectId}
                            onChange={handleChange}
                        >
                            <option value="">Select</option>
                            {projects.map(project => (
                                <option key={project._id} value={project._id}>
                                    {project.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Assigned To</Form.Label>
                        <Form.Select
                            name="assignedTo"
                            value={formData.assignedTo}
                            onChange={handleChange}
                        >
                            <option value="">Select</option>
                            {members.map(member => (
                                <option key={member._id} value={member._id}>
                                    {member.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Parent Task (Optional)</Form.Label>
                        <Form.Select
                            name="parentTaskId"
                            value={formData.parentTaskId}
                            onChange={handleChange}
                        >
                            <option value="">Main Task</option>
                            {tasks
                                .filter(task => !task.parentTaskId && task._id !== selectedTask?._id)
                                .map(task => (
                                    <option key={task._id} value={task._id}>
                                        {task.title}
                                    </option>
                                ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Task Title</Form.Label>
                        <Form.Control
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <div className="row">
                        <div className="col-md-4">
                            <Form.Group>
                                <Form.Label>Hours</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="estimatedHours"
                                    value={formData.estimatedHours}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>

                        <div className="col-md-4">
                            <Form.Group>
                                <Form.Label>Deadline</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>

                        <div className="col-md-4">
                            <Form.Group>
                                <Form.Label>Priority</Form.Label>
                                <Form.Select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </div>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    {selectedTask ? "Update Task" : "Save Task"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddTaskModal;