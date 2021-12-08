import { httpService } from "./http.service";
import { storageService } from "./storage.service";
import { MARKET_API, EXCHANGE_API, XWALLET_API } from "../configs/api";
import { eventChannel, END } from 'redux-saga'
import { size, get } from "../configs/utils";
import _ from "lodash"
export const marketService = {
    getSwapOrderBooks: async (
        customerId,
        pageIndex,
        pageSize=15,
        fromDate = getOneMonthAgoDate(),
        toDate = getCurrentDate(),
        walletCurrency = "",
        status = ""
    ) => {
        try {
            let res = await httpService.get(XWALLET_API.GET_SWAP_ORDER_BOOKS + `${customerId}/${pageIndex}/${pageSize}?fromDate=${fromDate}&toDate=${toDate}&walletCurrency=${walletCurrency}&status=${status}`);
            if (res.status === 200) {
                let data = res.data.source;
                return {
                    result: 'ok',
                    data,
                };
            } else {
                return {
                    result: 'err',
                    message: 'Please check your internet connection!',
                };
            }
        } catch (error) {
            return {
                result: 'err',
                message: 'Please check your internet connection!',
                messErr: error
            };
        }
    },
    getSwapTickers: async () => {
        try {
            return await httpService.get_without_token(EXCHANGE_API.GET_SWAP_TICKERS);
        } catch (error) {
            return []
        }
    },
    getOrderBooks: async (dataOrderBook) => {
        try {
            let post_data = {
                accId: get(dataOrderBook, "UserId"),
                startDate: get(dataOrderBook, "fromDate"),
                endDate: get(dataOrderBook, "toDate"),
                symbol: get(dataOrderBook, "symbol"),
                paymentUnit:get(dataOrderBook, "paymentUnit"),
                side:"",
                pageIndex: get(dataOrderBook, "pageIndex"),
                pageSize: 15
            }
            // console.log(post_data, "dataOrderBook");
            let data = await httpService.post(EXCHANGE_API.GET_ORDER_BOOKS, post_data);
            // console.log(data, "data kakak");
            if (data) {

                return {
                    result: 'ok',
                    data,
                };
            }
        } catch (error) {
            return {
                result: 'err',
                message: 'Please check your internet connection!',
                messErr:error
            };
        }

    },
    getSwapConfigs: async () => {
        try {
            let data = await httpService.get_without_token(EXCHANGE_API.GET_SWAP_CONFIGS);
            if (data) {
                return {
                    result: 'ok',
                    data,
                };
            }

        } catch (error) {
            return {
                result: 'err',
                message: 'Please check your internet connection!',
            };
        }

    },
    getMarketWatch: async () => {
        try {
            let data = await httpService.get_without_token(MARKET_API.GET_MARKET_WATCH);
            return {
                result: 'ok',
                data,
            };
        } catch (error) {
            return {
                result: 'err',
                message: 'Please check your internet connection!',
            };
        }
    },
    getCurrencies: async () => {
        try {
            let data = await httpService.post_without_token(EXCHANGE_API.GET_CURENCIES);
            return {
                result: 'ok',
                data,
            };
        } catch (error) {
            return {
                result: 'err',
                message: 'Please check your internet connection!',
            };
        }

    },
    getCurrencyConversion: async () => {
        try {
            let data = await httpService.post_without_token(EXCHANGE_API.GET_CURRENCY_CONVERSION);
            return {
                result: 'ok',
                data,
            };
        } catch (error) {
            return {
                result: 'err',
                message: 'Please check your internet connection!',
            };
        }
    },
    getCrytoWallet: async (customerId) => {
        try {
            let response = await httpService.post(EXCHANGE_API.GET_CRYPTO_WALLET + `${customerId}`);
            if (response.status === 200) {
                let data = response.data;
                return {
                    result: 'ok',
                    data,
                };
            }

        } catch (error) {
            return {
                result: 'err',
                message: 'Please check your internet connection!',
            };
        }
    },
    getFiatWallet: async (customerId) => {
        try {
            let response = await httpService.post(EXCHANGE_API.GET_FIAT_WALLET + `${customerId}`);
            if (response.status === 200) {
                let data = response.data;
                return {
                    result: 'ok',
                    data,
                };
            }
        } catch (error) {
            return {
                result: 'err',
                message: 'Please check your internet connection!',
            };
        }
    },
    create_new_order: async (coinSymbol, paymentUnit, quantity, price, orderType, side, customerEmail, accId, via, lastestPrice, percentWithLastestPrice) => {
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
            lastestPrice,
            percentWithLastestPrice
        }
        console.log(order_entity, "order_entity");
        return new Promise((resolve, reject) => {
            httpService.post(EXCHANGE_API.CREATE_NEW_ORDER, order_entity).then(res => {
                let result = res.data;
                console.log(result)
                if (result.code === 0) {
                    if (result.status == false) {
                        let response = {
                            status: "error",
                            message: result.description,
                            data: result
                        }
                        resolve(response);
                    }
                    else {
                        let response = {
                            status: "ok",
                            message: result.description,
                            data: result
                        }
                        resolve(response);
                    }
                }
                else if (result.code == -1100) {
                    let response = {
                        status: "error",
                        message: result.description,
                        data: null
                    }
                    resolve(response);
                }
                else {
                    let response = {
                        status: "error",
                        message: result.description,
                        data: null
                    }
                    resolve(response);
                }
            })
                .catch(err => {
                    let response = {
                        status: "error",
                        message: "UNKNOWN_ERROR",
                        data: err
                    }
                    reject(response);
                })
        })
    },
}
