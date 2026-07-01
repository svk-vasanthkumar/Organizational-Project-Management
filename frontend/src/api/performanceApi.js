import axios from "./axios";

export const getPerformance = () =>
    axios.get("/performance");