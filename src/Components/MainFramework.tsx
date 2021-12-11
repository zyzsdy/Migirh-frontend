import React, { useState } from 'react';
import { CalendarOutlined, SettingOutlined, TagsOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import './MainFramework.scss';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

export default function MainFramework() {
    const [collapse, setCollapse] = useState(true);
    const location = useLocation();

    return (
        <Layout>
            <Header className="layout-header-background">
                <div>Migirh</div>
            </Header>
            <Layout>
                <Sider collapsible collapsed={collapse} onCollapse={c => setCollapse(c)} width={200} className="layout-sider-background">
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={[location.pathname]}>
                        <Menu.Item key="/home" icon={<CalendarOutlined />}><Link to="/home">Tasks</Link></Menu.Item>
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