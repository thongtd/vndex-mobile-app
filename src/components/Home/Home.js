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
    Alert,
    PixelRatio,
    AppState,
    DeviceEventEmitter
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Content, Button, Input, Item } from 'native-base';
import { style } from "../../config/style";
import _ from "lodash"
import Swiper from 'react-native-swiper';
import { authService } from "../../services/authenticate.service";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { setStatusBar, getListenEvent, offEvent } from "../../redux/action/common.action"
const { width, height } = Dimensions.get('window');
const widthPixel = PixelRatio.getPixelSizeForLayoutSize(width);
const heightPixel = PixelRatio.getPixelSizeForLayoutSize(height);

import SignalRService from '../../services/signalr.service'
import { connect } from 'react-redux'
import I18n from 'react-native-i18n'
import { getCurrency, getLanguage, changeTheme } from "../../redux/action/common.action";
import { commonService } from "../../services/common.service";
import { tradeService } from "../../services/trade.service";
import { getConversion } from "../../redux/action/trade.action";
import { constant } from "../../config/constants";
import MarketDataItem from "./MarketInfoItem";
import throttle from "lodash/throttle";
import { marketService } from "../../services/market.service";
import { NavigationEvents } from "react-navigation";
import ConfirmModal from "../Shared/ConfirmModal";
import { storageService } from "../../services/storage.service";
import { Spiner } from '../Shared'
import { getBanner } from "../../redux/action/wallet.action";
import {
    CachedImage,
    ImageCacheProvider
} from 'react-native-cached-image';
import NoticeAlert from '../Shared/NoticeAlert';
import MarketItem from '../Trade/MarketItem';
import TitleTop from './components/TitleTop';
import Logout from '../Shared/Logout';
import MenuSelectQuickly from './components/MenuSelectQuickly';
import Empty from '../Shared/Empty';
import Tooltip from 'rn-tooltip';
import { jwtDecode } from '../../config/utilities';
import theme, { styles } from "react-native-theme";
import TouchableOpacityFnx from '../Shared/TouchableOpacityFnx';
import { getAllMarketWatch } from '../../redux/action/market.action';
import PropTypes from 'prop-types';
class Home extends React.PureComponent {
    constructor(props) {
        super(props);
        var d = new Date();
        var n = d.getTime();
        this.timerNow = n;
        this.timer = 500;
        this.state = {
            bgButton: '#152032',
            // txtBtn: '#3a4d92',
            _i: 0,
            resultMarketWatch: [],
            tradingCoins: [],
            time: "",
            banner: [],
            coin: [],
            loading: false,
            list: [],
            activeUnit: 'VND',
            favorites: [],
            apiDisconnected: false,
            visiableSwiper: false,
            news: [],
            socketStopped: false,
            isReady: true,
            lang: I18n.locale,
            isLeave: false,
            isLastestPrice: "empty",
            isChange: "empty",
            isPair: "empty",
            isVol: false,
            _index: 0,
            activeUnitLoser: '',
            changeLoser: [],
            changeGainer: [],
            changeVolume: [],
            currencyList: null,
            infoCurrencyFiat: null,
            infoCurrencyCoin: null,
            cryptoWallet: [],
            hasLogin: true,

        }
        this.marketWatch =DeviceEventEmitter.addListener(constant.SOCKET_EVENT.MARKET_WATCH,this.handleEventMarketWatch);
        this.timer = new Date().getTime();
        // this.onUpdateMarketData = this.getMarketData;
        this.getTheme();
    }
    handleEventMarketWatch=(event)=>{
        // console.log(event,"event marketwatch");
        this.getMarketData(event)
    }

    componentDidMount() {
        AppState.addEventListener("change", this.handleChange)
        this.checkHealthy();
        this.getFavorite();
        this.getMarket();
        if (Platform.OS === 'android') {
            setTimeout(() => {
                this.setState({ visiableSwiper: true })
            }, 0)
        }

    }
// componentDidUpdate(prevProps, prevState) {
//     let {activeUnit} = this.state;
//     if(Array.isArray(this.props.marketData) && prevProps.marketData !== this.props.marketData){
//         console.log(this.props.marketData,"marketData update");
//         this.setState({ tradingCoins: this.props.marketData }, () => this.getChange(activeUnit))
//     }
// }

    componentWillReceiveProps(nextProps) {
        let {activeUnit} = this.state;
        if (nextProps.logged === true && nextProps.logged !== this.props.logged) {
            this.setState({
                isReady: true
            })
            this.getMarket();
        }
        // if(nextProps.marketData !== this.props.marketData){
        //     if(Array.isArray(nextProps.marketData)){
        //         this.setState({ tradingCoins: nextProps.marketData })
        //     }else{
        //         this.getMarketData(nextProps.marketData)
        //     }
        // }
        if (nextProps.language !== this.props.language) {
            this.setState({
                lang: nextProps.language
            })
        }

    }

    retryConnect() {
        this.getMarket();
    }

    checkHealthy() {
        commonService.checkHealthy().then(val => {
            if (val !== "Ok!") {
                this.setState({ apiDisconnected: true })
            }
        })
    }

    getCurrency(res) {
        if (res) {
            this.setState({
                currencyList: res
            })
            this.props.getCurrency(res);
        }

    }

    setMarketData = (e) => {
        this.setState({ tradingCoins: e })
    }

    selectSymbol(unit, i) {
        this.setState({
            activeUnit: unit,
            activeUnitLoser: unit,
            _i: i,
            _index: i
        });
    }
    componentWillUnmount() {
        AppState.removeEventListener("change", this.handleChange)
    }
    handleChange = (AppState) => {
        if (AppState === "active") {
            this.getMarket();
            // this.setState({
            //     isReady: true
            // })
            // this.handleRefresh();
        }
    }
    getFavorite() {
        tradeService.getFavorite().then(res => {
            if (res) {
                this.setState({ favorites: res })
            }
        })
    }

    getMarketData = (marketData) => {
        // console.log("getMarketData",marketData);
        if (marketData) {
            let { tradingCoins, activeUnit } = this.state;
            for (let i in tradingCoins) {
                let item = tradingCoins[i];
                if (item.symbol === marketData.symbol && item.tradingCurrency === marketData.paymentUnit) {
                    tradingCoins[i] = Object.assign({}, item, marketData);
                    break;
                }
            }
            let timer = new Date().getTime();
            if(timer >  this.timer +350)
                this.setState({ tradingCoins: tradingCoins }, () => this.getChange(activeUnit))
        }
    }

    getMarket = () => {
        const { lang, activeUnit, tradingCoins, favorites } = this.state;
        marketService.setCurrencies().then(() => {
            jwtDecode().then(user => {
                // console.log(user, "okdata")
                if (user) {
                    this.setState({
                        hasLogin: true
                    })
                    authService.getCrytoWallet(user.id).then((cryptoWallet) => {
                        this.setState({
                            cryptoWallet
                        })
                        AsyncStorage.setItem("cryptoWallet", JSON.stringify(cryptoWallet));
                    }).catch(err => console.log(err))
                    Promise.all([
                        authService.getMarketWatch(),
                        authService.getBanner(1),
                        authService.getBanner(2),
                        tradeService.getCurrencyConversion(),
                        marketService.getCurrency(),
                        authService.getWalletBalanceByCurrency(user.id, "VND"),
                        authService.getWalletBalanceByCurrency(user.id, "BTC"),
                        // authService.getCrytoWallet(user.id), 
                        authService.getFiatWallet(user.id)]).then(data => {
                            // console.log(data, "value");
                            this.getMarketWatch(data[0]);
                            this.getBanner(data[1], data[2]);
                            this.getCurrencyConversion(data[3]);
                            this.getCurrency(data[4]);
                            this.setState({
                                infoCurrencyFiat: data[5],
                                infoCurrencyCoin: data[6],
                                // cryptoWallet: data[7],
                                isReady: false,
                                loading: false,
                                apiDisconnected: false
                            })
                            commonService.saveFiatList(data[7]);
                            // AsyncStorage.setItem("cryptoWallet", JSON.stringify(data[7]));
                        }).catch(err => console.log(err, "errData"))
                } else {
                    this.setState({
                        hasLogin: false
                    })
                    Promise.all([authService.getMarketWatch(), authService.getBanner(1), authService.getBanner(2), tradeService.getCurrencyConversion(), marketService.getCurrency()]).then(data => {
                        // console.log(data, "value2");
                        this.getMarketWatch(data[0]);
                        this.getBanner(data[1], data[2]);
                        this.getCurrencyConversion(data[3]);
                        this.getCurrency(data[4]);
                        this.setState({
                            isReady: false,
                            infoCurrencyFiat: null,
                            infoCurrencyCoin: null,
                            cryptoWallet: [],
                            loading: false,
                            apiDisconnected: false
                        })
                    }).catch(err => console.log(err, "errData"))
                }
            })
        }

        ).catch(err => console.log(err, "err setCurrenies"))
    }
    getMarketWatch = (res) => {
        const { lang, activeUnit, tradingCoins, favorites } = this.state;
        if (res) {
            let _marketData = [];
            let _coin = [];
            for (let i in res) {
                let e = res[i];
                _coin.push({ symbol: e.tradingCurrency, name: e.name })
                _marketData = _marketData.concat(e.tradingCoins);
            }
            this.props.getAllMarketWatch(_marketData);
            commonService.saveMarketData(_marketData, _coin);
            this.setState({
                resultMarketWatch: res,
                tradingCoins: _marketData,
                coin: _coin,
                loading: false
            }, () => this.getChange("VND"))
        }
    }
    getBanner = (banner, news) => {
        const { lang, activeUnit, tradingCoins, favorites } = this.state;
        if (banner) {
            var bannerFilter = [];
            const bannerLang = banner.filter(e => {
                if (e.mobileAppImage && e.languageCode && e.languageCode.indexOf(lang) > -1 || (typeof e.languageCode === "undefined" && e.mobileAppImage)) {
                    bannerFilter.push(e.mobileAppImage)
                    return e.mobileAppImage && e.languageCode && e.languageCode.indexOf(lang) > -1 || (typeof e.languageCode === "undefined" && e.mobileAppImage)
                }
            });
            this.setState({
                banner: bannerLang,
                bannerFilter
            })

        }

        if (news) {
            const newsLang = news.filter(e => e.languageCode && e.languageCode.indexOf(lang) > -1 || typeof e.languageCode === "undefined");
            this.setState({ news: newsLang })
        }

    }

    getCurrencyConversion(data) {
        if (data) {
            this.props.getConversion(data)
        }
    }
    getChange = (activeUnit) => {
        let { lang, tradingCoins, favorites } = this.state;
        tradingCoins = [];
        tradingCoins = this.state.tradingCoins;
        const marketDatasGainer = activeUnit != 'F' ? tradingCoins.filter(o => o.tradingCurrency === activeUnit && o.priceChange !== 0) : tradingCoins.filter(o => (favorites.indexOf(o.pair) > -1));
        const marketDatasLoser = activeUnit != 'F' ? tradingCoins.filter(o => o.tradingCurrency === activeUnit && o.priceChange !== 0) : tradingCoins.filter(o => (favorites.indexOf(o.pair) > -1));

        const marketDatasVolume = activeUnit != 'F' ? tradingCoins.filter(o => o.tradingCurrency === activeUnit && o.priceChange !== 0) : tradingCoins.filter(o => (favorites.indexOf(o.pair) > -1));

        var changeGainer = _.orderBy(marketDatasGainer, ['type', 'priceChange'], ['asc', 'desc']);
        var changeLoser = _.orderBy(marketDatasLoser, ['type', 'priceChange'], ['asc', 'asc']);
        var changeVolume = _.orderBy(marketDatasVolume, ['type', 'currencyVolume'], ['asc', 'desc']);

        if (changeLoser.length > 5) {
            changeLoser.length = 5;
        }
        if (changeGainer.length > 5) {
            changeGainer.length = 5;
        }
        if (changeVolume.length > 5) {
            changeVolume.length = 5
        }
        this.setState({
            changeLoser,
            changeGainer,
            changeVolume
        },()=>console.log("change success"))
    }
    handleRefresh = () => {
        this.setState({ loading: true })
        this.getMarket()
    }

    stopSocket() {
        this.setState({ socketStopped: true });
    }

    startSocket() {
        this.setState({ socketStopped: false });
    }
    getTheme = () => {
        storageService.getItem("theme").then((val) => {
            if (val && val === "light") {
                this.props.changeTheme("light");
            } else {
                this.props.changeTheme("default");
            }
        })
    }
    render() {
        const { activeTop, bgButton, txtBtn, _i, loading, banner, coin, activeUnit, news, isReady, isLeave, bannerFilter, changeLoser, changeGainer, changeVolume } = this.state;
        const { navigation, currencyConversion,getListenEvent,offEvent } = this.props;
        return (
            <Container style={[styles.bgMain, { paddingBottom: 0, paddingHorizontal: 10 }]}>
                <Spiner isVisible={isReady} />
                <Content
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={() => this.handleRefresh()} />}
                >
                    <NavigationEvents
                        onDidFocus={()=>{
                            getListenEvent([constant.SOCKET_EVENT.MARKET_WATCH]);
                            offEvent(false)
                        }}
                        onWillFocus={(payload) => {
                            DeviceEventEmitter.emit('eventScreen', { name: "HOME" });
                            this.getMarket();
                            this.props.setStatusBar(style.container.backgroundColor)
                            getListenEvent([constant.SOCKET_EVENT.MARKET_WATCH]);
                            offEvent(false)
                        }}
                        onWillBlur={() => {
                            offEvent(true);
                            getListenEvent([]);
                        }}
                    />
                    <Logout
                        navigation={navigation}
                    />
                    {/* <SignalRService 
                    // getMarketData={this.onUpdateMarketData}
                        listen_event={[constant.SOCKET_EVENT.MARKET_WATCH]}
                        offEvent={this.state.isLeave}
                        activeTab={null}
                    /> */}
                    <TouchableOpacityFnx style={{ position: "absolute", padding: 10, zIndex: 10, right: 0, top: 0 }}
                        onPress={() => navigation.navigate('HomeSearch')}
                    >
                        <Icon name={'search'} style={{ color: '#fff' }} size={16} />
                    </TouchableOpacityFnx>
                  <View style={{ height: 220, overflow: "hidden" }}>

                        {
                            banner && banner.length > 0 && bannerFilter.length > 0 ? (
                                <ImageCacheProvider
                                    urlsToPreload={banner}
                                >
                                    <Swiper autoplay={true}
                                        loop={true}
                                        autoplayDirection={true}
                                        key={banner.length}
                                        autoplayTimeout={5}
                                        dotStyle={{
                                            backgroundColor: 'rgba(0,0,0,.2)',
                                            width: 20,
                                            height: 4,
                                            borderRadius: 4,
                                            marginLeft: 3,
                                            marginRight: 3,
                                            //    marginTop: 30,
                                            marginBottom: -15,
                                        }}
                                        activeDotStyle={{
                                            backgroundColor: '#3a4d92',
                                            width: 20,
                                            height: 4,
                                            borderRadius: 4,
                                            marginLeft: 3,
                                            marginRight: 3,
                                            marginBottom: -15,
                                        }}
                                    >

                                        {
                                            banner.map((e, i) => (
                                                <TouchableOpacityFnx style={[stylest.slide1, {
                                                    backgroundColor: styles.bgMain.color
                                                }]}
                                                    key={i}
                                                    activeOpacity={1}
                                                    onPress={() => Linking.openURL(e.url)}>
                                                    <CachedImage source={{ uri: e.mobileAppImage }}
                                                        style={{ width: '100%', height: '100%', overflow: "hidden" }}
                                                        resizeMode={"cover"}
                                                    />
                                                </TouchableOpacityFnx>
                                            ))
                                        }

                                    </Swiper>
                                </ImageCacheProvider>
                            ) : null
                        }
                    </View> 
                   
                    <View style={{ height: 20, marginVertical: 5, flexDirection: "row" }}>
                        <Icon style={{
                            paddingRight: 10,
                            marginTop: 1.5
                        }} name="volume-up" color={styles.textWhite.color} size={15} />
                        <Swiper style={stylest.wrapper}
                            autoplay={true}
                            horizontal={Platform.OS === "android" ? true : false}
                            showsPagination={false}
                            loop={true}
                            autoplayDirection={true}
                            key={news.length}
                            removeClippedSubviews={false}
                            autoplayTimeout={5}

                        >
                            {
                                news.map((e, i) => (
                                    <TouchableOpacityFnx
                                        key={i}
                                        onPress={() => Linking.openURL(e.url)}
                                    >
                                        <Text style={styles.textWhite} numberOfLines={1}>{e.hyperlinkLabel}</Text>
                                    </TouchableOpacityFnx>
                                ))
                            }
                        </Swiper>
                    </View>
                    <MenuSelectQuickly
                        showReady={(data, hasLogin) => {
                            // console.log(hasLogin, this.state.hasLogin, "data");
                        }}
                        data={{
                            infoCurrencyFiat: this.state.infoCurrencyFiat,
                            infoCurrencyCoin: this.state.infoCurrencyCoin,
                            cryptoWallet: this.state.cryptoWallet
                        }}
                        currencyList={this.state.currencyList} navigation={navigation} />
                    <TitleTop
                        hasFontIcon
                        navigation={navigation}
                        dataNavigation={
                            {
                                unit: activeUnit,
                                _i: _i,
                            }
                        }
                        title={`Top Volume`}
                        iconName={"crown"}
                    />
                    <View style={[stylest.listCoin, { backgroundColor: styles.bgBtnListCoin.color }]}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <FlatList
                                data={coin}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacityFnx
                                        style={[stylest.coin, { height: 30, backgroundColor: index === _i ? styles.bgMain.color : styles.bgBtnListCoin.color }]}
                                        onPress={() => {
                                            this.setState({
                                                _i: index,
                                                activeUnit: item.symbol
                                            },() => {this.getChange(item.symbol)})
                                        }}
                                    >
                                        <Text style={[stylest.fontSize13, style.textWhite, { color: index == _i ? '#77b0ff' : styles.txtMainSub.color }]}>{item.symbol}</Text>
                                    </TouchableOpacityFnx>
                                )}
                                ListHeaderComponent={
                                    <Button
                                        style={[stylest.coin, { height: 30, width: 0, backgroundColor: 100 === _i ? '#152032' : styles.bgBtnListCoin.color }]}
                                        onPress={() => this.selectSymbol('F', 100)}>
                                        <Text
                                            style={[style.textWhite, { color: _i == 100 ? '#77b0ff' : styles.txtMainSub.color }]}></Text>
                                    </Button>
                                }
                                keyExtractor={(item, index) => index.toString()}
                                maxToRenderPerBatch={5}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>

                    </View>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={changeVolume}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <MarketItem
                                    length={changeGainer.length - 1}
                                    notFavorite={true}
                                    _i={_i} navigation={navigation} currencyConversion={currencyConversion} data={item}
                                    index={index} />
                            )}
                            maxToRenderPerBatch={5}
                            initialNumToRender={5}
                            contentContainerStyle={{
                                paddingVertical: 10,
                                height: 320
                            }}
                            ListEmptyComponent={<Empty style={{
                                flex: 1,
                                flexDirection: "column",
                                justifyContent: 'center',
                            }} />}
                        />
                    </View>
                    <TitleTop
                        hasBtn
                        navigation={navigation}
                        dataNavigation={
                            {
                                unit: activeUnit,
                                _i: _i,
                                hasChangeLoser: activeTop === "L" ? true : false,
                                hasChangeGainer: activeTop === "G" ? true : false
                            }
                        }
                        title1={"LOSERS".t()}
                        title2={"GAINERS".t()}
                        iconName1={"trending-down"}
                        iconName2={"trending-up"}
                        active={this.state.activeTop}
                        onActiveTop={(activeTop) => {
                            this.setState({
                                activeTop
                            })
                        }}
                    />
                    <View style={[stylest.listCoin, { backgroundColor: styles.bgBtnListCoin.color }]}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <FlatList
                                data={coin}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacityFnx
                                    style={[stylest.coin, { height: 30, backgroundColor: index === _i ? styles.bgMain.color : styles.bgBtnListCoin.color }]}
                                    onPress={() => this.setState({
                                        _i: index,
                                        activeUnit: item.symbol
                                    },() => this.getChange(item.symbol))}
                                >
                                    <Text style={[stylest.fontSize13, style.textWhite, { color: index == _i ? '#77b0ff' : styles.txtMainSub.color }]}>{item.symbol}</Text>
                                </TouchableOpacityFnx>
                                
                                )}
                                ListHeaderComponent={
                                    <Button
                                        style={[stylest.coin, { height: 30, width: 0, backgroundColor: 100 === _i ? '#152032' : styles.bgBtnListCoin.color }]}
                                        onPress={() => this.selectSymbol('F', 100)}>
                                        <Text
                                            style={[style.textWhite, { color: _i == 100 ? '#77b0ff' : styles.txtMainSub.color }]}></Text>
                                    </Button>
                                }
                                keyExtractor={(item, index) => index.toString()}
                                maxToRenderPerBatch={5}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>

                    </View>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={activeTop === "L" ? changeLoser : changeGainer}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <MarketItem
                                    length={changeLoser.length - 1}
                                    notFavorite={true}
                                    _i={_i} navigation={navigation} currencyConversion={currencyConversion} data={item}
                                    index={index} />
                            )}
                            maxToRenderPerBatch={5}
                            initialNumToRender={5}
                            contentContainerStyle={{
                                paddingVertical: 10,
                                height: 320
                            }}
                            ListEmptyComponent={<Empty style={{
                                flex: 1,
                                flexDirection: "column",
                                justifyContent: 'center',
                            }} />}
                        />
                    </View>

                    <ConfirmModal visible={this.state.apiDisconnected} title={"WARNING".t()} content={"NO_INTERNET".t()}
                        onClose={() => {
                            this.setState({ apiDisconnected: false })
                        }} onOK={() => this.retryConnect()}
                        resultText={this.state.resultText} resultType={this.state.resultType}
                        ButtonOKText={"RETRY".t()} ButtonCloseText={"CLOSE".t()}
                    />
                </Content>
            </Container>
        );
    }
}
Home.propTypes = {
    marketData:PropTypes.array,
  };
  
const stylest = StyleSheet.create({
    listCoin: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#152032'
    },
    coin: {
        borderColor: '#343f85',
        borderWidth: 0,
        borderRadius: 0,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        alignSelf: "center",
        alignItems: "center",
        width: 80
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
        backgroundColor: style.container.backgroundColor,
        overflow: 'hidden',
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
    },
    fontSize13: {
        fontSize: 13
    }
})

const mapStateToProps = (state) => {
    return {
        currencyConversion: state.tradeReducer.currencyConversion,
        language: state.commonReducer.language,
        bannerData: state.walletReducer.banner,
        logged: state.commonReducer.logged,
        marketData: state.marketReducer.marketData
    }
}

export default connect(mapStateToProps, {getAllMarketWatch,getListenEvent,offEvent, getLanguage, getConversion, getCurrency, getBanner, setStatusBar, changeTheme })(Home);
