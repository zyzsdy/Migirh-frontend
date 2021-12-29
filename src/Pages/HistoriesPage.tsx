import { CheckCircleFilled, DeleteOutlined, EditOutlined, FastBackwardFilled, PlayCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Layout, message, Modal, Pagination, Popconfirm, Skeleton, Space, Table } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BrowseInput from '../Components/BrowseInput';
import type { CategoryValues, GetCategoriesResponse } from '../Components/NewTaskModal';
import { useGlobalStore } from '../Contexts/globalContext';
import { TaskBasicInfo } from '../Tasks/tasklist';
import { apiResponseData, defaultApiErrorAction } from '../utils/defaultApiErrorAction';
import { fetchPostWithSign } from '../utils/fetchpost';
import { formatDateShort } from '../utils/format';
import './HistoriesPage.scss';

const { Sider, Content } = Layout;
const allTaskCate: CategoryValues = {
    cate_id: "",
    cate_name: "AllTask"
}

interface GetTaskListResponse extends apiResponseData {
    data: TaskBasicInfo[],
    sum_rows: number
}

export default function HistoriesPage() {
    const [loading, setLoading] = useState(true);
    const [t, i18n] = useTranslation("tasks");
    const globalState = useGlobalStore();
    const [catelist, setCatelist] = useState<CategoryValues[]>([]);
    const [nowActiveCate, setNowActiveCate] = useState<CategoryValues>(allTaskCate);
    const [selectedTask, setSelectedTask] = useState<React.Key[]>([]);
    const [taskList, setTaskList] = useState<TaskBasicInfo[]>([]);
    const [page, setPage] = useState(1);
    const [sum, setSum] = useState(0);
    const [editCateModalVisible, setEditCateModalVisible] = useState(false);
    const [editCateForm] = Form.useForm<CategoryValues>();
    const [reloadCategories, setReloadCategories] = useState(0);
    const [deleteTaskConfirmModalVisible, setDeleteTaskConfirmModalVisible] = useState(false);
    const [isDeleteFileSameTime, setIsDeleteFileSameTime] = useState(false);
    const [reloadPage, setReloadPage] = useState(0);

    useEffect(() => {
        const loadCategories = async () => {
            let res = await fetchPostWithSign(globalState, "category/get", {});
            let json = await res.json() as GetCategoriesResponse;
    
            if (json.error === 0) {
                setLoading(false);
                setCatelist(json.data);
            } else {
                defaultApiErrorAction(json, t);
            }
        }

        loadCategories();

    // eslint-disable-next-line
    }, [reloadCategories]);

    useEffect(() => {
        const loadTask = async () => {
            let res = await fetchPostWithSign(globalState, "task/list", {
                category: nowActiveCate.cate_id,
                page_num: page,
                page_size: 10
            });
            let json = await res.json() as GetTaskListResponse;
    
            if (json.error === 0) {
                setTaskList(json.data);
                setSum(json.sum_rows);
            } else {
                defaultApiErrorAction(json, t);
            }
        }

        loadTask();
    
    }, [nowActiveCate, page, reloadPage]);

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

    const onCateNavClick = (cateId: string) => {
        let idx = catelist.findIndex(c => c.cate_id === cateId);
        setPage(1);
        if (idx === -1) {
            setNowActiveCate(allTaskCate);
        } else {
            setNowActiveCate(catelist[idx]);
        }
    }

    const pageChange = (current: number, size: number) => {
        setPage(current);
    }

    const selectRow = (row: TaskBasicInfo) => {
        setSelectedTask([row.task_id]);
    }

    const showEditCateModal = () => {
        if (!nowActiveCate.cate_id) {
            message.error(t('MustSelectCategory'));
            return;
        }

        editCateForm.setFieldsValue(nowActiveCate);
        setEditCateModalVisible(true);
    }

    const onEditCateModalClose = () => {
        setEditCateModalVisible(false);
    }

    const reloadCategory = () => {
        setReloadCategories(reloadCategories + 1);
    }

    const reloadThisPage = () => {
        setReloadPage(reloadPage + 1);
    }

    const onEditCateForm = async (value: CategoryValues) => {
        let res = await fetchPostWithSign(globalState, "category/edit", value);
        let json = await res.json() as apiResponseData;

        if (json.error === 0) {
            setNowActiveCate(value);
            message.success(t('CategoryAddSuccess'));
            reloadCategory();
            setEditCateModalVisible(false);
        } else {
            defaultApiErrorAction(json, t);
        }
    }

    const onDeleteCate = async () => {
        let res = await fetchPostWithSign(globalState, "category/delete", {
            cate_id: nowActiveCate.cate_id
        });
        let json = await res.json() as apiResponseData;

        if (json.error === 0) {
            setNowActiveCate(allTaskCate);
            message.success(t('CategoryDeleteSuccess'));
            reloadCategory();
            setEditCateModalVisible(false);
        } else {
            defaultApiErrorAction(json, t);
        }
    }

    const onDeleteTaskConfirmModalClose = () => {
        setDeleteTaskConfirmModalVisible(false);
    }

    const deleteTask = () => {
        if (selectedTask.length <= 0) {
            message.error(t('PleaseSelect'));
            return;
        }
        if (selectedTask.length !== 1) {
            message.error(t('SelectedCountOnlySupportOne'));
            return;
        }

        setDeleteTaskConfirmModalVisible(true);
    }

    const onDeleteFileSameTimeChange = (event: any) => {
        setIsDeleteFileSameTime(event.target.checked);
    }

    const doDeleteTask = async () => {
        if (selectedTask?.length <= 0) {
            message.error("Selection error.");
            return;
        }
        let taskId = selectedTask[0];
    
        let idx = taskList.findIndex(t => t.task_id === taskId);
        if (idx === -1) {
            message.error("No selected item in Tasklist");
            return;
        }
    
        let task = taskList[idx];
        
        let res = await fetchPostWithSign(globalState, "task/delete", {
            task_id: task.task_id,
            delete_file: isDeleteFileSameTime
        });
        let json = await res.json() as apiResponseData;

        if (json.error === 0) {
            message.success(t('TaskDeleteSuccess'));
            reloadThisPage();
            setDeleteTaskConfirmModalVisible(false);
        } else {
            defaultApiErrorAction(json, t);
        }
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
            title: t("Category"),
            dataIndex: "category",
            render: (c: string, row: TaskBasicInfo) => <>{row.category_name ? t(row.category_name, { ns: "categoriesTranslation"}) : t(row.category, { ns: "categoriesTranslation"})}</>,
            width: "140px"
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
        },
        {
            title: t("UpdateTime"),
            dataIndex: "date_update",
            render: (d: string) => <>{formatDateShort(new Date(d))}</>,
            width: "140px"
        }
    ];

    return (
        <Skeleton loading={loading} active paragraph={{rows: 14, width: 120}}>
            <Modal title={t('EditCategory')} visible={editCateModalVisible} onCancel={onEditCateModalClose} footer={null}>
                <Form form={editCateForm} layout="horizontal" labelCol={{span: 5}} wrapperCol={{span: 19}} onFinish={onEditCateForm}>
                    <Form.Item label={t('CateId')} name="cate_id">
                        <Input readOnly />
                    </Form.Item>
                    <Form.Item label={t('CateName')} name="cate_name">
                        <Input />
                    </Form.Item>
                    <Form.Item label={t('CateDefaultPath')} name="default_path">
                        <BrowseInput />
                    </Form.Item>
                    <Form.Item wrapperCol={{span: 19, offset: 5}}>
                        <Space>
                            <Button type="primary" htmlType="submit">{t('CateAddSubmit')}</Button>
                            <Popconfirm placement="bottom" title={t('ConfirmCateDel')} icon={<QuestionCircleOutlined />}
                                okText={t('OkButton')} cancelText={t('CancelButton')} onConfirm={onDeleteCate}>
                                <Button type="primary" danger>{t('CateDel')}</Button>
                            </Popconfirm>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal title={t('DeleteTaskConfirm')} visible={deleteTaskConfirmModalVisible} onCancel={onDeleteTaskConfirmModalClose} closable={false}
                footer={[
                    <Button key="DeleteTaskConfirmCancelButton" onClick={onDeleteTaskConfirmModalClose}>{t('CancelButton')}</Button>,
                    <Button key="DeleteTaskConfirmSubmitButton" type="primary" danger onClick={doDeleteTask}>{t('ConfirmDeleteButton')}</Button>
                ]}>
                <p>{t('DeleteTaskNameConfirm', {taskname: GetTaskName(taskList, selectedTask)})}</p>
                <Checkbox checked={isDeleteFileSameTime} onChange={onDeleteFileSameTimeChange} >{t('DeleteFileSameTime')}</Checkbox>
            </Modal>
            <Layout>
                <Sider width={150} className="categories-sider-background">
                    <ul className="categories-sider">
                        <li {...(nowActiveCate.cate_id === "" ? {className: "categories-sider-item categories-active"} : {className: "categories-sider-item"})} onClick={() => onCateNavClick("")}>
                            {t("AllTask", { ns: "categoriesTranslation"})}
                        </li>
                        {
                            catelist.map(o => (
                                <li {...(nowActiveCate.cate_id === o.cate_id ? {className: "categories-sider-item categories-active"} : {className: "categories-sider-item"})}
                                    key={o.cate_id} onClick={() => onCateNavClick(o.cate_id)}>
                                    {o.cate_name ? t(o.cate_name, { ns: "categoriesTranslation"}): t(o.cate_id, { ns: "categoriesTranslation"})}
                                </li>
                            ))
                        }
                    </ul>
                </Sider>
                <Content className="histories-content-background">
                    <div>
                        <Space>
                            <Button icon={<EditOutlined />} onClick={showEditCateModal}>{t('EditCategory')}</Button>
                            <Button icon={<PlayCircleOutlined />} onClick={resumeTask}><span className="task-button-label">{t('Resume')}</span></Button>
                            <Button type="primary" danger icon={<DeleteOutlined />} onClick={deleteTask}>{t('Delete')}</Button>
                            <h1 style={{margin: 0, lineHeight: "32px", fontSize: "20px"}}>
                                {nowActiveCate.cate_name ? t(nowActiveCate.cate_name, { ns: "categoriesTranslation"}) : t(nowActiveCate.cate_id, { ns: "categoriesTranslation"})}
                            </h1>
                        </Space>
                    </div>
                    <div className="task-maintable-wrapper">
                        <Table columns={columns} dataSource={taskList} 
                            pagination={{position: ["bottomLeft"], current: page, total: sum, onChange: pageChange, showSizeChanger: false }} 
                            rowKey="task_id" rowSelection={{selectedRowKeys: selectedTask, onChange: setSelectedTask, type: "radio", renderCell: () => <></>, columnWidth: 0}}
                            onRow={(row: TaskBasicInfo) => ({
                                onClick: () => {
                                    selectRow(row);
                                }
                            })}
                        />
                    </div>
                </Content>
            </Layout>
        </Skeleton>
    );
}

function GetTaskName(taskList: TaskBasicInfo[], selectedTask: React.Key[]) {
    if (selectedTask?.length <= 0) return null;
    let taskId = selectedTask[0];

    let idx = taskList.findIndex(t => t.task_id === taskId);
    if (idx === -1) return null;

    let task = taskList[idx];
    return task.filename;
}