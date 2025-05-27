import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);
    const [remainingTime, setRemainingTime] = useState(null);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("AccessToken");
            const userRole = localStorage.getItem("role");

            // console.log("Token:", token); // Debug
            // console.log("User Role:", userRole); // Debug

            if (!token || !userRole) {
                logout();
                return;
            }
            try {
                const decodedToken = jwtDecode(token);
                // console.log("Decoded Token:", decodedToken); // Debug

                const expirationTime = decodedToken.exp * 1000;
                const currentTime = Date.now();
                const timeLeft = expirationTime - currentTime;

                if (timeLeft <= 0) {
                    logout();
                } else {
                    setIsAuthenticated(true);
                    setRole(userRole.toUpperCase()); // Chuyển role về dạng chữ hoa
                    setRemainingTime(timeLeft);
                }
            } catch (error) {
                console.error("Lỗi khi giải mã token:", error);
                // logout();
            }
        };

        checkAuth();
        const interval = setInterval(checkAuth, 10000);

        return () => clearInterval(interval);
    }, []);



    // const logout = async () => {
    //     try {
    //         const mssv = localStorage.getItem("mssv"); // Lấy MSSV của user từ localStorage
    //         if (mssv) {
    //             await fetch(`http://172.30.121.31:8000/auth/logout?mssv=${mssv}`, { method: "POST" });
    //         }
    //     } catch (error) {
    //         console.error("Lỗi khi gọi API logout:", error);
    //     }
    //
    //     // Xóa dữ liệu trên client
    //     localStorage.removeItem("AccessToken");
    //     localStorage.removeItem("RefreshToken");
    //     localStorage.removeItem("mssv");
    //     localStorage.removeItem("role");
    //
    //     setIsAuthenticated(false);
    //     setRole(null);
    //     navigate("/login", { replace: true });
    // };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, logout, remainingTime }}>
            {children}
        </AuthContext.Provider>
    );
};
export default AuthProvider;
