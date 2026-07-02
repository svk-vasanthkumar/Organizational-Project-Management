import axios from "./axios";

export const getBreachLogs = () =>
    axios.get("/breach-logs");