import { PauseCircleOutlined, PlayCircleOutlined, PlusCircleOutlined, StopOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Progress, Space, Table } from 'antd';
import React, { useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import NewTaskModal from '../Components/NewTaskModal';
import './TaskPage.scss';

interface TaskBasicInfo {
    task_id: string;
    status: number;
    is_live: boolean;
    filename: string;
    output_path: string;
    source_url: string;
    category: string;
    date_create: Date;
    date_update: Date;
    description: string;
    finished_chunk_count: number;
    total_chunk_count: number;
    chunk_speed: string;
    ratio_speed: string;
    eta: string;
}

interface TaskListAction {
    type: string,
    param: string
}

const reducer = (state: TaskBasicInfo[], action: TaskListAction) => {
    return state;
}

export default function TaskPage() {
    const [taskList, dispatchTaskList] = useReducer(reducer, []);
    const [t, i18n] = useTranslation("tasks");
    
    const statusLabels = [t("Init"), t("Downloading"), t("Paused"), t("Merging"), t("Completed"), t("Error")];
    const columns = [
        {
            title: t("Filename"),
            dataIndex: "filename"
        },
        {
            title: t("IsLive"),
            dataIndex: "is_live",
            render: (is_live: boolean) => <>{ is_live ? "Y" : "" }</>
        },
        {
            title: t("Status"),
            dataIndex: "status",
            render: (status: number) => {
                let l = statusLabels[status];
                return <>{ l }</>;
            }
        },
        {
            title: t("Process"),
            dataIndex: "finished_chunk_count",
            render: (d: number, row: TaskBasicInfo) => {
                if (row.is_live) return <></>;
    
                let percentage = row.finished_chunk_count / row.total_chunk_count;
                return <><Progress percent={percentage} status="active" /></>;
            }
        },
        {
            title: t("ETA"),
            dataIndex: "eta"
        },
        {
            title: t("ChunkSpeed"),
            dataIndex: "chunk_speed"
        },
        {
            title: t("Description"),
            dataIndex: "description"
        },
        {
            title: t("CreateTime"),
            dataIndex: "date_create"
        }
    ];

    return (
        <div className="mainframe-content-warpper">
            <div>
                <Space>
                    <NewTaskModal />
                    <Button icon={<PauseCircleOutlined />}><span className="task-button-label">{t('Pause')}</span></Button>
                    <Button icon={<PlayCircleOutlined />}><span className="task-button-label">{t('Resume')}</span></Button>
                    <Button icon={<StopOutlined />}><span className="task-button-label">{t('Stop')}</span></Button>
                    <Button type="primary" danger icon={<DeleteOutlined />}><span className="task-button-label">{t('Delete')}</span></Button>
                </Space>
            </div>
            <div className="task-maintable-wrapper">
                <Table columns={columns} dataSource={taskList}
                    rowSelection={{
                        type: 'checkbox'
                    }}
                />
            </div>
        </div>
    );
}
