const DEFAULT_STATE = {
    priceData: [],
    marketData: [],
    marketWatch: [],
    lastestPrice:{},
}
export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case "GET_PRICE_DATA_HUB":
            return {
                ...state,
                priceData: action.payload
            }
        case "GET_MARKET_DATA_HUB":
        // console.log(action.payload,"marketData Home Reducer");
            return {
                ...state,
                marketData: action.payload
            }
            // let tradingCoins = state.marketWatch;
            
            // let marketData = action.payload;
            // if (marketData) {
            //     for (let i in tradingCoins) {
            //         let item = tradingCoins[i];
            //         if (item.symbol === marketData.symbol && item.tradingCurrency === marketData.paymentUnit) {
            //             tradingCoins[i] = Object.assign({}, item, marketData);
            //             break;
            //         }
            //     }
            //     return {
            //         ...state,
            //         marketData: tradingCoins
            //     }
            // }
        case "GET_ALL_MARKET_WATCH":
            return {
                ...state,
                marketWatch: action.payload
            }
        case "GET_LASTEST_PRICE_BY_SYMBOL":
            return {
                ...state,
                lastestPrice:action.payload
            }
        default:
            return state;
    }
}