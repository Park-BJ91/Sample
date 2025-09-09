import axios from "axios";

const API = process.env.REACT_APP_SERVER_PRODUCT_API || '/api/product';

export const getProducts = () => {


    alert(localStorage.getItem('token'));

    return axios.get(
        API,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
};
export const getProductsSearch = (query) => axios.get(`${API}/search?filter=${query}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});
export const createProduct = (data) => axios.post(API, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});
