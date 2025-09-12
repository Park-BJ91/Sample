import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginSuccess = () => {
    const navigate = useNavigate();
    useEffect(() => {
        alert("네이버 로그인 성공!");
        navigate("/"); // 로그인 후 이동할 페이지
        // navigate("/dashboard"); // 로그인 후 이동할 페이지

    }, [navigate]);

    return <div>로그인 처리 중입니다...</div>;
};

export default LoginSuccess;

