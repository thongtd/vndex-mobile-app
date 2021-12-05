import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ListView,
    FlatList,
    TouchableOpacity,
    Touchable,
    Modal,
    Image,
    Keyboard,
    TextInput,
    RefreshControl, Linking, Dimensions, Platform, ActivityIndicator, StatusBar, AppState
} from 'react-native';
import {
    Container,
    Content,
    Header,
    Left,
    Body,
    Right,
    Button,
    Item,
    Tab,
    TabHeading,
    Thumbnail,
    Tabs, Switch
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { style } from "../../config/style";
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import DepositCoin from "./Deposit/DepositCoin";
import WithdrawCoin from "./Withdraw/WithdrawCoin";
import { authService } from "../../services/authenticate.service";
import {
    convertToUSD,
    convertUTC,
    dimensions,
    formatCurrency,
    jwtDecode,
    formatSCurrency,
    to_UTCDate
} from "../../config/utilities";
import { tradeService } from "../../services/trade.service";
import { connect } from 'react-redux';
import { storageService } from "../../services/storage.service";
import { constant } from "../../config/constants";
import { getConversion } from "../../redux/action/trade.action";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CountDown from "react-native-countdown-component";
import StepIndicator from "react-native-step-indicator";
import SignalRService from "../../services/signalr.service";
import ConfirmModal from "../Shared/ConfirmModal";
import { Spiner, ModalAlert, SendEmailField, HeaderFnx } from "../Shared";
import InfoCoin from './components/InfoCoin';
import ButtonWDFnx from '../Shared/ButtonWDFnx';
import { setStatusBar, offEvent, getListenEvent } from "../../redux/action/common.action"
import { NavigationEvents } from "react-navigation";
import { setCurrencyWithdrawFiat } from '../../redux/action/wallet.action';
import Empty from '../Shared/Empty';
import { styles } from "react-native-theme"
const { height, width } = Dimensions.get('window')

class WalletInfo extends React.Component {
    constructor(props) {
        super(props);
        var d = new Date();
        var n = d.getTime();
        this.timerNow = n;
        this.timer = 500;
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.onUpdateMarketData = this.getMarketData;
        // this.onGetWalletBalanceChange = this.getWalletBalanceChange
        this.state = {
            basic: true,
            listViewData: Array(5).fill('').map((_, i) => `item #${i}`),
            modalDepositCoinVisible: false,
            modalWithdrawCoinVisible: false,
            symbol: this.props.navigation.state.params.symbol,
            withdrawInfo: this.props.navigation.state.params.withdrawInfo,
            infoCurrency: {},
            depositLog: [],
            withdrawLog: [],
            tradeCoin: [],
            currencyConversion: [],
            historyDeposit: false,
            historyWithdraw: false,
            createdDate: '',
            status: '',
            value: '',
            address: '',
            txId: '',
            userInfo: {},
            image: this.props.navigation.state.params.image,
            cancelModal: false,
            verifyCode: null,
            sessionId: null,
            timer: 60,
            seconds: 9,
            checked: false,
            checkTextChange: false,
            minute: 0,
            checkTime: false,
            // tạm thời để check count down time chờ comfirm mail
            checkCancel: false,
            invalidCode: null,
            requestId: null,
            isRefresh: false,
            statusWithdraw: null,
            h: 0,
            m: 0,
            s: 0,
            contact: false,
            currentPosition: 0,
            code: null,
            activeTab: 'O',
            isDisabled: false,
            blockchainScan: {},
            is_confirm: false,
            disabledBtn: true,
            isReady: true,
            isCheck: false,
            isLeave: false
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.walletBalanceChange !== this.props.walletBalanceChange) {
            this.onRefresh();
        }
        if (nextProps.symbol !== this.props.symbol) {
            this.setState({
                symbol: nextProps.symbol
            }, () => {
                let { cryptoWallet } = this.props.navigation.state.params;
                let data = cryptoWallet.filter(item => item.symbol == this.state.symbol);
                this.setState({
                    image: data.length > 0 ? data[0].images : ""
                })
                this.getDataWallet()
            })

        }
        if (nextProps.marketData !== this.props.marketData) {
            this.getMarketData(nextProps.marketData)
        }
    }
    listenerWalletBalanceChange = async () => {
        let { walletBalanceChangeState } = await this.state;
        let user = await jwtDecode();
        if (walletBalanceChangeState && walletBalanceChangeState.notityType === 2 && user.id == walletBalanceChangeState.accId) {
            // console.log("da vao");
            await this.setState({
                walletBalanceChangeState: null
            })
            return this.onRefresh();
        }
        // console.log("chua vao");
        return false
    }
    componentDidMount() {
        this.props.setCurrencyWithdrawFiat(this.state.symbol)
        this.getDataWallet()
        AppState.addEventListener("change", this.handleChange);
    }
    getDataWallet = async () => {
        const { withdrawInfo } = this.props.navigation.state.params;
        let user = await jwtDecode();
        let _userInfo = await storageService.getItem(constant.STORAGEKEY.USER_INFO);
        let infoCurrency = await authService.getWalletBalanceByCurrency(user.id, this.state.symbol);
        let userInfo = await authService.keepLogin(user.id);
        if (userInfo) {
            this.getDepositLog(user.id, 1, 15);
            this.getWthdrawLog(user.id, 1, 15);
            this.getMarket();
            this.getCurrencyConversion();
            this.setState({ userInfo, infoCurrency, disabledBtn: false, isReady: false, withdrawInfo })
        } else {
            this.getDepositLog(user.id, 1, 15);
            this.getWthdrawLog(user.id, 1, 15);
            this.getMarket();
            this.getCurrencyConversion();
            this.setState({ userInfo: _userInfo, infoCurrency, disabledBtn: false, isReady: false, withdrawInfo })
        }
    }

    getWalletBalanceChange = async (data) => {
        let user = await jwtDecode();
        this.getWthdrawLog(user.id, 1, 15)
    }


    deposit = () => {
        this.setState({ modalDepositCoinVisible: true, modalWithdrawCoinVisible: false })
    }

    openModalDepositCoin = (e) => {
        this.setState({ modalDepositCoinVisible: e })
    }

    toggleModalWithdrawCoin = (e) => {
        this.setState({ modalWithdrawCoinVisible: e })
    }

    getMarket = async () => {
        let response = await authService.getMarketWatch();
        const { symbol } = this.state;
        let tradeCoin = [];
        response.forEach(e => {
            e.tradingCoins.forEach(x => {
                if (x.symbol === symbol) {
                    tradeCoin.push(x)
                }
            })
        })
        this.setState({ tradeCoin })
    }
    getMarketData = (marketData) => {
        if (marketData) {
            let { tradeCoin, activeUnit } = this.state;
            for (let i in tradeCoin) {
                let item = tradeCoin[i];
                if (item.symbol === marketData.symbol && item.tradingCurrency === marketData.paymentUnit) {
                    tradeCoin[i] = Object.assign({}, item, marketData);
                    break;
                }
            }
            var d = new Date();
            var n = d.getTime();
            if (n > this.timerNow + this.timer) {
                this.timerNow = n;

                this.setState({ tradeCoin })
            }

        }
    }

    getCurrencyConversion = async () => {
        let currencyConversion = await tradeService.getCurrencyConversion();
        this.setState({ currencyConversion })
        this.props.getConversion(currencyConversion)
    }

    async getDepositLog(id, pageIndex, pageSize) {
        let depositRes = await authService.getDepositCoinLog(id, pageIndex, pageSize);
        let depositLog = depositRes.source.filter(e => e.currency === this.state.symbol);
        this.setState({ depositLog })
    }

    async getWthdrawLog(id, pageIndex, pageSize) {
        let withdrawRes = await authService.getWithdrawCoinLog(id, pageIndex, pageSize);
        let withdrawLog = withdrawRes.filter(e => e.currency === this.state.symbol);
        this.setState({ withdrawLog })
        withdrawRes.forEach(e => {
            if (e.id === this.state.requestId) {
                this.setState({ statusWithdraw: e.status })
            }
        })
        let infoCurrency = await authService.getWalletBalanceByCurrency(id, this.state.symbol);
        this.setState({ infoCurrency });
    }

    async onSentMail() {
        this.setState({ isDisabled: true, checked: true });
        let timerActive = new Date().getTime();
        this.interval = setInterval(() => {
            if (this.state.timer <= 0) {
                clearInterval(this.interval);
                this.setState({
                    checked: false,
                    timer: 60,
                    isDisabled: false,
                    verifyCode: ''
                })
            } else {
                this.setState({
                    timer: 60 - Math.round((Date.now() - timerActive) / 1000),
                })
            }
        }, 1000);
        let user = await jwtDecode();
        let response = await authService.getTwoFactorEmailCode(user.sub);
        await this.setState({ sessionId: response.data.sessionId });
    }

    cancelWithdraw = async () => {
        let { requestId, sessionId, verifyCode } = this.state;

        let user = await jwtDecode();
        let data = { accId: user.id, requestId, sessionId, verifyCode };
        let res = await authService.cancelWithdrawCoin(data)
        if (res) {
            if (res.status) {
                this.setState({
                    is_confirm: false, invalidCode: '', requestId: null, timer: 60, checked: false, verifyCode: null,
                    resultText: null,
                    resultType: null
                });
                this.getDepositLog(user.id, 1, 15);
                this.getWthdrawLog(user.id, 1, 15);
            } else {
                this.setState({ resultType: "ERROR", resultText: res.message.t() })
            }
        } else {
            this.setState({ resultType: "ERROR", resultText: "UNKNOWN_ERROR".t() })
        }
    }

    onRefresh = () => {
        this.setState({
            isRefresh: true
        })
        jwtDecode().then(async (user) => {
            if (user) {
                this.getDepositLog(user.id, 1, 15);
                this.getWthdrawLog(user.id, 1, 15);
                this.getMarket();
                let infoCurrency = await authService.getWalletBalanceByCurrency(user.id, this.state.symbol);
                this.setState({ infoCurrency });
            }
        }).then(() => {
            this.setState({
                isRefresh: false
            })
        }).catch(() => {
            this.setState({
                isRefresh: false
            })
        })

    }
    componentWillUnmount() {
        AppState.removeEventListener("change", this.handleChange);
    }
    handleChange = (appState) => {
        if (appState === "active") {
            this.onRefresh()
        }
    }
    render() {
        const { navigation, currencyList,offEvent, getListenEvent } = this.props;
        const {
            modalDepositCoinVisible, modalWithdrawCoinVisible, symbol,
            infoCurrency, depositLog, withdrawLog, tradeCoin,
            currencyConversion, historyDeposit, historyWithdraw,
            createdDate, status, value, address, txId, userInfo, isCheck,
            withdrawInfo, image, cancelModal, verifyCode, invalidCode, isRefresh, activeTab, blockchainScan, disabledBtn, isReady, contentType, content, ButtonOKText, isViewContent
        } = this.state;
        return (
            <Container style={styles.bgMain}>
                <NavigationEvents
                    onWillFocus={(payload) => {
                        offEvent(false) 
                        getListenEvent([constant.SOCKET_EVENT.MARKET_WATCH])
                    }}
                    onWillBlur={() => {
                        offEvent(true);
                        getListenEvent([])
                    }}
                />
                {/* <SignalRService
                    activeTab={null}
                    offEvent={this.state.isLeave}
                    // getMarketData={this.onUpdateMarketData}
                    // getWalletBalanceChange={this.onGetWalletBalanceChange}
                    listen_event={[constant.SOCKET_EVENT.PRICE_CHANGE_NOTIFY, constant.SOCKET_EVENT.MARKET_WATCH]}
                /> */}
                <HeaderFnx
                    hasBack
                    style={{ backgroundColor: styles.bgInfoWlWhite.color, marginLeft: 0 }}
                    title={symbol}
                    navigation={navigation}
                    isIcon={true}
                    icon={
                        <Thumbnail source={{ uri: image }} style={{ width: 20, height: 20, marginHorizontal: 10 }}
                            square />
                    }
                    colorStatus={style.colorHistory}
                />
                <Spiner isVisible={isReady} />
                <View style={{ flex: 1 }}>
                    <InfoCoin
                        currencyList={this.props.currencyList}
                        symbolCoin={symbol}
                        infoCurrency={infoCurrency} />

                    <ButtonWDFnx
                        onWithDraw={() => {
                            if (userInfo.twoFactorEnabled) {
                                navigation.navigate('WithdrawCoin', {
                                    infoCurrency,
                                    twoFactorService: userInfo.twoFactorService,
                                    withdrawInfo,
                                    modalWithdrawCoinVisible,
                                    toggleModalWithdrawCoin: this.toggleModalWithdrawCoin,
                                    _onRefresh: this.onRefresh,
                                    cryptoWallet: this.props.navigation.state.params.cryptoWallet
                                })
                            } else {
                                this.setState({ isCheck: true })
                            }
                        }}
                        onDeposit={() => {
                            navigation.navigate('DepositCoin', {
                                infoCurrency,
                                cryptoWallet: this.props.navigation.state.params.cryptoWallet
                            })
                        }}
                    />
                    <View style={stylest.history}>
                        <Text style={[styles.textWhite, { marginVertical: 10, fontWeight: 'bold' }]}>{'HISTORY'.t()}</Text>
                        <View style={[style.row, { justifyContent: "space-between" }]}>
                            <View style={[style.row, { marginBottom: 10 }]}>
                                <TouchableOpacity onPress={() => {
                                    this.setState({ activeTab: "O" })
                                }}
                                    style={[style.tabOrderHeading,
                                    {
                                        borderBottomWidth: activeTab === "O" ? 2 : 1,
                                        borderBottomColor: activeTab === "O" ? '#4272ec' : styles.txtButtonTabMainTitle.color,
                                        minWidth: 80
                                    }]}>
                                    <Text style={activeTab === 'O' ? { color: '#78afff', fontSize: 13 } : styles.txtMainTitle}>{'DEPOSITS'.t().toUpperCase()}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    this.setState({ activeTab: "R" })
                                }}
                                    style={[style.tabOrderHeading,
                                    { borderBottomWidth: activeTab === "R" ? 2 : 1, borderBottomColor: activeTab === "R" ? '#4272ec' : styles.txtButtonTabMainTitle.color, minWidth: 80 }]}>
                                    <Text style={activeTab === 'R' ? { color: '#78afff', fontSize: 13 } : styles.txtMainTitle}>{'WITHDRAWALS'.t().toUpperCase()}</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity style={{
                                    flexDirection: "row", marginTop: 5
                                }} onPress={() => {
                                    navigation.navigate("HistoryCoin")
                                }}>
                                    <Text style={styles.txtWhiteOpSub}>{'ShowMore'.t()}</Text>
                                    <Icon style={{
                                        paddingLeft: 5,
                                        marginTop: 3
                                    }} name={"chevron-right"} size={12} color={style.textWhiteOp.color} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <Content
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={isRefresh} onRefresh={this.onRefresh} />}
                    >
                        <View style={[styles.bgMain]}>
                            {
                                activeTab === 'O' ?
                                    depositLog.length > 0 ?
                                        <SwipeListView
                                            dataSource={this.ds.cloneWithRows(depositLog)}
                                            renderRow={data => (
                                                <Item style={{
                                                    backgroundColor: styles.bgSub.color,
                                                    marginTop: 7.5,
                                                    marginLeft: 10,
                                                    marginRight: 10,
                                                    height: 60,
                                                    borderBottomWidth: 0,
                                                    paddingHorizontal: 10
                                                }}
                                                    onPress={() => navigation.navigate('HistoryDepositCoin', { data })}
                                                >
                                                    <Left style={{}}>

                                                        <Text style={styles.txtMainSub}>{to_UTCDate(data.createdDate, 'DD/MM/YYYY hh:mm:ss')}</Text>
                                                    </Left>
                                                    <Body style={{ alignItems: 'flex-start' }}>
                                                        <Text style={styles.txtMainSub}>{'STATUS'.t()}</Text>
                                                        <Text
                                                            style={data.status == 4 ? styles.bgBuyOldNew : (data.status == 5 || data.status == 6) ? styles.bgSellOldNew : (data.status == 3) ? { color: "#f9ca07" } : styles.textWhite}>{`${data.statusLable.toUpperCase()}`.t()}</Text>
                                                    </Body>
                                                    <Right style={{ alignItems: 'flex-end' }}>
                                                        <Text style={[styles.textWhite, { fontWeight: "bold" }]}>{data.currency}</Text>
                                                        <Text
                                                            style={styles.textWhite}>{formatCurrency(data.amount, 8)}</Text>
                                                    </Right>
                                                </Item>
                                            )}
                                            rightOpenValue={-50}
                                            disableLeftSwipe={true}
                                            disableRightSwipe={true}
                                        />
                                        :
                                        <Empty style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: 100
                                        }} />
                                    : null
                            }
                            {
                                activeTab === 'R' ?
                                    withdrawLog.length > 0 ?
                                        <SwipeListView
                                            // useFlatList
                                            dataSource={this.ds.cloneWithRows(withdrawLog)}
                                            renderRow={data => (
                                                <Item style={{
                                                    backgroundColor: styles.bgSub.color,
                                                    marginTop: 7.5,
                                                    marginLeft: 10,
                                                    marginRight: 10,
                                                    height: 60,
                                                    borderBottomWidth: 0,
                                                    paddingHorizontal: 10
                                                }}
                                                    onPress={() => {
                                                        if (userInfo.twoFactorEnabled) {
                                                            navigation.navigate('HistoryWithdrawCoin', { data })
                                                        } else {
                                                            this.setState({ cancelModal: true })
                                                        }
                                                    }}
                                                >
                                                    <Left style={{}}>

                                                        <Text style={styles.txtMainSub}>{to_UTCDate(data.createdDate, 'DD/MM/YYYY hh:mm:ss')}</Text>
                                                    </Left>
                                                    <Body style={{ alignItems: 'flex-start' }}>
                                                        <Text style={styles.txtMainSub}>{'STATUS'.t()}</Text>
                                                        <Text
                                                            style={data.status == 4 ? styles.bgBuyOldNew : (data.status == 5 || data.status == 6) ? styles.bgSellOldNew : (data.status == 3) ? { color: "#f9ca07" } : styles.textWhite}>{`${data.statusLable.toUpperCase()}`.t()}</Text>
                                                    </Body>
                                                    <Right style={{ alignItems: 'flex-end' }}>
                                                        <Text style={[styles.textWhite, { fontWeight: "bold" }]}>{data.currency}</Text>
                                                        <Text
                                                            style={styles.textWhite}>{formatSCurrency(currencyList, data.amount, data.currency)}</Text>
                                                    </Right>
                                                </Item>
                                            )}
                                            renderHiddenRow={(data, secId, rowId, rowMap) => (
                                                (data.status == 1 || data.status == 2) &&
                                                <Item style={{
                                                    backgroundColor: styles.bgSellOldNew.color,
                                                    marginTop: 7.5,
                                                    marginLeft: 10,
                                                    marginRight: 10,
                                                    height: 60,
                                                    borderBottomWidth: 0
                                                }}
                                                    onPress={() => {
                                                        if (userInfo.twoFactorEnabled) {
                                                            this.setState({
                                                                is_confirm: true,
                                                                requestId: data.id,
                                                                contentType: "CANCEL_ORDERS".t(),
                                                                content: "CONFIRM_TO_CANCEL_WIHTDRAWAL_REQUEST".t(),
                                                                ButtonOKText: "OK".t(),
                                                                isViewContent: false
                                                            })
                                                        } else {
                                                            this.setState({ cancelModal: true })
                                                        }
                                                    }}
                                                >
                                                    <Left />
                                                    <Body />
                                                    <Right style={{ marginRight: 15 }}>
                                                        <Icon name={'trash'} color={'#fff'} size={20} />
                                                    </Right>
                                                </Item>
                                            )}
                                            rightOpenValue={-50}
                                        />
                                        :
                                        <Empty style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: 100
                                        }} />
                                    : null
                            }
                            <View style={[stylest.tradeCoin, { margin: 10 }]}>
                                <Text style={[styles.textWhite, { fontWeight: 'bold', marginBottom: 10 }]}>{'TRADE'.t()}</Text>
                                <FlatList
                                    data={tradeCoin}
                                    renderItem={({ item, index }) => (
                                        <TouchableOpacity style={{
                                            borderBottomWidth: 0,
                                            padding: 10,
                                            flex: index % 2 === 0 ? 0 : 1,
                                            marginEnd: 2.5,
                                            marginBottom: 2.5,
                                            backgroundColor: styles.bgSub.color,
                                            width: '50%'
                                        }}
                                            onPress={() => navigation.navigate('Trade', { tradingCoin: item })}
                                        >
                                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                                <Text style={[styles.textWhite, { fontWeight: 'bold', fontSize: 15 }]}>{item.symbol}</Text>
                                                <Text style={[styles.txtMainSub,{fontSize:12, alignSelf: "flex-end"}]}>{" "}/{" "}{item.tradingCurrency}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                                                <Text style={[styles.bgBuyOldNew, { fontSize: 12 }]}>
                                                    {formatSCurrency(currencyList, item.lastestPrice, item.tradingCurrency)}
                                                </Text>
                                                <Text style={[styles.txtMainSub, { fontSize: 12 }]}>
                                                    $ {convertToUSD(item.tradingCurrency, currencyConversion, currencyList, item.lastestPrice)}
                                                </Text>

                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    scrollEnabled={false}
                                    numColumns={2}
                                    extraData={this.state}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                        </View>
                    </Content>
                </View>


                <ConfirmModal visible={isCheck} title={"2FA_REQUIRED".t()}
                    content={"2FA_REQUIRED_CONTENT".t()}
                    onClose={() => this.setState({
                        isCheck: false,
                    })} onOK={() => navigation.navigate('Account')}
                    resultText={this.state.resultText}
                    resultType={this.state.resultType}
                    ButtonOKText={"Enable 2FA".t()}
                    ButtonCloseText={"CLOSE".t()}
                />

                <ModalAlert
                    visible={this.state.is_confirm}
                    contentType={contentType}
                    content={content}
                    ButtonOKText={ButtonOKText}
                    onClose={() => {
                        this.setState({
                            is_confirm: false,
                            isViewContent: false,
                            verifyCode: null,
                            resultText: null,
                            resultType: null
                        })
                    }}
                    resultText={this.state.resultText}
                    resultType={this.state.resultType}
                    isViewContent={isViewContent}
                    viewContent={(
                        <View>
                            {
                                userInfo.twoFactorService === constant.TWO_FACTOR_TYPE.EMAIL_2FA ?
                                    <SendEmailField
                                        titleBtn={"SEND_EMAIL".t()}
                                        placeholder={'EMAIL_VERIFICATION'.t()}
                                        onChangeText={(text) => this.setState({ verifyCode: text })}
                                        value={this.state.verifyCode}
                                        checked={this.state.checked}
                                        onSend={
                                            () => {
                                                this.onSentMail(), this.setState({ checked: true })
                                            }
                                        }
                                        timer={this.state.timer}
                                    />
                                    :
                                    <View>
                                        <TextInput
                                            allowFontScaling={false}
                                            style={[style.inputView, {
                                                backgroundColor: "transparent",
                                                color: styles.textWhite.color,
                                                borderWidth: 0.5, borderColor: style.colorBorderBox, borderBottomWidth: 0.5
                                            }]}
                                            placeholder={'GOOGLE_AUTHENTICATION_CODE'.t()}
                                            placeholderTextColor={styles.textMain.color}
                                            keyboardType={'numeric'}
                                            onChangeText={(text) => this.setState({ verifyCode: text })}
                                            value={this.state.verifyCode} />
                                    </View>
                            }
                        </View>
                    )}
                    onOK={() => {
                        if (isViewContent === true) {
                            return this.cancelWithdraw()
                        } else {
                            this.setState({
                                content: null,
                                isViewContent: true
                            })
                        }
                    }}
                />
            </Container>
        )
    }
}

const stylest = StyleSheet.create({
    info: {
        flexDirection: "column",
        paddingHorizontal: 30,
    },
    fund: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: "space-between"
        // padding: 10,
    },
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2.5,
        height: 60,
        width: "50%"
    },
    history: {
        // marginLeft: 5,
        // marginRight: 5,
        // flex: 1,
        paddingHorizontal: 10,
    },
    item: {
        borderBottomWidth: 0,
        padding: 5,
        flex: 1,
        backgroundColor: '#1c2840',
        margin: 5
    },
    itemTab: {
        borderBottomWidth: 0,
    },
    rowBack: {
        width: 70,
        backgroundColor: '#c5321e'
    },
    tradeCoin: {},
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#00000090',
    },
    activityIndicatorWrapper: {
        backgroundColor: '#192240',
        width: dimensions.width - 20,
        padding: 15,
        display: 'flex',
        justifyContent: 'space-between'
    },
    input: {
        backgroundColor: '#19243a',
        borderRadius: 2,
        height: 40,
        justifyContent: 'center'
    },
    img: {
        // flex: 1,
        // borderRadius: 2.5,
        height: "120%",
        width: 50,
        opacity: 0.2,
        marginTop: 13,
        marginLeft: 5
        // position:"absolute",
        // left:0
    }
})
const mapStateToProps = (state) => {
    return {
        symbol: state.walletReducer.currency,
        statusBar: state.commonReducer.statusBar,
        marketData: state.marketReducer.marketData,
        currencyList: state.commonReducer.currencyList,
        walletBalanceChange: state.tradeReducer.walletBalanceChange,
        marketData:state.marketReducer.marketData
    }
}
export default connect(mapStateToProps, { offEvent, getListenEvent,getConversion, setCurrencyWithdrawFiat, setStatusBar })(WalletInfo);