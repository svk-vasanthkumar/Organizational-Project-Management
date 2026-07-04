import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { createEstimation } from "../api/estimationApi";
import { getProjects } from "../api/projectApi";
import { showError } from "./AppToast";

function AddEstimationModal({ show, handleClose, refreshEstimations }) {
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({
        projectId: "",
        estimatedHours: "",
        hourlyRate: "",
        quotedPrice: "",
        notes: ""
    });

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const res = await getProjects();
            setProjects(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const total =
            Number(formData.estimatedHours || 0) *
            Number(formData.hourlyRate || 0);

        setFormData(prev => ({
            ...prev,
            quotedPrice: total
        }));
    }, [formData.estimatedHours, formData.hourlyRate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            await createEstimation(formData);
            refreshEstimations();
            handleClose();
        } catch (err) {
            console.log(err);
            showError("Failed to save estimation");
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Add Estimation</Modal.Title>
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
                            <option value="">Select Project</option>
                            {projects.map(project => (
                                <option key={project._id} value={project._id}>
                                    {project.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <Form.Group>
                                <Form.Label>Estimated Hours</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="estimatedHours"
                                    value={formData.estimatedHours}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>

                        <div className="col-md-6 mb-3">
                            <Form.Group>
                                <Form.Label>Hourly Rate</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="hourlyRate"
                                    value={formData.hourlyRate}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </div>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label>Quoted Price (Read Only)</Form.Label>
                        <Form.Control
                            type="text"
                            name="quotedPrice"
                            value={`₹ ${formData.quotedPrice}`}
                            readOnly
                            disabled
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Notes</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save Estimation
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddEstimationModal;