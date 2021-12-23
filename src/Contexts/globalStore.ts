export const initState = {
    apiRoot: "http://127.0.0.1:46015/api", //no tailing slash!
    isLogin: false,
    loginUser: {
        name: "",
        token: "",
        sk: "",
    }
};

export type GlobalState = typeof initState;

interface SetLoginParam {
    type: "user/setLogin",
    param: {
        name: string,
        token: string,
        sk: string
    }
};

function SetLoginState(state: GlobalState, action: SetLoginParam) : GlobalState {
    return {
        ...state,
        isLogin: true,
        loginUser: action.param
    };
}

interface SetLogoutParam {
    type: "user/setLogout"
}

function SetLogout(state: GlobalState, action: SetLogoutParam) : GlobalState {
    return {
        ...state,
        isLogin: false,
        loginUser: {
            name: "",
            token: "",
            sk: ""
        }
    };
}


export type GlobalAction = SetLoginParam | SetLogoutParam;

export const reducer = (state: GlobalState, action: GlobalAction) => {
    switch (action.type) {
        case "user/setLogin": return SetLoginState(state, action);
        case "user/setLogout": return SetLogout(state, action);
        default: return state;
    }
}