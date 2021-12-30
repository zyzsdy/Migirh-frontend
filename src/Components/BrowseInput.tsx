import { Button, Input, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { openSaveDialog } from '../ElectronTools/electronTools';

interface BrowseInputProps {
    onChange?: (v: string) => void
    value?: string;
}

export default function BrowseInput(props: BrowseInputProps) {
    const [t, i18n] = useTranslation("tasks");
    const [inputValue, setInputValue] = useState<string>();

    useEffect(() => {
        if (props.value) {
            setInputValue(props.value);
        }
    }, [props.value]);

    const dataChange = (e: any) => {
        let v = e.target.value;
        setInputValue(v);
        if (props.onChange) {
            props.onChange(v);
        }
    }

    const openDialog = async () => {
        let result = await openSaveDialog();

        if (!result.result) {
            message.warn(t('ElectronOnly'));
            return;
        }

        if (result.canceled) {
            return;
        }

        if (result.filePaths.length > 0) {
            let r = result.filePaths[0];
            setInputValue(r);
            if (props.onChange) {
                props.onChange(r);
            }
        }
    }

    return (
        <Input.Group compact>
            <Input style={{width: 'calc(100% - 100px)'}} value={inputValue} onChange={dataChange} />
            <Button type="primary" style={{width: '100px'}} onClick={openDialog}>{t('BrowseButton')}</Button>
        </Input.Group>
    )
}