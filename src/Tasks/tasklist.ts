export interface TaskBasicInfo {
    task_id: string;
    status: number;
    is_live: boolean;
    filename: string;
    output_path: string;
    source_url: string;
    category: string;
    category_name?: string;
    date_create: Date;
    date_update: Date;
    description: string;
    finished_chunk_count?: number;
    total_chunk_count?: number;
    chunk_speed?: string;
    ratio_speed?: string;
    eta?: string;
    minyami_options?: MinyamiOptions,
    logger?: Log[]
}

export interface MinyamiOptions {
    threads?: number;
    retries?: number;
    key?: string;
    cookies?: string;
    headers?: string;
    format?: string;
    slice?: string;
    proxy?: string;
    nomerge?: boolean;
    verbose?: boolean;
}

export interface Log {
    type: "debug" | "info" | "warning" | "error";
    message: string;
}

interface ReloadTaskList {
    type: "reloadTaskList";
    param: TaskBasicInfo[];
}

interface PushTaskList {
    type: "push";
    param: TaskBasicInfo;
}

interface StatusChangeTaskList {
    type: "statusChange";
    param: {
        task_id: string;
        newStatus: number;
    }
}

interface ChunkUpdateTaskList {
    type: "chunkUpdate";
    param: {
        task_id: string;
        data?: {
            finishedChunksCount?: number;
            totalChunksCount?: number;
            chunkSpeed?: string;
            ratioSpeed?: string;
            eta?: string;
        }
    }
}

type TaskListAction = ReloadTaskList | PushTaskList | StatusChangeTaskList | ChunkUpdateTaskList;

export const taskListReducer = (state: TaskBasicInfo[], action: TaskListAction) => {
    switch (action.type) {
        case "reloadTaskList":
            return action.param;
        case "push":
            return [...state, action.param];
        case "statusChange":
            {
                let sIndex = state.findIndex(t => t.task_id === action.param.task_id);
                if (sIndex === -1) return state;

                let stemp = [...state];
                stemp[sIndex].status = action.param.newStatus;
                return stemp;
            }
        case "chunkUpdate":
            {
                let sIndex = state.findIndex(t => t.task_id === action.param.task_id);
                if (sIndex === -1) return state;

                if (action.param.data) {
                    let stemp = [...state];
                    stemp[sIndex].finished_chunk_count = action.param.data.finishedChunksCount;
                    stemp[sIndex].total_chunk_count = action.param.data.totalChunksCount;
                    stemp[sIndex].chunk_speed = action.param.data.chunkSpeed;
                    stemp[sIndex].ratio_speed = action.param.data.ratioSpeed;
                    stemp[sIndex].eta = action.param.data.eta;
                    return stemp;
                }

                return state;
            }
        default:
            return state;
    }
}