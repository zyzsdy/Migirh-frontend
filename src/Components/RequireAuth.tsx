import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useGlobalStore } from '../Contexts/globalContext';

export default function RequireAuth({ children }: { children: ReactNode}) {
    const { state, dispatch } = useGlobalStore();
    let location = useLocation();

    if (!state.isLogin) {
        return (
            <Navigate to="/login" state={{from: location}} />
        );
    }

    return (
        <>
            { children }
        </>
    );
}