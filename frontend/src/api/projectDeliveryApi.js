import axios from "./axios";

export const getProjectDeliveries = () =>
    axios.get("/project-delivery");

export const createProjectDelivery = (data) =>
    axios.post("/project-delivery", data);