import axios from "./axios";

export const getProfile = () =>
    axios.get("/users/profile");

export const updateProfile = (data) =>
    axios.put("/users/profile", data);

export const changePassword = (data) =>
    axios.put("/users/change-password", data);