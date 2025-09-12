import React from "react";
import { useNavigate } from "react-router-dom";

const LoginFail = () => {
    const navigate = useNavigate();

    const handleRetry = () => {
        navigate("/login");
    };


    return (
        <div>
            <h2>로그인 실패 😢</h2>
            <p>다시 시도해주세요.</p>
            <button onClick={handleRetry}>로그인 다시하기</button>
        </div>
    );
};

export default LoginFail;
