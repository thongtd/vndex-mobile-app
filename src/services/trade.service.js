import { httpService } from './http.service'
import { storageService } from './storage.service'
import { EXCHANGE_API, MARKET_API } from '../config/API'
import { constant } from "../config/constants";

export const tradeService = {
    create_new_order: async (coinSymbol, paymentUnit, quantity, price, orderType, side, customerEmail, accId, via,LastestPrice,PercentWithLastestPrice) => {
        let order_entity = {
            coinSymbol: coinSymbol,
            paymentUnit: paymentUnit,
            quantity: quantity,
            price: price,
            orderType: orderType,
            side: side,
            customerEmail: customerEmail,
            accId: accId,
            via: via,
            LastestPrice,
            PercentWithLastestPrice
        }
        console.log(order_entity,"order_entity");
        return new Promise((resolve, reject) => {
            httpService.post(EXCHANGE_API.CREATE_NEW_ORDER, order_entity).then(res => {
                let result = res.data;
                //console.log(result)
                if (result.code === 0) {
                    if (result.status == false) {
                        let response = {
                            status: "ERROR",
                            message: result.description,
                            data: null
                        }
                        resolve(response);
                    }
                    else {
                        let response = {
                            status: "OK",
                            message: result.description,
                            data: result
                        }
                        resolve(response);
                    }
                }
                else if (result.code == -1100) {
                    let response = {
                        status: "ERROR",
                        message: result.description,
                        data: null
                    }
                    resolve(response);
                }
                else {
                    let response = {
                        status: "ERROR",
                        message: result.description,
                        data: null
                    }
                    resolve(response);
                }
            })
                .catch(err => {
                    let response = {
                        status: "ERROR",
                        message: "UNKNOWN_ERROR",
                        data: err
                    }
                    reject(response);
                })
        })
    },
    cancel_order: (accId: string, orderIds: Array<string>) => {
        let post_data = { accId, orderIds };
        return httpService.post(EXCHANGE_API.CANCEL_ORDER, post_data);
    },
    getOrderBookCoin: (symbol, paymentUnit, side, top) => {
        return httpService.get_without_token(MARKET_API.ORDER_BOOK + `/${symbol}/${paymentUnit}/${side}/${top}`)
    },

    getOrderBooks: async (accId, startDate, endDate, symbol, paymentUnit, side, pageIndex, pageSize) => {
        let post_data = {
            accId, startDate, endDate, symbol, paymentUnit, side, pageIndex, pageSize
        }
        console.log(post_data,"post data");
        return await httpService.post(EXCHANGE_API.GET_ORDER_BOOKS, post_data);
    },
    getOpenOrder: (accId, startDate, endDate, symbol, paymentUnit, side, pageIndex, pageSize) => {
        let post_data = {
            accId, startDate, endDate, symbol, paymentUnit, side, pageIndex, pageSize
        }
        return httpService.post(EXCHANGE_API.GET_OPEN_ORDER, post_data);
    },
    getRecentOrder: (symbol, unit, top) => {
        let url = EXCHANGE_API.GET_RECENT_ORDER.replace("{symbol}", symbol);
        url = url.replace("{paymentUnit}", unit);
        url = url.replace("{top}", top);
        return httpService.get_without_token(url);
    },
    
    getBuySellNowByPair: (symbol, unit) => {
        let url = EXCHANGE_API.GET_BUY_SELL_NEW_BY_PAIR.replace("{symbol}", symbol);
        url = url.replace("{paymentUnit}", unit);
        return httpService.get_without_token(url);
    },

    getCurrencyConversion: async () => {
        return await httpService.post_without_token(EXCHANGE_API.GET_CURRENCY_CONVERSION)
    },
    setTransFee: async (customerTypeId) => {
        try {
            let fee = await httpService.post(EXCHANGE_API.GET_TRANS_FEE + `${customerTypeId}/null`, { customerTypeId })
            storageService.removeItem(constant.STORAGEKEY.FEE);
            return await storageService.setItem(constant.STORAGEKEY.FEE, fee.data);
        } catch (e) {
            return false;
        }
    },
    getTransFeeBySymbol: async (symbol) => {
        let fee = await storageService.getItem(constant.STORAGEKEY.FEE);
        if (fee) {
            let transFee = 0;
            let length = fee.length;
            for (let i = 0; i < length; i++) {
                if (symbol === fee[i].marketCurrency) {
                    transFee = fee[i].transFee
                }
            }
            return transFee;
        } else {
            let user_info = await storageService.getItem(constant.STORAGEKEY.USER_INFO);
            let customerTypeId = user_info.customerTypeId;
            let fee = await httpService.post(EXCHANGE_API.GET_TRANS_FEE + `${customerTypeId}/null`, { customerTypeId })
            if (fee.status === 200) {
                let dt = fee.filter(o => o.marketCurrency === symbol);
                if (dt.length === 0) return 0;
                return dt[0].transFee;
            }
        }

    },
    getFeeBySymbol: async (symbol) => {
        let fee = await storageService.getItem(constant.STORAGEKEY.FEE);
        if (fee) {
            let transFee = 0;
            let length = fee.length;
            for (let i = 0; i < length; i++) {
                if (symbol === fee[i].marketCurrency) {
                    transFee = fee[i]
                }
            }
            return transFee;
        } else {
            let user_info = await storageService.getItem(constant.STORAGEKEY.USER_INFO);
            let customerTypeId = user_info.customerTypeId;
            let fee = await httpService.post(EXCHANGE_API.GET_TRANS_FEE + `${customerTypeId}/null`, { customerTypeId })
            if (fee.status === 200) {
                let dt = fee.filter(o => o.marketCurrency === symbol);
                if (dt.length === 0) return 0;
                return dt[0];
            }
        }

    },
    
    checkFavorite: async (pair) => {
        return new Promise((resolve, reject) => {
            storageService.getItem(constant.STORAGEKEY.FAVORITE).then(res => {
                if (res) {
                    let fav = res.filter(o => o === pair);
                    if (fav.length > 0) {
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                }
                else {
                    resolve(false);
                }
            })
        })
    },
    addFavorite: async (pair, type) => {
        storageService.getItem(constant.STORAGEKEY.FAVORITE).then(res => {
            let favorites = res;
            if (favorites) {
                let fav = favorites.filter(o => o !== pair);
                if (type == 1) {
                    favorites = fav.concat([pair]);
                }
                else {
                    favorites = fav;
                }
                storageService.setItem(constant.STORAGEKEY.FAVORITE, favorites);
            }
            else {
                storageService.setItem(constant.STORAGEKEY.FAVORITE, [pair]);
            }
        })
    },
    getFavorite: async () => {
        return storageService.getItem(constant.STORAGEKEY.FAVORITE);
    },
    getOrderDetail: async (orderId) => {
        let url = EXCHANGE_API.GET_ORDER_DETAIL.replaceAll("{orderId}", orderId);
        let response = await httpService.post(url);
        if (response.status === 200) {
            return response.data;
        }
        else {
            return null;
        }
    }
}
