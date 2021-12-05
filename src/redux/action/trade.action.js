export function getTimeNotify(time) {
    return {
        type: 'GET_TIME_NOTIFY_HUB',
        payload: time
    }
}

export function getTopBuyData(buyData) {
return {
        type: 'GET_TOP_BUY_HUB',
        payload: buyData
    }
}
export function getTopSellData(sellData) {
    return {
        type: 'GET_TOP_SELL_HUB',
        payload: sellData
    }
}

export function getTopSell(sellData) {
    return {
        type: 'GET_TRADING_SELL_DATA',
        payload: sellData
    }
}

export function getTopBuy(buyData) {
    return {
        type: 'GET_TRADING_BUY_DATA',
        payload: buyData
    }
}

export function getMatchOrderData(orderData) {
    return {
        type: 'GET_MATCH_ORDER_HUB',
        payload: orderData
    }
}
export function getAllMatchOrderData(orderData) {
    return {
        type: 'GET_MATCH_ORDER',
        payload: orderData
    }
}



export function getTradeMatchOrderData(orderData) {
    return {
        type: 'GET_TRADING_MATCH_ORDER_HUB',
        payload: orderData
    }
}

export function getWalletBalanceData(walletData) {
    return {
        type: 'GET_WALLET_BALANCE_HUB',
        payload: walletData
    }
}
export function getWalletBalanceChange(changeData) {
    return {
        type: 'GET_WALLET_BALANCE_CHANGE_HUB',
        payload: changeData
    }
}

export function getBalance(balance) {
    return {
        type: 'GET_BALANCE',
        payload: balance
    }
}


export function getConversion(data) {
    return {
        type: 'GET_CURRENCY_CONVERSION',
        payload: data
    }
}

export function getTradingPair(pair) {
    return {
        type: 'GET_TRADING_PAIR',
        payload: pair
    }
}
export function getDefaultMarketData(marketData) {
    return {
        type: 'GET_DEFAULT_MARKET_DATA',
        payload: marketData
    }
}

export function getTradingMarketWatch(marketData) {
    return {
        type: 'GET_TRADING_MARKET_WATCH_HUB',
        payload: marketData
    }
}
export function getUserNotify(userData) {
    return {
        type: 'GET_USER_DATA_HUB',
        payload: userData
    }
}
