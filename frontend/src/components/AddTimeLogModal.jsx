import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

import { getTasks } from "../api/taskApi";
import { getMembers } from "../api/teamMemberApi";
import { createTimeLog } from "../api/timeLogApi";
import { showError, showSuccess } from "./AppToast";

function AddTimeLogModal({
    show,
    handleClose,
    refreshLogs
}) {
    const [tasks, setTasks] = useState([]);
    const [members, setMembers] = useState([]);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        taskId: "",
        memberId: "",
        date: "",
        hoursLogged: "",
        notes: ""
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const taskRes = await getTasks();
            const memberRes = await getMembers();

            setTasks(taskRes.data.data);
            setMembers(memberRes.data.data);
        } catch (err) {
            showError(err.response?.data?.message || "Failed to load time log form data");
        }
    };

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
            await createTimeLog(formData);
            refreshLogs();
            handleClose();
            showSuccess("Time Logged");
        } catch (err) {
            showError(err.response?.data?.message || "Failed to log time");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop={saving ? "static" : true}>
            <Modal.Header closeButton={!saving}>
                <Modal.Title>Log Hours</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Task</Form.Label>
                        <Form.Select
                            name="taskId"
                            value={formData.taskId}
                            onChange={handleChange}
                            disabled={saving}
                        >
                            <option value="">Select</option>
                            {tasks.map(task => (
                                <option key={task._id} value={task._id}>
                                    {task.title}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Member</Form.Label>
                        <Form.Select
                            name="memberId"
                            value={formData.memberId}
                            onChange={handleChange}
                            disabled={saving}
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
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            disabled={saving}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Hours</Form.Label>
                        <Form.Control
                            type="number"
                            name="hoursLogged"
                            value={formData.hoursLogged}
                            onChange={handleChange}
                            disabled={saving}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Notes</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            disabled={saving}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={saving}>
                    Cancel
                </Button>

                <Button variant="primary" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Log"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddTimeLogModal;
