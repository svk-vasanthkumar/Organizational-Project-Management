import axios from "./axios";

export const getAssignments = () =>
    axios.get("/assignments");

export const createAssignment = (data) =>
    axios.post("/assignments", data);

export const deleteAssignment = (id) =>
    axios.delete(`/assignments/${id}`);