import axios from "./axios";

export const getAssignments = () =>
    axios.get("/assignments");

export const createAssignment = (data) =>
    axios.post("/assignments", data);

export const updateAssignment = (id, data) =>
    axios.put(`/assignments/${id}`, data);

export const deleteAssignment = (id) =>
    axios.delete(`/assignments/${id}`);

// ADD THIS
export const getAssignmentsByProject = (projectId) =>
    axios.get(`/assignments/project/${projectId}`);