import React, { useState, useEffect } from 'react';
import SSHTerminal from './SSHTerminal';
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
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [connectDetails, setConnectDetails] = useState(null);
    const [selectedServer, setSelectedServer] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [disconnectingId, setDisconnectingId] = useState(null);
    const [openTerminalMap, setOpenTerminalMap] = React.useState({});


    useEffect(() => {
        fetchServers();
    }, []);

    const fetchServers = async () => {
        try {
            const data = await APIConnect.getServers();
            const sorted = data.sort((a, b) => a.machineNumber - b.machineNumber);
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
        if (!host || !usernameU || !passwordU || !machineNumber) {
            message.warning('Vui lòng nhập đầy đủ thông tin, bao gồm số máy');
            return;
        }
        const payload = { host, usernameU, passwordU, machineNumber: parseInt(machineNumber, 10) };
        try {
            if (editId) {
                await APIConnect.updateServer(editId, payload);
                message.success('Đã cập nhật máy chủ');
            } else {
                await APIConnect.addServer(payload);
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
                await APIConnect.deleteServer(id);
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
        try {
            setConnectingId(server.id);
            const res = await APIConnect.connectSSH({ host: server.host, user: server.usernameU, password: server.passwordU });
            setConnectDetails({ ...server, message: res.message });
            setShowDetailModal(false);
            setShowConnectModal(true);
            await fetchServers();
        } catch (error) {
            message.error("Kết nối thất bại");
        } finally {
            setConnectingId(null);
        }
    };

    const handleDisconnect = async () => {
        try {
            setDisconnectingId(connectDetails.id);

            const res = await APIConnect.disconnectSSH({
                host: connectDetails.host,
                user: connectDetails.usernameU
            });

            if (res.success) {
                message.success("Đã ngắt kết nối SSH");

                // Đóng modal kết nối thành công
                setShowConnectModal(false);

                // Hiển thị lại modal chi tiết
                const disconnectedServer = servers.find(s => s.id === connectDetails.id);
                if (disconnectedServer) {
                    setSelectedServer(disconnectedServer);
                    setShowDetailModal(true);
                }

                setConnectDetails(null);
                await fetchServers();
            } else {
                message.error(res.message || "Lỗi khi ngắt kết nối");
            }
        } catch (error) {
            message.error(error.message || "Lỗi khi ngắt kết nối");
        } finally {
            setDisconnectingId(null);
        }
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

            {/* Modal Thêm / Sửa */}
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
                    <Button key="submit" type="primary"
                            onClick={handleSubmit}>
                        {editId ? 'Cập nhật' : 'Lưu'}
                    </Button>
                ]}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Input placeholder="Host" value={host} onChange={(e) => setHost(e.target.value)} />
                    <Input placeholder="Username" value={usernameU} onChange={(e) => setUsernameU(e.target.value)} />
                    <Input.Password placeholder="Password" value={passwordU} onChange={(e) => setPasswordU(e.target.value)} />
                    <Input
                        type="number"
                        placeholder="Số máy"
                        value={machineNumber}
                        onChange={(e) => setMachineNumber(e.target.value)}
                        min={1}
                    />
                </Space>
            </Modal>

            {/* Modal Chi tiết Máy Chủ */}
            <Modal
                open={showDetailModal}
                title={`Chi tiết Máy Chủ: Máy số ${selectedServer?.machineNumber}`}
                onCancel={async () => {
                    setSelectedServer(null);
                    setShowDetailModal(false);
                    await fetchServers();
                }}

                footer={null}
            >
                {selectedServer && (
                    <>
                        <p><b>Host:</b> {selectedServer.host}</p>
                        <p><b>User:</b> {selectedServer.usernameU}</p>
                        <p><b>Số máy:</b> {selectedServer.machineNumber}</p>
                        <p>
                            <Space>
                                <Tag color={selectedServer.isAlive ? 'green' : 'red'}>
                                    {selectedServer.isAlive ? 'Online' : 'Offline'}
                                </Tag>
                                {connectingId === selectedServer.id && (
                                    <Tag color="blue">Đang kết nối...</Tag>
                                )}
                                {connectDetails?.id === selectedServer.id && (
                                    <Tag color="geekblue">Đã kết nối</Tag>
                                )}
                            </Space>
                        </p>

                        <Space>
                            <Button onClick={() => {
                                handleEdit(selectedServer);
                                setShowDetailModal(false);
                            }}>
                                Sửa
                            </Button>

                            <Button danger onClick={() => {
                                handleDelete(selectedServer.id);
                                setShowDetailModal(false);
                            }}>
                                Xóa
                            </Button>
                                <Button
                                    size="small"
                                    type="primary"
                                    onClick={() => handleConnect(selectedServer)}
                                    disabled={!selectedServer.isAlive || connectingId === selectedServer.id}
                                    loading={connectingId === selectedServer.id}
                                >
                                    Kết nối
                                </Button>
                        </Space>
                    </>
                )}
            </Modal>

            {/* Modal Kết nối thành công */}
            <Modal
                open={showConnectModal}
                title="Kết nối thành công"
                onCancel={async () => {
                    setShowConnectModal(false);
                    setConnectDetails(null);
                    await fetchServers();
                }}
                footer={[
                    <Button
                        key="close"
                        type="primary"
                        onClick={handleDisconnect}
                    >
                        Ngắt kết nối
                    </Button>,
                    // <Button
                    //     key="terminal"
                    //     onClick={() => setShowTerminalModal(true)}
                    // >
                    //     Mở Terminal
                    // </Button>
                ]}
            >
                {connectDetails && (
                    <div>
                        <p><b>Host:</b> {connectDetails.host}</p>
                        <p><b>User:</b> {connectDetails.usernameU}</p>
                        <p><b>Số máy:</b> {connectDetails.machineNumber}</p>
                        <p style={{ color: 'green' }}>{connectDetails.message}</p>
                    </div>
                )}
            </Modal>

            {/* Modal Terminal tách riêng */}
            {servers.map(server => (
                openTerminalMap[server.id] && (
                    <Modal
                        key={server.id}
                        open={true}
                        title={`Terminal cho máy ${server.machineNumber}`}
                        onCancel={() => {
                            setOpenTerminalMap(prev => ({
                                ...prev,
                                [server.id]: false,
                            }));
                        }}
                        footer={null}
                        width={800}
                    >
                        <SSHTerminal
                            wsUrl={`ws://localhost:8089/ws/ssh?host=${server.host}&user=${server.usernameU}&password=${server.passwordU}`}
                        />
                    </Modal>
                )
            ))}

            <h4>Danh sách máy chủ</h4>

            <List
                grid={{ gutter: 16, column: 5 }}
                dataSource={[...servers].sort((a, b) => a.machineNumber - b.machineNumber)}
                renderItem={(server) => (
                    <List.Item>
                        <Card
                            hoverable
                            title={`Máy số ${server.machineNumber ?? '-'}`}
                            style={{ textAlign: 'center' }}
                            onClick={() => {
                                setSelectedServer(server);
                                if (server.isConnected) {
                                    setConnectDetails(server);
                                    setShowConnectModal(true);
                                } else {
                                    setShowDetailModal(true);
                                }
                            }}
                        >
                            <p><b>Host:</b> {server.host}</p>
                            <p><b>User:</b> {server.usernameU}</p>
                            <p><b>Số máy:</b> {server.machineNumber}</p>
                            <Space direction="vertical">
                                <Tag color={server.isAlive ? 'green' : 'red'}>
                                    {server.isAlive ? 'Online' : 'Offline'}
                                </Tag>
                                {server.isConnected && (
                                    <Button
                                        type="primary"
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Ngăn event click mở modal chi tiết
                                            setOpenTerminalMap(prev => ({
                                                ...prev,
                                                [server.id]: true,
                                            }));
                                        }}
                                    >
                                        Terminal
                                    </Button>
                                )}

                            </Space>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );

}

export default ServerManager;
