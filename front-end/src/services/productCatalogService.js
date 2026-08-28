import axios from "axios";

const BASE_URL = "http://localhost:8080/api/product-catalog";

export const getProductsByCategory = (categoryId) => {
    return axios.get(
        `${BASE_URL}/category/${categoryId}`
    );
};