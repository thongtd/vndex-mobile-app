import { httpService } from "./http.service";
import { CHART_API, EXCHANGE_API, MARKET_API } from "../config/API";
import {get_past_date, splitPair} from "../config/utilities";
import { storageService } from "./storage.service";
import { constant } from "../config/constants";
import moment from "moment";

export const marketService = {
    get_chart_time: async () => {
        return httpService.get_without_token(CHART_API.GET_SERVER_TIME);
    },
    get_chart_config: (symbol) => {
        return httpService.get_without_token(`${CHART_API.CONFIG_BY_SYMBOL}?symbol=${symbol.replace('-', '_')}`);
    },
    get_chart_data: async (symbol, resolution) => {
       // let time = await httpService.get_without_token(`${CHART_API.GET_SERVER_TIME}?symbol=${symbol}`);
        let to = moment().unix();
        let from = moment().add(-120, 'days').unix();
        if(resolution !== 'D' && resolution !== 'W' && resolution !== 'M'){
            from = moment().add(-5, 'days').unix();
        }

        return new Promise((resolve, reject) => {
            let url = `${CHART_API.TRADE_HISTORIES}?symbol=${symbol.replace("-", "_")}&resolution=${resolution}&from=${from}&to=${to}`;
            console.log(url,"url chart data");
            httpService.get_without_token(url).then((res) => {
                if (res.s === "ok") {
                    let result = {
                        data: res,
                        status: "OK",
                        message: ""
                    }
                    resolve(result);
                }
                else {
                    let result = {
                        data: res,
                        status: "ERROR",
                        message: "NO_DATA"
                    }
                    resolve(result)
                }
            })
                .catch(err => {
                    reject(err);
                })
        })
    },
    get_depth_data: (symbol, paymentUnit) => {
        let top = 10;
        let url = `${CHART_API.DEPTH_CHART}/${symbol}/${paymentUnit}/${top}`
        return new Promise((resolve, reject) => {
            httpService.get_without_token(url).then((res) => {
                if (res) {
                    resolve({
                        data: res,
                        message: "",
                        status: "OK"
                    })
                }
                else {
                    resolve({
                        data: null,
                        message: "NO_DATA_FOUND",
                        status: "ERROR"
                    })
                }
            })
                .catch(err => {
                    resolve({
                        data: err,
                        message: "DEPTH_DATA_ERROR",
                        status: "ERROR"
                    })
                })
        })

    },
    getMarketWatchByPair: async (pair) => {
        let unit = splitPair(pair, '-').unit;
        return new Promise((resolve, reject) => {
            httpService.get_without_token(MARKET_API.GET_MARKET_WATCH).then(res => {
                let marketData = res;

                marketData.forEach(e => {
                    if (e.name == unit) {
                        e.tradingCoins.forEach(j => {
                            if (j.pair == pair) {
                                resolve(j);
                            }
                        })
                    }
                })
            })
                .catch(err => {
                    reject(err);
                })
        })
    },
    getCurrencies: async () => {
        return await httpService.post_without_token(EXCHANGE_API.GET_CURENCIES);
    },
    setCurrencies: async () => {
        return new Promise((resolve, reject) => {
            httpService.post_without_token(EXCHANGE_API.GET_CURENCIES).then(res => {
                if (res) {
                    storageService.setItem(constant.STORAGEKEY.CURRENCY, res).then(success => {
                        resolve(success);
                    })
                }
                else {
                    resolve(false);
                }
            })
                .catch(err => {
                    reject(err);
                })
        })
    },

    getCurrency: async () => {
        return await storageService.getItem(constant.STORAGEKEY.CURRENCY);
    }
}
