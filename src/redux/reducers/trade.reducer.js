import _ from "lodash";
const DEFAULT_STATE = {
    time: "",
    sellData: ["", "", "", "", "", "", "", ""],
    buyData: ["", "", "", "", "", "", "", ""],
    orderData: [],
    currencyConversion: [],
    walletBalance: [],
    tradingMatchOrder: [],
    balance: {},
    walletBalanceChange: {},
    tradingPair: "",
    tradingMarketWatch: {},
    dataFakeEmpty: ["", "", "", "", "", "", "", ""],
    hasLogout:false
}
export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case "GET_TIME_NOTIFY_HUB":
            return {
                ...state,
                time: action.payload
            }
        case "GET_TOP_SELL_HUB":
            return {
                ...state,
                sellData: action.payload
            }

        case "GET_TOP_BUY_HUB":
            return {
                ...state,
                buyData: action.payload
            }
        case "GET_MATCH_ORDER_HUB":
            return {
                ...state,
                orderData: action.payload
            }
        case "GET_MATCH_ORDER":
            if (action.payload.length > 0) {
                let newData = { ...action.payload };
                let mergeData = Object.assign([...state.dataFakeEmpty], newData);
                let updateData = Object.values(mergeData);
                return {
                    ...state,
                    orderData: updateData
                }
            } else {
                return {
                    ...state,
                    orderData: [...state.dataFakeEmpty]
                }
            }

        case "GET_CURRENCY_CONVERSION":
            return {
                ...state,
                currencyConversion: action.payload
            }
        case "GET_WALLET_BALANCE_HUB":
            return {
                ...state,
                walletBalance: action.payload
            }
        case "GET_TRADING_MATCH_ORDER_HUB":
            return {
                ...state,
                tradingMatchOrder: action.payload
            }
        case "GET_BALANCE":
            return {
                ...state,
                balance: action.payload
            }
        case "GET_WALLET_BALANCE_CHANGE_HUB":
            return {
                ...state,
                walletBalanceChange: action.payload
            }
        case "GET_TRADING_PAIR":
            return {
                ...state,
                tradingPair: action.payload
            }
        case "GET_TRADING_SELL_DATA":
            if (action.payload.length > 0) {
                let newData = { ...action.payload };
                let mergeData = Object.assign([...state.dataFakeEmpty], newData);
                let updateData = Object.values(mergeData);
                return {
                    ...state,
                    sellData: updateData
                }
            } else {
                return {
                    ...state,
                    sellData: [...state.dataFakeEmpty]
                }
            }
        case "GET_TRADING_BUY_DATA":
            if (action.payload.length > 0) {
                let newData = { ...action.payload };
                let mergeData = Object.assign([...state.dataFakeEmpty], newData);
                let updateData = Object.values(mergeData);
                return {
                    ...state,
                    buyData: updateData
                }
            } else {
                return {
                    ...state,
                    buyData: [...state.dataFakeEmpty]
                }
            }

        case "GET_TRADING_MARKET_WATCH_HUB":
            if(action.payload === "empty"){
                return {
                            ...state
                        }
            }else{
                return {
                            ...state,
                            tradingMarketWatch: action.payload
                        }
            }
        case "GET_DEFAULT_MARKET_DATA":
            return {
                ...state,
                tradingMarketWatch: action.payload
            }
        case "GET_USER_DATA_HUB":
            return {
                ...state,
                hasLogout: action.payload
            }

        default:
            return state;
    }
}
