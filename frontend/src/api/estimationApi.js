import axios from "./axios";

export const getEstimations = () =>
  axios.get("/estimations");

export const createEstimation = (data) =>
  axios.post("/estimations", data);

export const updateEstimation = (id, data) =>
  axios.put(`/estimations/${id}`, data);

export const deleteEstimation = (id) =>
  axios.delete(`/estimations/${id}`);

export const approveEstimation = (id) =>
  axios.put(`/estimations/${id}/approve`);

export const rejectEstimation = (id) =>
  axios.put(`/estimations/${id}/reject`);