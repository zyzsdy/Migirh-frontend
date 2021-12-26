import { Badge, Button, Card, Modal, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import type { NewTaskParams } from './NewTaskModal';
import './SelectTaskModal.scss';

interface SelectTaskModalProps{
    visible: boolean
    onOK: (values: NewTaskParams) => void,
    onCancel: () => void,
    initParams?: InputResult[]
}

export interface InputResult {
    label: string;
    info: NewTaskParams
}

function CardTitleWithButton({taskIndex, labelName, onClick}: {taskIndex: number, labelName: string, onClick: (key: number) => void}) {
    const [t, i18n] = useTranslation("tasks");
    const innerOnClick = () => {
        onClick(taskIndex);
    }

    return (
        <div className="select-task-card-title">
            <span><Badge count={taskIndex + 1} style={{backgroundColor: 'rgb(24,144,255)'}}/> {labelName}</span>
            <span><Button onClick={innerOnClick} type="primary" >{t('DownloadThisItem')}</Button></span>
        </div>
    );
}

export default function SelectTaskModal(props: SelectTaskModalProps) {
    const [t, i18n] = useTranslation("tasks");

    const onSelectTaskButtonClick = (taskIndex: number) => {
        if (props.initParams) {
            props.onOK(props.initParams[taskIndex].info);
        }
    }

    return (
        <Modal title={t('SelectTaskModalTitle')} visible={props.visible} footer={null} onCancel={props.onCancel} width={900}
                okText={t('OkButton')} cancelText={t('CancelButton')}>
            {
                props.initParams && props.initParams.map((inputResult, index) => {
                    return (
                        <Card key={JSON.stringify(inputResult)} title={<CardTitleWithButton taskIndex={index} labelName={inputResult.label} onClick={onSelectTaskButtonClick} />}>
                            <Typography.Paragraph ellipsis={{
                                rows: 2,
                                expandable: true,
                            }}>
                                {inputResult.info?.url ?? "No URL"}
                            </Typography.Paragraph>
                        </Card>
                    )
                })
            }
        </Modal>
    );
}