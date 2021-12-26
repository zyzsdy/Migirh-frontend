import { Col, Collapse, Form, Input, InputNumber, message, Modal, Row, Select, Switch } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalStore } from '../Contexts/globalContext';
import { apiResponseData, defaultApiErrorAction } from '../utils/defaultApiErrorAction';
import { fetchPostWithSign } from '../utils/fetchpost';
import BrowseInput from './BrowseInput';
import './NewTaskModal.scss';

export interface NewTaskParams {
    url?: string;
    live?: boolean;
    output?: string;
    category?: string;
    description?: string;
    threads?: number;
    retries?: number;
    key?: string;
    cookies?: string;
    headers?: string;
    format?: string;
    slice?: string;
    nomerge?: boolean;
    proxy?: string;
    verbose?: boolean
}

interface NewTaskModalProps {
    visible: boolean
    onOK: () => void,
    onCancel: () => void,
    initParams?: NewTaskParams
}

export default function NewTaskModal(props: NewTaskModalProps) {
    const [t, i18n] = useTranslation("tasks");
    const [newTaskForm] = Form.useForm<NewTaskParams>();
    const globalState = useGlobalStore();

    useEffect(() => {
        if (props.initParams) {
            newTaskForm.setFieldsValue(props.initParams);
        }
    }, [newTaskForm, props.initParams]);


    const onOk = () => {
        newTaskAction(newTaskForm.getFieldsValue());
    }

    const newTaskAction = async (value: NewTaskParams) => {
        let res = await fetchPostWithSign(globalState, "task/add", {
            url: value.url,
            live: value.live,
            output: value.output,
            category: value.category,
            description: value.description,
            options: {
                threads: value.threads,
                retries: value.retries,
                key: value.key,
                cookies: value.cookies,
                headers: value.headers,
                format: value.format,
                slice: value.slice,
                proxy: value.proxy,
                nomerge: value.nomerge,
                verbose: value.verbose
            }
        });
        let json = await res.json() as apiResponseData;

        if (json.error === 0) {
            message.success(t('TaskAddSuccess'));
            props.onOK();
        } else {
            defaultApiErrorAction(json, t);
        }
    }

    return (
        <Modal title={t('NewTaskModalTitle')} visible={props.visible} onOk={onOk} onCancel={props.onCancel} width={900}
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
                            <BrowseInput />
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
                                    <Input.TextArea rows={2} />
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
    );
}