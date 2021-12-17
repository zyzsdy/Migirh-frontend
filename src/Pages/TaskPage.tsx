import { PauseCircleOutlined, PlayCircleOutlined, PlusCircleOutlined, StopOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Progress, Table } from 'antd';
import React, { useReducer } from 'react';
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

const columns = [
    {
        title: "Filename",
        dataIndex: "filename"
    },
    {
        title: "Live",
        dataIndex: "is_live",
        render: (is_live: boolean) => <>{ is_live ? "Y" : "" }</>
    },
    {
        title: "Status",
        dataIndex: "status",
        render: (status: number) => {
            const statusLabels = ["Init", "Downloading", "Paused", "Merging", "Completed", "Error"];
            let l = statusLabels[status];
            return <>{ l }</>;
        }
    },
    {
        title: "Process",
        dataIndex: "finished_chunk_count",
        render: (d: number, row: TaskBasicInfo) => {
            if (row.is_live) return <></>;

            let percentage = row.finished_chunk_count / row.total_chunk_count;
            return <><Progress percent={percentage} status="active" /></>;
        }
    },
    {
        title: "ETA",
        dataIndex: "eta"
    },
    {
        title: "Chunk speed",
        dataIndex: "chunk_speed"
    },
    {
        title: "Description",
        dataIndex: "description"
    },
    {
        title: "Added Time",
        dataIndex: "date_create"
    }
]

interface TaskListAction {
    type: string,
    param: string
}

const reducer = (state: TaskBasicInfo[], action: TaskListAction) => {
    return state;
}

export default function TaskPage() {
    const [taskList, dispatchTaskList] = useReducer(reducer, []);


    return (
        <div className="task-wrapper">
            <div>
                <Button type="primary" icon={<PlusCircleOutlined />}><span className="task-button-label">New Task</span></Button>
                <Button icon={<PauseCircleOutlined />}><span className="task-button-label">Pause</span></Button>
                <Button icon={<PlayCircleOutlined />}><span className="task-button-label">Resume</span></Button>
                <Button icon={<StopOutlined />}><span className="task-button-label">Stop</span></Button>
                <Button type="primary" danger icon={<DeleteOutlined />}><span className="task-button-label">Delete</span></Button>
            </div>
            <div>
                <Table columns={columns} dataSource={taskList}
                    rowSelection={{
                        type: 'checkbox'
                    }}
                />
            </div>
        </div>
    );
}
