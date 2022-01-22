import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { HubConnectionBuilder, JsonHubProtocol, LogLevel, HttpTransportType } from '@aspnet/signalr';
import { SOCKET_URL } from '../configs/api';
import { constant } from '../configs/constant';
import { storageService } from './storage.service';
import { useSelector,useDispatch } from "react-redux"
import { get, createAction } from '../configs/utils';
import { GET_WITHDRAW_FIAT_LOG, GET_DEPOSIT_COIN_LOG, GET_DEPOSIT_FIAT_LOG, GET_WITHDRAW_COIN_LOG, GET_ASSET_SUMARY } from '../redux/modules/wallet/actions';
import { GET_CRYPTO_WALLET, GET_FIAT_WALLET } from '../redux/modules/market/actions';
const SignalRService = ({
    params,
}) => {
    var connection = null;
    var connected = false;
    const dispatcher = useDispatch();
    const userInfo = useSelector(state => state.authentication.userInfo);
    // const marketWatch = useSelector(state => state.market.marketWatch)
    useEffect(() => {
        // setInterval(()=>{
        //     restartSocket(get(userInfo, "id") || "")
        // },60000)
        // alert("ok");
        restartSocket(get(userInfo, "id") || "")
    }, [userInfo]);
    const restartSocket = (userId) => {
        if (connection) {
            connection.stop().then(val => {
                if (val) {
                    connection = null
                    run(userId);
                } else {
                    connection = null
                    run(userId);
                }
            }).catch(() => {
                connection = null
                run(userId);
            })
        } else {
            run(userId);
        }
    }
    const run = (userId) => {
        if (!connection) {
            init(userId, () => {
                if (connection) {
                    start();
                }
            })
        } else {
            start();
        }
    }
    const init = (userId, cb) => {
        let hubUrl = SOCKET_URL;
        hubUrl = SOCKET_URL + userId;

        let protocol = new JsonHubProtocol();
        const hubConnection = new HubConnectionBuilder()
            .configureLogging(LogLevel.None)
            .withUrl(hubUrl)
            .withHubProtocol(protocol)
            .build();
        console.log(hubConnection, "hubConnection");
        connection = hubConnection;
        
        return cb();
    }
    const start = () => {
        if (connection) {
            connection.stop().then(() => {
                connection.start().then(res => {
                    connected = true;
                    isClose = false;
// alert("ngon");
                    // dispatcher(createAction('CONNECT_SOCKET',{
                    //     connection,
                    //     marketWatch
                    // }))
                    
                    registerEvent();
                })
                    .catch(err => {
                        connected = false;
                    });
            }).catch(err => {
                console.log(err, "connected socket err");
                connected = false;
            })
        }
    }
    const registerEvent = () => {

        let hubConnection = connection;
        // hubConnection.on(constant.SOCKET_EVENT.TIME_SERVICE_NOTIFY, (time) => {
        //     // console.log(time, "time")
        // });
        hubConnection.on('newMessage', (data) => {
            console.log(data,"kakak");
            // if (user.notityType == 3) {
            //     console.log(user, "userInfo")
            // }
        });
        // hubConnection.on(constant.SOCKET_EVENT.PRICE_CHANGE_NOTIFY, (data) => {
        //     console.log(data,"kakakak");
        //     if (get(data,"notityType") === 2) {
        //         dispatcher(createAction(GET_WITHDRAW_FIAT_LOG, {
        //             UserId:get(data,"accId"),
        //             pageIndex: 1
        //         }))
        //         dispatcher(createAction(GET_DEPOSIT_COIN_LOG, {
        //             UserId:get(data,"accId"),
        //             pageIndex: 1
        //         }))
        //         dispatcher(createAction(GET_DEPOSIT_FIAT_LOG, {
        //             UserId:get(data,"accId"),
        //             pageIndex: 1
        //         }))
        //         dispatcher(createAction(GET_WITHDRAW_COIN_LOG, {
        //             UserId:get(data,"accId"),
        //             pageIndex: 1
        //         }))
        //         dispatcher(createAction(GET_ASSET_SUMARY, {
        //             UserId: get(data,"accId"),
        //             marketWatch
        //         }))
        //         dispatcher(createAction(GET_CRYPTO_WALLET, get(data,"accId")))
        //         dispatcher(createAction(GET_FIAT_WALLET, get(data,"accId")))
        //     }
        // });
        // [constant.SOCKET_EVENT.MARKET_WATCH].forEach((item) => {
        //     console.log(marketWatch,"marketWatchmarketWatch")
        //     switch (item) {
        //         case constant.SOCKET_EVENT.MARKET_WATCH:
        //             hubConnection.on(constant.SOCKET_EVENT.MARKET_WATCH, (marketData) => {
        //                 console.log(marketData, "marketData HUB");
        //             });
        //             break;
        //         case constant.SOCKET_EVENT.TOP_BUY:
        //             hubConnection.on(constant.SOCKET_EVENT.TOP_BUY, (buyData) => {

        //             });
        //             break;
        //         case constant.SOCKET_EVENT.TOP_SELL:
        //             hubConnection.on(constant.SOCKET_EVENT.TOP_SELL, (sellData) => {
        //             })
        //             break;
        //         case constant.SOCKET_EVENT.MATCH_ORDER:
        //             hubConnection.on(constant.SOCKET_EVENT.MATCH_ORDER, (orderData) => {


        //             });
        //             break;
        //     }
        // })

        hubConnection.onclose(() => {
            connected = false;
            if (!isClose) {
                isClose = true;
                reconnect();;
            }
        })
    }
    const reconnect = () => {
        let reconnectInterval = setInterval(function () {
            if (!connected) {
                if (connection) {
                    start();
                    connected = false;
                }
            }
            else {
                clearInterval(reconnectInterval);
                connected = true;
            }
        }, 5000)
    }

    return null;
}

export default SignalRService;
