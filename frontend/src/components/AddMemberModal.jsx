import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { createMember } from "../api/teamMemberApi";
import { showError, showSuccess } from "./AppToast";

function AddMemberModal({ show, handleClose, refreshMembers }) {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        department: ""
    });
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSave = async () => {
        if (saving) return;
        setSaving(true);

        try {

            await createMember(formData);

            refreshMembers();

            handleClose();

            setFormData({
                name: "",
                email: "",
                role: "",
                department: ""
            });

            showSuccess("Member Added Successfully");

        } catch (err) {

            showError(err.response?.data?.message || "Failed to add member");

        } finally {

            setSaving(false);

        }

    };

    return (

        <Modal show={show} onHide={handleClose} backdrop={saving ? "static" : true}>

            <Modal.Header closeButton={!saving}>
                <Modal.Title>Add Team Member</Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <Form>

                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={saving}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={saving}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            disabled={saving}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Department</Form.Label>
                        <Form.Control
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            disabled={saving}
                        />
                    </Form.Group>

                </Form>

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="secondary"
                    onClick={handleClose}
                    disabled={saving}
                >
                    Cancel
                </Button>

                <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save Member"}
                </Button>

            </Modal.Footer>

        </Modal>

    );

}

export default AddMemberModal;
