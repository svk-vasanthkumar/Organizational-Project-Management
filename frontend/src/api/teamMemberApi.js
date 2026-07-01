import axios from "./axios";

export const getMembers = () => axios.get("/team-members");

export const createMember = (data) =>
  axios.post("/team-members", data);

export const updateMember = (id, data) =>
  axios.put(`/team-members/${id}`, data);

export const deleteMember = (id) =>
  axios.delete(`/team-members/${id}`);