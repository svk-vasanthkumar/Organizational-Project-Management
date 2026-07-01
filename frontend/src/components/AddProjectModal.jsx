import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
// 🏗️ Step 7 — Import API
import { createProject } from "../api/projectApi";

// 🏗️ Step 6 — Receive Props
function AddProjectModal({ show, handleClose, refreshProjects }) {
    // 🏗️ Step 1 — Form State
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

    // A clean helper to keep the inputs DRY (Don't Repeat Yourself)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // 🏗️ Step 8 — Create Handle Save
    const handleSave = async () => {
        try {
            await createProject(formData);
            alert("Project Created Successfully");
            refreshProjects();
            handleClose();
        } catch (error) {
            console.log(error);
            alert("Failed to Create Project");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Add New Project</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <div className="row">
                        {/* 🏗️ Step 2 — Connect Inputs */}
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

                {/* 🏗️ Step 9 — Save Button Execution */}
                <Button 
                    variant="primary" 
                    onClick={handleSave}
                >
                    Save Project
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddProjectModal;