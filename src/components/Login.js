import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post('http://localhost:8088/api/auth/login', {
                username,
                password,
            });

            const data = res.data;

            if (typeof data === 'string' && data.startsWith('Invalid')) {
                alert('Sai thông tin đăng nhập');
            } else {
                localStorage.setItem('token', data.token);
                localStorage.setItem('username', data.username);
                localStorage.setItem('role', data.role);

                alert(`Đăng nhập thành công với quyền ${data.role}`);

                if (data.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/user');
                }
            }
        } catch (err) {
            console.error(err);
            alert('Lỗi kết nối server');
        }
    };


    return (
        <div className="login-container">
            <h2>Đăng nhập</h2>
            <input
                type="text"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={e => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Đăng nhập</button>
            <p>Chưa có tài khoản? <a href="/signup">Đăng ký</a></p>
        </div>
    );
}

export default Login;
