import React, { useRef, useState } from 'react';
import { CalendarOutlined, SettingOutlined, TagsOutlined, SearchOutlined } from '@ant-design/icons';
import { Input, Button, Layout, Menu, Row, Col } from 'antd';
import './MainFramework.scss';
import { Link, Outlet, useLocation } from 'react-router-dom';
import migirhLogo from '../assets/migirh-logo.png';

const { Header, Sider, Content } = Layout;

export default function MainFramework() {
    const [collapse, setCollapse] = useState(true);
    const location = useLocation();
    const mainInputEl = useRef<Input>(null);

    const mainInputProcessing = async () => {
        var value = mainInputEl.current?.state.value ?? "";
        console.log(value);
    }

    return (
        <Layout>
            <Header className="layout-header-background">
                <Row>
                    <Col span={4} className="layout-header-brand">
                        <img alt="Logo" className="layout-header-logo" src={migirhLogo} />
                        <span className="header-logo-title">Migirh</span>
                        <span className="header-logo-title-long">Minyami GUI</span>
                    </Col>
                    <Col span={20} className="header-maininput-warpper">
                        <Input.Group compact>
                            <Input className="header-maininput" ref={mainInputEl} placeholder='Enter link / page / command you want by Minyami' onPressEnter={mainInputProcessing} />
                            <Button className="header-maininput-button" icon={<SearchOutlined />} onClick={mainInputProcessing} />
                        </Input.Group>
                    </Col>
                </Row>
            </Header>
            <Layout>
                <Sider collapsible collapsed={collapse} onCollapse={c => setCollapse(c)} width={200} className="layout-sider-background">
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={[location.pathname]}>
                        <Menu.Item key="/" icon={<CalendarOutlined />}><Link to="/">Tasks</Link></Menu.Item>
                        <Menu.Item key="/settings" icon={<SettingOutlined />}><Link to="/settings">Settings</Link></Menu.Item>
                        <Menu.Item key="/about" icon={<TagsOutlined />}><Link to="/about">About</Link></Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Content className="layout-content-background">
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}