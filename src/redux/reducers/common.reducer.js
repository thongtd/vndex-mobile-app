import { constant } from "../../config/constants";

const DEFAULT_STATE = {
    language: "en-US",
    logged: false,
    theme: "default",
    user_info: {},
    currencyList: [],
    statusBar: '#141d30',
    noticeChange: 1,
    offEvent:false,
    listenEvent:[constant.SOCKET_EVENT.MARKET_WATCH]
}

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case "GET_LANGUAGE":
            return {
                ...state,
                language: action.payload
            }
        case 'CHECK_LOGIN':
            return {
                ...state,
                logged: action.logged
            }

        case "GET_USER_INFO":
            return {
                ...state,
                user_info: action.payload
            }
        case "GET_CURRENCY":
            return {
                ...state,
                currencyList: action.payload
            }
        case "NOTICE_CHANGE":
            return {
                ...state,
                noticeChange: action.payload
            }

        case "SET_STATUS_BAR":
            return {
                ...state,
                statusBar: action.payload
            }
        case "CHANGE_THEME":
            return {
                ...state,
                theme: action.payload
            }
        case "OFF_EVENT":
        // console.log(action.payload,"payload kaka");
            return {
                ...state,
                offEvent:action.payload
            }
            
        case "LISTEN_EVENT":
        console.log(action.payload,"listen_event reducer");
            return {
                ...state,
                listenEvent:action.payload
            }
            
        default:
            return state;
    }
}
