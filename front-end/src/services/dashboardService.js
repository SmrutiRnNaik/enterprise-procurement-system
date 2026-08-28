import axios from "axios";

const BASE_URL = "http://localhost:8080/api";


/* =========================================================
   DASHBOARD
   ========================================================= */

export const getDashboardCounts = (userId) => {

    return axios.get(
        `${BASE_URL}/dashboard/counts/${userId}`
    );

};


/* =========================================================
   REQUEST HISTORY
   ========================================================= */

export const getRequestHistory = (userId) => {

    return axios.get(
        `${BASE_URL}/products/history?type=user&id=${userId}`
    );

};


/* =========================================================
   DOWNLOAD REQUEST HISTORY
   ========================================================= */

export const downloadHistory = (userId, format) => {

    return axios.get(
        `${BASE_URL}/products/history?type=user&id=${userId}&format=${format}`,
        {
            responseType: "blob"
        }
    );

};


/* =========================================================
   RAISE REQUEST
   ========================================================= */

export const raiseRequest = (data) => {

    return axios.post(
        `${BASE_URL}/products/request`,
        data
    );

};