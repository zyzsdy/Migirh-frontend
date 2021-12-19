import React, { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react';
import { reducer, initState, GlobalAction, GlobalState } from './globalStore';
import i18n from '../utils/i18n';
import { I18nextProvider } from 'react-i18next';

const initDispatch: Dispatch<GlobalAction> = (action: GlobalAction): GlobalState => {
    throw new Error('context init error.'); 
}

const GlobalStateContext = createContext(initState);
const GlobalDispatchContext = createContext(initDispatch);

export function useGlobalStore() {
    return useContext(GlobalStateContext);
}

export function useGlobalDispatch(){
    return useContext(GlobalDispatchContext);
}

export function GlobalProvider({ children } : { children: ReactNode}) {
    const [state, dispatch] = useReducer(reducer, initState);

    return (
        <GlobalStateContext.Provider value={state}>
            <GlobalDispatchContext.Provider value={dispatch}>
                <I18nextProvider i18n={i18n}>
                    { children }
                </I18nextProvider>
            </GlobalDispatchContext.Provider>
        </GlobalStateContext.Provider>
    );
}