import { Modal, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { createProject, updateProject } from "../api/projectApi";
import { showError, showSuccess } from "./AppToast";

function AddProjectModal({ show, handleClose, refreshProjects, selectedProject }) {
    const [formData, setFormData] = useState({
        name: "",
        client: "",
        type: "",
        priority: "Medium",
        totalHours: "",
        budget: "",
        startDate: "",
        endDate: "",
        scope: ""
    });

    useEffect(() => {
        if (selectedProject) {
            setFormData({
                name: selectedProject.name || "",
                client: selectedProject.client || "",
                type: selectedProject.type || "",
                priority: selectedProject.priority || "Medium",
                totalHours: selectedProject.totalHours || "",
                budget: selectedProject.budget || "",
                startDate: selectedProject.startDate?.substring(0, 10) || "",
                endDate: selectedProject.endDate?.substring(0, 10) || "",
                scope: selectedProject.scope || ""
            });
        } else {
            setFormData({
                name: "",
                client: "",
                type: "",
                priority: "Medium",
                totalHours: "",
                budget: "",
                startDate: "",
                endDate: "",
                scope: ""
            });
        }
    }, [selectedProject, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSave = async () => {
        try {
            if (selectedProject) {
                await updateProject(selectedProject._id, formData);
                showSuccess("Project Updated Successfully");
            } else {
                await createProject(formData);
                showSuccess("Project Created Successfully");
            }
            refreshProjects();
            handleClose();
        } catch (error) {
            console.log(error);
            showError("Operation Failed");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {selectedProject ? "Edit Project" : "Add New Project"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <Form.Label>Project Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <Form.Label>Client</Form.Label>
                            <Form.Control
                                type="text"
                                name="client"
                                value={formData.client}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <Form.Label>Project Type</Form.Label>
                            <Form.Control
                                type="text"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <Form.Label>Priority</Form.Label>
                            <Form.Select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </Form.Select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <Form.Label>Total Hours</Form.Label>
                            <Form.Control
                                type="number"
                                name="totalHours"
                                value={formData.totalHours}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <Form.Label>Budget</Form.Label>
                            <Form.Control
                                type="number"
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-12">
                            <Form.Label>Scope</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="scope"
                                value={formData.scope}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>

                <Button variant="primary" onClick={handleSave}>
                    {selectedProject ? "Update Project" : "Save Project"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddProjectModal;