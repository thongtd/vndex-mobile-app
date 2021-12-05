export function getMarketData(marketData) {
    return {
        type: 'GET_MARKET_DATA_HUB',
        payload: marketData
    }
}

export function getAllMarketWatch(data) {
    return {
        type: 'GET_ALL_MARKET_WATCH',
        payload: data
    }
}
export function getLastestPriceBySymbol(data) {
    return {
        type: 'GET_LASTEST_PRICE_BY_SYMBOL',
        payload: data
    }
}

export function setListennerSocket(data) {
    return {
        type: 'SET_LISTENNER_SOCKET',
        payload: data
    }
}
