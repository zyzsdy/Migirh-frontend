import { PauseCircleOutlined, PlayCircleOutlined, PlusCircleOutlined, StopOutlined, DeleteOutlined, CheckCircleFilled } from '@ant-design/icons';
import { Button, message, notification, Progress, Space, Table } from 'antd';
import React, { useEffect, useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NewTaskModal, { NewTaskParams } from '../Components/NewTaskModal';
import { useGlobalStore } from '../Contexts/globalContext';
import { apiResponseData, defaultApiErrorAction } from '../utils/defaultApiErrorAction';
import { fetchPostWithSign } from '../utils/fetchpost';
import { formatDateShort } from '../utils/format';
import { WsClientMessage, WsServerReply } from '../utils/WsMessage';
import { TaskBasicInfo, taskListReducer } from '../Tasks/tasklist';
import sleep from '../utils/sleep';
import './TaskPage.scss';

interface taskPreaddResponse extends apiResponseData {
    cache: NewTaskParams;
}

interface taskNowResponse extends apiResponseData {
    data: TaskBasicInfo[];
}

const stepInReducer = (state: number) => {
    return state + 1;
}

export default function TaskPage() {
    const globalState = useGlobalStore();
    const [refreshFlag, setRefreshFlag] = useReducer(stepInReducer, 0);
    const [newTaskModalVisible, setNewTaskModalVisible] = useState(false);
    const [newTaskModalParams, setNewTaskModalParams] = useState<NewTaskParams>();
    const [taskList, dispatchTaskList] = useReducer(taskListReducer, []);
    const [selectedTask, setSelectedTask] = useState<React.Key[]>([]);
    const [t, i18n] = useTranslation("tasks");

    useEffect(() => {
        const loadTaskNow = async () => {
            let res = await fetchPostWithSign(globalState, "task/now", {});
            let json = await res.json() as taskNowResponse;

            if (json.error === 0) {
                dispatchTaskList({
                    type: "reloadTaskList",
                    param: json.data
                });
            } else {
                defaultApiErrorAction(json, t);
            }
        }

        loadTaskNow();
    }, [globalState, t, refreshFlag]);

    useEffect(() => {
        let ws: WebSocket;
        let running = false;
        let heartBeatId: number;
        const wsConn = () => {
            console.log("DEBUG;;==CONN WS;");
            ws = new WebSocket(globalState.wsRoot);
            
            ws.addEventListener('open', () => {
                running = true;
                wsSend({
                    cmd: 1,
                    token: globalState.loginUser.token
                });
                wsStartHeartbeat();
            });
            ws.addEventListener('message', (e: any) => {
                let msg = JSON.parse(e.data) as WsServerReply;
                switch (msg.cmd){
                    case 1:
                        if (msg.error !== 0) {
                            notification.error({
                                message: t('WsConnError', {ns: "apiResponse"}),
                                description: t(msg.info ?? "", {...msg.info_args, ns: "apiResponse"}),
                                duration: null
                            });
                            return;
                        }
                        return;
                    case 2:
                        return;
                    case 3:
                        setRefreshFlag();
                        return;
                    case 4:
                        if (msg.subCmd === 1) {
                            dispatchTaskList({
                                type: "chunkUpdate",
                                param: {
                                    task_id: msg.task_id,
                                    data: msg.data
                                }
                            });
                        } else if (msg.subCmd === 2) {
                            dispatchTaskList({
                                type: "statusChange",
                                param: {
                                    task_id: msg.task_id,
                                    newStatus: msg.newStatus
                                }
                            });
                        }
                        return;
                    default:
                        return;
                }
            });
            ws.addEventListener('error', async (e: any) => {
                if (running) {
                    console.log("Websocket disconnected due to error, trying to reconnect...");
                    await sleep(1000);

                    if (ws && (ws.readyState === 2 || ws.readyState === 3)) {
                        wsConn();
                    } else {
                        console.log("Abandon ws reconnect");
                    }
                } else {
                    notification.error({
                        message: t('WsConnError', {ns: "apiResponse"}),
                        description: e.reason,
                        duration: null
                    });
                }
            });
            ws.addEventListener('close', async (e: any) => {
                if (running) {
                    console.log("Websocket disconnected, trying to reconnect...")
                    await sleep(1000);

                    if (ws && (ws.readyState === 2 || ws.readyState === 3)) {
                        wsConn();
                    } else {
                        console.log("Abandon ws reconnect");
                    }
                } else {
                    console.log("DEBUG;;==WS CLOSED;");
                }
            });
        }

        const wsSend = async (msg: WsClientMessage) => {
            if (ws && ws.readyState === 1) {
                ws.send(JSON.stringify(msg));
            } else {
                throw new Error("Websocket connection has already closed or not been established.");
            }
        }

        const wsSendHeartbeat = () => {
            if (ws && ws.readyState === 1) {
                wsSend({
                    cmd: 2
                });
            } else {
                clearInterval(heartBeatId);
            }
        }

        const wsStartHeartbeat = async () => {
            clearInterval(heartBeatId);
            heartBeatId = window.setInterval(wsSendHeartbeat, 30000);
        }

        wsConn();

        return () => {
            console.log("DEBUG;;==ACTIVED STOP WS;");
            if (ws) {
                running = false;
                ws.close();
            }
        }

        // eslint-disable-next-line
    }, []);

    const showNewTask = async () => {
        let res = await fetchPostWithSign(globalState, "task/preadd", {});
        let json = await res.json() as taskPreaddResponse;

        if (json.error === 0) {
            setNewTaskModalParams({
                ...json.cache,
                url: ""
            });
        } else {
            defaultApiErrorAction(json, t);
        }
        setNewTaskModalVisible(true);
    }

    const newTaskCancel = () => {
        setNewTaskModalVisible(false);
    }

    const newTaskAction = async () => {
        setNewTaskModalVisible(false);
    }

    const stopTask = async () => {
        if (selectedTask.length <= 0) {
            message.error(t('PleaseSelect'));
            return;
        }
        if (selectedTask.length !== 1) {
            message.error(t('SelectedCountOnlySupportOne'));
            return;
        }
        let taskId = selectedTask[0];

        let res = await fetchPostWithSign(globalState, "task/stop", {
            task_id: taskId
        });
        let json = await res.json() as apiResponseData;

        if (json.error === 0) {
            message.success(t('TaskStopSuccess'));
        } else {
            defaultApiErrorAction(json, t);
        }
    }

    const resumeTask = async () => {
        if (selectedTask.length <= 0) {
            message.error(t('PleaseSelect'));
            return;
        }
        if (selectedTask.length !== 1) {
            message.error(t('SelectedCountOnlySupportOne'));
            return;
        }
        let taskId = selectedTask[0];

        let res = await fetchPostWithSign(globalState, "task/resume", {
            task_id: taskId
        });
        let json = await res.json() as apiResponseData;

        if (json.error === 0) {
            message.success(t('TaskResumeSuccess'));
        } else {
            defaultApiErrorAction(json, t);
        }
    }

    const selectRow = (row: TaskBasicInfo) => {
        setSelectedTask([row.task_id]);
    }
    
    const statusLabels = [t("Init"), t("Downloading"), t("Paused"), t("Merging"), t("Completed"), t("Error")];
    const columns = [
        {
            title: t("Filename"),
            dataIndex: "filename",
            width: "30%"
        },
        {
            title: t("IsLive"),
            dataIndex: "is_live",
            render: (is_live: boolean) => <>{ is_live ? <CheckCircleFilled /> : "" }</>,
            width: "90px"
        },
        {
            title: t("Status"),
            dataIndex: "status",
            render: (status: number) => {
                let l = statusLabels[status];
                return <>{ l }</>;
            },
            width: "100px"
        },
        {
            title: t("Process"),
            dataIndex: "finished_chunk_count",
            render: (d: number, row: TaskBasicInfo) => {
                if (row.is_live) return <>{t('DownloadChunkCount', {count: row.finished_chunk_count})}</>;

                let percentage = 0;
                if (row.finished_chunk_count && row.total_chunk_count) {
                    percentage = +((row.finished_chunk_count / row.total_chunk_count) * 100).toFixed(2);
                }
                if (row.finished_chunk_count === row.total_chunk_count) {
                    return <Progress className="task-progress-bar" percent={100} status="success" />;
                } else {
                    return <Progress className="task-progress-bar" percent={percentage} status="active" />;
                }
                
            },
            width: "220px"
        },
        {
            title: t("ETA"),
            dataIndex: "eta",
            width: "140px",
            render: (x: string, row: TaskBasicInfo) => <>{row.status !== 4 && row.eta}</>
        },
        {
            title: t("Speed"),
            dataIndex: "chunk_speed",
            render: (s: string, row: TaskBasicInfo) => <>{row.status !== 4 && <>{row.chunk_speed} {t('ChunkSpeedUnit')} | {row.ratio_speed}x</>}</>,
            width: "180px"
        },
        {
            title: t("Description"),
            dataIndex: "description"
        },
        {
            title: t("CreateTime"),
            dataIndex: "date_create",
            render: (d: string) => <>{formatDateShort(new Date(d))}</>,
            width: "140px"
        }
    ];

    return (
        <div className="mainframe-content-warpper">
            <NewTaskModal visible={newTaskModalVisible} onOK={newTaskAction} onCancel={newTaskCancel} initParams={newTaskModalParams} />
            <div>
                <Space>
                    <Button type="primary" icon={<PlusCircleOutlined />} onClick={showNewTask}><span className="task-button-label">{t('NewTask')}</span></Button>
                    {
                        IsNowLive(taskList, selectedTask) ? (
                            <Button icon={<StopOutlined />} onClick={stopTask}><span className="task-button-label">{t('Stop')}</span></Button>
                        ) : (
                            IsPause(taskList, selectedTask) ? (
                                <Button icon={<PlayCircleOutlined />} onClick={resumeTask}><span className="task-button-label">{t('Resume')}</span></Button>
                            ) : (
                                <Button icon={<PauseCircleOutlined />} onClick={stopTask}><span className="task-button-label">{t('Pause')}</span></Button>
                            )
                            
                        )
                    }
                </Space>
            </div>
            <div className="task-maintable-wrapper">
                <Table columns={columns} dataSource={taskList} pagination={false} rowKey="task_id"
                    rowSelection={{selectedRowKeys: selectedTask, onChange: setSelectedTask, type: "radio", renderCell: () => <></>, columnWidth: 0}}
                    onRow={(row: TaskBasicInfo) => ({
                        onClick: () => {
                            selectRow(row);
                        }
                    })}
                />
            </div>
        </div>
    );
}

function IsNowLive(taskList: TaskBasicInfo[], selectedTask: React.Key[]) {
    if (selectedTask?.length <= 0) return true;
    let taskId = selectedTask[0];

    let idx = taskList.findIndex(t => t.task_id === taskId);
    if (idx === -1) return true;

    let task = taskList[idx];
    return task.is_live;
}

function IsPause(taskList: TaskBasicInfo[], selectedTask: React.Key[]) {
    if (selectedTask?.length <= 0) return false;
    let taskId = selectedTask[0];

    let idx = taskList.findIndex(t => t.task_id === taskId);
    if (idx === -1) return false;

    let task = taskList[idx];
    return task.status === 2;
}