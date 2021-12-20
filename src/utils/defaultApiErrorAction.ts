import { message } from "antd";
import type { TFunction } from "i18next";

export interface apiResponseData {
    error: number;
    info: string;
    info_arg: {[p: string]: string}
}

export function defaultApiErrorAction<T extends apiResponseData>(data: T, t: TFunction) {
    message.error(t(data.info, {
        ...data.info_arg,
        ns: "apiResponse"
    }));
}