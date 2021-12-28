import { Layout } from 'antd';
import React from 'react';
import './HistoriesPage.scss';

const { Sider, Content } = Layout;

export default function HistoriesPage() {
    return (
        <Layout>
            <Sider width={150} className="categories-sider-background">
                categories
            </Sider>
            <Content className="histories-content-background">
                tasklist
            </Content>
        </Layout>
    );
}
