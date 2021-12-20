import React, { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useLocation } from 'react-router-dom';
import { useGlobalDispatch, useGlobalStore } from '../Contexts/globalContext';
import { GlobalState } from '../Contexts/globalStore';
import { fetchPostWithSign } from '../utils/fetchpost';

enum LogStatus{
    UNKNOWN = 0,
    LOGGED_IN = 1,
    NOT_LOGGED_IN = 2
}

export default function RequireAuth({ children }: { children: ReactNode}) {
    const [t, i18n] = useTranslation();
    const globalState = useGlobalStore();
    const globalDispatch = useGlobalDispatch();
    let location = useLocation();
    const [logStatus, setLogStatus] = useState(LogStatus.UNKNOWN);

    const changeLang = (lang: string) => {
        i18n.changeLanguage(lang);
    }

    const checkLogin = async () => {
        //not logged in, check localStorage
        let token = localStorage.getItem("token");
        if (token) {
            let sk = localStorage.getItem("sk") ?? "";
            let uname = localStorage.getItem("uname") ?? "";

            let tempGlobalState: GlobalState = {
                ...globalState,
                loginUser: {
                    sk,
                    name: uname,
                    token
                }
            };

            //check loginstatus
            let res = await fetchPostWithSign(tempGlobalState, "system/init", {});
            let json = await res.json();

            if (json['error'] !== 0) {
                //not logged in
                localStorage.removeItem("token");
                localStorage.removeItem("sk");
                localStorage.removeItem("uname");
                globalDispatch({
                    type: "user/setLogout"
                });
                setLogStatus(LogStatus.NOT_LOGGED_IN);

                if (json['lang']) {
                    changeLang(json['lang']);
                }
            } else {
                //restore login status
                globalDispatch({
                    type: "user/setLogin",
                    param: {
                        name: uname,
                        token: token,
                        sk: sk
                    }
                });
                setLogStatus(LogStatus.LOGGED_IN);
                if (json['lang']) {
                    changeLang(json['lang']);
                }
            }

        } else {
            setLogStatus(LogStatus.NOT_LOGGED_IN);
        }
    }

    useEffect(() => {
        if (!globalState.isLogin) {
            checkLogin();
        }
    });

    if (globalState.isLogin) {
        return (
            <>
                { children }
            </>
        );
    }

    if (logStatus === LogStatus.UNKNOWN) {
        return (
            <div>{t('Logging')}</div>
        );
    } else if (logStatus === LogStatus.LOGGED_IN) {
        return (
            <>
                { children }
            </>
        );
    } else {
        return (
            <Navigate to="/login" state={{from: location}} />
        );
    }

}