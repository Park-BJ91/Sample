import React, { createContext, useContext, useState, useEffect } from 'react';
import { verifyCookie } from '@api/auth/authApi';

const AuthContext = createContext(); // 인증 관련 상태와 함수를 담을 컨텍스트 생성

export const AuthProvider = ({ children }) => {
    const PATH = import.meta.env.VITE_SERVER_AUTH_API;
    const [isLogin, setIsLogin] = useState(null); // null = 아직 확인 전(unknown)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const checkAuth = async () => {
            try {
                const res = await verifyCookie();
                if (!mounted) return;
                console.log("Auth check:", res.data);
                setIsLogin(res.data?.result === 1);
            } catch (err) {
                if (!mounted) return;
                setIsLogin(false);
            } finally {
                if (!mounted) return;
                setLoading(false);
            }
        };

        checkAuth();
        return () => { mounted = false; };
    }, [PATH]);

    return (
        <AuthContext.Provider value={{ isLogin, setIsLogin, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// 훅으로 간단하게 사용
export const useAuth = () => useContext(AuthContext);