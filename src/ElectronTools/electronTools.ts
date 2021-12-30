import isElectron from "is-electron";

export async function getElectronVersion(): Promise<string> {
    if (!isElectron()) return "(Not Electron)";

    return await window.ipc.getVersion();
}


export async function openSaveDialog(): Promise<{
    result: boolean;
    canceled: boolean;
    filePaths: string[]
}> {
    if (!isElectron()) return {
        result: false,
        canceled: false,
        filePaths: []
    }

    let res = await window.ipc.openSaveDialog();

    return {
        result: true,
        ...res
    }
}