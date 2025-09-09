import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // useNavigate 훅 사용


    const handleLocalLogin = async ({ id, pw }) => {
        try {
            const response = await axios.post('/api/local/login', {
                reqId: id,
                pwd: pw
            });

            const data = response.data;

            console.log('Login response:', data);

            console.log('Response data:', data.user, data.token);

            if (data.token) {
                // 로그인 성공 시 토큰 저장 등 처리
                localStorage.setItem('token', data.token);
                console.log('Login successful:', data);
                navigate('/'); // /home 페이지로 이동
            }
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);
        }
    };

    const handleLocalTest = async () => {
        try {
            const response = await fetch('/api/test', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            console.log('Test successful:', data);
        } catch (error) {
            console.error('Test error:', error);
            alert('Test failed.');
        }
    };

    const handleNaverLogin = async () => {
        try {
            const response = await axios.get('/auth/naver');
            console.log('Naver Login successful:', response.data);
        } catch (error) {
            console.error('Naver Login error:', error);
            alert('Naver Login failed.');
        }
    };


    return (
        <div>
            <h2>Login Page</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={() => handleLocalLogin({ id: username, pw: password })}>Login</button>
            <button onClick={() => handleLocalTest({ id: username, pw: password })}>Test</button>
            <br />
            <a href="http://localhost:4000/auth/naver">
                {/* <a href="/auth/naver"> */}
                <button>Naver Login</button>
            </a>
        </div>
    );

}
