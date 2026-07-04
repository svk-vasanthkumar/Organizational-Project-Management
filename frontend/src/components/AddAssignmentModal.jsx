import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
// Change 1: Import Update API alongside createAssignment
import { createAssignment, updateAssignment } from "../api/assignmentApi";
import { getProjects } from "../api/projectApi";
import { getMembers } from "../api/teamMemberApi";

// Change 2: Accept assignmentData via incoming properties
function AddAssignmentModal({
  show,
  handleClose,
  refreshAssignments,
  assignmentData,
}) {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);

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

  // Change 3: Watch assignmentData context updates to automatically branch form fill behavior
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
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Change 4: Dynamic endpoint routing based on identity state logic
  const handleSave = async () => {
    try {
      if (assignmentData) {
        await updateAssignment(assignmentData._id, formData);
      } else {
        await createAssignment(formData);
      }

      refreshAssignments();
      handleClose();

      setFormData({
        projectId: "",
        memberId: "",
        role: "",
        allocatedHours: "",
        startDate: "",
      });
    } catch (err) {
      console.error(err);
      // Maintained layout execution standard, logged to dev console for toast engine conversion later
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        {/* Change 5: Dynamic header string context */}
        <Modal.Title>
          {assignmentData ? "Edit Assignment" : "Assign Member"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Project</Form.Label>
            {/* Change 7: Force dynamic disabled restrictions during update cycles */}
            <Form.Select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              disabled={!!assignmentData}
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
            {/* Change 7: Force dynamic disabled restrictions during update cycles */}
            <Form.Select
              name="memberId"
              value={formData.memberId}
              onChange={handleChange}
              disabled={!!assignmentData}
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
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Allocated Hours</Form.Label>
            <Form.Control
              type="number"
              name="allocatedHours"
              value={formData.allocatedHours}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={formData.startDate}
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
          {/* Change 6: Dynamic visual label processing */}
          {assignmentData ? "Update" : "Assign"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddAssignmentModal;