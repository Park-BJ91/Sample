// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // 작성하신 useAuth 훅

export default function ProtectedRoute({ children }) {
    const { isLogin, loading } = useAuth();

    if (loading) {
        // 로그인 여부 확인 중일 때 (API 요청 중)
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-300"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!isLogin) {
        // 로그인 안 되어 있으면 로그인 페이지로 이동
        return <Navigate to="/login" replace />;
    }

    // 로그인 되어 있으면 원래 페이지로 진입
    return children;
}
