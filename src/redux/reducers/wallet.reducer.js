const DEFAULT_STATE = {
    withdrawLog: [],
    depositLog: [],
    banner:[],
    currency:"VND"
}
export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case "GET_WITHDRAW_LOG":
            return {
                ...state,
                withdrawLog: action.payload
            }
        case "GET_DEPOSIT_LOG":
            return {
                ...state,
                depositLog: action.payload
            }
        case "GET_BANNER":
            return {
                ...state,
                banner:action.payload
            }
        case "SET_CURRENCY_WITHDRAW_FIAT":
            return {
                ...state,
                currency:action.payload
            }
        default:
            return state;
    }
}