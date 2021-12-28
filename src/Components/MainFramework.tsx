import React, { useRef, useState } from 'react';
import { DownloadOutlined, CalendarOutlined, SettingOutlined, TagsOutlined, SendOutlined } from '@ant-design/icons';
import { Input, Button, Layout, Menu, Row, Col, message } from 'antd';
import './MainFramework.scss';
import { Link, Outlet, useLocation } from 'react-router-dom';
import migirhLogo from '../assets/migirh-logo.png';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '../Contexts/globalContext';
import { fetchPostWithSign } from '../utils/fetchpost';
import { apiResponseData, defaultApiErrorAction } from '../utils/defaultApiErrorAction';
import type { InputResult } from './SelectTaskModal';
import SelectTaskModal from './SelectTaskModal';
import type { NewTaskParams } from './NewTaskModal';
import NewTaskModal from './NewTaskModal';

const { Header, Sider, Content } = Layout;

interface taskInputResponse extends apiResponseData {
    result: InputResult[]
}

export default function MainFramework() {
    const [t, i18n] = useTranslation();
    const [collapse, setCollapse] = useState(true);
    const location = useLocation();
    const mainInputEl = useRef<Input>(null);
    const globalState = useGlobalStore();
    const [selectTaskVisible, setSelectTaskVisible] = useState(false);
    const [selectTaskList, setSelectTaskList] = useState<InputResult[]>([]);
    const [newTaskModalVisible, setNewTaskModalVisible] = useState(false);
    const [newTaskModalParams, setNewTaskModalParams] = useState<NewTaskParams>();

    const mainInputProcessing = async () => {
        let content = mainInputEl.current?.state.value ?? "";
        mainInputEl.current?.setValue("");
        if (!content) {
            message.info(t('MustEnterContent'));
            return;
        };
        let res = await fetchPostWithSign(globalState, "task/input", {
            content
        });
        let json = await res.json() as taskInputResponse;

        if (json.error === 0) {
            if (json.result && json.result.length === 1){
                // 直接弹出新建任务页
                selectTaskOk(json.result[0].info);
            } else {
                // 弹出任务选择页
                setSelectTaskList(json.result);
                setSelectTaskVisible(true);
            }
        } else {
            defaultApiErrorAction(json, t);
        }
    }

    const selectTaskOk = (info: NewTaskParams) => {
        setSelectTaskVisible(false);
        setNewTaskModalParams(info);
        setNewTaskModalVisible(true);
    }

    const selectTaskCancel = () => {
        setSelectTaskVisible(false);
    }

    const newTaskCancel = () => {
        setNewTaskModalVisible(false);
    }

    const newTaskAction = async () => {
        setNewTaskModalVisible(false);
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
                            <Input className="header-maininput" ref={mainInputEl} placeholder={t('TaskInputPlaceholder')} onPressEnter={mainInputProcessing} />
                            <Button className="header-maininput-button" icon={<SendOutlined />} onClick={mainInputProcessing} />
                        </Input.Group>
                        <SelectTaskModal initParams={selectTaskList} visible={selectTaskVisible} onOK={selectTaskOk} onCancel={selectTaskCancel} />
                        <NewTaskModal visible={newTaskModalVisible} onOK={newTaskAction} onCancel={newTaskCancel} initParams={newTaskModalParams} />
                    </Col>
                </Row>
            </Header>
            <Layout className="layout-sider-background-warpper">
                <Sider collapsible collapsed={collapse} onCollapse={c => setCollapse(c)} width={200} className="layout-sider-background">
                    <Menu theme="light" mode="inline" defaultSelectedKeys={[location.pathname]}>
                        <Menu.Item key="/" icon={<DownloadOutlined />}><Link to="/">{t('Tasks')}</Link></Menu.Item>
                        <Menu.Item key="/histories" icon={<CalendarOutlined />}><Link to="/histories">{t('Histories')}</Link></Menu.Item>
                        <Menu.Item key="/settings" icon={<SettingOutlined />}><Link to="/settings">{t('Settings')}</Link></Menu.Item>
                        <Menu.Item key="/about" icon={<TagsOutlined />}><Link to="/about">{t('About')}</Link></Menu.Item>
                    </Menu>
                </Sider>
                <Content className="layout-content-background">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}