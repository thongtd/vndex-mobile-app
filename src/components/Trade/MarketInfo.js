import React, { PureComponent } from 'react'
import { StyleSheet, Text, View, DeviceEventEmitter } from 'react-native'
import { style } from "../../config/style";
import { convertToUSD, formatCurrency, formatSCurrency, splitPair } from "../../config/utilities";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import { Body, Item, Left, Right } from "native-base";
import { marketService } from "../../services/market.service";
import { constant } from "../../config/constants";
import throttle from "lodash/throttle";
import { getDefaultMarketData } from "../../redux/action/trade.action";
import { NavigationEvents } from 'react-navigation'
import { styles } from "react-native-theme";
class MarketInfo extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            marketInfo: props.navigation.state.params ? props.navigation.state.params.tradingCoin : {
                currencyVolume: 0,
                highestPrice: 0,
                lastestPrice: 0,
                lowestPrice: 0,
                name: "Bitcoin",
                pair: "BTC-VND",
                prevLastestPrice: 0,
                priceChange: 0,
                priceChangeVolume: 0,
                symbol: "BTC",
                tradingCurrency: "VND",
                vol24: 0,
                highest: 0,
                lowest: 0,
                priceChange: 0,
                priceUsd: 0,
                persent: 0,
                priceChangeVolume: 0
            }

        }
        this.timerNowInfo = new Date().getTime();
        this.timer = 350
        this.traddingMarketWatch = DeviceEventEmitter.addListener(constant.SOCKET_EVENT.MARKET_WATCH, this.getTraddingMarketWatch);
    }

    componentDidMount() {
        this.getMarketInfo(this.props.pair);
    }

    componentDidUpdate(prevProps) {
        console.log(prevProps.tradingMarketWatch, "tradingMarketWatch update");
        if (prevProps.pair && prevProps.pair !== this.props.pair) {
            this.getMarketInfo(this.props.pair);
        }
    }
    getTraddingMarketWatch = (marketData) => {
        // console.log(marketData,"event marketwatch tradding")
        // let { marketWatchData } = this.props;
        let { marketInfo } = this.state;
        let marketDataStore = marketInfo;
        let currentPair = this.props.pair;
        let dataStore = marketData;

        let newPair = dataStore.symbol + "-" + (dataStore.paymentUnit);
        if (newPair === currentPair) {
            
            marketDataStore = Object.assign(marketDataStore, {}, dataStore);
            let tradingMarketWatch = Object.assign({}, marketInfo, dataStore)
            var timerNowInfo = new Date().getTime();
            // console.log(marketDataStore,"event marketwatch tradding2")
            if (timerNowInfo > this.timerNowInfo + this.timer) {
                this.timerNowInfo = timerNowInfo;
                // DeviceEventEmitter.emit(constant.EVENTS_DEVICE.traddingMarketWatch, updateDataStore)
                let { currencyList, currencyConversion } = this.props;
                let marketInfo = tradingMarketWatch;
                let vol24 = formatSCurrency(currencyList, marketInfo.currencyVolume, marketInfo.tradingCurrency);
                let highest = formatSCurrency(currencyList, marketInfo.highestPrice, marketInfo.tradingCurrency);
                let lowest = formatSCurrency(currencyList, marketInfo.lowestPrice, marketInfo.tradingCurrency)
                let priceChange = formatSCurrency(currencyList, marketInfo.lastestPrice, marketInfo.tradingCurrency)
                let priceUsd = convertToUSD(marketInfo.tradingCurrency, currencyConversion, currencyList, marketInfo.lastestPrice)
                let persent = formatSCurrency(currencyList, marketInfo.priceChange, '');
                let priceChangeVolume = formatSCurrency(currencyList, marketInfo.priceChangeVolume, marketInfo.tradingCurrency)
                // console.log(marketDataStore,"event marketwatch tradding3")
                this.setState({
                    marketInfo: tradingMarketWatch,
                    vol24,
                    highest,
                    lowest,
                    priceChange,
                    priceUsd,
                    persent,
                    priceChangeVolume
                })
                // this.props.getTradingMarketWatch(updateDataStore);
            }

        }


    }
    componentWillReceiveProps(nextProps) {
        // console.log(nextProps.tradingMarketWatch, "tradingMarketWatch");
        if (nextProps.onRefresh === true && nextProps.onRefresh !== this.props.onRefresh) {
            this.getMarketInfo(nextProps.pair)
        }
        // if (nextProps.tradingMarketWatch && nextProps.tradingMarketWatch !== this.props.tradingMarketWatch) {
        //     let { currencyList, currencyConversion } = this.props;
        //     let marketInfo = nextProps.tradingMarketWatch;
        //     let vol24 = formatSCurrency(currencyList, marketInfo.currencyVolume, marketInfo.tradingCurrency);
        //     let highest = formatSCurrency(currencyList, marketInfo.highestPrice, marketInfo.tradingCurrency);
        //     let lowest = formatSCurrency(currencyList, marketInfo.lowestPrice, marketInfo.tradingCurrency)
        //     let priceChange = formatSCurrency(currencyList, marketInfo.lastestPrice, marketInfo.tradingCurrency)
        //     let priceUsd = convertToUSD(marketInfo.tradingCurrency, currencyConversion, currencyList, marketInfo.lastestPrice)
        //     let persent = formatSCurrency(currencyList, marketInfo.priceChange, '');
        //     let priceChangeVolume = formatSCurrency(currencyList, marketInfo.priceChangeVolume, marketInfo.tradingCurrency)
        //     this.setState({
        //         marketInfo: nextProps.tradingMarketWatch,
        //         vol24,
        //         highest,
        //         lowest,
        //         priceChange,
        //         priceUsd,
        //         persent,
        //         priceChangeVolume
        //     })
        // }
    }

    getMarketInfo(pair) {
        // this.setState({
        //     vol24:0,
        //     highest:0,
        //     lowest:0,
        //     priceChange:0,
        //     priceUsd:0,
        //     persent:0,
        //     priceChangeVolume:0
        // })
        marketService.getMarketWatchByPair(pair).then(res => {
            if (res) {
                this.props.getDefaultMarketData(res);
                let { currencyList, currencyConversion } = this.props;
                let marketInfo = res;
                let vol24 = formatSCurrency(currencyList, marketInfo.currencyVolume, marketInfo.tradingCurrency);
                let highest = formatSCurrency(currencyList, marketInfo.highestPrice, marketInfo.tradingCurrency);
                let lowest = formatSCurrency(currencyList, marketInfo.lowestPrice, marketInfo.tradingCurrency)
                let priceChange = formatSCurrency(currencyList, marketInfo.lastestPrice, marketInfo.tradingCurrency)
                let priceUsd = convertToUSD(marketInfo.tradingCurrency, currencyConversion, currencyList, marketInfo.lastestPrice)
                let persent = formatSCurrency(currencyList, marketInfo.priceChange, '');
                let priceChangeVolume = formatSCurrency(currencyList, marketInfo.priceChangeVolume, marketInfo.tradingCurrency)
                this.setState({
                    marketInfo: res,
                    vol24,
                    highest,
                    lowest,
                    priceChange,
                    priceUsd,
                    persent,
                    priceChangeVolume
                })
            }
        })
            .catch(err => {
                console.log(err, "get Market watch")
            })
    }
    render() {
        const { currencyConversion, currencyList, tradingMarketWatch } = this.props;
        const { priceChangeVolume, marketInfo, vol24, highest, lowest, priceChange, priceUsd, persent } = this.state;
        return (
            <View style={{ paddingLeft: 10, backgroundColor: styles.bgMain.color, marginTop: 10 }}>
                <View style={stylest.container}>
                    <View style={stylest.viewItem}>
                        <View style={stylest.headerLeft}>
                            <Text style={[stylest.lastPrice, marketInfo.priceChange < 0 ? styles.bgSellOldNew : styles.bgBuyOldNew, {
                                fontSize: 18,
                                fontWeight: "bold",
                            }]}>{priceChange || 0}</Text>
                            <Text style={[stylest.currencyVolume, {
                                paddingBottom: 5,
                                color: styles.textMain.color
                            }, stylest.fontSizeText]}>{"≈ "}{priceUsd || 0} USD</Text>
                            <View style={[stylest.headerItem, { paddingBottom: 10, backgroundColor: styles.bgMain.color }]}>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={[marketInfo.priceChange < 0 ? styles.bgSellOldNew : styles.bgBuyOldNew, { fontSize: 14 }]}>{priceChangeVolume || 0}
                                    </Text>
                                    <Text
                                        style={[styles.textWhite, { fontSize: 14 }]}>( {persent || 0} %) <Icon
                                            size={12}
                                            name={marketInfo.priceChange < 0 ? 'arrow-down' : 'arrow-up'} color={marketInfo.priceChange < 0 ? styles.bgSellOldNew.color : styles.bgBuyOldNew.color} /></Text>
                                </View>

                            </View>
                        </View>

                    </View>
                    <View style={[stylest.viewItem, { paddingTop: 5 }]}>
                        <View style={[stylest.HeaderRight]}>
                            <View style={[stylest.itemRight, { paddingRight: 5 }]}>
                                <Text style={[stylest.itemTextLeft, stylest.fontSizeText, styles.txtMainTitle]}>{"LOWEST".t()}</Text>
                                <Text style={[stylest.itemTextLeft, stylest.fontSizeText, styles.txtMainTitle]}>{"HIGHEST".t()}</Text>
                                <Text style={[stylest.itemTextLeft, stylest.fontSizeText, styles.txtMainTitle]}>{"24H_VOLUME".t()}</Text>
                            </View>
                            <View style={stylest.itemRight}>
                                <Text
                                    style={[stylest.itemTextRight, stylest.fontSizeText, styles.textWhite]}>{lowest || 0}</Text>
                                <Text
                                    style={[stylest.itemTextRight, stylest.fontSizeText, styles.textWhite]}>{highest || 0}</Text>
                                <Text
                                    style={[stylest.itemTextRight, stylest.fontSizeText, styles.textWhite]}>{vol24 || 0}</Text>
                            </View>
                        </View>
                    </View>
                </View>

            </View>
        )
    }
}

const stylest = StyleSheet.create({
    headerItem: {
        flexDirection: "row",
        alignItems: "flex-end",
        //padding: 5,
        backgroundColor: style.container.backgroundColor
    },
    lastPrice: {
        fontWeight: '600',
        fontSize: 13,
        color: '#44a250'
    },
    item: {
        borderBottomWidth: 0,
        // paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5
    },
    currencyVolume: {
        color: '#486db5',
        fontSize: 13
    },
    container: {
        flex: 1,
        flexDirection: "row"
    },
    viewItem: {
        flex: 1
    },
    headerLeft: {
        flexDirection: "column",
        justifyContent: 'flex-start',
    },
    itemRight: { flexDirection: "column", justifyContent: 'flex-end', alignItems: "flex-end" },
    itemTextLeft: { color: '#486db5', paddingBottom: 5 },
    itemTextRight: { color: '#fff', paddingBottom: 5 },
    HeaderRight: {
        flexDirection: 'row',
        paddingRight: 10,
        justifyContent: 'flex-end'
    },
    fontSizeText: { fontSize: 12 }
})
const mapStateToProps = state => {
    return {
        currencyConversion: state.tradeReducer.currencyConversion,
        marketData: state.marketReducer.marketData,
        currencyList: state.commonReducer.currencyList,
        tradingMarketWatch: state.tradeReducer.tradingMarketWatch
    }
}
export default connect(mapStateToProps, { getDefaultMarketData })(MarketInfo);
