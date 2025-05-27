import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import SideBarAdmin from '../config/SideBarAdmin';

const { Content } = Layout;

const AdminLayout = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <SideBarAdmin />
            <Layout>
                <Content style={{ margin: '16px', padding: '16px', background: '#fff' }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
