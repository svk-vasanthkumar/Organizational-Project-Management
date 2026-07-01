import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { createMember } from "../api/teamMemberApi";

function AddMemberModal({ show, handleClose, refreshMembers }) {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        department: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSave = async () => {

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

        } catch (err) {

            console.log(err);

            alert("Failed to add member");

        }

    };

    return (

        <Modal show={show} onHide={handleClose}>

            <Modal.Header closeButton>
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
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Department</Form.Label>
                        <Form.Control
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                        />
                    </Form.Group>

                </Form>

            </Modal.Body>

            <Modal.Footer>

                <Button
                    variant="secondary"
                    onClick={handleClose}
                >
                    Cancel
                </Button>

                <Button
                    variant="primary"
                    onClick={handleSave}
                >
                    Save Member
                </Button>

            </Modal.Footer>

        </Modal>

    );

}

export default AddMemberModal;