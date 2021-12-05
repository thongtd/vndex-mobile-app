import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    ListView, FlatList, WebView, ActivityIndicator, StatusBar, Modal,
    AsyncStorage,
    RefreshControl,
    BackHandler,
    AppState,
    ScrollView,
    Platform,
    DeviceEventEmitter
} from 'react-native';
import { Container, Content, Header, Left, Body, Right, Button, Label, Item, Form, Input, Picker } from 'native-base';
import { style } from "../../config/style";
import Icon from 'react-native-vector-icons/FontAwesome'
import {
    dimensions,
    formatCurrency,
    getPairList,
    formatSolution, formatSCurrency, jwtDecode,
} from "../../config/utilities";
import { connect } from 'react-redux';
import { authService } from "../../services/authenticate.service";
import { BUY, currency, SELL, symbolCoin, constant } from "../../config/constants";
import { checkLogin, getCurrency, getListenEvent, offEvent } from "../../redux/action/common.action";
import { marketService } from "../../services/market.service";
import DepthChart from '../Shared/DepthChart'
import Chart from '../Shared/Chart'
import { NavigationEvents } from 'react-navigation'
import MarketInfo from "./MarketInfo";
import OpenOrder from "./OpenOrder";
import TradingForm from "./TradingForm";
import TopBuySellOrder from "./TopBuySellOrder";
import { getBalance, getTradingPair } from '../../redux/action/trade.action'
import { tradeService } from "../../services/trade.service";
import StockChartScreen from "../Shared/StockChart";
import { setStatusBar } from "../../redux/action/common.action"
import { HeaderFnx, Spiner } from '../Shared';
import Orientation from 'react-native-orientation';
import { NavigationActions } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Logout from '../Shared/Logout';
import ChartFnx from './Chart/ChartTest';
import { styles } from "react-native-theme";
import { storageService } from '../../services/storage.service';
import TouchableOpacityFnx from '../Shared/TouchableOpacityFnx';
const { width, height } = Dimensions.get('window');

class Trade extends React.Component {
    constructor(props) {
        super(props);
        this.bestPrice = 0;
        this.state = {
            isReady: false,
            onReload: false,
            pairList: ["BTC-VND"],
            modalVisible: false,
            selectedPair: "BTC-VND",
            symbol: "BTC",
            unit: "VND",
            side: '',
            logged: false,
            arrCoin: [],
            _i: (this.props.navigation.state.params && this.props.navigation.state.params._i) ? this.props.navigation.state.params._i : 0,
            marketData: (this.props.navigation.state.params && this.props.navigation.state.params.tradingCoin) ? this.props.navigation.state.params.tradingCoin : {
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
                tradingCurrency: "VND"
            },
            bestPrice: 0,
            onRefresh: false,
            is_favorite: false,
            activeChart: 0,
            socketStopped: false,
            newOrder: null,
            loading: false,
            hasScroll: true,
            isNow: false,
            activeBSNow:"L"
        }
    }


    componentDidMount() {
        // this.props.navigation.setParams({ screen: 'TRADE' })
        this.getDataFirst()
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        AppState.addEventListener('change', this._handleAppStateChange);

    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps, "next Props trade");

        let { tradingMarketWatch } = this.props;
        if (tradingMarketWatch && nextProps.tradingMarketWatch.symbol !== tradingMarketWatch.symbol) {
            this.getDataFirst();
            this.setState({ price: formatSCurrency(this.props.currencyList, nextProps.tradingMarketWatch.lastestPrice, this.state.unit) });
        }
        if (nextProps.tradingMarketWatch.lastestPrice !== this.state.bestPrice) {
            if (!this.state.modalVisible) {
                this.setState({
                    bestPrice: nextProps.tradingMarketWatch.lastestPrice
                })
            } else {
                this.bestPrice = nextProps.tradingMarketWatch.lastestPrice
            }

        }
    }

    getDataFirst = () => {

        let params = this.props.navigation.state.params
        let marketData = (params && params.tradingCoin) ? params.tradingCoin : null
        let { symbol, selectedPair, unit } = this.state;
        if (marketData) {
            console.log(marketData, "marketData test params navi");
            selectedPair = marketData.pair
            symbol = marketData.symbol
            unit = marketData.tradingCurrency
            this.setState({ bestPrice: marketData.lastestPrice, symbol, selectedPair, unit, marketData })
            this.checkFavorite(selectedPair);
        } else {
            marketService.getMarketWatchByPair(selectedPair).then(res => {
                console.log(res, "marketData test");
                this.setState({
                    marketData: res,
                    bestPrice: res.lastestPrice,
                    isReady: false
                })
            })
                .catch(err => console.log(err));
        }
        let pairList = getPairList(symbolCoin, currency);
        this.setState({
            pairList,
            // onRefresh: false,

        })

        marketService.setCurrencies().then(() => {
            this.getCurrency();
        });
    }
    getCurrency() {
        marketService.getCurrency().then(res => {
            this.setState({
                onReload: false,
                onRefresh: false
            })
            this.props.getCurrency(res);
        })
    }

    checkFavorite(pair) {
        tradeService.checkFavorite(pair).then((is_favorite) => {
            this.setState({ is_favorite })
        })
    }

    executeFavorite() {
        //1: add, 0: remove
        let type = 1;
        if (this.state.is_favorite) {
            type = 0
        }
        tradeService.addFavorite(this.state.selectedPair, type).then(res => {
            this.setState({ is_favorite: !this.state.is_favorite });
        })
    }

    openModal(side) {
        authService.getToken().then(async res => {
            if (res) {
                this.setState({ side, modalVisible: true })
                this.scroll.props.scrollToPosition(0, 359, true);
            } else {
                this.props.navigation.navigate('Login');
                this.props.checkLogin(false)
            }
        })
    }

    closeModal = () => {
        this.setState({ modalVisible: false, bestPrice: this.bestPrice !== 0 ? this.bestPrice : this.state.bestPrice })
    }

    openBuy() {
        let { bestPrice } = this.state;
        this.setPrice(BUY, bestPrice);
    }

    openSell() {
        let { bestPrice } = this.state;
        this.setPrice(SELL, bestPrice);
    }


    initMarketData(params) {
        let { marketData, initPair } = this.state;
        if (params && params.tradingCoin && (params.tradingCoin.pair != initPair && params.tradingCoin.pair != marketData.pair)) {
            let marketData = params.tradingCoin;
            if (marketData) {
                this.setState({ initPair: marketData.pair });
                let symbol = marketData.symbol
                let selectedPair = marketData.pair
                let unit = marketData.tradingCurrency
                let pairImage = marketData.image
                this.setState({
                    symbol,
                    selectedPair,
                    unit,
                    marketData,
                    pairImage
                })
                this.checkFavorite(selectedPair);
            }
        }
    }

    setPrice(side, price) {
        if (!this.state.modalVisible) {
            this.openModal(side);
        }
        this.setState({ price: formatSCurrency(this.props.currencyList, price, this.state.unit) });

    }

    setBestPrice(side, price) {
        let { bestPrice, marketData } = this.state;
        this.setState({ bestPrice: marketData.lastestPrice })
    }

    _onRefresh = () => {
        this.setState({
            onRefresh: true,
            onReload: true
        })
        this.getDataFirst();
        this.initMarketData(this.props.navigation.state.params);
    }
    componentWillUnmount() {
        this.backHandler.remove()
        AppState.removeEventListener('change', this._handleAppStateChange);
    }
    handleBackPress = () => {
        if (this.state.modalVisible) {
            this.closeModal();
        }
    }
    _handleAppStateChange = (AppState) => {
        if (AppState === "active") {
            this.getDataFirst();
            this.initMarketData(this.props.navigation.state.params);
        }

    }

    render() {
        const { isNow,
            modalVisible, side, price
            , symbol, marketData, selectedPair, onRefresh, is_favorite, activeChart, unit, _i, isReady, hasScroll, onReload
        } = this.state;
        const { navigation, currencyList,getListenEvent,offEvent } = this.props;
        
        // console.log(selectedPair, "selectedPair");
        // const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return (
            <Container style={[stylest.bgMain]}>
                <NavigationEvents
                    onDidFocus={()=>{
                        getListenEvent([
                            constant.SOCKET_EVENT.PRICE_CHANGE_NOTIFY,
                            constant.SOCKET_EVENT.TOP_BUY,
                            constant.SOCKET_EVENT.TOP_SELL,
                            constant.SOCKET_EVENT.MARKET_WATCH
                        ])
                        offEvent(false)
                    }}
                    onWillFocus={(payload) => {
                        getListenEvent([
                            constant.SOCKET_EVENT.PRICE_CHANGE_NOTIFY,
                            constant.SOCKET_EVENT.TOP_BUY,
                            constant.SOCKET_EVENT.TOP_SELL,
                            constant.SOCKET_EVENT.MARKET_WATCH
                        ])
                        offEvent(false)
                        DeviceEventEmitter.emit('eventScreen', {name:"TRADE"});
                        StatusBar.setHidden(false);
                        this.setState({
                            onReload: true,
                        })
                        this.initMarketData(payload.state.params);
                        this.getDataFirst()
                        Orientation.getOrientation((err, orientation) => {
                            if (orientation !== 'PORTRAIT') {
                                Orientation.lockToPortrait();
                            }
                        });
                    }}
                    onWillBlur={() => {
                        this.closeModal();
                        offEvent(true);
                        getListenEvent([]);
                    }}
                />
                
                <HeaderFnx
                    navigation={navigation}
                    colorStatus={style.colorWithdraw}
                    hasView={
                        <Item style={[stylest.header, {
                            backgroundColor: styles.backgroundSub.color,
                            borderBottomWidth: this.props.theme === "light" ? 0.5 : 0,
                        }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={[stylest.item, stylest.viewClick]}>
                                    <Image source={{ uri: marketData.image }} style={stylest.iconKey} />
                                    <TouchableOpacityFnx onPress={() => navigation.navigate("MarketWatchSelect", {
                                        unit: unit,

                                    })}
                                        style={stylest.clickHeader}>
                                        <Text style={[stylest.textTitle, styles.textWhite]}> {this.state.selectedPair.replace("-", " / ")}   </Text>
                                        <Icon name="caret-down" style={[stylest.iconCaret, styles.textWhite]} />
                                    </TouchableOpacityFnx>
                                </View>
                            </View>
                            <Body>
                            </Body>
                            <Right style={{ alignItems: 'center', justifyContent: "flex-end", flexDirection: "row", paddingRight: 10 }}>

                                <TouchableOpacityFnx style={{
                                    paddingLeft: 15
                                }} transparent onPress={() => this.executeFavorite()}>
                                    <Icon name="star" color={is_favorite ? '#FFC200' : styles.textWhite.color} size={20} />
                                </TouchableOpacityFnx>
                            </Right>
                        </Item>
                    }
                />

                <KeyboardAwareScrollView
                    scrollEnabled={hasScroll}
                    innerRef={c => (this.scroll = c)}
                    style={[stylest.content, this.state.modalVisible && { marginBottom: isNow ? 230 : 200, }, {
                        backgroundColor: styles.bgMain.color
                    }]}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={onRefresh}
                            onRefresh={() => {

                                this._onRefresh();
                            }}
                        />
                    }
                >

                    <View style={{
                    }}
                    >
                        <View
                            onMoveShouldSetResponder={() => this.setState({
                                hasScroll: true
                            })}
                            style={{}}>
                            <MarketInfo
                                onRefresh={onReload}
                                pair={selectedPair} symbol={symbol}
                                navigation={navigation} />
                        </View>
                        <View
                            onMoveShouldSetResponder={() => this.setState({
                                hasScroll: Platform.OS === "ios" ? true : false
                            })}>
                            {/*<StockChartScreen pair={selectedPair}/>*/}
                            <Chart
                                selectedPair={selectedPair}
                                currencyList={currencyList}
                                navigation={navigation}
                                onRefresh={onReload}
                            />

                        </View>
                        {/*Du mua, du ban*/}
                        <View
                            onMoveShouldSetResponder={() => this.setState({
                                hasScroll: true
                            })}>
                            <TopBuySellOrder
                                onReload={onRefresh}
                                pair={selectedPair}
                                setPrice={(side, price) => {
                                    if(this.state.activeBSNow !== "N"){
                                        this.setPrice(side, price)
                                    }
                                    }}
                                socketStopped={this.state.socketStopped} />
                        </View>
                        <View
                            onMoveShouldSetResponder={() => this.setState({
                                hasScroll: true
                            })} style={{ marginTop: 10, marginBottom: 10 }}>
                            <OpenOrder
                                pair={selectedPair}
                                onRefresh={onReload}
                                newOrder={this.state.newOrder}
                                navigation={navigation}
                            />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                {/*Modal Trade*/}
                <TradingForm
                activeBSNow={(active)=>this.setState({
                    activeBSNow:active
                })}
                    isBuySellNow={(isNow) => this.setState({
                        isNow
                    })}
                    navigation={navigation}
                    visible={modalVisible} setMessage={this.setMessage}
                    refresh={(newOrder) => {
                        this.setState({ onRefresh: false, newOrder });
                    }} close={this.closeModal}
                    pair={selectedPair} 
                    side={side} 
                    price={price} 
                    bestPrice={formatSCurrency(this.props.currencyList, this.bestPrice, this.state.unit)}
                    setSide={(side) => this.setState({ side })} />
                <View style={[stylest.btnOrder, {
                    backgroundColor: styles.bgMain.color
                }]}>
                    <TouchableOpacityFnx style={[stylest.btnBuy, style.buttonHeight, {
                        backgroundColor: styles.bgBuyOldNew.color
                    }]} onPress={() => this.openBuy()}>
                        <Text style={style.textWhite}>{"BUY".t()}</Text>
                    </TouchableOpacityFnx>
                    <TouchableOpacityFnx style={[stylest.btnSell, style.buttonHeight, {
                        backgroundColor: styles.bgSellOldNew.color
                    }]} onPress={() => this.openSell()}>
                        <Text style={style.textWhite}>{"SELL".t()}</Text>
                    </TouchableOpacityFnx>
                </View>
            </Container>
        );
    }
}

const stylest = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c2840',
        height: '100%'
    },
    header: {
        backgroundColor: "#1c2840",
        alignItems: 'center',
        paddingTop: 0,
        height: 50,
        paddingHorizontal: 10,
        marginLeft: 0
    },
    headerItem: {
        flexDirection: "row",
        alignItems: "flex-end",
        padding: 10
    },
    marketData: {
        backgroundColor: "#1c2840",
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#1c2840",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    content: {
        backgroundColor: "#151d30",
        flex: 1,

        // height:100
    },
    chart: {
        height: 480,
        backgroundColor: "#151d30"
    },
    order: {
        flexDirection: 'row',
        // height: height/3
    },
    item: {
        borderBottomWidth: 0,
        // paddingLeft: 5,
        paddingRight: 5,
    },
    btnOrder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#00000040'
    },
    btnBuy: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 10,
        backgroundColor: '#00d154',
        marginBottom: 10,
        borderRadius: 2,
        alignItems:"center"
    },
    btnSell: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 10,
        backgroundColor: '#ff315d',
        marginBottom: 10,
        borderRadius: 2,
        alignItems:"center"
    },
    lastPrice: {
        fontWeight: '600',
        fontSize: 12,
        color: '#44a250'
    },
    currencyVolume: {
        color: '#343f85',
        fontSize: 10
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#343f85',
        width: width,
        height: height / 2.2,
        justifyContent: 'space-between',
        padding: 10
    },
    input: {
        backgroundColor: '#1d314a',
        borderRadius: 2,
        height: 30,
        marginBottom: 5,
        marginHorizontal: 5

    },
    fontSize: {
        fontSize: 10,
    },
    listCoin: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1c2840'
    },
    coin: {
        borderColor: '#343f85',
        borderWidth: 0,
        borderRadius: 0,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        // paddingHorizontal: 20,
        // paddingVertical: 15
    },
    textTitle: {
        color: style.colorWhite,
        fontSize: 18,
        fontWeight: 'bold'
    },
    clickHeader: {
        width: 150,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    iconCaret: { fontSize: 18, color: style.colorWhite },
    viewClick: { flexDirection: 'row', alignItems: 'center', justifyContent: "flex-start" },
    iconKey: { height: 17, width: 17 }
});

const mapStateToProps = state => {
    return {
        currencyConversion: state.tradeReducer.currencyConversion,
        currencyList: state.commonReducer.currencyList,
        tradingMarketWatch: state.tradeReducer.tradingMarketWatch,
        theme: state.commonReducer.theme
    }
}
export default connect(mapStateToProps, {offEvent,getListenEvent, getCurrency, setStatusBar, checkLogin, getBalance, getTradingPair })(Trade);
