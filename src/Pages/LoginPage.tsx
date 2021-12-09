import { Col, Divider, Row, Form, Input, Button } from 'antd';
import React from 'react';

export default function LoginPage() {
    return (
        <>
            <Row>
                <Col span={12} offset={6}>
                    <h2>Login</h2>
                    <Divider />
                    <Form labelCol={{span: 3}} wrapperCol={{span: 9}}>
                        <Form.Item label="Username" name="username" rules={[{required: true, message: "Username required!"}]}><Input /></Form.Item>
                        <Form.Item label="Password" name="password" rules={[{required: true, message: "Password required!"}]}><Input.Password /></Form.Item>
                        <Form.Item wrapperCol={{offset: 3, span: 9}}>
                            <Button type="primary" htmlType="submit">Login</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>  
        </>
    );
}