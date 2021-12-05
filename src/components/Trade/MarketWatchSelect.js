import React from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    Linking,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    FlatList,
    Platform,
    DeviceEventEmitter
} from 'react-native';
import { Container, Content, List, ListItem, Left, Body, Right, Thumbnail, Tab, Button, Input, Item } from 'native-base';
import { style } from "../../config/style";
import Swiper from 'react-native-swiper';
import { authService } from "../../services/authenticate.service";
import Icon from 'react-native-vector-icons/FontAwesome5';
import _ from "lodash"
const { width, height } = Dimensions.get('window');
import SignalRService from '../../services/signalr.service'
import { connect } from 'react-redux'
import I18n from 'react-native-i18n'
import { getCurrency, getLanguage, offEvent, getListenEvent } from "../../redux/action/common.action";
import { commonService } from "../../services/common.service";
import { tradeService } from "../../services/trade.service";
import { getConversion } from "../../redux/action/trade.action";
import { constant } from "../../config/constants";
import MarketDataItem from "../Home/MarketInfoItem";
import throttle from "lodash/throttle";
import { marketService } from "../../services/market.service";
import { NavigationEvents } from "react-navigation";
import { ConfirmModal } from "../Shared/ConfirmModal";
import { storageService } from "../../services/storage.service";
import { getAllMarketWatch } from "../../redux/action/market.action";
import MarketItem from "./MarketItem";
import StatusBarFnx from '../Shared/StatusBar';
import { styles } from "react-native-theme";
import TouchableOpacityFnx from '../Shared/TouchableOpacityFnx';
class MarketWatchSelect extends React.Component {
    constructor(props) {
        super(props);
        var d = new Date();
        var n = d.getTime();
        this.timerNow = n;
        this.timer = 350;

        this.state = {
            bgButton: '#1c2840',
            txtBtn: '#3a4d92',
            _i: 100,
            resultMarketWatch: [],
            tradingCoins: [],
            time: "",
            banner: [],
            coin: [],
            loading: true,
            list: [],
            activeUnit: '',
            favorites: [],
            apiDisconnected: false,
            visiableSwiper: false,
            news: [],
            isLastestPrice: "empty",
            isChange: "empty",
            isPair: "empty",
            isVol: false,
            isLeave: false
        }
        this.marketWatch =DeviceEventEmitter.addListener(constant.SOCKET_EVENT.MARKET_WATCH,this.getMarketData);
        // this.onUpdateMarketData = this.getMarketData;
    }

    componentDidMount() {
        this.getFavorite();
        this.getMarket();
        if (Platform.OS === 'android') {
            setTimeout(() => {
                this.setState({ visiableSwiper: true })
            }, 0)
        }
    }

    selectSymbol(unit, i) {
        this.setState({
            activeUnit: unit,
            _i: i
        });
    }

    getFavorite() {
        tradeService.getFavorite().then(res => {
            if (res) {
                this.setState({ favorites: res })
            }
        })
    }

    getMarket = () => {
        authService.getMarketWatch().then(res => {
            let _marketData = [];
            let _coin = [];
            for (let i in res) {
                let e = res[i];
                _coin.push({ symbol: e.tradingCurrency, name: e.name })
                _marketData = _marketData.concat(e.tradingCoins);
            }
            commonService.saveMarketData(_marketData, _coin);
            let { unit, hasChangeGainer, hasChangeLoser } = this.props.navigation.state.params;
            let _i;
            if (_coin.length > 0) {
                _coin.map((item, index) => {
                    if (item.symbol === unit) {
                        _i = index
                    }
                })
            }
            this.props.getAllMarketWatch(_marketData);
            this.setState({
                resultMarketWatch: res,
                tradingCoins: _marketData,
                coin: _coin,
                loading: false
            })

            console.log(_coin, _i, "_i market")
            if (hasChangeGainer) {
                this.setState({
                    isPair: "empty",
                    isLastestPrice: "empty",
                    isChange: false,
                    isVol: "empty",
                })
            } else if (hasChangeLoser) {
                this.setState({
                    isPair: "empty",
                    isLastestPrice: "empty",
                    isChange: true,
                    isVol: "empty",
                })
            }
            this.selectSymbol(unit ? unit : res[0].tradingCurrency, (_i > 0 || _i === 0) ? _i : 100)
        })
    }
    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.marketData !== this.props.marketData) {
    //         if(Array.isArray(nextProps.marketData)){
    //             this.setState({ tradingCoins: nextProps.marketData })
    //         }else{
    //             this.getMarketData(nextProps.marketData)
    //         }
    //         // this.getMarketData(nextProps.marketData)
    //     }

    // }
    getMarketData = (marketData) => {
        if (marketData) {
            let { tradingCoins, activeUnit } = this.state;
            for (let i in tradingCoins) {
                let item = tradingCoins[i];
                if (item.symbol === marketData.symbol && item.tradingCurrency === marketData.paymentUnit) {
                    tradingCoins[i] = Object.assign({}, item, marketData);
                    break;
                }
            }
           
            var d = new Date();
            var n = d.getTime();
            if (n > this.timerNow + this.timer) {
                this.timerNow = n;
                this.setState({ tradingCoins: tradingCoins })
               
            }
            // this.setState({ tradingCoins: tradingCoins })
        }
    }

    handleRefresh = () => {
        this.setState({ loading: true })
        this.getMarket()
    }

    checkData = () => {
        const { bgButton, txtBtn, _i, loading, coin, activeUnit, favorites, isLastestPrice, isPair, isVol, isChange } = this.state;
        const tradingCoins = this.props.marketWatch
        const marketDatas = activeUnit != 'F' ? tradingCoins.filter(o => o.tradingCurrency === activeUnit) : tradingCoins.filter(o => (favorites.indexOf(o.pair) > -1));
        var lastestPrice = _.orderBy(marketDatas, ['type', 'lastestPrice'], ['asc', isLastestPrice ? 'asc' : 'desc']);
        var pair = _.orderBy(marketDatas, ['type', 'symbol'], ['asc', isPair ? 'asc' : 'desc']);
        var change = _.orderBy(marketDatas, ['type', 'priceChange'], ['asc', isChange ? 'asc' : 'desc']);
        var vol = _.orderBy(marketDatas, ['type', 'currencyVolume'], ['asc', isVol ? 'asc' : 'desc']);

        if (isLastestPrice !== "empty") {
            return lastestPrice
        } else if (isPair !== "empty") {
            return pair;
        } else if (isChange !== "empty") {
            return change;
        } else if (isVol !== "empty") {
            return vol;
        }

    }
    render() {
        const { bgButton, txtBtn, _i, loading, coin, activeUnit, favorites, isLastestPrice, isPair, isVol, isChange } = this.state;
        const tradingCoins = this.props.marketWatch
        const { navigation, currencyConversion, offEvent, getListenEvent } = this.props;

        return (
            <Container style={[styles.bgMain, { paddingHorizontal: 0, paddingTop: 0, }]}>
                <NavigationEvents
                    onWillFocus={(payload) => {
                        this.getFavorite();
                        offEvent(false);
                        getListenEvent([constant.SOCKET_EVENT.MARKET_WATCH])
                    }}
                    onWillBlur={() => {
                        offEvent(true);
                        getListenEvent([]);
                    }}
                />
                <StatusBarFnx
                    color={style.colorWithdraw}
                />

                {/* <SignalRService 
                // getMarketData={this.onUpdateMarketData}
                    offEvent={this.state.isLeave}
                    listen_event={[constant.SOCKET_EVENT.MARKET_WATCH]}
                activeTab={null} />  */}
                <Item style={[{ marginLeft: 0, paddingVertical: 8, paddingRight: 10, borderBottomWidth: 0, flexDirection: "row", justifyContent: "space-between",backgroundColor:styles.backgroundSub.color }]}>
                    <Text style={[styles.textWhite, style.splitHeader,{borderLeftWidth:0}]}>{"MARKET".t()}</Text>
                    <TouchableOpacityFnx
                        onPress={() => navigation.navigate("HomeSearch")}
                    >
                        <Icon name={"search"} color={styles.textWhite.color} size={18} />
                    </TouchableOpacityFnx>
                </Item>
                <View style={[stylest.listCoin, { backgroundColor: styles.backgroundSub.color }]}>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <FlatList
                            data={coin}
                            renderItem={({ item, index }) => (
                                <TouchableOpacityFnx
                                    style={[stylest.coin, { height: 38, backgroundColor: index === _i ? styles.bgBtnListCoin.color : styles.backgroundSub.color }]}
                                    onPress={() => {
                                        this.setState({
                                            _i: index,
                                            activeUnit: item.symbol,
                                        });
                                    }}
                                >
                                    <Text
                                        style={[styles.textWhite, { color: index == _i ? '#77b0ff' : styles.txtMainSub.color }]}>{item.symbol}
                                    </Text>
                                </TouchableOpacityFnx>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            ListHeaderComponent={
                                <TouchableOpacityFnx
                                    style={[stylest.coin, { height: 38, width: 100, backgroundColor: 100 === _i ? styles.bgBtnListCoin.color : styles.backgroundSub.color }]}
                                    // onPress={() => this.selectSymbol('F', 100)}
                                    onPress={() => {
                                        this.setState({
                                            _i: 100,
                                            activeUnit: 'F',
                                        });
                                    }}
                                >
                                    <Text style={[styles.textWhite, { color: _i == 100 ? '#77b0ff' : styles.txtMainSub.color }]}>Favorite</Text>
                                </TouchableOpacityFnx>
                            }
                            maxToRenderPerBatch={5}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>

                    <TouchableOpacityFnx style={{ width: 25, height: 25, borderRadius: 25, marginRight: 10, backgroundColor: '#151d30', alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => this.props.navigation.goBack()}>
                        <Icon name={'times'} style={{ color: '#fff' }} size={14} />
                    </TouchableOpacityFnx>
                </View>
                <View
                    style={{ backgroundColor: styles.bgBtnListCoin.color, paddingHorizontal: 10, paddingVertical: 7.5, flexDirection: 'row', borderRadius: 2.5 }}
                >
                    <Left style={{ flex: 1.4 }}>
                        <View style={{
                            flexDirection: "row"
                        }}>
                            <TouchableOpacityFnx
                                onPress={() => {
                                    if (this.state.isPair !== "empty") {
                                        this.setState({
                                            isPair: !this.state.isPair,
                                            isLastestPrice: "empty",
                                            isChange: "empty",
                                            isVol: "empty",
                                        })
                                    } else {
                                        this.setState({
                                            isPair: false,
                                            isLastestPrice: "empty",
                                            isChange: "empty",
                                            isVol: "empty",
                                        })
                                    }
                                }}
                            >
                                <Text style={this.state.isPair !== "empty" ? { color: '#77b0ff' } : style.textMain}>
                                    {"PAIR".t()}{" "}
                                    {this.state.isPair !== "empty" && <Icon name={this.state.isPair ? "arrow-up" : "arrow-down"} size={12} color={this.state.isPair !== "empty" ? '#77b0ff' : style.textMain.color} />}
                                </Text>
                            </TouchableOpacityFnx>
                            <Text style={style.textMain}>
                                {" "}{"/"}{" "}
                            </Text>
                            <TouchableOpacityFnx
                                onPress={() => {
                                    if (this.state.isVol !== "empty") {
                                        this.setState({
                                            isVol: !this.state.isVol,
                                            isLastestPrice: "empty",
                                            isChange: "empty",
                                            isPair: "empty",
                                        })
                                    } else {
                                        this.setState({
                                            isVol: false,
                                            isLastestPrice: "empty",
                                            isChange: "empty",
                                            isPair: "empty",
                                        })
                                    }
                                }}
                            >
                                <Text style={this.state.isVol !== "empty" ? { color: '#77b0ff' } : style.textMain}>
                                    {"VOL".t()}{" "}
                                    {this.state.isVol !== "empty" && <Icon name={this.state.isVol ? "arrow-up" : "arrow-down"} size={12} color={this.state.isVol !== "empty" ? '#77b0ff' : style.textMain.color} />}
                                </Text>
                            </TouchableOpacityFnx>
                        </View>
                    </Left>
                    <View style={{ borderBottomWidth: 0, flex: 0.4 }}>

                    </View>
                    <View style={{ borderBottomWidth: 0, flex: 1.6 }}>
                        <TouchableOpacityFnx
                            onPress={() => {
                                if (this.state.isLastestPrice !== "empty") {
                                    this.setState({
                                        isLastestPrice: !this.state.isLastestPrice,
                                        isVol: "empty",
                                        isChange: "empty",
                                        isPair: "empty",
                                    })
                                } else {
                                    this.setState({
                                        isLastestPrice: false,
                                        isVol: "empty",
                                        isChange: "empty",
                                        isPair: "empty",
                                    })
                                }
                            }}
                        >
                            <Text style={this.state.isLastestPrice !== "empty" ? { color: '#77b0ff' } : style.textMain}>{"LAST_PRICE".t()}
                                {" "}
                                {this.state.isLastestPrice !== "empty" && <Icon name={this.state.isLastestPrice ? "arrow-up" : "arrow-down"} size={12} color={this.state.isLastestPrice !== "empty" ? '#77b0ff' : style.textMain.color} />}
                            </Text>
                        </TouchableOpacityFnx>
                    </View>
                    <Right style={{ borderBottomWidth: 0, alignItems: 'flex-end' }}>
                        <TouchableOpacityFnx
                            onPress={() => {
                                if (this.state.isChange !== "empty") {
                                    this.setState({
                                        isChange: !this.state.isChange,
                                        isVol: "empty",
                                        isLastestPrice: "empty",
                                        isPair: "empty",
                                    })
                                } else {
                                    this.setState({
                                        isChange: false,
                                        isVol: "empty",
                                        isLastestPrice: "empty",
                                        isPair: "empty",
                                    })
                                }
                            }}
                        >
                            <Text style={this.state.isChange !== "empty" ? { color: '#77b0ff' } : style.textMain}>{"PERCENT_CHANGE".t()}{" "}
                                {this.state.isChange !== "empty" && <Icon name={this.state.isChange ? "arrow-up" : "arrow-down"} size={12} color={this.state.isChange !== "empty" ? '#77b0ff' : style.textMain.color} />}
                            </Text>
                        </TouchableOpacityFnx>
                    </Right>
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={this.checkData()}
                        keyExtractor={(item, index) => index.toString()}
                        refreshControl={
                            <RefreshControl refreshing={loading} onRefresh={this.handleRefresh} />
                        }
                        renderItem={({ item, index }) => (
                            <MarketItem _i={_i} navigation={navigation} currencyConversion={currencyConversion} data={item}
                                index={index} />
                        )}
                        maxToRenderPerBatch={10}
                        initialNumToRender={10}
                    />
                </View>
            </Container>
        );
    }
}

const stylest = StyleSheet.create({
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
        width: 50,
        alignItems: "center"
    },
    wrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#151a2a',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#151a2a',
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    }
})

const mapStateToProps = (state) => {
    return {
        currencyConversion: state.tradeReducer.currencyConversion,
        language: state.commonReducer.language,
        marketWatch: state.marketReducer.marketWatch,
        marketData: state.marketReducer.marketData
    }
}

export default connect(mapStateToProps, { offEvent, getListenEvent, getLanguage, getConversion, getCurrency, getAllMarketWatch })(MarketWatchSelect);
