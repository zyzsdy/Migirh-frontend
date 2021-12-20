import { Divider, Form, Input, InputNumber, Select, Switch } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import './SettingPage.scss';
import { resources } from '../utils/i18n';

export default function SettingPage() {
    const [t, i18n] = useTranslation("settings");
    const langList = Object.keys(resources);

    const langChange = (v: string) => {
        i18n.changeLanguage(v);
    }

    return (
        <div className="mainframe-content-warpper">
            <h1>{t('SettingsTitle')}</h1>
            <Divider />
            <div>
                <h2>{t('General')}</h2>
                <Form labelCol={{span: 4}} wrapperCol={{span: 14}} layout="horizontal">
                    <Form.Item label={t('Language')}>
                        <Select defaultValue={i18n.language} onChange={langChange}>
                            {langList.map(l => (<Select.Option key={l} value={l}>{t(l, {ns: "lang"})}</Select.Option>))}
                        </Select>
                    </Form.Item>
                </Form>
                <h2>{t('MinyamiOptions')}</h2>
                <Form labelCol={{span: 4}} wrapperCol={{span: 14}} layout="horizontal">
                    <Form.Item label={t('Threads')}>
                        <InputNumber defaultValue={5} />
                    </Form.Item>
                    <Form.Item label={t('Retries')}>
                        <InputNumber defaultValue={5} />
                    </Form.Item>
                    <Form.Item label={t('Headers')}>
                        <Input />
                    </Form.Item>
                    <Form.Item label={t('Format')}>
                        <Select defaultValue="ts">
                            <Select.Option value="ts">ts</Select.Option>
                            <Select.Option value="mkv">mkv</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label={t('Nomerge')}>
                        <Switch />
                    </Form.Item>
                    <Form.Item label={t('Verbose')}>
                        <Switch />
                    </Form.Item>
                </Form>
                <h2>{t('Network')}</h2>
                <Form labelCol={{span: 4}} wrapperCol={{span: 14}} layout="horizontal">
                    <Form.Item label={t('Proxy')}>
                        <Input />
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
