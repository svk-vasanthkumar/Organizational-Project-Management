import axios from "./axios";

export const getProjects = () => axios.get("/projects");

export const createProject = (data) =>
  axios.post("/projects", data);

export const updateProject = (id, data) =>
  axios.put(`/projects/${id}`, data);

export const deleteProject = (id) =>
  axios.delete(`/projects/${id}`);