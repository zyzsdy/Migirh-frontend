import { Divider, Form, Select } from 'antd';
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
                <Form labelCol={{span: 4}} wrapperCol={{span: 14}} layout="horizontal">
                    <Form.Item label={t('Language')}>
                        <Select defaultValue={i18n.language} onChange={langChange}>
                            {langList.map(l => (<Select.Option key={l} value={l}>{t(l, {ns: "lang"})}</Select.Option>))}
                        </Select>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
