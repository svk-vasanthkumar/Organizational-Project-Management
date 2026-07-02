import axios from "./axios";

export const getTasks = () => axios.get("/tasks");

export const createTask = (data) =>
    axios.post("/tasks", data);

export const deleteTask = (id) =>
    axios.delete(`/tasks/${id}`);

export const updateTask = (id, data) =>
    axios.put(`/tasks/${id}`, data);