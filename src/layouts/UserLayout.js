import React from 'react';
import { Outlet } from 'react-router-dom';

const UserLayout = () => {
    return (
        <div className="min-h-screen bg-blue-50">
            <header className="p-4 bg-blue-600 text-white text-xl">Trang người dùng</header>
            <main className="p-4">
                <Outlet />
            </main>
        </div>
    );
};

export default UserLayout;
