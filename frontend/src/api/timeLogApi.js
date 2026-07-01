import axios from "./axios";

export const getTimeLogs = () =>
    axios.get("/time-logs");

export const createTimeLog = (data) =>
    axios.post("/time-logs", data);