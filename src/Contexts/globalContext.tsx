import React, { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react';

import { reducer, initState, GlobalAction, GlobalState } from './globalStore';

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
                { children }
            </GlobalDispatchContext.Provider>
        </GlobalStateContext.Provider>
    );
}