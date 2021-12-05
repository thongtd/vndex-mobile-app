import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, Animated, Dimensions, Image, FlatList, ImageBackground, AsyncStorage, Platform, AppState,DeviceEventEmitter } from 'react-native';
import { Container, Content, Item, Left, Right, Body, Thumbnail, Header, CheckBox } from 'native-base';
import { style } from "../../config/style";
import { authService } from "../../services/authenticate.service";
import {
    formatCurrency,
    jwtDecode,
    formatSCurrency,
    formatTrunc,
    convertToUSD,
    convertToCurr
} from "../../config/utilities";
import { NavigationEvents } from "react-navigation";
import { connect } from 'react-redux'
import { commonService } from "../../services/common.service";
import { constant } from "../../config/constants";
import SignalRService from "../../services/signalr.service";
import throttle from "lodash/throttle";
import ItemWallet from './components/ItemWallet';
import Icon from "react-native-vector-icons/FontAwesome"
import { setStatusBar, offEvent, getListenEvent } from "../../redux/action/common.action"
import _ from "lodash";
import { HeaderFnx, Spiner } from '../Shared';
import Logout from '../Shared/Logout';
import WalletDW from './components/WalletDW';
import theme,{styles} from "react-native-theme"
import TextInputFnx from '../Shared/TextInputFnx';
import TouchableOpacityFnx from '../Shared/TouchableOpacityFnx';
import { getAllMarketWatch } from '../../redux/action/market.action';
const lengthString = 15;
const HEADER_MAX_HEIGHT = 60;
const HEADER_MIN_HEIGHT = 40;

const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const { width, height } = Dimensions.get('window')
class Wallet extends React.PureComponent {
    constructor(props) {
        super(props);
        var d = new Date();
        var n = d.getTime();
        this.timerNow = n;
        this.timer = 500;

        this.state = {
            walletInfo: [],
            loading: false,
            cryptoWallet: [],
            fiatWallet: [],
            scrollY: new Animated.Value(0),
            assetSummary: [],
            userMarket: [],
            totalCryptoValue: 0,
            totalCostVal: 0,
            totalPnlValue: 0,
            totalCoinPnlPercent: 0,
            totalPnlPercent: 0,
            totalFiatValue: 0,
            currencyCode: null,
            isShowBalances: true,
            isReady: true,
            keepLogin: null,
            valueFiat: null,
            valueCoin: null
        }
        this.onUpdateMarketData = this.getMarketData;
        this.fiats = [];
        this.coins = [];
    }
    async getDataWallet() {
        let user = await jwtDecode()
        let assetSummary = authService.getAssetSummary(user.id);
        let userMarket = authService.getMarketWatch();

        let cryptoWallet = authService.getCrytoWallet(user.id);
        let fiatWallet = authService.getFiatWallet(user.id);
        Promise.all([assetSummary, userMarket, cryptoWallet, fiatWallet]).then(value => {

            let cryptoWalletBtc = [];
            if (value[2]) {
                value[2].map((item, i) => {
                    item.totalAmount = (Number(item.available) + Number(item.pending));
                    if ((Number(item.available) + Number(item.pending)) > 0) {
                        cryptoWalletBtc.push(item);
                    }
                })
            }
            var cryptoWalletArr = _.orderBy(value[2], ['type', 'totalAmount'], ['asc', 'desc']);
            var cryptoWalletBtcArr = _.orderBy(cryptoWalletBtc, ['type', 'totalAmount'], ['asc', 'desc']);

            this.setState({
                assetSummary: value[0],
                userMarket: value[1],
                cryptoWallet: cryptoWalletArr,
                cryptoWalletBtc: cryptoWalletBtcArr,
                fiatWallet: value[3],
                loading: false,
                isReady: false
            });
            this.fiats = value[3];
            this.coins = value[2];
            this.coinsBtc = cryptoWalletBtcArr;
            this.calculateAsset(value[1]);
            // this.props.getAllMarketWatch(value[1]);
            commonService.saveFiatList(value[3]);
        });
        this.getKeepLogin();
    }

    getKeepLogin = async () => {
        let user = await jwtDecode();
        let userInfo = await authService.keepLogin(user.id);
        await this.setState({
            currencyCode: userInfo.currencyCode,
            keepLogin: userInfo
        })
    }

    getMarketData = async (marketData) => {
        let userMarket = this.state.userMarket;

        for (let j in userMarket) {
            let coin = userMarket[j];
            if (coin.tradingCurrency === marketData.paymentUnit) {
                for (let i in coin.tradingCoins) {
                    let item = coin.tradingCoins[i];
                    if (item.symbol === marketData.symbol && item.tradingCurrency === marketData.paymentUnit) {
                        coin.tradingCoins[i] = Object.assign({}, item, marketData);
                        break;
                    }
                }
            }
        }
        this.calculateAsset(userMarket);
        // var d = new Date();
        // var n = d.getTime();
        // if (n > this.timerNow + this.timer) {
        //     this.timerNow = n;
        //     this.calculateAsset(userMarket);
        // }
    }

    calculateAsset = async (userMarket) => {
        const { assetSummary } = this.state;
        let cryptos = assetSummary.filter(e => e.walletType == 2);
        let fiats = assetSummary.filter(e => e.walletType == 1);
        let curr = 'VND';
        // this.setState({ userMarket })
        if (userMarket.length > 0) {
            let totalCostVal = 0, totalCryptoValue = 0, totalPnlValue = 0, totalCoinPnlPercent = 0, totalPnlPercent = 0, totalFiatValue = 0;
            for (let i = 0; i < fiats.length; i++) {
                if (fiats[i].currency === curr) {
                    totalFiatValue += fiats[i].totalAmount
                } else {
                    totalFiatValue += convertToCurr(fiats[i].currency, this.props.currencyConversion, this.props.currencyList, fiats[i].totalAmount, curr)
                }
            }

            for (let j = 0; j < userMarket.length; j++) {
                if (userMarket[j].tradingCurrency === curr) {
                    for (let i = 0; i < userMarket[j].tradingCoins.length; i++) {

                        let t = userMarket[j].tradingCoins[i];

                        let _coin = cryptos.filter(e => e.currency === t.symbol);

                        if (_coin) {
                            _coin.forEach(coin => {
                                coin.pnlValue = 0;

                                coin.lastestPrice = t.lastestPrice;
                                coin.prevLastestPrice = t.prevLastestPrice;
                                coin.value = coin.lastestPrice * coin.totalAmount;

                                totalCryptoValue += coin.value;

                                if (coin.coCToLocalValue === 0) {
                                    coin.pnlPercent = 0;
                                } else {
                                    coin.pnlPercent = parseFloat(((t.lastestPrice - coin.coCToLocalValue) / coin.coCToLocalValue * 100).toFixed(2));
                                }

                                totalCostVal += coin.totalAmount * coin.coCToLocalValue;

                                coin.pnlValue = coin.totalAmount * t.lastestPrice - coin.totalAmount * coin.coCToLocalValue;
                                totalPnlValue += coin.pnlValue;
                            })
                        }
                    }
                }
            }

            if (totalCostVal === 0) {
                totalCoinPnlPercent = 0;
                totalPnlPercent = 0;
            } else {
                totalCoinPnlPercent = totalPnlValue / totalCostVal * 100;
                totalPnlPercent = totalPnlValue / (totalCostVal + totalFiatValue) * 100;
            }
            this.setState({ totalCryptoValue, totalCostVal, totalPnlValue, totalCoinPnlPercent, totalPnlPercent, totalFiatValue })
        }
    }

    handleRefresh = () => {
        this.setState({ loading: true,valueFiat:"",valueCoin:"" })
        this.getDataWallet()
    }
    switchShowBtc = () => {
        this.setState({
            isShowBalances: !this.state.isShowBalances
        })

    }
    componentDidMount = () => {
        AppState.addEventListener("change", this.handleChange);
    };

    componentWillUnmount() {
        AppState.removeEventListener("change", this.handleChange);
    }
    handleChange = (AppState) => {
        if (AppState === "active") {
            // this.setState({ isReady: true })
            this.getDataWallet()
        }
    }
    handleSearchFiat = (text) => {
        this.setState({
            valueFiat:text
        });
        if (this.fiats.length > 0) {
            const newData = this.fiats.filter(item => {
                const itemData = `${item.currency.toUpperCase()} - ${item.name.toUpperCase()} `;
                const textData = text.toUpperCase();

                return itemData.indexOf(textData) > -1;
            });
            this.setState({ fiatWallet: newData });
        }
    }
    handleSearchCoin = (text) => {
        const { isShowBalances, cryptoWalletBtc, cryptoWallet } = this.state;
        this.setState({
            isShowBalances: false,
            valueCoin:text
        },()=>{
            if (isShowBalances) {
                if (this.coinsBtc.length > 0) {
                    const newData = this.coinsBtc.filter(item => {
                        const itemData = `${item.symbol.toUpperCase()} - ${item.name.toUpperCase()} `;
                        const textData = text.toUpperCase();
    
                        return itemData.indexOf(textData) > -1;
                    });
                    this.setState({ cryptoWalletBtc: newData });
                }
    
            } else {
                if (this.coins.length > 0) {
                    const newData = this.coins.filter(item => {
                        const itemData = `${item.symbol.toUpperCase()} - ${item.name.toUpperCase()} `;
                        const textData = text.toUpperCase();
    
                        return itemData.indexOf(textData) > -1;
                    });
                    this.setState({ cryptoWallet: newData });
                }
            }
        });
        

    }
      
    componentWillReceiveProps(nextProps) {

        if(nextProps.marketData !== this.props.marketData){
            this.getMarketData(nextProps.marketData)
        }
    }
    render() {
        const { navigation, currencyList, currencyConversion,offEvent,getListenEvent } = this.props;
        const { keepLogin, isReady, walletInfo, loading, cryptoWallet, fiatWallet, totalCryptoValue, totalCostVal, totalPnlValue, totalCoinPnlPercent, totalPnlPercent, totalFiatValue, currencyCode, isShowBalances, cryptoWalletBtc, isLeave } = this.state;

        return (
            <Container style={[styles.bgMain, { paddingBottom: 0 }]}>
                <Spiner isVisible={isReady} />
                {/* <SignalRService 
                    // getMarketData={this.onUpdateMarketData}
                    offEvent={this.state.isLeave}
                    activeTab={null}
                    listen_event={[constant.SOCKET_EVENT.MARKET_WATCH, constant.SOCKET_EVENT.PRICE_CHANGE_NOTIFY]} /> */}
                <NavigationEvents
                    onWillFocus={(payload) => {
                        getListenEvent([constant.SOCKET_EVENT.MARKET_WATCH]);
                        DeviceEventEmitter.emit('eventScreen', {name:"BALANCES"});
                        this.getDataWallet()
                        offEvent(false);
                    }}
                    onDidFocus={()=>{
                        theme.setRoot(this);
                        offEvent(false);
                        getListenEvent([constant.SOCKET_EVENT.MARKET_WATCH]);
                    }}
                    onWillBlur={() => {
                        offEvent(true);
                        getListenEvent([]);
                    }}
                />
                <HeaderFnx
                    title={'ASSET_MANAGEMENT'.t()}
                    navigation={navigation}
                    hasRight={
                        <TouchableOpacityFnx onPress={() => this.props.navigation.navigate('HistoryCoin')}>
                            <Text style={[{ fontWeight: '600' },styles.txtWhiteOpSub]}>{'HISTORY'.t()}</Text>
                        </TouchableOpacityFnx>}
                    style={{ marginLeft: -10 }}
                    colorStatus={style.bgHeader.backgroundColor}
                    backgroundHeader={styles.backgroundSub.color}
                />

                <Content
                    style={{ margin: 10 }}
                    refreshControl={
                        (
                            <RefreshControl refreshing={loading} onRefresh={this.handleRefresh} />
                        )
                    }
                    showsVerticalScrollIndicator={false}
                >

                    <View style={{ flex: 1, backgroundColor: styles.bgSub.color, borderRadius: 4 }}>
                        <View style={{ marginVertical: 10, marginHorizontal: 10, justifyContent: 'center' }}>
                            <Text style={{ color: styles.txtMainSub.color, alignSelf: "center" }}>{'ESTIMATE_TOTAL_ASSET'.t()}</Text>
                            <Item style={{
                                borderBottomColor: "#44588c",
                            }}>
                                <Body style={{ flex: 3, }}>
                                    <View style={{
                                        flexDirection: "row", justifyContent: "center",
                                        paddingVertical: 5
                                    }}>
                                        <Text style={[styles.bgBuyOldNew, { fontSize: 20, fontWeight: 'bold' }]}>
                                            {isLeave ? 0 : formatTrunc(currencyList, totalFiatValue + totalCryptoValue, 'VND')}
                                        </Text>
                                        <Text style={{
                                            color: styles.textMain.color,
                                            fontSize: 16,
                                            fontWeight: "normal",
                                            alignSelf: "flex-end"
                                        }}>{" "}
                                            {currencyCode && currencyCode}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={[{
                                            color: styles.textWhite.color,
                                            paddingBottom: 5
                                        }, Platform.OS === "ios" && stylest.fontIOS]}>
                                            {"≈ "}
                                            {isLeave ? 0 : convertToUSD(currencyCode, currencyConversion, currencyList, totalFiatValue + totalCryptoValue)}
                                            {" USD"}
                                        </Text>
                                    </View>
                                </Body>
                            </Item>
                            <Item style={{ padding: 5, alignItems: 'flex-start', borderBottomColor: "#44588c" }}>
                                <Left style={{ alignItems: 'flex-start' }}>
                                    <Text style={{ color: styles.txtMainSub.color }}>{'FIAT_WALLET_VALUE'.t()}</Text>
                                    <Text style={[styles.textWhite, { fontSize: 12, paddingVertical: 5 }]} numberOfLines={1}>{isLeave ? 0 : formatTrunc(currencyList, totalFiatValue, 'VND')}</Text>
                                </Left>
                                <Right style={{ alignItems: 'flex-start' }}>
                                    <Text style={{ color: styles.txtMainSub.color }}>{'COIN'.t()}</Text>
                                    <Text style={[styles.textWhite, { fontSize: 12, paddingVertical: 5 }]} numberOfLines={1}>{isLeave ? 0 : formatTrunc(currencyList, totalCryptoValue, 'VND')}</Text>
                                </Right>
                            </Item>
                            <View style={{
                                alignItems: "center",
                               marginTop:8
                            }}>
                                <WalletDW
                                    currencyList={currencyList}
                                    cryptoWallet={cryptoWallet}
                                    navigation={navigation}
                                    keepLogin={keepLogin}
                                />
                            </View>
                        </View>
                    </View>
                    <Item style={[style.item, { height: 40, justifyContent: "center" }]}>
                        <Left style={{
                            flex: 2
                        }}>
                            <Text style={[styles.textWhite, { fontWeight: '500' }]}>{'FIAT_WALLETS'.t()}</Text>
                        </Left>
                        <Right style={{
                            flex: 1,

                        }}>
                            <View style={{
                                width: "100%",

                            }}>
                                <View style={{
                                    height: 25,
                                    borderWidth: 0.5,
                                    borderColor: "#486db5",
                                    overflow: "hidden"
                                }}>
                                    <TextInputFnx
                                        placeholder={""}
                                        value={this.state.valueFiat}
                                        onChangeText={this.handleSearchFiat}
                                        styled={[{
                                            marginRight: 3,
                                            paddingLeft: 20,
                                            height: 35,
                                            position: "absolute",
                                            top: -4,
                                            width: "100%"
                                        },styles.textWhite]}
                                    />
                                </View>

                                <Icon name="search" size={12} style={{
                                    position: "absolute",
                                    top: "28%",
                                    left: 5
                                }} color={style.textMain.color} />
                            </View>
                        </Right>
                    </Item>
                    <View>
                        {fiatWallet && fiatWallet.length >0? fiatWallet.map((item,index)=>{
                            return (
                                <ItemWallet
                                    e={item}
                                    onNavigation={() => navigation.navigate('WalletInfoCash', { symbol: item.currency, name: item.name, fiatWallet })}
                                    name={item.name}
                                    symbol={item.currency}
                                    available={
                                        formatTrunc(currencyList, item.available, item.currency)
                                    }
                                />
                            )
                        }):null}
                       
                    </View>
                    <Item style={[style.item, { height: 40, justifyContent: "center" }]}>
                        <Left style={{
                            flex: 2
                        }}>
                            <TouchableOpacity
                                onPress={
                                    this.switchShowBtc
                                }
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center"
                                }}
                            >
                                <CheckBox
                                    checked={isShowBalances}
                                    color={'#44a250'}
                                    onPress={this.switchShowBtc}
                                    style={{
                                        borderWidth: 0.5,
                                        marginLeft: -10,
                                        borderRadius: 0,
                                    }}
                                />
                                <Text style={[styles.textWhite, { marginLeft: 20, fontWeight: '500' }]}>{`${'HIDE_SMALL_BALANCES'.t()}`}
                                </Text>
                            </TouchableOpacity>
                        </Left>
                        <Right style={{
                            flex: 1
                        }}>
                            <View style={{
                                width: "100%",

                            }}>
                                <View style={{
                                    height: 25,
                                    borderWidth: 0.5,
                                    borderColor: "#486db5",
                                    overflow: "hidden"
                                }}>
                                    <TextInputFnx
                                        placeholder={""}
                                        value={this.state.valueCoin}
                                        onChangeText={this.handleSearchCoin}
                                        styled={[{
                                            marginRight: 3,
                                            paddingLeft: 20,
                                            
                                            height: 35,
                                            position: "absolute",
                                            top: -4,
                                            width: "100%"
                                        },styles.textWhite]}
                                    />
                                </View>
                                <Icon name="search" size={12} style={{
                                    position: "absolute",
                                    top: "28%",
                                    left: 5
                                }} color={style.textMain.color} />
                            </View>
                        </Right>
                    </Item>
                    <View style={stylest.coins}>
                        {
                            (isShowBalances && cryptoWalletBtc && cryptoWallet ? cryptoWalletBtc : cryptoWallet).map((e, i) => (
                                <ItemWallet
                                    e={e}
                                    onNavigation={() => navigation.navigate('WalletInfo', {
                                        cryptoWallet,
                                        symbol: e.symbol, image: e.images, withdrawInfo: { minWithdrawal: e.minWithdrawal, transactionFee: e.transactionFee, deposit: e.deposit, withdraw: e.withdrawal }
                                    })}
                                    name={_.truncate(e.name, {
                                        length: lengthString
                                    })}
                                    symbol={e.symbol}
                                    available={
                                        formatSCurrency(currencyList, Number(e.available) + Number(e.pending), e.symbol)
                                    }
                                    key={i}
                                    hasIcon={true}
                                />
                            ))
                        }
                    </View>
                </Content>
            </Container>
        );
    }
}
const stylest = StyleSheet.create({
    fontIOS: {
        fontFamily: "Roboto"
    },
    item: {
        borderBottomWidth: 0,
        borderRadius: 2.5
    },
    total: {
        padding: 20,
        backgroundColor: '#509bff',
        borderRadius: 10,
        marginBottom: 10,
        height: height / 5,
        position: 'absolute',
        width: width - 20,
        marginRight: 10,
        marginLeft: 10
    },
    total_one: {
        padding: 20,
        backgroundColor: '#1c2840',
        borderRadius: 10,
        marginBottom: 10,
        height: height / 5 + 10,
        width: width - 50,
        marginRight: 25,
        marginLeft: 25
    },
    total_two: {
        padding: 20,
        backgroundColor: '#172136',
        borderRadius: 10,
        marginBottom: 10,
        height: height / 5 + 20,
        width: width - 80,
        marginRight: 40,
        marginLeft: 40
    },
    fiatWallet: {
        backgroundColor: '#1c2840',
        padding: 10,
        marginBottom: 5,
        borderRadius: 2.5
    },
    coins: {

    }
})
const mapStateToProps = state => {
    return {
        currencyList: state.commonReducer.currencyList,
        currencyConversion: state.tradeReducer.currencyConversion,
        walletBalanceChange: state.tradeReducer.walletBalanceChange,
        marketData:state.marketReducer.marketData
    }
}
export default connect(mapStateToProps, {getAllMarketWatch, setStatusBar,offEvent,getListenEvent })(Wallet);
