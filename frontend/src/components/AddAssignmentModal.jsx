import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { createAssignment } from "../api/assignmentApi";
import { getProjects } from "../api/projectApi";
import { getMembers } from "../api/teamMemberApi";

function AddAssignmentModal({
  show,
  handleClose,
  refreshAssignments,
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
    loadDropdowns();
  }, []);

  const loadDropdowns = async () => {
    try {
      const projectRes = await getProjects();
      const memberRes = await getMembers();

      setProjects(projectRes.data.data);
      setMembers(memberRes.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await createAssignment(formData);

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
      console.log(err);
      alert("Assignment Failed");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Assign Member</Modal.Title>
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

              {projects.map((project) => (
                <option
                  key={project._id}
                  value={project._id}
                >
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
            >
              <option value="">Select Member</option>

              {members.map((member) => (
                <option
                  key={member._id}
                  value={member._id}
                >
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

          <Form.Group>
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
          Assign
        </Button>

      </Modal.Footer>
    </Modal>
  );
}

export default AddAssignmentModal;