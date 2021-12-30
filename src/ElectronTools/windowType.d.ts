declare interface Window {
    ipc: {
        getVersion: () => Promise<string>,
        openSaveDialog: () => Promise<{
            canceled: boolean;
            filePaths: string[];
        }>
    }
}
