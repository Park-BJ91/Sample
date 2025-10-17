import { boardAxios } from "@root/config/apiInstance";

/** 게시판 임시 이미지 업로드 */
export const boardTempImageUploadAPI = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    try {
        const response = await boardAxios.post('/temp-image', formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data; // 업로드된 이미지의 URL 반환
    } catch (error) {
        console.error("Error uploading temporary image:", error);
        throw error;
    }
};

/** 게시판 임시 이미지 삭제 */
export const boardTempImageDeleteAPI = async (info) => {
    console.log("삭제할 이미지 정보 #############:", info);
    try {
        const response = await boardAxios.delete('/temp-image', { data: { info } });
        return response.data; // 삭제된 이미지의 URL 반환
    } catch (error) {
        console.error("Error deleting temporary image:", error);
        throw error;
    }
};

/** 게시물 생성 */
export const createBoardPostAPI = async (postData) => {
    try {
        const response = await boardAxios.post('/posts', postData);
        return response.data; // 생성된 게시물 데이터 반환
    } catch (error) {
        console.error("Error creating board post:", error);
        throw error;
    }
};

/** 게시물 목록 조회 */
export const getBoardPostsAPI = async (page) => {
    try {
        const response = await boardAxios.get('/main', { params: { page: page, limit: 10 } });
        return response.data; // 게시물 목록 반환
    } catch (error) {
        console.error("Error fetching board posts:", error);
        throw error;
    }
};

/** 특정 게시물 조회 */
export const getBoardPostByIdAPI = async (postId) => {
    try {
        const response = await boardAxios.get(`/posts/${postId}`);
        return response.data; // 특정 게시물 데이터 반환
    } catch (error) {
        console.error("Error fetching board post by ID:", error);
        throw error;
    }
};

/** 게시물 수정 */
export const updateBoardPostAPI = async (postId, updatedData) => {
    try {
        const response = await boardAxios.put(`/posts/${postId}`, updatedData);
        return response.data; // 업데이트된 게시물 데이터 반환
    } catch (error) {
        console.error("Error updating board post:", error);
        throw error;
    }
};

/** 게시물 삭제 */
export const deleteBoardPostAPI = async (postId) => {
    try {
        const response = await boardAxios.delete(`/posts/${postId}`);
        return response.data; // 삭제 결과 반환
    } catch (error) {
        console.error("Error deleting board post:", error);
        throw error;
    }
};

/** 좋아요 */
export const likeBoardPostAPI = async (postId) => {
    try {
        const response = await boardAxios.post(`/posts/${postId}/like`);
        return response.data; // 좋아요 결과 반환
    } catch (error) {
        console.error("Error liking board post:", error);
        throw error;
    }
};


/** 좋아요 취소 */
export const unlikeBoardPostAPI = async (postId) => {
    try {
        const response = await boardAxios.post(`/posts/${postId}/unlike`);
        return response.data; // 좋아요 취소 결과 반환
    } catch (error) {
        console.error("Error unliking board post:", error);
        throw error;
    }
};

/** 댓글 추가 */
export const addCommentAPI = async (postId, commentData) => {
    try {
        const response = await boardAxios.post(`/posts/${postId}/comments`, commentData);
        return response.data; // 추가된 댓글 데이터 반환
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
};

/** 댓글 목록 조회 */
export const getCommentsAPI = async (postId) => {
    try {
        const response = await boardAxios.get(`/posts/${postId}/comments`);
        return response.data; // 댓글 목록 반환
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw error;
    }
};

/** 댓글 삭제 */
export const deleteCommentAPI = async (postId, commentId) => {
    try {
        const response = await boardAxios.delete(`/posts/${postId}/comments/${commentId}`);
        return response.data; // 삭제 결과 반환
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
    }
};

/** 댓글 수정 */
export const updateCommentAPI = async (postId, commentId, updatedData) => {
    try {
        const response = await boardAxios.put(`/posts/${postId}/comments/${commentId}`, updatedData);
        return response.data; // 업데이트된 댓글 데이터 반환
    } catch (error) {
        console.error("Error updating comment:", error);
        throw error;
    }
};

