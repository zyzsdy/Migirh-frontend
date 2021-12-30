import { Col, Collapse, Divider, Drawer, Progress, Row, Skeleton, Typography } from "antd";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { TaskBasicInfo } from "../Tasks/tasklist";
import { formatDateLong } from "../utils/format";
import "./TaskDetail.scss";

interface TaskDetailProps {
    visible: boolean;
    taskItem: TaskBasicInfo | null,
    onClose: () => void,
    isActive: boolean;
    loading: boolean;
}

export default function TaskDetail(props: TaskDetailProps) {
    const [t, i18n] = useTranslation("tasks");
    const logDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (props.isActive && props.taskItem && props.taskItem.logger && logDiv.current) {
            logDiv.current.scrollTop = logDiv.current.scrollHeight + 50;
        }
    });

    const statusLabels = [t("Init"), t("Downloading"), t("Paused"), t("Merging"), t("Completed"), t("Error")];
    const progressArea = (taskItem: TaskBasicInfo) => {
        if (taskItem.is_live) {
            return (
                <Row>
                    <Col span={3}>{t('FinishedChunkCount')}:</Col>
                    <Col span={21}>{taskItem.finished_chunk_count}</Col>
                </Row>
            );
        }

        let percentage = 0;
        let progressStatus: "success" | "active" = "active";
        if (taskItem.finished_chunk_count && taskItem.total_chunk_count) {
            percentage = +((taskItem.finished_chunk_count / taskItem.total_chunk_count) * 100).toFixed(2);
        }
        if (taskItem.finished_chunk_count === taskItem.total_chunk_count) {
            progressStatus = "success";
        }

        return (
            <>
                <Progress className="task-progress-bar" percent={percentage} status={progressStatus} />
                <Row>
                    <Col span={3}>{t('FinishedChunkCount')}:</Col>
                    <Col span={9}>{taskItem.finished_chunk_count}</Col>
                    <Col span={3}>{t('TotalChunkCount')}:</Col>
                    <Col span={9}>{taskItem.total_chunk_count}</Col>
                </Row>
            </>
        );
    }

    if (!props.taskItem) {
        return <></>;
    } else return (
        <Drawer title={t('TaskDetail')} visible={props.visible} onClose={props.onClose} placement="right" key={props.taskItem.task_id} width={900}>
            <Skeleton loading={props.loading} active paragraph={{rows: 14, width: 120}}>
                <Row>
                    <Col span={3}>{t('Filename')}:</Col>
                    <Col span={21} style={{fontWeight: 500}}>{props.taskItem.filename}</Col>
                </Row>
                <Row>
                    <Col span={3}>{t('IsLive')}:</Col>
                    <Col span={9}>{ props.taskItem.is_live ? t('LiveMode') : t('ArchiveMode')}</Col>
                    <Col span={3}>{t('Category')}:</Col>
                    <Col span={9}>
                        { props.taskItem.category_name ? t(props.taskItem.category_name, { ns: "categoriesTranslation"}) : t(props.taskItem.category, { ns: "categoriesTranslation"})}
                    </Col>
                </Row>
                <Row>
                    <Col span={3}>{t('Output')}:</Col>
                    <Col span={21}>{props.taskItem.output_path}</Col>
                </Row>
                <Row>
                    <Col span={3}>{t('M3u8Url')}:</Col>
                    <Col span={21}>
                        <Typography.Paragraph ellipsis={{
                            rows: 2,
                            expandable: true,
                            symbol: t('Expand')
                        }}>
                            {props.taskItem.source_url}
                        </Typography.Paragraph>
                    </Col>
                </Row>
                <Row>
                    <Col span={3}>{t('CreateTime')}:</Col>
                    <Col span={9}>{formatDateLong(new Date(props.taskItem.date_create))}</Col>
                    <Col span={3}>{t('UpdateTime')}:</Col>
                    <Col span={9}>{formatDateLong(new Date(props.taskItem.date_update))}</Col>
                </Row>
                <Row>
                    <Col span={3}>{t('Description')}:</Col>
                    <Col span={21}>
                        {
                            props.taskItem.description ? (
                                <Typography.Paragraph ellipsis={{
                                    rows: 2,
                                    expandable: true,
                                    symbol: t('Expand')
                                }}>
                                    {props.taskItem.description}
                                </Typography.Paragraph>
                            ) : (
                                <span style={{color: "#999999"}}>{t('Empty')}</span>
                            )
                        }
                    </Col>
                </Row>
                {
                    props.isActive ? (
                        <>
                            <Divider />
                            {progressArea(props.taskItem)}
                            <Row>
                                <Col span={3}>{t('Speed')}:</Col>
                                <Col span={9}>{props.taskItem.chunk_speed} {t('ChunkSpeedUnit')} | {props.taskItem.ratio_speed}x</Col>
                                <Col span={3}>{t('ETA')}:</Col>
                                <Col span={9}>{props.taskItem.eta}</Col>
                            </Row>
                        </>
                    ) : (
                        <Row>
                            <Col span={3}>{t('Status')}:</Col>
                            <Col span={21}>{statusLabels[props.taskItem.status]}</Col>
                        </Row>
                    )
                }
                {
                    props.taskItem.minyami_options && (
                        <Collapse className="task-detail-minyami-options-panel">
                            <Collapse.Panel header={t('MinyamiOptions')} key="mo">
                                <Row>
                                    <Col span={3}>{t('Threads')}:</Col>
                                    <Col span={5}>{props.taskItem.minyami_options.threads}</Col>
                                    <Col span={3}>{t('Retries')}:</Col>
                                    <Col span={5}>{props.taskItem.minyami_options.retries}</Col>
                                    <Col span={3}>{t('Format')}:</Col>
                                    <Col span={5}>{props.taskItem.minyami_options.format}</Col>
                                </Row>
                                <Row>
                                    <Col span={3}>{t('Nomerge')}:</Col>
                                    <Col span={5}>{props.taskItem.minyami_options.nomerge ? t('True') : t('False')}</Col>
                                    <Col span={3}>{t('Verbose')}:</Col>
                                    <Col span={5}>{props.taskItem.minyami_options.verbose ? t('True') : t('False')}</Col>
                                    <Col span={3}>{t('Slice')}:</Col>
                                    <Col span={5}>{props.taskItem.minyami_options.slice}</Col>
                                </Row>
                                <Row>
                                    <Col span={3}>{t('Key')}:</Col>
                                    <Col span={21}>{props.taskItem.minyami_options.key}</Col>
                                </Row>
                                <Row>
                                    <Col span={3}>{t('Cookies')}:</Col>
                                    <Col span={21}>{props.taskItem.minyami_options.cookies}</Col>
                                </Row>
                                <Row>
                                    <Col span={3}>{t('Headers')}:</Col>
                                    <Col span={21}>{props.taskItem.minyami_options.headers}</Col>
                                </Row>
                                <Row>
                                    <Col span={3}>{t('Proxy')}:</Col>
                                    <Col span={21}>{props.taskItem.minyami_options.proxy}</Col>
                                </Row>
                            </Collapse.Panel>
                        </Collapse>
                    )
                }
                {
                    props.taskItem.logger && (
                        <>
                            <div className="task-detail-logger-header">{t('MinyamiWorkerLogTitle')}</div>
                            <div className="task-detail-logger-wrapper" ref={logDiv}>
                                {
                                    props.taskItem.logger.map(l => <p className={"task-detail-logger log-" + l.type} key={l.message}>{l.message}</p>)
                                }
                            </div>
                        </>
                    )
                }
            </Skeleton>
        </Drawer>
    )
}