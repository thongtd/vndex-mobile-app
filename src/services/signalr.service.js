import React, { Component } from 'react';
import { HubConnectionBuilder, JsonHubProtocol, LogLevel, HttpTransportType } from '@aspnet/signalr';
import { SOCKET_URL } from '../config/API';
import { DeviceEventEmitter } from "react-native"
import { storageService } from '../services/storage.service'
import {
    getTimeNotify,
    getMatchOrderData,
    getTopBuyData,
    getTopSellData,
    getWalletBalanceData,
    getTradeMatchOrderData,
    getWalletBalanceChange,
    getUserNotify
} from '../redux/action/trade.action'
import { getBalanceData, getMarketData, getPriceData } from '../redux/action/market.action'
import { getTradingMarketWatch } from '../redux/action/trade.action'
import { connect } from 'react-redux'
import { constant } from "../config/constants";
import _ from "lodash"
// import queueFactory from 'react-native-queue';
type Props = {
    listen_event: Array<String>
}

class SignalRService extends Component<Props>{
    constructor(props) {
        super(props);
        var d = new Date();
        var n = d.getTime();
        this.timerNow = n;
        this.connected = false;
        this.connection = null;
        this.timer = 500;
        this.isClose = false;
        this.payload = null;
        this.timeMarketWatch = new Date().getTime();
        this.timerNowInfo = new Date().getTime();
        this.timerTopSell = new Date().getTime();
        this.timerTopSellE = new Date().getTime();
        this.timerTopBuy = new Date().getTime();
        this.timerTopBuyE = new Date().getTime();
        this.timerhistory = new Date().getTime();
        this.timeMarketWatchWallet = new Date().getTime();
    }

    run() {
        if (!this.connection) {
            this.init().then(() => {
                if (this.connection) {
                    this.start();
                    this.registerEvent();
                }
                else {

                }
            })
        }
        else {
            this.start();
            this.registerEvent();
        }
    }

    init = async () => {
        let user_info = await storageService.getItem(constant.STORAGEKEY.USER_INFO);
        let hubUrl = SOCKET_URL;
        if (user_info && user_info.id) {
            hubUrl = SOCKET_URL + user_info.id;
        }

        let protocol = new JsonHubProtocol();
        const hubConnection = new HubConnectionBuilder()
            .configureLogging(LogLevel.None)
            .withUrl(hubUrl)
            .withHubProtocol(protocol)
            .build();
        console.log(hubConnection, "hubConnection");
        this.connection = hubConnection;
        // this.initQueue()
    }
    // initQueue=async()=>{
    //     const queue = await queueFactory();
    //     queue.addWorker('getMarketData', async (id, payload) => {
    //         // this.payload = payload;
    //         // if(this.payload !== payload){
    //         this.props.getMarketData(payload);
    //         console.log('getMarketData job '+id+' executed.',payload);
    //         // }
    //       });
    //     queue.start();
    // }

    start() {
        if (this.connection) {
            this.connection.stop().then(() => {
                this.connection.start().then(res => {
                    console.log(res, "connected socket");
                    this.connected = true;
                    this.isClose = false;
                })
                    .catch(err => {
                        console.log(err, "connected socket err");
                        this.connected = false;
                        // this.logError(err);
                    });
            }).catch(err => {
                console.log(err, "connected socket err");
                this.connected = false;
            })


        }
    }

    async registerEvent() {

        let hubConnection = this.connection;
        let { listen_event } = this.props;
        console.log(listen_event, "registerEvent socket tren")
        hubConnection.on(constant.SOCKET_EVENT.TIME_SERVICE_NOTIFY, (time) => this.props.getTimeNotify(time));
        hubConnection.on(constant.SOCKET_EVENT.USER_NOTIFY, (user) => {
            if (user.notityType == 3) {
                this.props.getUserNotify(true)
            }
        });
        hubConnection.on(constant.SOCKET_EVENT.PRICE_CHANGE_NOTIFY, (data) => {
            if (data) {
                if (data.notityType === 1) {
                    this.props.getTradeMatchOrderData(data.orderInfoNotities);
                }
                if (data.notityType === 2) {
                    this.props.getWalletBalanceChange(data);
                    this.props.getWalletBalanceData(data.walletBalances);
                }
            }
        });
        listen_event.forEach((item) => {
            switch (item) {
                case constant.SOCKET_EVENT.MARKET_WATCH:
                    hubConnection.on(constant.SOCKET_EVENT.MARKET_WATCH, (marketData) => {
                        DeviceEventEmitter.emit(constant.SOCKET_EVENT.MARKET_WATCH, marketData)
                        // console.log(marketData,"marketData socket tren")
                        let { marketWatchData } = this.props;
                        // let marketDataStore = this.props.tradingMarketWatchStore;
                        // let currentPair = this.props.tradingPair;
                        // let dataStore = marketData;

                        // let newPair = dataStore.symbol + "-" + (dataStore.paymentUnit);
                        // if (newPair === currentPair) {
                        //     marketDataStore = Object.assign(marketDataStore, {}, dataStore);
                        //     let updateDataStore = Object.assign({}, this.props.tradingMarketWatchStore, dataStore)
                        //     var timerNowInfo = new Date().getTime();

                        //     if (timerNowInfo > this.timerNowInfo + this.timer) {
                        //         this.timerNowInfo = timerNowInfo;
                        //         DeviceEventEmitter.emit(constant.EVENTS_DEVICE.traddingMarketWatch,updateDataStore)
                        //         // this.props.getTradingMarketWatch(updateDataStore);
                        //     }

                        // }
                        // else {
                        //     this.props.getTradingMarketWatch("empty");
                        // }

                        // if (marketWatchData && marketWatchData.length > 0) {
                        //     console.log(marketWatchData, "marketWatchData");
                        //     if (marketWatchData.length === 5) {
                        //         let timeMarketWatchWallet = new Date().getTime();
                        //         if (timeMarketWatchWallet > this.timeMarketWatchWallet + 350) {
                        //             this.props.getMarketData(marketData);
                        //         }
                        //     } else {
                        //         marketWatchData.map((item, index) => {
                        //             if (item.symbol === marketData.symbol && item.tradingCurrency === marketData.paymentUnit) {
                        //                 item.currencyVolume = marketData.currencyVolume;
                        //                 item.highestPrice = marketData.highestPrice;
                        //                 item.lastestPrice = marketData.lastestPrice;
                        //                 item.lowestPrice = marketData.lowestPrice;
                        //                 item.prevLastestPrice = marketData.prevLastestPrice;
                        //                 item.priceChange = marketData.priceChange;
                        //                 item.priceChangeVolume = marketData.priceChangeVolume;
                        //                 item.symbol = marketData.symbol;
                        //                 item.tradingCurrency = marketData.paymentUnit;
                        //             }
                        //         })
                        //         let timeMarketWatch = new Date().getTime();
                        //         if (timeMarketWatch > this.timeMarketWatch + 500) {
                        //             this.timeMarketWatch = timeMarketWatch;
                        //             this.props.getMarketData(marketWatchData);
                        //             this.props.getMarketData(marketData);
                        //         }
                        //     }

                        // }
                    });
                    break;
                case constant.SOCKET_EVENT.TOP_BUY:
                    hubConnection.on(constant.SOCKET_EVENT.TOP_BUY, (buyData) => {
                        console.log(buyData, "buyData socket tren");
                        if (this.props.tradingPair && this.props.buyDataStore) {
                            const tradingPair = this.props.tradingPair.toLowerCase().replace('-', '_');
                            if (Object.keys(buyData)[0] === tradingPair) {
                                let newData = buyData;

                                let oldData = { ...this.props.buyDataStore };
                                let upData = newData[tradingPair];
                                if (upData) {
                                    let mergeDataBuy = Object.assign(oldData, upData);
                                    let updateDataBuy = Object.values(mergeDataBuy);
                                    updateDataBuy.length = 8;

                                    var timerTopBuy = new Date().getTime();
                                    if (timerTopBuy > this.timerTopBuy + this.timer) {
                                        this.timerTopBuy = timerTopBuy;
                                        this.props.getTopBuyData(updateDataBuy);
                                    }

                                } else {
                                    var timerTopBuyE = new Date().getTime();

                                    if (timerTopBuyE > this.timerTopBuyE + this.timer) {
                                        this.timerTopBuyE = timerTopBuyE;
                                        this.props.getTopBuyData([...this.props.buyDataStore]);
                                    }
                                }

                            }
                        }

                    });
                    break;
                case constant.SOCKET_EVENT.TOP_SELL:
                    hubConnection.on(constant.SOCKET_EVENT.TOP_SELL, (sellData) => {
                        console.log(sellData, "sellData socket tren");
                        if (this.props.tradingPair && this.props.sellDataStore.length > 0) {
                            const tradingPair = this.props.tradingPair.toLowerCase().replace('-', '_');
                            if (Object.keys(sellData)[0] === tradingPair) {
                                let oldDataSell = { ...this.props.sellDataStore };
                                let upDataSell = sellData[tradingPair];
                                if (upDataSell) {
                                    let mergeData = Object.assign(oldDataSell, upDataSell);
                                    let updateDataSell = Object.values(mergeData);
                                    updateDataSell.length = 8;

                                    var timerTopSell = new Date().getTime();
                                    if (timerTopSell > this.timerTopSell + this.timer) {
                                        this.timerTopSell = timerTopSell;
                                        this.props.getTopSellData(updateDataSell);
                                    }

                                } else {
                                    var timerTopSellE = new Date().getTime();
                                    if (timerTopSellE > this.timerTopSellE + this.timer) {
                                        this.timerTopSellE = timerTopSellE;
                                        this.props.getTopSellData([...this.props.sellDataStore]);
                                    }

                                }
                                // console.log(sellData, Object.keys(sellData)[0], "buydata socket");
                            }
                        }
                    })
                    break;
                case constant.SOCKET_EVENT.MATCH_ORDER:
                    hubConnection.on(constant.SOCKET_EVENT.MATCH_ORDER, (orderData) => {
                        console.log(orderData, "orderData socket tren");
                        let dataCheck = orderData;
                        let pair = orderData.symbol + "-" + orderData.paymentUnit
                        if (this.props.tradingPair == pair && this.props.orderDataStore.length > 0 && this.props.orderDataStore[0] !== orderData) {
                            let oldOrder = this.props.orderDataStore;
                            let length = this.props.orderDataStore;
                            oldOrder.unshift(orderData);
                            oldOrder.pop();
                            var orderDataStoreUpdate = this.props.orderDataStore.splice(0, length - 1).concat(oldOrder);
                            // console.log(oldOrder, "orderDataStoreUpdate")
                            var timerhistory = new Date().getTime();
                            if (timerhistory > this.timerhistory + this.timer) {
                                this.timerhistory = timerhistory;
                                this.props.getMatchOrderData(orderDataStoreUpdate);
                                console.log(orderDataStoreUpdate, "orderdata socket");
                            }
                            // console.log(orderData, "orderdata socket");
                        }

                    });
                    break;
            }
        })

        hubConnection.onclose(async () => {
            //this.stop();
            this.connected = false;

            if (!this.isClose) {
                this.isClose = true;
                await this.reconnect();;
            }
        })
    }

    invoke(method, callback, argument) {
        this.connection.invoke(method, argument).then(value => {
            callback(value);
        })
    }

    stop() {
        this.connection.stop().then(value => {

        }).catch(err => {
        })
    }


    reconnect() {
        console.log("Reconnect");
        let self = this;

        let reconnectInterval = setInterval(function () {
            if (!self.connected) {
                if (self.connection) {

                    self.start();
                    self.connected = false;
                }
            }
            else {
                clearInterval(reconnectInterval);
                self.connected = true;
            }
        }, 5000)
    }

    logError(err) {
    }

    componentWillMount() {
        this.run();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.listen_event !== this.props.listen_event) {
            console.log(this.props.listen_event, "update socket tren");
            this.registerEvent();
        }
    }
    componentWillReceiveProps(nextProps) {
        let hubConnection = this.connection;
        if (nextProps.offEvent === true && this.connection) {
            console.log("off socket")
            // this.stopEvent();
            this.stopAllEvent();
        } else if (nextProps.offEvent === false && nextProps.offEvent !== this.props.offEvent && this.connection) {
            this.registerEvent();
        }
        if (nextProps.listen_event !== this.props.listen_event) {
            this.registerEvent();
        }
        // if (nextProps.activeTab && nextProps.activeTab === 'O' && this.connection && nextProps.offEvent === false) {
        //     console.log("off matchorder and listener topsell,buy")
        //     hubConnection.off(constant.SOCKET_EVENT.MATCH_ORDER);
        //     this.registerEvent();
        // } else if (nextProps.activeTab && nextProps.activeTab === 'R' && this.connection && nextProps.offEvent === false) {
        //     console.log("off topsell,buy and listener matchorder")
        //     hubConnection.off(constant.SOCKET_EVENT.TOP_SELL);
        //     hubConnection.off(constant.SOCKET_EVENT.TOP_BUY);
        //     this.registerEvent();
        // }

    }
    stopEvent() {
        let hubConnection = this.connection;
        let { listen_event } = this.props;

        listen_event.forEach((item) => {
            switch (item) {
                case constant.SOCKET_EVENT.MARKET_WATCH:
                    hubConnection.off(constant.SOCKET_EVENT.MARKET_WATCH)
                    break;
                case constant.SOCKET_EVENT.MATCH_ORDER:
                    hubConnection.off(constant.SOCKET_EVENT.MATCH_ORDER)
                    break;
                case constant.SOCKET_EVENT.TOP_SELL:
                    hubConnection.off(constant.SOCKET_EVENT.TOP_SELL)
                    break;
                case constant.SOCKET_EVENT.TOP_BUY:
                    hubConnection.off(constant.SOCKET_EVENT.TOP_BUY)
                    break;
            }
        })
    }
    stopAllEvent = () => {
        let hubConnection = this.connection;
        console.log("stopall socket tren")
        hubConnection.off(constant.SOCKET_EVENT.MARKET_WATCH)
        hubConnection.off(constant.SOCKET_EVENT.MATCH_ORDER)
        hubConnection.off(constant.SOCKET_EVENT.TOP_SELL)
        hubConnection.off(constant.SOCKET_EVENT.TOP_BUY)
    }

    render() {

        return null;
    }
}
const mapStateToProps = state => {
    return {
        tradingPair: state.tradeReducer.tradingPair,
        orderDataStore: state.tradeReducer.orderData,
        buyDataStore: state.tradeReducer.buyData,
        sellDataStore: state.tradeReducer.sellData,
        tradingMarketWatchStore: state.tradeReducer.tradingMarketWatch,
        marketWatchData: state.marketReducer.marketWatch,
        listen_event: state.commonReducer.listenEvent
    }
}

export default connect(mapStateToProps, {
    getTimeNotify, getMatchOrderData,
    getTopBuyData, getTopSellData,
    getMarketData,
    getTradingMarketWatch,
    getTradeMatchOrderData,
    getWalletBalanceData, getWalletBalanceChange, getUserNotify
})(SignalRService);
