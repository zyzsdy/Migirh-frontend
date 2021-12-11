import { Col, Divider, Row, Form, Input, Button } from 'antd';
import React, { useEffect } from 'react';
import { useGlobalDispatch } from '../Contexts/globalContext';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

interface LoginForm {
    username: string;
    password: string;
}

export default function LoginPage() {
    let location = useLocation();
    let navigate = useNavigate();
    // eslint-disable-next-line
    let [searchParams, setSearchParams] = useSearchParams();
    const globalDispatch = useGlobalDispatch();

    let from = location.state?.from?.pathname ?? "/";

    const onFormSubmit = (values: LoginForm) => {
        console.log(values);
    }

    useEffect(() => {
        let localToken = searchParams.get("localToken");
        if (localToken) {
            let localSk = searchParams.get("localSk") ?? "";
    
            localStorage.setItem("token", localToken);
            localStorage.setItem("uname", "SYSTEM");
            localStorage.setItem("sk", localSk);
    
            globalDispatch({
                type: "user/setLogin",
                param: {
                    name: "SYSTEM",
                    token: localToken,
                    sk: localSk
                }
            });
    
            navigate(from, { replace: true });
        }
    });

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