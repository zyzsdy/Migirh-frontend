import React, { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react';

import { reducer, initState, GlobalAction, GlobalState } from './globalStore';

type GlobalContextStore = {
    state: GlobalState,
    dispatch: Dispatch<GlobalAction>
}

const initContext: GlobalContextStore = {
    state: initState,
    dispatch: (action: GlobalAction) : GlobalState => {
        throw new Error('context init error.'); 
    }
}

export const GlobalContext = createContext(initContext);

export function useGlobalStore() {
    return useContext(GlobalContext);
}

type Props = {
    children: ReactNode
}
export function GlobalProvider({ children } : Props) {
    const [state, dispatch] = useReducer(reducer, initState);

    return (
        <GlobalContext.Provider value={{state, dispatch}}>
            { children }
        </GlobalContext.Provider>
    );
}