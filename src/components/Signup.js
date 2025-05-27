import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER'); // Mặc định là USER
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            await axios.post('http://localhost:8088/api/auth/signup', {
                username,
                password,
                role, // Gửi role lên backend
            });
            alert('Đăng ký thành công!');
            navigate('/');
        } catch (err) {
            console.error(err);
            alert('Lỗi đăng ký');
        }
    };

    return (
        <div className="login-container">
            <h2>Đăng ký</h2>
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
            <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="USER">Người dùng</option>
                <option value="ADMIN">Quản trị viên</option>
                {/* Có thể thêm các role khác ở đây nếu backend hỗ trợ */}
            </select>
            <button onClick={handleSignup}>Đăng ký</button>
        </div>
    );
}

export default Signup;
