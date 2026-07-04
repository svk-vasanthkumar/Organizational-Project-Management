import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

import { getProjects } from "../api/projectApi";
import { createTask, updateTask } from "../api/taskApi";
import { getAssignmentsByProject } from "../api/assignmentApi"; 
import { showError, showSuccess, showWarning } from "./AppToast";

function AddTaskModal({ show, handleClose, refreshTasks, selectedTask }) {
    const [projects, setProjects] = useState([]);
    const [assignments, setAssignments] = useState([]); 
    const [isSaving, setIsSaving] = useState(false); 
    const [isLoadingMembers, setIsLoadingMembers] = useState(false); // Handles loading status text

    const [formData, setFormData] = useState({
        projectId: "",
        assignedTo: "",
        assignmentId: "", 
        title: "",
        description: "",
        estimatedHours: "",
        deadline: "",
        priority: "Medium",
        status: "Not Started" 
    });

    useEffect(() => {
        loadProjects();
    }, []);

    useEffect(() => {
        if (show) {
            if (selectedTask) {
                const targetProjectId = selectedTask.projectId?._id || selectedTask.projectId || "";
                
                if (targetProjectId) {
                    loadProjectAssignments(targetProjectId);
                }

                setFormData({
                    projectId: targetProjectId,
                    assignedTo: selectedTask.assignedTo?._id || selectedTask.assignedTo || "",
                    assignmentId: selectedTask.assignmentId?._id || selectedTask.assignmentId || "",
                    title: selectedTask.title || "",
                    description: selectedTask.description || "",
                    estimatedHours: selectedTask.estimatedHours || "",
                    deadline: selectedTask.deadline?.substring(0, 10) || "",
                    priority: selectedTask.priority || "Medium",
                    status: selectedTask.status || "Not Started"
                });
            } else {
                setFormData({
                    projectId: "",
                    assignedTo: "",
                    assignmentId: "",
                    title: "",
                    description: "",
                    estimatedHours: "",
                    deadline: "",
                    priority: "Medium",
                    status: "Not Started"
                });
                setAssignments([]);
            }
        }
    }, [selectedTask, show]);

    const loadProjects = async () => {
        try {
            const p = await getProjects();
            setProjects(p.data.data || p.data);
        } catch (err) {
            showError(err.response?.data?.message || "Failed to load projects");
        }
    };

    const loadProjectAssignments = async (projectId) => {
        setIsLoadingMembers(true);
        try {
            const res = await getAssignmentsByProject(projectId);
            setAssignments(res.data.data || res.data);
        } catch (err) {
            showError(err.response?.data?.message || "Failed to load project assignments");
            setAssignments([]);
        } finally {
            setIsLoadingMembers(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "projectId") {
            setFormData(prev => ({
                ...prev,
                projectId: value,
                assignedTo: "",   
                assignmentId: ""  
            }));
            
            if (value) {
                loadProjectAssignments(value);
            } else {
                setAssignments([]);
            }
            return;
        }

        if (name === "assignedTo") {
            const chosenOption = e.target.options[e.target.selectedIndex];
            const targetAssignmentId = chosenOption.getAttribute("data-assignment-id") || "";
            
            setFormData(prev => ({
                ...prev,
                assignedTo: value,
                assignmentId: targetAssignmentId
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.projectId) return "Please select a project.";
        if (!formData.assignedTo || !formData.assignmentId) return "Please select an assigned member.";
        if (!formData.title.trim()) return "Task title cannot be empty.";
        if (formData.description && formData.description.length > 1000) return "Description cannot exceed 1000 characters.";
        if (!formData.estimatedHours || Number(formData.estimatedHours) <= 0) return "Estimated hours must be greater than 0.";
        if (!formData.deadline) return "Please select a valid deadline.";
        return null; 
    };

    const handleSave = async () => {
        const validationError = validateForm();
        if (validationError) {
            showWarning(validationError);
            return;
        }

        setIsSaving(true);
        try {
            if (selectedTask) {
                await updateTask(selectedTask._id, formData);
            } else {
                await createTask(formData);
            }
            refreshTasks();
            handleClose();
            showSuccess(selectedTask ? "Task Updated Successfully" : "Task Created Successfully");
        } catch (err) {
            showError(err.response?.data?.message || "Failed to save task. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" backdrop={isSaving ? "static" : true}>
            <Modal.Header closeButton={!isSaving}>
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
                            disabled={!!selectedTask || isSaving}
                        >
                            <option value="">Select Project</option>
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
                            disabled={!!selectedTask || !formData.projectId || isSaving || isLoadingMembers}
                        >
                            <option value="">{isLoadingMembers ? "Loading Members..." : "Select Member"}</option>
                            {assignments.map(item => {
                                const memberObj = item.memberId; 
                                if (!memberObj) return null;
                                return (
                                    <option 
                                        key={item._id} 
                                        value={memberObj._id}
                                        data-assignment-id={item._id}
                                    >
                                        {memberObj.name}
                                    </option>
                                );
                            })}
                        </Form.Select>
                    </Form.Group>

                    {selectedTask && (
                        <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                disabled={isSaving}
                            >
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Review">Review</option>
                                <option value="Completed">Completed</option>
                                <option value="Blocked">Blocked</option>
                            </Form.Select>
                        </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>Task Title</Form.Label>
                        <Form.Control
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            disabled={isSaving}
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
                            disabled={isSaving}
                        />
                    </Form.Group>

                    <div className="row">
                        <div className="col-md-4">
                            <Form.Group className="mb-3">
                                <Form.Label>Hours</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="estimatedHours"
                                    value={formData.estimatedHours}
                                    onChange={handleChange}
                                    disabled={isSaving}
                                />
                            </Form.Group>
                        </div>

                        <div className="col-md-4">
                            <Form.Group className="mb-3">
                                <Form.Label>Deadline</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    disabled={isSaving}
                                />
                            </Form.Group>
                        </div>

                        <div className="col-md-4">
                            <Form.Group className="mb-3">
                                <Form.Label>Priority</Form.Label>
                                <Form.Select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    disabled={isSaving}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </Form.Select>
                            </Form.Group>
                        </div>
                    </div>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={isSaving}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Saving Task..." : selectedTask ? "Update Task" : "Save Task"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddTaskModal;
