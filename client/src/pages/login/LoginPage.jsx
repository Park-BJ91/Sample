import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@contexts/AuthContext';
import { userLoginAPI } from '@api/auth/authApi';
import axios from 'axios';
import naverLogo from '../../assets/login/n_black_bar.png';


export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // 실패 메시지

    const { setIsLogin } = useAuth();

    const navigate = useNavigate();

    const PATH = import.meta.env.VITE_SERVER_AUTH_API; ``

    const handleLocalLogin = async ({ id, pw }) => {
        try {
            const response = await userLoginAPI({ reqId: id, pwd: pw });
            if (response.data?.result === 'SUCCESS') {
                setError('');
                setIsLogin(true);
                navigate('/'); // 로그인 성공 후 홈 이동
            } else {
                setError(response.data.message || '로그인에 실패했습니다.');
            }
        } catch (error) {
            setError(error.response.data.message || '로그인에 실패했습니다.');
            throw error;
        }
    };

    /* 회원 가입 핸들러 */
    const handleSignup = async () => {
        await navigate('/signup');
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                <div className="flex flex-row items-center gap-4 mb-4">
                    <div className="flex flex-col flex-1 gap-2">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-0 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <button
                        onClick={() => handleLocalLogin({ id: username, pw: password })}
                        className="bg-sky-300 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline h-full"
                        style={{ minHeight: '84px' }}
                    >
                        Login
                    </button>
                </div>

                <div className="flex flex-col items-start text-sm my-6">
                    <span className="text-gray-500" onClick={handleSignup}>회원 가입</span>
                </div>

                {error && (
                    <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
                        {error}
                    </div>
                )}

                <hr className="my-6" />

                <div className="flex flex-col gap-2">
                    <a href={`${PATH}/naver`}>
                        <img src={naverLogo} alt="Naver Login" />
                    </a>
                </div>
            </div>
        </div>
    );
}