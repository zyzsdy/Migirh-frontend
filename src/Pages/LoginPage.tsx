import { Col, Divider, Row, Form, Input, Button, Space } from 'antd';
import React, { useEffect } from 'react';
import { useGlobalDispatch } from '../Contexts/globalContext';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import migirhLogoPng from '../assets/migirh-logo.png';

interface LoginForm {
    username: string;
    password: string;
}

export default function LoginPage() {
    const [t, i18n] = useTranslation("login");
    const location = useLocation();
    const navigate = useNavigate();
    // eslint-disable-next-line
    const [searchParams, setSearchParams] = useSearchParams();
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
                <Col xs={{span: 24}} sm={{span: 24}} md={{span: 12, offset: 6}}>
                    <Space>
                        <img alt="Logo" src={migirhLogoPng} height={64} style={{verticalAlign: 'top'}}/>
                        <span style={{fontFamily: 'Fredoka One', fontSize: 40}}>Minyami GUI / Migirh</span>
                    </Space>
                </Col>
            </Row>
            <Row>
                <Col xs={{span: 24}} sm={{span: 24}} md={{span: 12, offset: 6}}>
                    <h2>{t('LoginTitle')}</h2>
                    <Divider />
                    <Form labelCol={{span: 4}} wrapperCol={{span: 21}} onFinish={onFormSubmit}>
                        <Form.Item label={t('Username')} name="username" rules={[{required: true, message: t('ParameterRequired', { para: t('Username') })}]}><Input /></Form.Item>
                        <Form.Item label={t('Password')} name="password" rules={[{required: true, message: t('ParameterRequired', { para: t('Password') })}]}><Input.Password /></Form.Item>
                        <Form.Item wrapperCol={{offset: 4, span: 21}}>
                            <Button type="primary" htmlType="submit">{t('LoginButton')}</Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>  
        </>
    );
}