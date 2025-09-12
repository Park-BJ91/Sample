import axios from "axios";


export const verifyToken = async () => {
    const PATH = process.env.REACT_APP_SERVER_AUTH_API || '/api/auth';
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(
            `${PATH}/verifyToken`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        // return response.data;
        return response
    } catch (error) {
        console.error("Failed to verify token:", error.response);
        return error.response;
    }
};
