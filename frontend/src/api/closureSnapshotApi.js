import axios from "./axios";

export const getClosureSnapshots = () =>
    axios.get("/closure-snapshots");

export const createClosureSnapshot = (data) =>
    axios.post("/closure-snapshots", data);