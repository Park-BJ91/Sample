import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "@api/auth/authApi";

export default function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const result = await verifyToken(); // 서버에 쿠키 검사 요청
                if (result.result !== 1) {
                    navigate("/login", { replace: true }); // 인증 실패 → 로그인 페이지로
                }
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    if (loading) return <div>Loading...</div>;
    return children;
}