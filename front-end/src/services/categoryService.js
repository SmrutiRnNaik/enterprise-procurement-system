import axios from "axios";

const BASE_URL = "http://localhost:8080/api/categories";

export const getCategoriesByDepartment = (departmentId) => {
    return axios.get(
        `${BASE_URL}/department/${departmentId}`
    );
};