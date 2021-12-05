export function getLanguage(lang){
    return {
        type: 'GET_LANGUAGE',
        payload: lang
    }
}

export function checkLogin(logged) {
    return{
        type: 'CHECK_LOGIN',
        logged
    }
}

// export function changeTheme(theme) {
//     return{
//         type: 'CHECK_LOGIN',
//         payload: theme
//     }
// }

export function getUserInfo(user_info){
    return {
        type:"GET_USER_INFO",
        payload: user_info
    }
}

export function getCurrency(currencyList){
    return {
        type:"GET_CURRENCY",
        payload: currencyList
    }
}

export function setStatusBar(color) {
    return {
        type:"SET_STATUS_BAR",
        payload:color
    }
}

export function noticeChange(change){
    return {
        type:"NOTICE_CHANGE",
        payload:change
    }
}
export function changeTheme(theme){
    return {
        type:"CHANGE_THEME",
        payload:theme
    }
}
export function offEvent(payload){
    return {
        type:"OFF_EVENT",
        payload:payload
    }
}
export function getListenEvent(payload){
    return {
        type:"LISTEN_EVENT",
        payload:payload
    }
}
