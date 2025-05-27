import React from 'react';

function HomeUser() {
    const username = localStorage.getItem('username');

    return (
        <div className="home-container">
            <h2>Chào mừng người dùng {username}</h2>
            <p>Đây là trang dành cho người dùng thường. User</p>
        </div>
    );
}

export default HomeUser;
