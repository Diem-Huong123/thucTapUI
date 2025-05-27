import React from 'react';

function Welcome() {
    const token = localStorage.getItem('token');

    return (
        <div>
            <h2>Chào mừng bạn! Đã đăng nhập thành công!</h2>

        </div>
    );
}

export default Welcome;
