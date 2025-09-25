import userAaxios from "@api/user/userInstance.js";


/** 회원 아이디 중복 검사 */
export const verifyIdAPI = async (userId) => {
    try {
        const response = await userAaxios.get("/verifyId", { params: { userId } });
        return response;
    } catch (error) {
        console.log("User API 아이디 검증 오류:", error);
        throw error.response?.data || error;
        // return { result: false, message: '클라이언트 API 아이디 검증 오류' };
    }
};

/** 회원가입 */
export const signUpAPI = async (userData) => {

    const { id, password, nickname, profileImage, email, phone, address, addressDetail, zonecode } = userData;

    console.log("User API 회원가입 데이터:", userData);

    const formData = new FormData();

    formData.append("id", id);
    formData.append("password", password);
    formData.append("nickname", nickname);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("addressDetail", addressDetail);
    formData.append("zonecode", zonecode);
    formData.append("profileImage", profileImage);


    try {
        const response = await userAaxios.post(
            "/signup",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response;
    } catch (error) {
        console.log("User API 회원가입 오류:", error);
        throw error.response?.data || error;
    }
};
