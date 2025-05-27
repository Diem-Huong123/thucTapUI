import React from 'react';
import { Layout, Menu } from 'antd';
import {
    DesktopOutlined,
    AppstoreOutlined,
    LockOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            key: '/addserver',
            icon: <DesktopOutlined />,
            label: 'Phòng máy',
        },
        {
            key: '/dich-vu',
            icon: <AppstoreOutlined />,
            label: 'Dịch vụ',
        },
        {
            key: '/quan-ly-kong',
            icon: <LockOutlined />,
            label: 'QL nhóm truy cập Kong',
        },
    ];

    return (
        <Sider width={220} className="h-screen bg-gray-900">
            <div
                className="font-semibold border-b flex items-center justify-center"
                style={{ fontSize: '22px', height: '60px', color: 'white', textAlign: 'center' }}
            >
                ADMIN
            </div>

            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                onClick={({ key }) => navigate(key)}
                items={menuItems}
                style={{ marginTop: 10, fontSize: '18px' }}
            />
        </Sider>

    );
};

export default Sidebar;
