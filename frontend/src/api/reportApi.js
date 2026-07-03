import axios from "./axios";

export const getProjectSummary = () =>
    axios.get("/reports/project-summary");

export const getMemberPerformance = () =>
    axios.get("/reports/member-performance");

export const getLagAttribution = () =>
    axios.get("/reports/lag-attribution");