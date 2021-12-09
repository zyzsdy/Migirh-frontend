import React, { useState } from 'react';
import { CalendarOutlined, SettingOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import './MainFramework.scss';
import { Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

export default function MainFramework() {
    const [collapse, setCollapse] = useState(true);

    return (
        <Layout>
            <Header className="layout-header-background">
                <div>Migirh</div>
            </Header>
            <Layout>
                <Sider collapsible collapsed={collapse} onCollapse={c => setCollapse(c)} width={200} className="layout-sider-background">
                    <Menu theme="dark" mode="inline">
                        <Menu.Item icon={<CalendarOutlined />}>Tasks</Menu.Item>
                        <Menu.Item icon={<SettingOutlined />}>Settings</Menu.Item>
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