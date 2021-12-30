import { Log, TaskBasicInfo } from "./tasklist";

interface setNullAction {
    type: "setNull";
}

interface setNewAction {
    type: "setNew";
    param: TaskBasicInfo;
}

interface chunkUpdateAction {
    taskId: string;
    type: "chunkUpdate";
    param: {
        finishedChunksCount?: number;
        totalChunksCount?: number;
        chunkSpeed?: string;
        ratioSpeed?: string;
        eta?: string;
    };
    log?: Log;
}

interface statusChangeAction {
    taskId: string;
    type: "statusChange";
    param: {
        newStatus: number;
    };
    log?: Log;
}

interface newLogAction {
    taskId: string;
    type: "newLog";
    log?: Log;
}

interface replaceLoggerAction {
    type: "replaceLogger";
    logger: Log[];
}

type ActiveTaskAction = setNullAction | setNewAction | chunkUpdateAction | statusChangeAction | newLogAction | replaceLoggerAction;

export const activeTaskReducer = (state: TaskBasicInfo | null, action: ActiveTaskAction) => {
    if (action.type === "setNull") {
        return null;
    } else if (action.type === "setNew") {
        return action.param;
    } else if (action.type === "chunkUpdate") {
        if (state === null) return null;
        if (state.task_id !== action.taskId) return state;

        let tempState = {...state};
        tempState.finished_chunk_count = action.param.finishedChunksCount;
        tempState.total_chunk_count = action.param.totalChunksCount;
        tempState.chunk_speed = action.param.chunkSpeed;
        tempState.ratio_speed = action.param.ratioSpeed;
        tempState.eta = action.param.eta;
        tempState.logger = (state.logger && action.log ) ? [...state.logger, action.log] : (action.log ? [action.log] : undefined);
        return tempState;
    } else if (action.type === "statusChange") {
        if (state === null) return null;
        if (state.task_id !== action.taskId) return state;

        let tempState = {...state};
        tempState.status = action.param.newStatus;
        tempState.logger = (state.logger && action.log ) ? [...state.logger, action.log] : (action.log ? [action.log] : undefined);
        return tempState;
    } else if (action.type === "newLog") {
        if (state === null) return null;
        if (state.task_id !== action.taskId) return state;

        let tempState = {...state};
        tempState.logger = (state.logger && action.log ) ? [...state.logger, action.log] : (action.log ? [action.log] : undefined);
        return tempState;
    } else if (action.type === "replaceLogger") {
        if (state === null) return null;
        else {
            return {
                ...state,
                logger: action.logger
            }
        }
    } else {
        return null;
    }
}