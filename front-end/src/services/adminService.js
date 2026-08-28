import axios from "axios";

const BASE_URL = "http://localhost:8080/api";


/* =========================================================
   GET ALL ADMIN REQUESTS
   ========================================================= */

export const getAdminRequests = () => {

    return axios.get(
        `${BASE_URL}/products/history?type=admin`
    );

};


/* =========================================================
   APPROVE / REJECT REQUEST
   ========================================================= */

export const updateRequestStatus = (
    productId,
    status
) => {

    return axios.put(
        `${BASE_URL}/admin/requests/${productId}/status`,
        {
            status: status
        }
    );

};


/* =========================================================
   DOWNLOAD ADMIN REQUEST HISTORY
   ========================================================= */

export const downloadAdminHistory = (
    format
) => {

    return axios.get(
        `${BASE_URL}/products/history?type=admin&format=${format}`,
        {
            responseType: "blob"
        }
    );

};