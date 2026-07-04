import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { createAssignment, updateAssignment } from "../api/assignmentApi";
import { getProjects } from "../api/projectApi";
import { getMembers } from "../api/teamMemberApi";
import { showError, showSuccess } from "./AppToast";

function AddAssignmentModal({
  show,
  handleClose,
  refreshAssignments,
  assignmentData,
}) {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    projectId: "",
    memberId: "",
    role: "",
    allocatedHours: "",
    startDate: "",
  });

  useEffect(() => {
  if (show) {
    loadDropdowns();
  }
}, [show]);

  useEffect(() => {
    if (assignmentData) {
      setFormData({
        projectId: assignmentData.projectId?._id || assignmentData.projectId || "",
        memberId: assignmentData.memberId?._id || assignmentData.memberId || "",
        role: assignmentData.role || "",
        allocatedHours: assignmentData.allocatedHours || "",
        startDate: assignmentData.startDate
          ? assignmentData.startDate.substring(0, 10)
          : "",
      });
    } else {
      setFormData({
        projectId: "",
        memberId: "",
        role: "",
        allocatedHours: "",
        startDate: "",
      });
    }
  }, [assignmentData, show]);

  const loadDropdowns = async () => {
    try {
      const projectRes = await getProjects();
      const memberRes = await getMembers();

      setProjects(projectRes.data.data);
      setMembers(memberRes.data.data);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to load form data");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      if (assignmentData) {
        await updateAssignment(assignmentData._id, formData);
      } else {
        await createAssignment(formData);
      }

      refreshAssignments();
      handleClose();
      showSuccess(assignmentData ? "Assignment Updated Successfully" : "Member Assigned Successfully");

      setFormData({
        projectId: "",
        memberId: "",
        role: "",
        allocatedHours: "",
        startDate: "",
      });
    } catch (err) {
      showError(err.response?.data?.message || "Failed to save assignment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop={saving ? "static" : true}>
      <Modal.Header closeButton={!saving}>
        <Modal.Title>
          {assignmentData ? "Edit Assignment" : "Assign Member"}
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
              disabled={!!assignmentData || saving}
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
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
              disabled={!!assignmentData || saving}
            >
              <option value="">Select Member</option>
              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </Form.Select>
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

          <Form.Group className="mb-3">
            <Form.Label>Allocated Hours</Form.Label>
            <Form.Control
              type="number"
              name="allocatedHours"
              value={formData.allocatedHours}
              onChange={handleChange}
              disabled={saving}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={formData.startDate}
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
          {saving ? (assignmentData ? "Updating..." : "Assigning...") : assignmentData ? "Update" : "Assign"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddAssignmentModal;
