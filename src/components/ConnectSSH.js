import React, { useState } from "react";
import { Form, Input, Button, Typography, Card, message } from "antd";
import { APIConnect } from "../api";

const { Title, Paragraph } = Typography;

function ConnectSSH() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    const onFinish = async (values) => {
        setLoading(true);
        setResult("");

        try {
            const res = await APIConnect.connectSSH(values);

            setResult(res.message);
            if (res.success && res.message.includes("thành công")) {
                message.success("Kết nối thành công!");
            } else {
                message.error("Kết nối thất bại!");
            }
        } catch (error) {
            setResult("Lỗi frontend: " + error.message);
            message.error("Không thể kết nối đến backend.");
        }

        setLoading(false);
    };

    return (
        <div style={{ maxWidth: 600, margin: "50px auto" }}>
            <Card>
                <Title level={3}>Kết nối SSH tới máy ảo</Title>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Host / IP"
                        name="host"
                        rules={[{ required: true, message: "Vui lòng nhập địa chỉ IP" }]}
                    >
                        <Input placeholder="VD: 192.168.56.101" />
                    </Form.Item>

                    <Form.Item
                        label="Username"
                        name="user"
                        rules={[{ required: true, message: "Vui lòng nhập username" }]}
                    >
                        <Input placeholder="VD: ubuntu" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Kết nối SSH
                        </Button>
                    </Form.Item>
                </Form>

                {result && (
                    <Card type="inner" title="Kết quả">
                        <Paragraph style={{ whiteSpace: "pre-line" }}>{result}</Paragraph>
                    </Card>
                )}
            </Card>
        </div>
    );
}

export default ConnectSSH;
