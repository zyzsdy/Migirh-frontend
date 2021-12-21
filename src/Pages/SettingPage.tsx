import { Divider, Form, Input, InputNumber, message, Radio, Select, Switch } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './SettingPage.scss';
import { resources } from '../utils/i18n';
import { useGlobalStore } from '../Contexts/globalContext';
import { fetchPostWithSign } from '../utils/fetchpost';
import { apiResponseData, defaultApiErrorAction } from '../utils/defaultApiErrorAction';
import debounce from '../utils/debounce';
import { InfoCircleOutlined } from '@ant-design/icons';

interface systemConfigGetResponse extends apiResponseData {
    data: SystemConfig[]
}

interface SystemConfig {
    config_key: string;
    config_value: string;
}

interface MinyamiOptions {
    threads?: number;
    retries?: number;
    headers?: string;
    format?: string;
    nomerge?: boolean;
    verbose?: boolean;
}

interface ProxyOptions {
    proxy: "noproxy" | "http" | "https" | "socks5",
    host: string;
    port: number;
}

export default function SettingPage() {
    const [t, i18n] = useTranslation("settings");
    const langList = Object.keys(resources);
    const globalState = useGlobalStore();
    const [lang, setLang] = useState("en");
    const [minyamiOptionsForm] = Form.useForm<MinyamiOptions>();
    const [proxyOptionsForm] = Form.useForm<ProxyOptions>();
    const minyamiTmpPathInputEl = useRef<Input>(null);

    const setSystemConfig = async (config: SystemConfig) => {
        let res = await fetchPostWithSign(globalState, "system/update_config", {
            data: [config]
        });

        let json = await res.json() as apiResponseData;
        if (json.error === 0) {
            message.success(t("SaveOk"));
        } else {
            defaultApiErrorAction(json, t);
        }
    }

    const langChange = async (v: string) => {
        setLang(v);
        i18n.changeLanguage(v);
        await setSystemConfig({
            config_key: "lang",
            config_value: v
        });
    }

    const onMinyamiTmpPathChange = async (event: any) => {
        let v = event.target.value;
        await setSystemConfig({
            config_key: "minyami_tmp_path",
            config_value: v
        });
    }
    
    const onMinyamiOptionsFormChange = async (value: any, allValue: MinyamiOptions) => {
        let minyamiOptions = JSON.stringify(allValue);
        await setSystemConfig({
            config_key: "minyami_options",
            config_value: minyamiOptions
        });
    }

    const onProxyOptionsFormChange = async (value: any, allValue: ProxyOptions) => {
        let proxyOptions = JSON.stringify(allValue);
        await setSystemConfig({
            config_key: "proxy_options",
            config_value: proxyOptions
        });
    }

    useEffect(() => {
        const loadSystemConfig = async () => {
            let res = await fetchPostWithSign(globalState, "system/get_config", {});
            let json = await res.json() as systemConfigGetResponse;
    
            if (json.error === 0) {
                for (let config of json.data) {
                    if (config.config_key === "lang") {
                        setLang(config.config_value);
                    } else if (config.config_key === "minyami_options") {
                        let minyamiOptions = JSON.parse(config.config_value) as MinyamiOptions;
                        minyamiOptionsForm.setFieldsValue(minyamiOptions);
                    } else if (config.config_key === "proxy_options") {
                        let proxyOptions = JSON.parse(config.config_value) as ProxyOptions;
                        proxyOptionsForm.setFieldsValue(proxyOptions);
                    } else if (config.config_key === "minyami_tmp_path") {
                        if (minyamiTmpPathInputEl.current) {
                            minyamiTmpPathInputEl.current.setValue(config.config_value);
                        }
                    }
                }
            } else {
                defaultApiErrorAction(json, t);
            }
        }

        loadSystemConfig();
    }, [globalState, t, minyamiOptionsForm, proxyOptionsForm]);

    return (
        <div className="mainframe-content-warpper">
            <h1>{t('SettingsTitle')}</h1>
            <Divider />
            <div>
                <h2>{t('General')}</h2>
                <Form labelCol={{span: 4}} wrapperCol={{span: 14}} layout="horizontal">
                    <Form.Item label={t('Language')}>
                        <Select defaultValue="en" value={lang} onChange={langChange}>
                            {langList.map(l => (<Select.Option key={l} value={l}>{t(l, {ns: "lang"})}</Select.Option>))}
                        </Select>
                    </Form.Item>
                    <Form.Item label={t('MinyamiTmpPath')} tooltip={{title: t('EffectAfterRestart'), icon: <InfoCircleOutlined />}}>
                        <Input ref={minyamiTmpPathInputEl} onChange={debounce(onMinyamiTmpPathChange, 750)}/>
                    </Form.Item>
                </Form>
                <h2>{t('MinyamiOptions')}</h2>
                <Form form={minyamiOptionsForm} onValuesChange={debounce(onMinyamiOptionsFormChange, 750)}
                    labelCol={{span: 4}} wrapperCol={{span: 14}} layout="horizontal"
                    initialValues={{
                        threads: 5,
                        retries: 5,
                        format: "ts",
                        nomerge: false,
                        verbose: false
                    }}>
                    <Form.Item label={t('Threads')} name="threads">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label={t('Retries')} name="retries">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label={t('Headers')} name="headers">
                        <Input />
                    </Form.Item>
                    <Form.Item label={t('Format')} name="format">
                        <Select>
                            <Select.Option value="ts">ts</Select.Option>
                            <Select.Option value="mkv">mkv</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label={t('Nomerge')} name="nomerge" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item label={t('Verbose')} name="verbose" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
                <h2>{t('Network')}</h2>
                <Form form={proxyOptionsForm} onValuesChange={debounce(onProxyOptionsFormChange, 750)}
                    labelCol={{span: 4}} wrapperCol={{span: 14}} layout="horizontal"
                    initialValues={{
                        proxy: "noproxy",
                        host: "127.0.0.1",
                        port: "7890"
                    }}>
                    <Form.Item label={t('Proxy')} name="proxy">
                        <Radio.Group>
                            <Radio value="noproxy">{t('NoProxy')}</Radio>
                            <Radio value="http">HTTP</Radio>
                            <Radio value="https">HTTPS</Radio>
                            <Radio value="socks5">Socks5</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label={t('ProxyHost')} name="host">
                        <Input />
                    </Form.Item>
                    <Form.Item label={t('ProxyPort')} name="port">
                        <InputNumber />
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
