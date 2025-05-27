import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HomeAdmin() {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const navigate = useNavigate();

    useEffect(() => {
        if (role !== 'ADMIN') {
            alert('Bạn không có quyền truy cập trang này');
            navigate('/login');
        }
    }, [role, navigate]);

    return (
        <div className="home-container">
            <h2>CHÀO MỪNG BẠN ĐẾN VỚI TRANG ADMIN</h2>
            <p>Đây là trang quản trị hệ thống.</p>
        </div>
    );
}

export default HomeAdmin;
