import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, element }) => {
    const role = localStorage.getItem("role"); // Lấy role từ localStorage

    if (!role || !allowedRoles.includes(role)) {
        return <Navigate to="/login" />; // Chuyển hướng nếu không có quyền
    }

    return element ? element : <Outlet />; // Hiển thị nội dung nếu có quyền
};

export default ProtectedRoute;
