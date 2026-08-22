import axios from "axios";

const BASE_URL = "http://localhost:8080/api/users";

export const registerUser = (data) => {
    return axios.post(`${BASE_URL}/register`, data);
};

export const getDepartments = () => {
    return axios.get("http://localhost:8080/api/departments");
};

export const loginUser = (data) => {
    return axios.post(`${BASE_URL}/login`, data);
};