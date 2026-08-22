import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

export const getDashboardCounts = (userId) => {
    return axios.get(`${BASE_URL}/dashboard/counts/${userId}`);
};

export const getRequestHistory = (userId) => {
    return axios.get(`${BASE_URL}/products/history?type=user&id=${userId}`);
};

export const downloadHistory = (userId, format) => {
    return axios.get(
        `${BASE_URL}/products/history?type=user&id=${userId}&format=${format}`,
        {
            responseType: "blob"
        }
    );
};