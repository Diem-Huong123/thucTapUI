import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { APIConnect } from '../api';
import {
    Input,
    Button,
    Space,
    Typography,
    message,
    List,
    Card,
    Tag,
    Modal,
} from 'antd';

const { Text } = Typography;

function ServerManager() {
    const [servers, setServers] = useState([]);
    const [host, setHost] = useState('');
    const [usernameU, setUsernameU] = useState('');
    const [passwordU, setPasswordU] = useState('');
    const [machineNumber, setMachineNumber] = useState('');
    const [editId, setEditId] = useState(null);
    const [connectingId, setConnectingId] = useState(null);
    const [connectResult, setConnectResult] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [connectDetails, setConnectDetails] = useState(null);


    const apiUrl = 'http://localhost:8089/api/servers';

    useEffect(() => {
        fetchServers();
    }, []);

    const fetchServers = async () => {
        try {
            const res = await axios.get(apiUrl);
            const sorted = res.data.sort((a, b) => a.machineNumber - b.machineNumber);
            setServers(sorted);
        } catch (err) {
            message.error('Lỗi khi tải danh sách máy chủ');
            console.error(err);
        }
    };



    const resetForm = () => {
        console.log('Resetting form');
        setHost('');
        setUsernameU('');
        setPasswordU('');
        setMachineNumber('');
        setEditId(null);
    };


    const handleSubmit = async () => {
        try {
            if (!host || !usernameU || !passwordU || !machineNumber) {
                message.warning('Vui lòng nhập đầy đủ thông tin, bao gồm số máy');
                return;
            }

            const payload = {
                host,
                usernameU,
                passwordU,
                machineNumber: parseInt(machineNumber, 10) // gửi kiểu số nguyên
            };

            if (editId) {
                const res = await axios.put(`${apiUrl}/${editId}`, payload);
                console.log('Update response:', res.data);
                message.success('Đã cập nhật máy chủ');
            } else {
                const res = await axios.post(apiUrl, payload);
                console.log('Add response:', res.data);
                message.success('Đã thêm máy chủ');
            }
            resetForm();
            setIsModalVisible(false);
            await fetchServers();
        } catch (err) {
            message.error('Lỗi khi lưu thông tin máy chủ');
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa máy chủ này?')) {
            try {
                const res = await axios.delete(`${apiUrl}/${id}`);
                console.log('Delete response:', res.data);
                message.success('Đã xóa máy chủ');
                await fetchServers();
            } catch (err) {
                message.error('Lỗi khi xóa máy chủ');
                console.error(err);
            }
        }
    };

    const handleEdit = (server) => {
        console.log("Editing server:", server);
        setHost(server.host);
        setUsernameU(server.usernameU);
        setPasswordU(server.passwordU);
        setMachineNumber(server.machineNumber?.toString() || '');
        setEditId(server.id);
        setIsModalVisible(true);
    };


    const handleConnect = async (server) => {
        setConnectingId(server.id);
        try {
            const res = await APIConnect.connectSSH({
                host: server.host,
                user: server.usernameU,
                password: server.passwordU,
            });
            setConnectResult((prev) => ({ ...prev, [server.id]: res.message }));
        } catch {
            setConnectResult((prev) => ({ ...prev, [server.id]: 'Kết nối thất bại' }));
        }
        setConnectingId(null);
    };


    return (
        <div style={{ padding: 20 }}>
            <h3>Quản lý Máy Chủ</h3>

            <Button
                type="primary"
                onClick={() => {
                    resetForm();
                    setEditId(null);
                    setIsModalVisible(true);
                }}
            >
                Thêm Máy Chủ
            </Button>

            <Modal
                key={editId || 'new'}
                title={editId ? 'Cập nhật Máy Chủ' : 'Thêm Máy Chủ'}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false);
                    resetForm();
                }}

                footer={[
                    <Button key="cancel" onClick={() => {
                        setIsModalVisible(false);
                        resetForm();
                    }}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleSubmit}>
                        {editId ? 'Cập nhật' : 'Lưu'}
                    </Button>,
                ]}

            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Input
                        placeholder="Host"
                        value={host}
                        onChange={(e) => setHost(e.target.value)}
                    />
                    <Input
                        placeholder="Username"
                        value={usernameU}
                        onChange={(e) => setUsernameU(e.target.value)}
                    />
                    <Input.Password
                        placeholder="Password"
                        value={passwordU}
                        onChange={(e) => setPasswordU(e.target.value)}
                    />
                    <Input
                        type="number"
                        placeholder="Số máy"
                        value={machineNumber}
                        onChange={(e) => setMachineNumber(e.target.value)}
                        min={1}
                    />
                </Space>
            </Modal>

            <h4>Danh sách máy chủ</h4>

            <List
                grid={{ gutter: 16, column: 5 }}
                dataSource={[...servers].sort((a, b) => a.machineNumber - b.machineNumber)}
                renderItem={(server) => (
                    <List.Item>
                        <Card
                            hoverable
                            title={`Server ${server.id} - Máy số ${server.machineNumber ?? '-'}`}
                            extra={
                                <Tag color={server.isAlive ? 'green' : 'red'}>
                                    {server.isAlive ? 'Online' : 'Offline'}
                                </Tag>
                            }
                            style={{ height: '100%', textAlign: 'center' }}
                        >
                            <p><b>Host:</b> {server.host}</p>
                            <p><b>User:</b> {server.usernameU}</p>
                            <p><b>Số máy:</b> {server.machineNumber}</p>

                            <Space>
                                <Button size="small" onClick={() => handleEdit(server)}>
                                    Sửa
                                </Button>
                                <Button size="small" danger onClick={() => handleDelete(server.id)}>
                                    Xóa
                                </Button>
                                <Button
                                    size="small"
                                    type="primary"
                                    onClick={() => handleConnect(server)}
                                    disabled={!server.isAlive || connectingId === server.id}
                                    loading={connectingId === server.id}
                                >
                                    Kết nối
                                </Button>
                            </Space>

                            {connectResult[server.id] && (
                                <div style={{ marginTop: 8, fontSize: 12, color: '#1890ff' }}>
                                    {connectResult[server.id]}
                                </div>
                            )}
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
}

export default ServerManager;
