import { Col, Divider, Row, Form, Input, Button } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LoginForm {
    username: string;
    password: string;
}

export default function LoginPage() {
    let location = useLocation();
    let navigate = useNavigate();

    let from = location.state?.from?.pathname || "/";


    const onFormSubmit = (values: LoginForm) => {
        console.log(values);
    }

    return (
        <>
            <Row>
                <Col span={12} offset={6}>
                    <h2>Login</h2>
                    <Divider />
                    <Form labelCol={{span: 3}} wrapperCol={{span: 9}} onFinish={onFormSubmit}>
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