import React, { useState } from 'react';
import { CalendarOutlined, SettingOutlined } from '@ant-design/icons';
import { Input, Layout, Menu } from 'antd';
import './MainFramework.scss';
import { useGlobalStore } from '../Contexts/globalContext';

const { Header, Sider, Content } = Layout;

export default function MainFramework() {
    const [collapse, setCollapse] = useState(true);
    const { state, dispatch } = useGlobalStore();

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
                        Content
                        <div>ApiRoot: {state.apiRoot}</div>
                        <div>Lang: {state.lang}</div>
                        <div><Input placeholder="lang" onChange={v => dispatch({ type: "i18n/setLang", param: v.target.value })} /></div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}