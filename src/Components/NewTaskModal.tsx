import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Divider, Form, Input, InputNumber, Modal, Row, Select, Switch } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './NewTaskModal.scss';

interface NewTaskParams {
    url: string;
    live: boolean;
    output: string;
    category: string;
    description: string;
    threads: number;
    retries: number;
    key: string;
    cookies: string;
    headers: string;
    format: string;
    slice: string;
    nomerge: boolean;
    proxy: string;
    verbose: boolean
}

export default function NewTaskModal() {
    const [t, i18n] = useTranslation("tasks");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newTaskForm] = Form.useForm<NewTaskParams>();

    const showModal = () => {
        setIsModalVisible(true);
    }

    const onOk = () => {
        console.log(newTaskForm.getFieldsValue());
        setIsModalVisible(false);
    }

    const onCancel = () => {
        setIsModalVisible(false);
    }

    return (
        <>
            <Button type="primary" icon={<PlusCircleOutlined />} onClick={showModal}><span className="task-button-label">{t('NewTask')}</span></Button>
            <Modal title={t('NewTaskModalTitle')} visible={isModalVisible} onOk={onOk} onCancel={onCancel} width={900}
                okText={t('OkButton')} cancelText={t('CancelButton')}>
                <Form form={newTaskForm} initialValues={{
                    threads: 5,
                    retries: 5,
                    format: "ts",
                    category: "default"
                }}>
                    <Row>
                        <Col span={3} className="modal-label"><label htmlFor="url">{t('M3u8Url')}</label></Col>
                        <Col span={21}>
                            <Form.Item name="url">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={3} className="modal-label"><label htmlFor="live">{t('IsLive')}</label></Col>
                        <Col span={9}>
                            <Form.Item name="live" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Col>
                        <Col span={3} className="modal-label"><label htmlFor="category">{t('Category')}</label></Col>
                        <Col span={9}>
                            <Form.Item name="category">
                                <Select>
                                    <Select.Option value="default">Default</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={3} className="modal-label"><label htmlFor="output">{t('Output')}</label></Col>
                        <Col span={21}>
                            <Form.Item name="output">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={3} className="modal-label"><label htmlFor="description">{t('Description')}</label></Col>
                        <Col span={21}>
                            <Form.Item name="description">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Collapse>
                        <Collapse.Panel header={t('MinyamiOptions')} key="mo">
                            <Row>
                                <Col span={3} className="modal-label"><label htmlFor="threads">{t('Threads')}</label></Col>
                                <Col span={5}>
                                    <Form.Item name="threads">
                                        <InputNumber />
                                    </Form.Item>
                                </Col>
                                <Col span={3} className="modal-label"><label htmlFor="retries">{t('Retries')}</label></Col>
                                <Col span={5}>
                                    <Form.Item name="retries">
                                        <InputNumber />
                                    </Form.Item>
                                </Col>
                                <Col span={3} className="modal-label"><label htmlFor="format">{t('Format')}</label></Col>
                                <Col span={5}>
                                    <Form.Item name="format">
                                        <Select>
                                            <Select.Option value="ts">ts</Select.Option>
                                            <Select.Option value="mkv">mkv</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={3} className="modal-label"><label htmlFor="nomerge">{t('Nomerge')}</label></Col>
                                <Col span={9}>
                                    <Form.Item name="nomerge" valuePropName="checked">
                                        <Switch />
                                    </Form.Item>
                                </Col>
                                <Col span={3} className="modal-label"><label htmlFor="verbose">{t('Verbose')}</label></Col>
                                <Col span={9}>
                                    <Form.Item name="verbose" valuePropName="checked">
                                        <Switch />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={3} className="modal-label"><label htmlFor="key">{t('Key')}</label></Col>
                                <Col span={9}>
                                    <Form.Item name="key">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={3} className="modal-label"><label htmlFor="slice">{t('Slice')}</label></Col>
                                <Col span={9}>
                                    <Form.Item name="slice">
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={3} className="modal-label"><label htmlFor="cookies">{t('Cookies')}</label></Col>
                                <Col span={21}>
                                    <Form.Item name="cookies">
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={3} className="modal-label"><label htmlFor="headers">{t('Headers')}</label></Col>
                                <Col span={21}>
                                    <Form.Item name="headers">
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={3} className="modal-label"><label htmlFor="proxy">{t('Proxy')}</label></Col>
                                <Col span={21}>
                                    <Form.Item name="proxy">
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Collapse.Panel>
                    </Collapse>
                </Form>
            </Modal>
        </>
    );
}