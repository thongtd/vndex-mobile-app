import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ListView,
    TouchableOpacity,
    Image,
    TextInput,
    RefreshControl,
    Dimensions,
    ActivityIndicator,
    Platform,
    StatusBar,
    AppState
} from 'react-native';
import { Container, Content, Header, Left, Body, Right, Button, Item, Picker, Tab, TabHeading, Tabs } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { style } from "../../config/style";
import { SwipeListView } from 'react-native-swipe-list-view';
import { dimensions, formatTrunc, jwtDecode, to_UTCDate } from "../../config/utilities";
import { authService } from "../../services/authenticate.service";
import Check2FA from "./Withdraw/Check2FA";
import WithdrawCast from "./Withdraw/WithdrawCast";
import connect from "react-redux/es/connect/connect";
import { getConversion } from "../../redux/action/trade.action";
import ConfirmModal from "../Shared/ConfirmModal";
import { constant } from "../../config/constants";
import SignalRService from "../../services/signalr.service";
import { getDepositLog, getWithdrawLog, setCurrencyWithdrawFiat } from "../../redux/action/wallet.action";
import { ModalAlert, SendEmailField } from "../Shared"
import {
    HeaderFnx,
    Spiner
} from "../Shared"
import ButtonWDFnx from '../Shared/ButtonWDFnx';
import { setStatusBar, noticeChange } from "../../redux/action/common.action"
const { height, width } = Dimensions.get('window')
import { NavigationEvents } from "react-navigation"
import Empty from '../Shared/Empty';
import {styles} from "react-native-theme"
class WalletInfoCash extends PureComponent {
    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            basic: true,
            listViewData: Array(5).fill('').map((_, i) => `item #${i}`),
            modalDepositCashVisible: false,
            modalWithdrawCashVisible: false,
            symbol: this.props.navigation.state.params.symbol,
            nameCurrency: this.props.navigation.state.params.name,
            infoCurrency: {
                available: 0,
                pending: 0,
                totalDeposit: 0,
                totalWithdrawal: 0,
                symbol: ''
            },
            depositLog: [],
            withdrawLog: [],
            bankInfo: {},
            listBank: [],
            visibleCastDeposit: false,
            visibleCastWithdraw: false,
            userInfo: {},
            isCheck: false,
            loading: false,
            cancelId: '',
            openCancel: false,
            confirm: null,
            depositData: null,
            activeTab: 'O',
            vertifyCode: '',
            openCancelWithdraw: false,
            cancelRow: {},
            name: '',
            timer: 60,
            checked: false,
            sessionId: "",
            isReady: true,
            isStart: false
        };
    }
  
    async componentDidMount() {
        AppState.addEventListener("change", this.handleChange);
         this.setState({
            isStart: true
        })
        // this.props.getDepositLog(1, 15, this.state.symbol);
        // this.props.getWithdrawLog(1, 15, this.state.symbol);
        // this.getBankCurrencyCode(this.state.symbol);
        // this.getWalletBalanceByCurrency();
        // let user = await jwtDecode();
        // console.log(user, "user");
        // if (user) {
        //     this.getDepositBankAccount(this.state.symbol, user.id);
        //     authService.keepLogin(user.id).then(res => {
        //         console.log(res, "response")
        //         this.setState({ userInfo: res, loading: false, isReady: false })
        //     }).catch(err => console.log(err, "err user"))
        // }
        // this.props.setCurrencyWithdrawFiat(this.props.navigation.state.params.symbol);
        // this.getNameCoin();

    }
    getNameCoin = () => {
        let { fiatWallet } = this.props.navigation.state.params;
        let { symbol } = this.state;
        let data = fiatWallet.filter((o, i) => o.currency === symbol);
        if (data.length > 0) {
            this.setState({
                nameCurrency: data[0].name
            })
        }
    }

    async onSentMail() {
        this.setState({ checked: true });
        let timerActive = new Date().getTime();
        this.interval = setInterval(() => {
            if (this.state.timer <= 0) {
                clearInterval(this.interval);
                this.setState({
                    checked: false,
                    timer: 60,
                })
            } else {
                this.setState({
                    timer: 60 - Math.round((Date.now() - timerActive) / 1000),
                })
            }
        }, 1000);
        let user = await jwtDecode();
        let response = await authService.getTwoFactorEmailCode(user.sub);
        if (response.status === 200) {
            this.setState({ sessionId: response.data.sessionId });
        }
    }

    getWalletBalanceByCurrency() {
        jwtDecode().then(user => {
            if (user) {
                authService.getWalletBalanceByCurrency(user.id, this.state.symbol).then(infoCurrency => {
                    this.setState({ infoCurrency, loading: false })
                }
                )
            }
        }).catch(err => console.log(err))
    }

    openModalDepositCash = (data) => {
        let { infoCurrency } = this.state;
        let { currencyList } = this.props;
        console.log(data, "dataInfo");
        if (data !== null) {
            if (data.status === constant.PAYMENT_STATUS.Open
                || data.status === constant.PAYMENT_STATUS.Pending) {

                this.props.navigation.navigate("FiatDeposit", {
                    depositData: data,
                    depositStep: 3,
                    symbol: this.state.symbol
                })
            }
            else {
                this.props.navigation.navigate("FiatDeposit", {
                    depositData: data,
                    depositStep: 2,
                    symbol: this.state.symbol,
                    status: data.status,
                })
            }
        }
        else {
            this.props.navigation.navigate("FiatDeposit", {
                depositData: data,
                depositStep: 1,
                symbol: this.state.symbol,
                available: formatTrunc(currencyList, infoCurrency.available, infoCurrency.symbol)
            })
        }
    }

    openModalWithdrawCash = () => {
        const { symbol, userInfo } = this.state;
        if (userInfo && userInfo.twoFactorEnabled) {
            // this.setState(this.resetAll());
            this.props.navigation.navigate("WithdrawCast", {
                symbol,
                userInfo,
                type: 0
            });
        } else {
            this.setState({ isCheck: true })
        }
    }

    resetAll() {
        return (previousState, currentProps) => {
            return {
                ...previousState,
                estimatedTime: '',
                currentPosition: 0,
                amount: '0',
                messageText: '',
                messageType: '',
                openCancel: false,
                isCheck: false,
                depositStep: 1
            };
        };
    }

    getDepositBankAccount = async (currencyCode, accId) => {
        console.log(currencyCode, accId);
        try {
            let bankInfo = await authService.getDepositBankAccount(currencyCode, accId);
            this.setState({ bankInfo })
        } catch (error) {
            console.log(error, "error");
        }

    }

    getBankCurrencyCode = async (currencyCode) => {
        let listBank = await authService.getBankByCurrencyCode(currencyCode);
        this.setState({ listBank })
    }
    openWithdrawInfo = async (data) => {
        let user = await jwtDecode();
        if (user) {
            authService.getFiatRequest(user.id, data.id).then(val => {
                let currentRequest = Object.assign(val, {}, {
                    estimatedTime: val.ttl || '00:00:00',
                    currentPosition: val.status >= 4 ? 4 : val.status,
                    amount: data.amount,
                    messageText: val.status === 6 ? "WITHDRAWALS_REJECT_MESSAGE".t() : (val.status === 5 ? "WITHDRAWAL_CANCEL".t() : (val.status === 4 ? "WITHDRAWAL_SUCCESS".t() : '')),
                    messageType: (val.status === 6 || val.status === 5) ? "E" : 'S',
                    loadWithdrawType: 1,
                    selectedUnit: this.state.symbol,
                    data: data
                })
                this.props.navigation.navigate("WithdrawCast", { currentRequest, userInfo: this.state.userInfo })
            })
        }
    }

    cancelDepositFiat() {
        let id = this.state.cancelId
        authService.cancelDepositFiat(id).then(res => {
            if (res) {
                if (res.result.status) {
                    this.setState({
                        openCancel: false
                    });
                    this.props.getDepositLog(1, 15, this.state.symbol);
                }
            }
        })
    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps, "next Props wallet");
        if (nextProps.getNoticeChange === 2) {
            this.onRefresh();
            this.props.noticeChange(1);
        }
        // if (nextProps.currency !== this.state.symbol) {
        //     this.setState({
        //         symbol: nextProps.currency
        //     }, () => this.onRefresh())
        // }
    }
    componentDidUpdate(prevProps, prevState) {
        console.log(prevState,"prevState");
        if (prevProps.walletBalanceChange !== this.props.walletBalanceChange) {
            this.onRefresh();
        }
        if(prevState.isStart !== this.state.isStart && this.state.isStart === true){
            console.log("vao dau");
            this.getData();
        }else if(!this.state.isStart && prevProps.currency !== this.props.currency){
            console.log("vao sau");
            this.setState({
                symbol: this.props.currency
            }, () => this.onRefresh())
        }
    }
    getData=async()=>{
        this.props.getDepositLog(1, 15, this.state.symbol);
            this.props.getWithdrawLog(1, 15, this.state.symbol);
            this.getBankCurrencyCode(this.state.symbol);
            this.getWalletBalanceByCurrency();
            let user = await jwtDecode();
            console.log(user, "user");
            if (user) {
                this.getDepositBankAccount(this.state.symbol, user.id);
                authService.keepLogin(user.id).then(res => {
                    console.log(res, "response")
                    this.setState({ userInfo: res, loading: false, isReady: false })
                }).catch(err => console.log(err, "err user"))
            }
            this.props.setCurrencyWithdrawFiat(this.props.navigation.state.params.symbol);
            this.getNameCoin();
    }
    onRefresh = () => {
        this.getWalletBalanceByCurrency();
        this.props.getDepositLog(1, 15, this.state.symbol);
        this.props.getWithdrawLog(1, 15, this.state.symbol);
        this.getNameCoin();
    }

    openDepositInfo = (data) => {
        this.openModalDepositCash(data);
    }
    componentWillUnmount = () => {
        AppState.removeEventListener("change", this.handleChange)
    };
    handleChange = (appState) => {
        if (appState === "active") {
            this.setState({ loading: true });
            this.onRefresh()
        }
    }
    async cancelWithdrawFiat(data) {
        // console.log("cliked aside");
        const acc = await jwtDecode();
        if (acc) {
            const { vertifyCode, sessionId } = this.state;
            authService.cancelWithdrawFiat(acc.id, sessionId, data.id, vertifyCode).then(res => {
                if (res) {
                    if (res.status) {
                        this.onRefresh()
                        // this.props.getWithdrawLog(1, 15, this.state.symbol);
                        this.setState({
                            vertifyCode: null, isModal: false, timer: 60,
                            checked: false,
                            resultText: null,
                            resultType: null
                        })
                    }
                    else {
                        this.setState({ resultType: "ERROR", resultText: res.message.t() })
                    }
                } else {
                    this.setState({ resultType: "ERROR", resultText: "UNKNOWN_ERROR".t() })
                }
            })
        }

    }

    render() {
        const { navigation, currencyList } = this.props;
        const { activeTab, contentType, content, ButtonOKText, isViewContent, nameCurrency } = this.state;
        const { infoCurrency, symbol, isCheck, loading, openCancel, isReady, userInfo, isModal } = this.state;
        const { withdrawLog, depositLog } = this.props;
        // console.log(this.state.userInfo,"userinfo");
        console.log(this.props.navigation.state.params, "params goback");

        return (
            <Container style={styles.bgMain}>
                {/* <SignalRService
                    getWalletBalanceChange={(data) => console.log(data, "kakak data")}
                    listen_event={[constant.SOCKET_EVENT.PRICE_CHANGE_NOTIFY]} /> */}
                <NavigationEvents
                    onWillBlur={(payload) => {
                        this.setState({
                            isStart:false
                        })
                    }}
                />
                <HeaderFnx
                    colorStatus={style.colorHistory}
                    navigation={navigation}
                    style={{ marginLeft: 0, backgroundColor: styles.bgInfoWlWhite.color, borderBottomWidth: 0 }}
                    hasBack title={`${symbol}-${nameCurrency}`} />
                {/* <StatusBar backgroundColor={'#162a4f'} barStyle="light-content" /> */}

                <Spiner isVisible={isReady} />

                <View style={{ flex: 1 }}>
                    <View style={{
                        backgroundColor: styles.bgInfoWlWhite.color,
                        height: height / 6 + 10,
                        width: width,
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10
                    }}>
                        <View style={stylest.info}>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={[styles.txtMainTitle, { paddingVertical: 2.5 }]}>{'AVAILABLE'.t()}</Text>
                                <Text
                                    style={[styles.textWhite, { paddingVertical: 2.5, paddingBottom: 7.5 }]}>{formatTrunc(currencyList, infoCurrency.available, infoCurrency.symbol)}</Text>
                                <Text style={[styles.txtMainTitle, { paddingVertical: 2.5 }]}>{'DEPOSITS'.t()}</Text>
                                <Text
                                    style={styles.textWhite}>{formatTrunc(currencyList, infoCurrency.totalDeposit, infoCurrency.symbol)}</Text>
                            </View>
                            <View style={{ flex: 1, marginLeft: 30, justifyContent: 'center' }}>
                                <Text style={[styles.txtMainTitle, { paddingVertical: 2.5, }]}>{'PENDING'.t()}</Text>
                                <Text
                                    style={[styles.textWhite, { paddingVertical: 2.5, paddingBottom: 7.5 }]}>{formatTrunc(currencyList, infoCurrency.pending, infoCurrency.symbol)}</Text>
                                <Text style={[styles.txtMainTitle, { paddingVertical: 2.5 }]}>{'WITHDRAWALS'.t()}</Text>
                                <Text
                                    style={styles.bgBuyOldNew}>{formatTrunc(currencyList, infoCurrency.totalWithdrawal, infoCurrency.symbol)}</Text>
                            </View>
                        </View>
                    </View>
                    <ButtonWDFnx
                        onDeposit={() => this.openModalDepositCash(null)}
                        onWithDraw={() => this.openModalWithdrawCash()}
                    />
                    <View style={stylest.history}>
                        <Text style={[styles.textWhite, { marginBottom: 10, fontWeight: 'bold' }]}>{'HISTORY'.t()}</Text>
                        <View style={[style.row, { justifyContent: "space-between" }]}>
                            <View style={[style.row, { justifyContent: 'flex-start', alignItems: 'center', }]}>
                                <TouchableOpacity onPress={() => {
                                    this.setState({ activeTab: "O" })
                                }}
                                    style={[style.tabOrderHeading, {
                                        minWidth: 80,
                                        borderBottomWidth: activeTab === "O" ? 2 : 1,
                                        borderBottomColor: activeTab === "O" ? '#4272ec' :  styles.txtButtonTabMainTitle.color
                                    }]}>
                                    <Text style={activeTab === 'O' ? {
                                        color:  style.textMain.color,
                                        fontSize: 13
                                    } : styles.txtMainTitle}>{'DEPOSITS'.t().toUpperCase()}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    this.setState({ activeTab: "R" })
                                }}
                                    style={[style.tabOrderHeading, {
                                        minWidth: 80,
                                        borderBottomWidth: activeTab === "R" ? 2 : 1,
                                        borderBottomColor: activeTab === "R" ? '#4272ec' :  styles.txtButtonTabMainTitle.color
                                    }]}>
                                    <Text style={activeTab === 'R' ? {
                                        color:  style.textMain.color,
                                        fontSize: 13
                                    } :styles.txtMainTitle}>{'WITHDRAWALS'.t().toUpperCase()}</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity style={{
                                    flexDirection: "row", marginTop: 5
                                }} onPress={() => {
                                    navigation.navigate("HistoryCoin",{
                                        isCash:true
                                    })
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
                    <Content refreshing={loading}
                        refreshControl={<RefreshControl refreshing={loading} onRefresh={this.onRefresh} />}>
                        {
                            activeTab === 'O' ?
                                depositLog.length > 0 ?
                                    <SwipeListView
                                        dataSource={this.ds.cloneWithRows(depositLog)}
                                        disableRightSwipe={true}
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
                                                onPress={() => this.openDepositInfo(data)}
                                            >
                                                <Left>
                                                    <Text
                                                        style={[styles.txtMainSub, { lineHeight: 19 }]}>{to_UTCDate(data.createdDate, 'DD/MM/YYYY hh:mm:ss')}</Text>
                                                </Left>
                                                <Body style={{ alignItems: 'flex-start' }}>
                                                    <Text style={[styles.txtMainSub]}>{'STATUS'.t()}</Text>
                                                    <Text
                                                        style={data.status == 4 ? styles.bgBuyOldNew : (data.status == 5 || data.status == 6) ? styles.bgSellOldNew : (data.status == 3) ? { color: "#f9ca07" } : styles.textWhite}>
                                                        {`${data.statusLable.toUpperCase()}`.t()}</Text>
                                                </Body>
                                                <Right style={{}}>
                                                    <Text style={[styles.textWhite, { fontWeight: "bold" }]}>{symbol}</Text>
                                                    <Text
                                                        style={styles.textWhite}>{formatTrunc(currencyList, data.amount, symbol)}</Text>
                                                </Right>
                                            </Item>
                                        )}
                                        renderHiddenRow={(data, secId, rowId, rowMap) => {
                                            console.log(data.status, "status")
                                            if (data.status !== constant.PAYMENT_STATUS.Cancelled
                                                && data.status !== constant.PAYMENT_STATUS.Completed
                                                && data.status !== constant.PAYMENT_STATUS.Processing
                                                && data.status !== constant.PAYMENT_STATUS.Rejected && data.status !== 7) {
                                                return (
                                                    <Item style={{
                                                        backgroundColor: '#ff315d',
                                                        marginTop: 7.5,
                                                        marginLeft: 10,
                                                        marginRight: 10,
                                                        height: 60,
                                                        borderBottomWidth: 0
                                                    }}
                                                        onPress={() => this.setState({ openCancel: true, cancelId: data.id })}
                                                    >
                                                        <Left />
                                                        <Body />
                                                        <Right style={{ marginRight: 15 }}>
                                                            <Icon name={'trash'} color={'#fff'} size={20} />
                                                        </Right>
                                                    </Item>
                                                )
                                            }
                                        }}
                                        rightOpenValue={-50}
                                    />
                                    :
                                    <Empty style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: 80
                                    }} />
                                : null
                        }
                        {
                            activeTab === 'R' ?
                                withdrawLog.length > 0 ?
                                    <SwipeListView
                                        dataSource={this.ds.cloneWithRows(withdrawLog)}
                                        disableRightSwipe={true}
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
                                                onPress={() => this.openWithdrawInfo(data)}
                                            >
                                                <Left style={{}}>
                                                    {/*<Text style={styles.textWhite}>{data.currency}</Text>*/}
                                                    <Text
                                                        style={[styles.txtMainSub, { lineHeight: 19 }]}>{to_UTCDate(data.createdDate, 'DD/MM/YYYY hh:mm:ss')}</Text>
                                                </Left>
                                                <Body style={{ alignItems: 'flex-start' }}>
                                                    <Text style={[styles.txtMainSub]}>{'STATUS'.t()}</Text>
                                                    <Text
                                                        style={data.status == 4 ? styles.bgBuyOldNew : (data.status == 5 || data.status == 6) ? styles.bgSellOldNew : (data.status == 3) ? { color: "#f9ca07" } : styles.textWhite}>{`${data.statusLable.toUpperCase()}`.t()}</Text>
                                                </Body>
                                                <Right style={{}}>
                                                    <Text style={styles.txtMainSub}>{'VALUE'.t()} ({symbol})</Text>
                                                    <Text
                                                        style={styles.textWhite}>{formatTrunc(currencyList, data.amount && data.amount, this.state.symbol)}</Text>
                                                </Right>
                                            </Item>
                                        )}
                                        renderHiddenRow={(data, secId, rowId, rowMap) => (
                                            // <React.Fragment>
                                            //     {
                                            (data.status !== constant.PAYMENT_STATUS.Cancelled
                                                && data.status !== constant.PAYMENT_STATUS.Completed
                                                && data.status !== constant.PAYMENT_STATUS.Processing
                                                && data.status !== constant.PAYMENT_STATUS.Rejected) &&
                                            <Item style={{
                                                backgroundColor: '#ff315d',
                                                marginTop: 7.5,
                                                marginLeft: 10,
                                                marginRight: 10,
                                                height: 60,
                                                borderBottomWidth: 0
                                            }}
                                                onPress={() => {
                                                    this.setState({
                                                        isModal: true,
                                                        contentType: "CANCEL_WITHDRAWALS_REQUEST".t(),
                                                        content: "CONFIRM_TO_CANCEL_WIHTDRAWAL_REQUEST".t(),
                                                        ButtonOKText: "OK".t(),
                                                        cancelRow: data,
                                                        isViewContent: false
                                                    })
                                                }}
                                            >
                                                <Left />
                                                <Body />
                                                <Right style={{ marginRight: 15 }}>
                                                    <Icon name={'trash'} color={'#fff'} size={20} />
                                                </Right>
                                            </Item>
                                            //     }
                                            // </React.Fragment>

                                        )}
                                        rightOpenValue={-50}
                                    />
                                    :
                                    <Empty style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: 80
                                    }} />
                                    : null
                        }
                    </Content>
                </View>


                <ConfirmModal
                    visible={isCheck}
                    title={"2FA_REQUIRED".t()}
                    content={"2FA_REQUIRED_CONTENT".t()}
                    onClose={() => this.setState({
                        isCheck: false,
                    })}
                    onOK={() => navigation.navigate('Account')}
                    resultText={this.state.resultText}
                    resultType={this.state.resultType}
                    ButtonOKText={"Enable 2FA".t()}
                    ButtonCloseText={"CLOSE".t()}
                />

                <ConfirmModal visible={openCancel} title={"CANCEL_DEPOSIT_FIAT".t()}
                    content={"CANCEL_DEPOSIT_FIAT_CONFIRM".t()}
                    onClose={() => this.setState({
                        openCancel: false,
                        vertifyCode: null,
                        messageText: null,
                        resultType: null,
                        resultText: null,
                    })} onOK={() => this.cancelDepositFiat()}
                    resultText={this.state.resultText}
                    resultType={this.state.resultType} ButtonOKText={"OK".t()}
                    ButtonCloseText={"CLOSE".t()}
                />

                <ModalAlert
                    visible={isModal}
                    contentType={contentType}
                    content={content}
                    ButtonOKText={ButtonOKText}
                    onClose={() => {
                        this.setState({
                            isModal: false,
                            isViewContent: false,
                            vertifyCode: null,
                            messageText: null,
                            resultType: null,
                            resultText: null,
                        })
                    }}
                    resultText={this.state.resultText}
                    resultType={this.state.resultType}
                    isViewContent={isViewContent}
                    viewContent={(
                        <View>
                            {
                                userInfo && userInfo.twoFactorService === constant.TWO_FACTOR_TYPE.EMAIL_2FA ?
                                    <SendEmailField
                                        titleBtn={"SEND_EMAIL".t()}
                                        placeholder={"PLEASE_INPUT_YOUR_2FA_CODE".t()}
                                        onChangeText={(text) => this.setState({ vertifyCode: text })}
                                        value={this.state.vertifyCode}
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
                                            style={[style.inputView,{
                                                color: styles.textWhite.color,
                                                backgroundColor:"transparent",
                                                borderWidth:0.5,borderColor:style.colorBorderBox,borderBottomWidth:0.5 
                                            }]}
                                            placeholder={"INPUT_YOUR_2FA_CODE_GG".t()}
                                            placeholderTextColor={styles.txtMainSub.color}
                                            keyboardType={'numeric'}
                                            onChangeText={(text) => this.setState({ vertifyCode: text })}
                                            value={this.state.vertifyCode} />
                                    </View>
                            }
                        </View>
                    )}
                    onOK={() => {
                        if (isViewContent === true) {
                            return this.cancelWithdrawFiat(this.state.cancelRow)
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
        flexDirection: 'row',
        paddingHorizontal: 30,
        marginBottom: 5
    },
    fund: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2.5,
        height: 60,
        width: "50%"
    },
    history: {
        paddingHorizontal: 10,
        marginBottom: 5,
        marginTop: 10
        //flex: 1,
    },
    item: {
        borderBottomWidth: 0,
        padding: 5,
        flex: 1,
        // backgroundColor: "",
        margin: 5
    },
    rowBack: {
        width: 70,
        backgroundColor: '#c5321e'
    },
    tradeCoin: {
        padding: 10,
        flex: 1
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#0e1021',
    },
    activityIndicatorWrapper: {
        backgroundColor: '#192240',
        width: dimensions.width - 20,
        height: dimensions.height / 1.5,
        // borderRadius: 10,
        padding: 10,
        display: 'flex',
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    img: {
        height: "120%",
        width: 50,
        opacity: 0.2,
        marginTop: 13,
        marginLeft: 5
    }
})
const mapStateToProps = (state) => {
    return {
        statusBar: state.commonReducer.statusBar,
        currencyList: state.commonReducer.currencyList,
        walletBalanceChange: state.tradeReducer.walletBalanceChange,
        withdrawLog: state.walletReducer.withdrawLog,
        depositLog: state.walletReducer.depositLog,
        currency: state.walletReducer.currency,
        getNoticeChange: state.commonReducer.noticeChange
    }
}
export default connect(mapStateToProps, { setCurrencyWithdrawFiat, noticeChange, setStatusBar, getConversion, getWithdrawLog, getDepositLog })(WalletInfoCash);
