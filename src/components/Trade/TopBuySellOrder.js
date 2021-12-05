import React, { PureComponent } from 'react'
import { Platform, StyleSheet, Text, TouchableOpacity, View, FlatList, ListView, Dimensions, ScrollView, PanResponder, AppState } from "react-native";
import { Body, Button, Item, Left, Right, Content, Container } from "native-base";
import { style } from "../../config/style";
import {
    fillTopOrder,
    formatCurrency,
    formatSCurrency,
    formatTrunc,
    splitPair,
    to_UTCDate
} from "../../config/utilities";
import { BUY, constant, SELL } from "../../config/constants";
import Icon from "react-native-vector-icons/FontAwesome";
import { tradeService } from "../../services/trade.service";
import { httpService } from "../../services/http.service";
import connect from "react-redux/es/connect/connect";
import SignalRService from "../../services/signalr.service";
import TopBuyItem from './TopBuy'
import TopSellItem from './TopSell'
import throttle from 'lodash/throttle'
import {
    getAllMatchOrderData,
    getMatchOrderData,
    getTopBuy,
    getTopSell,
    getTradingPair
} from "../../redux/action/trade.action";
import { NavigationEvents } from "react-navigation";
import {styles} from "react-native-theme";
import TouchableOpacityFnx from '../Shared/TouchableOpacityFnx';
import { offEvent, getListenEvent } from '../../redux/action/common.action';
const { height, width } = Dimensions.get('window')

class TopBuySellOrder extends PureComponent {
    constructor(props) {
        super(props)
        var d = new Date();
        var n = d.getTime();
        this.timerNowB = n;
        this.timerNowS = n;
        this.timerNowO = n;
        this.state = {
            isLeave: false,
            isLeaveB: false,
            isLeaveS: false,
            buyDataState: [],
            sellDataState: [],
            symbol: '',
            unit: '',
            orderSell: [],
            orderBuy: [],
            recentOrder: [],
            activeTab: 'O',
            buyDataFake: ["", "", "", "", "", "", "", ""],
            isStart: false
        }
    }
    componentWillMount() {
        this.props.getTradingPair(this.props.pair);
    }
    _keyExtractor = (item, index) => index.toString();

    componentDidMount() {
        let { symbol, unit } = splitPair(this.props.pair)
        this.setState({ symbol, unit, isStart: true })

    }

    componentDidUpdate(prevProps, prevStates) {
        console.log(prevStates, "prevStates");
        if (prevStates.activeTab !== this.state.activeTab && this.state.activeTab === "O") {
            let { symbol, unit } = splitPair(this.props.pair)
            this.setState({ symbol, unit, onRefresh: true })
            this.getOrderBook(symbol, unit);
        } else if (prevStates.activeTab !== this.state.activeTab && this.state.activeTab === "R") {
            let { symbol, unit } = splitPair(this.props.pair)
            this.setState({ symbol, unit, onRefresh: true })
            this.getRecentOrder(this.props.pair)
        }
        if (prevProps.pair !== this.props.pair) {
            console.log("isLeave === true")
            this.props.getTradingPair(this.props.pair);
            this.setState({
                isLeave: true,
                isLeaveB: true,
                isLeaveS: true
            }, () => {
                console.log("isLeave === false")
                let { symbol, unit } = splitPair(this.props.pair);
                this.setState({ symbol, unit })
                this.getOrderBook(symbol, unit);
                this.getRecentOrder(this.props.pair);
            })
        } else if (this.props.pair === "BTC-VND" && prevStates.isStart === true) {
            this.setState({
                isStart: false
            })
            let { symbol, unit } = this.state
            this.getOrderBook(symbol, unit);
            this.getRecentOrder(this.props.pair)
        }else if (prevProps.onReload === true && prevProps.onReload !== this.props.onReload) {
            let { symbol, unit } = splitPair(this.props.pair)
            this.setState({ symbol, unit, onRefresh: true })
            this.getOrderBook(symbol, unit);
            this.getRecentOrder(this.props.pair)
        }

    }
    getRecentOrder(pair) {
        let { symbol, unit } = splitPair(pair);
        const top = 8;
        this.props.getAllMatchOrderData([])
        tradeService.getRecentOrder(symbol, unit, top)
            .then(res => {
                if (res) {
                    this.props.getAllMatchOrderData(res.length > 8 ? res.length = 8 : res)
                    this.setState({ isLeave: false })
                }
            }).catch(err => console.log(err, "getOrderBookCoin"))
    }

    getOrderBook = (symbol, unit) => {
        this.props.getTopBuy([]);
        this.props.getTopSell([]);
        const top = 8;
        tradeService.getOrderBookCoin(symbol, unit, BUY, top).then(res => {
            if (res.length > 0) {
                this.setState({
                    isLeaveB: false
                });
            }
            //this.setState({ orderBuy: res })
            this.props.getTopBuy(res.length > 8 ? res.length = 8 : res);
        })
            .catch((err) => {
                console.log(err, "getOrderBookCoin")
                httpService.onError(err);
            })
        tradeService.getOrderBookCoin(symbol, unit, SELL, top).then(res => {
            if (res.length > 0) {
                this.setState({
                    isLeaveS: false
                });
            }
            //this.setState({ orderSell: res })
            this.props.getTopSell(res.length > 8 ? res.length = 8 : res);

        })
            .catch((err) => {
                console.log(err, "getOrderBookCoin")
            })
    }
    render() {

        let { activeTab } = this.state;
        const { currencyList,getListenEvent,offEvent } = this.props;
        return (
            <View style={{}}>
                {/* <SignalRService listen_event={activeTab === 'O' ? [constant.SOCKET_EVENT.TOP_BUY, constant.SOCKET_EVENT.TOP_SELL, constant.SOCKET_EVENT.MARKET_WATCH] : [constant.SOCKET_EVENT.MATCH_ORDER, constant.SOCKET_EVENT.MARKET_WATCH]}
                    offEvent={this.state.isLeave}
                    activeTab={this.state.activeTab}
                /> */}
                
                <View style={{ backgroundColor: style.tabActiveColor, marginBottom: 10, height: 30, marginHorizontal: 10 }}>
                    <View style={[style.row]}>
                        <TouchableOpacityFnx
                            style={[stylest.coin, {
                                height: 30,
                                borderBottomColor: activeTab === 'O' ? '#4972f3' :  styles.txtButtonTabMainTitle.color,
                                borderBottomWidth: activeTab === 'O' ? 2 : 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingHorizontal: 20
                            }]}
                            onPress={() => {
                                getListenEvent([constant.SOCKET_EVENT.TOP_BUY,constant.SOCKET_EVENT.TOP_SELL,constant.SOCKET_EVENT.MARKET_WATCH,constant.SOCKET_EVENT.PRICE_CHANGE_NOTIFY])
                                this.setState({ activeTab: "O" })}}>
                            <Text
                                style={[style.textWhite, {
                                    color: activeTab === 'O' ? '#77b0ff' : styles.txtMainTitle.color,
                                    fontSize: activeTab === "O" ? 14 : 12
                                }]}>{'BOOK'.t()}</Text>
                        </TouchableOpacityFnx>
                        <TouchableOpacityFnx
                            style={[stylest.coin, {
                                height: 30,
                                borderBottomColor: activeTab === 'R' ? '#4972f3' :  styles.txtButtonTabMainTitle.color,
                                borderBottomWidth: activeTab === 'R' ? 2 : 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingHorizontal: 20
                            }]}
                            onPress={() => {
                                getListenEvent([constant.SOCKET_EVENT.MATCH_ORDER,constant.SOCKET_EVENT.MARKET_WATCH,constant.SOCKET_EVENT.PRICE_CHANGE_NOTIFY])
                                this.setState({ activeTab: "R" })}}>
                            <Text
                                style={[style.textWhite, {
                                    color: activeTab === 'R' ? '#77b0ff' : styles.txtMainTitle.color,
                                    fontSize: activeTab === "R" ? 14 : 12
                                }]}>{'RECENT_TRADES'.t()}</Text>
                        </TouchableOpacityFnx>
                    </View>
                </View>
                {
                    activeTab === 'O' ?
                        <View style={stylest.order}>
                            <View style={{ flex: 1 }}>
                                <Item style={[stylest.item, { flexDirection: 'row', paddingRight: 2.5, paddingLeft: 10 }]}>
                                    <Left style={{}}><Text
                                        style={[styles.txtMainTitle, stylest.fontSize]}>{'AMOUNT'.t()}</Text></Left>
                                    <View style={{ alignItems: 'flex-end' }}><Text
                                        style={[styles.txtMainTitle, stylest.fontSize]}>{'PRICE'.t()}</Text></View>
                                </Item>
                                {/* {
                                    this.renderFlatBuy()
                                } */}
                                <FlatList
                                    contentContainerStyle={{
                                        paddingTop: 10
                                    }}
                                    data={this.props.buyData}
                                    keyExtractor={this._keyExtractor}
                                    renderItem={({ item, index }) => (
                                        <TopBuyItem index={index} data={item}
                                            setPrice={(price) => this.props.setPrice(BUY, price)} />
                                    )}
                                    maxToRenderPerBatch={8}
                                    initialNumToRender={8}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Item style={[stylest.item, { paddingLeft: 2.5, paddingRight: 10 }]}>
                                    <Left style={{}}>
                                        <Text style={[styles.txtMainTitle, stylest.fontSize]}>{'PRICE'.t()}</Text></Left>
                                    <Right style={{}}><Text
                                        style={[styles.txtMainTitle, stylest.fontSize]}>{'AMOUNT'.t()}</Text></Right>
                                </Item>
                                {/* {this.renderFlatSell()} */}
                                <FlatList
                                    contentContainerStyle={{
                                        paddingTop: 10
                                    }}
                                    data={this.props.sellData}
                                    keyExtractor={this._keyExtractor}
                                    renderItem={({ item, index }) => (
                                        <TopSellItem data={item} index={index}
                                            setPrice={(price) => this.props.setPrice(SELL, price)} />
                                    )}
                                    maxToRenderPerBatch={8}
                                    initialNumToRender={8}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>
                        </View> : null
                }
                {
                    activeTab === "R" ? (
                        <View style={{}}>
                            <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.txtMainTitle, stylest.fontSize]}>{'PRICE'.t()}</Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end', }}>
                                    <Text style={[styles.txtMainTitle, stylest.fontSize]}>{'AMOUNT'.t()}</Text>
                                </View>
                                <Right style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
                                    <Text style={[styles.txtMainTitle, stylest.fontSize]}>{'TIME'.t()}</Text>
                                </Right>
                            </View>
                            {/* {this.renderOrder()} */}
                            <FlatList
                                contentContainerStyle={{
                                    paddingTop: 10
                                }}
                                data={this.props.orderData}
                                keyExtractor={this._keyExtractor}
                                renderItem={({ item, index }) => (
                                    <Item style={{
                                        marginLeft: 10,
                                        marginRight: 10,
                                        // marginBottom: 5,
                                        alignItems: 'center',
                                        borderBottomWidth: 0,
                                        height: 30
                                    }} key={index}>
                                        <View style={{ flex: 1 }}>
                                            <Text
                                                style={[item.colorCode > 0 ? styles.bgBuyOldNew :styles.bgSellOldNew, item.price > 0 ? { fontSize: 13 } : { fontSize: 20, marginTop: -10 }]}>{item.price > 0 ? formatSCurrency(currencyList, item.price, item.paymentUnit) : "--"}</Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                            <Text
                                                style={[styles.textWhite, item.qtty > 0 ? { fontSize: 13 } : { fontSize: 20, marginTop: -10 }]}>{item.qtty > 0 ? formatSCurrency(currencyList, item.qtty, item.symbol, true) : "--"}</Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                            <Text
                                                style={[styles.textMain, item.tradingDate ? { fontSize: 13 } : { fontSize: 20, marginTop: -10 }]}>{item.tradingDate ? to_UTCDate(item.tradingDate, 'HH:mm:ss') : "--"}</Text>
                                        </View>
                                    </Item>
                                )}
                                maxToRenderPerBatch={8}
                                initialNumToRender={8}
                                showsVerticalScrollIndicator={false}
                                extraData={this.state}
                            />
                        </View>
                    ) : null
                }
            </View>
        )
    }
}

const stylest = StyleSheet.create({
    fontSize: {
        fontSize: 12,
    },
    fontIOS: {
        fontFamily: 'Roboto',
    },
    fontSize30: {
        fontSize: 20,
    },
    item: {
        borderBottomWidth: 0,
        paddingBottom: 5
    },
    order: {
        flexDirection: 'row',
        paddingBottom: 1
    },
    coin: {
        borderColor: '#343f85',
        borderWidth: 0,
        borderRadius: 0,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        // paddingHorizontal: 20,
        // paddingVertical: 8
    },
    item2: {
        borderBottomWidth: 0,
        paddingLeft: 2.5,
        paddingRight: 10,
        marginBottom: -10,
        marginTop: -10,
        // paddingBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    item3: {
        borderBottomWidth: 0,
        paddingLeft: 10,
        paddingRight: 2.5,
        marginBottom: -10,
        marginTop: -10,
        // paddingBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    order2: {
        flexDirection: 'row',
        // height: height/3
    },
});
const mapStateToProps = state => {
    return {
        buyData: state.tradeReducer.buyData,
        sellData: state.tradeReducer.sellData,
        currencyList: state.commonReducer.currencyList,
        orderData: state.tradeReducer.orderData
    }
}
export default connect(mapStateToProps, {offEvent, getListenEvent, getTradingPair, getTopBuy, getTopSell, getAllMatchOrderData })(TopBuySellOrder);
