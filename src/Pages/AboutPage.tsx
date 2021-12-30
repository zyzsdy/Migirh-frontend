import { Divider } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import packageJson from '../../package.json'
import { useGlobalStore } from '../Contexts/globalContext';
import { apiResponseData, defaultApiErrorAction } from '../utils/defaultApiErrorAction';
import { fetchPost } from '../utils/fetchpost';

const getChromeVersion = () => {
    let uaSegs = navigator.userAgent.split(" ");
    var chromeStr = "";
    for (let versionSeg of uaSegs) {
        if (/chrome/i.test(versionSeg)){
            chromeStr = versionSeg;
        }
    }

    if (chromeStr) {
        return chromeStr.split('/')[1];
    }

    return "(Not Chromium)";
}

interface getAboutVersionResponse extends apiResponseData {
    data: {
        minyami_version: string;
        core_version: string;
    }
}

export default function AboutPage() {
    const [t, i18n] = useTranslation("about");
    const globalState = useGlobalStore();
    const [minyamiVersion, setMinyamiVersion] = useState("");
    const [migirhCoreVersion, setMigirhCoreVersion] = useState("");
    const [electronVersion, setElectronVersion] = useState("");

    useEffect(() => {
        const loadVersion = async () => {
            let res = await fetchPost(globalState, "system/about", {});
            let json = await res.json() as getAboutVersionResponse;

            if (json.error === 0) {
                setMinyamiVersion(json.data.minyami_version);
                setMigirhCoreVersion(json.data.core_version);
            } else {
                defaultApiErrorAction(json, t);
            }
        }

        loadVersion();
    }, []);

    return (
        <div className="mainframe-content-warpper">
            <h1>{t('About')}</h1>
            <h3>Migirh {packageJson.version}</h3>
            <p>Minyami {minyamiVersion}</p>
            <p>Migirh-core {migirhCoreVersion}</p>
            <p>Electron {electronVersion}</p>
            <p>Chromium {getChromeVersion()}</p>
            <Divider />
            <p>Migirh is an HLS downloader based on Minyami. Minyami is a great product created by Eridanus Sora.</p>
            <p>Special Thanks to MeowSound Idols and other supporters.</p>
            <p>© 2022, Ted Zyzsdy, member of MeowSound Idols. Open-sourced under GPLv3.</p>
        </div>
    );
}
