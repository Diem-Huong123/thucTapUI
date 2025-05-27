import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCheck = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    useEffect(() => {
        if (!role) {
            navigate("/login"); // Nếu chưa đăng nhập, chuyển hướng đến trang login
        }
    }, [role, navigate]);

    return null; // Không render gì cả
};

export default AuthCheck;
