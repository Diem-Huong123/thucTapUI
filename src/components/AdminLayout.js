import React from "react";
import { Outlet } from "react-router-dom";
// import AdminSidebar from "./AdminPage/AdminSideBar";
// import Navbar from "./AdminPage/AdminNavBar";
// import Footer from "./Footer";
// import "./AdminLayout.css";

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <Navbar className="admin-navbar" />
            <div className="admin-main">
                <AdminSidebar className="admin-sidebar" />
                <div className="admin-content">
                    <Outlet />
                </div>
            </div>
            <Footer className="admin-footer" />
        </div>
    );
};

export default AdminLayout;
