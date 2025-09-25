import axios from "axios";

const API = process.env.VITE_SERVER_PRODUCT_API;
const token = localStorage.getItem('token');

export const getProducts = async () => {
    try {
        const response = await axios.get(
            API,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response;
    } catch (error) {
        console.error("Failed to fetch products:", error);
        throw error;
    }
};
export const getProductsSearch = async (query) => {
    try {
        const response = await axios.get(`${API}/search?filter=${query}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response;
    } catch (error) {
        console.error("Failed to fetch products:", error);
        throw error;
    }
};
export const createProduct = async (data) => {
    try {
        const response = await axios.post(API, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response;
    } catch (error) {
        console.error("Failed to create product:", error);
        throw error;
    }
};
