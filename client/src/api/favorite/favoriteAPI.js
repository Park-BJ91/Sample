import { favoriteAxios } from "@root/config/apiInstance";

const FAVORITE_API_BASE_URL = '/api/favorite';

/** 즐겨찾기 추가 API */
export const addFavoriteAPI = async (favoriteData) => {
    try {
        const response = await favoriteAxios.post(`${FAVORITE_API_BASE_URL}/add`, favoriteData);
        console.log("🚀 ~ addFavoriteAPI ~ response:", response);
        return response;
    } catch (error) {
        console.error("Error adding favorite:", error);
        throw error;
    }
};

/** 즐겨찾기 중복 여부 확인 API */
export const checkFavoriteExistsAPI = async (contentId, contentTypeId) => {
    try {
        const response = await favoriteAxios.get(`${FAVORITE_API_BASE_URL}/check`, {
            params: { contentId, contentTypeId },
            withCredentials: true
        });
        return response.data.exists;
    } catch (error) {
        console.error("Error checking favorite existence:", error);
        throw error;
    }
};

/** 즐겨찾기 목록 조회 API */
export const getFavoritesAPI = async () => {
    try {
        const response = await favoriteAxios.get(`${FAVORITE_API_BASE_URL}/favorites`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Error fetching favorites:", error);
        throw error;
    }
};

//** 즐겨찾기 삭제 API */
export const deleteFavoriteAPI = async (favId) => {
    try {
        const response = await favoriteAxios.delete(`${FAVORITE_API_BASE_URL}/favorites/${favId}`, { withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error deleting favorite:", error);
        throw error;
    }
};


