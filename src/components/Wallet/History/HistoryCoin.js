import React from 'react';
import {
    StatusBar,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ListView,
    Modal,
    FlatList,
    Dimensions,
    Image,
    TouchableWithoutFeedback,
    Linking, TextInput, Keyboard, Platform, ScrollView, RefreshControl, ActivityIndicator
} from 'react-native';
import {
    Body,
    Button, CheckBox,
    Container,
    Content,
    Header, Input,
    Item,
    Left,
    List, Picker,
    Right,
    Switch,
    Tab,
    TabHeading,
    Tabs,
    Thumbnail
} from 'native-base';
import Icon from "react-native-vector-icons/FontAwesome";
import { style } from "../../../config/style";
import { convertUTC, to_UTCDate, dimensions, formatCurrency, formatSCurrency, jwtDecode } from "../../../config/utilities";
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { authService } from "../../../services/authenticate.service";
import { constant } from "../../../config/constants";
import CountDown from "react-native-countdown-component";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import StepIndicator from "react-native-step-indicator";
import { storageService } from "../../../services/storage.service";
import { connect } from 'react-redux';
import SignalRService from "../../../services/signalr.service";
import ConfirmModal from "../../Shared/ConfirmModal";
import { Spiner, HeaderFnx } from "../../Shared/";
const { height, width } = Dimensions.get('window');
import { CheckboxHistory, Fiat, ItemHistory } from "./components"
import ModalFilter from '../../Order/components/ModalFilter';
import Title from '../../Order/components/Title';
import PickerSearch from '../../Shared/PickerSearch';
import { styles } from "react-native-theme";
// import {setStatusBar} from "../../../redux/action/common.action"; 
class HistoryCoin extends React.Component {
    constructor(props) {
        super(props);
        this.dsDp = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.dsWd = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.onGetWalletBalanceChange = this.getWalletBalanceChange
        this.state = {
            historyDeposit: false,
            historyWithdraw: false,
            depositLog: [],
            withdrawLog: [],
            symbol: '',
            createdDate: '',
            status: '',
            value: '',
            address: '',
            txId: '',
            fromAddress: '',
            toAddress: '',
            openTab: "O",
            listCoin: [],
            listImage: [],
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
            isDisabled: false,
            userInfo: {},
            blockchainScan: {},
            pageIndex: 1,
            loading: false,
            is_confirm: false,
            isReady: true,
            isFilter: false,
            paymentUnit: '',
            walletId: 0,
            walletSelect: "C"
        }
        this.depositLog = []
        this.withdrawLog = []
    }

    async componentDidMount() {
        let user = await jwtDecode();
        this._refresh();
        let _userInfo = await storageService.getItem(constant.STORAGEKEY.USER_INFO);
        let userInfo = await authService.keepLogin(user.id);
        if (userInfo.twoFactorEnabled) {
            this.setState({ userInfo, loading: false })
        } else {
            this.setState({ userInfo: _userInfo, loading: false })
        }
    }

    getWithdrawFiat = async (id, pageSize) => {
        const { paymentUnit } = this.state;
        let withdrawLog = await authService.getWithdrawFiatLog(id, this.state.pageIndex, pageSize);
        console.log(withdrawLog, "withdrawLog kakakaka")
        this.withdrawLog = withdrawLog.source;
        if (paymentUnit !== '') {
            let withdrawLog = this.withdrawLog.filter(e => e.walletCurrency == paymentUnit);
            this.setState({ withdrawLog })
        } else {
            this.setState({ withdrawLog: this.withdrawLog, isReady: false })
        }
    }

    getDepositFiat = async (id, pageSize) => {
        const { paymentUnit } = this.state;
        let depositLog = await authService.getDepositFiatLog(id, this.state.pageIndex, pageSize);
        this.depositLog = depositLog.source;
        if (paymentUnit !== '') {
            let depositLog = this.depositLog.filter(e => e.walletCurrency == paymentUnit);
            this.setState({ depositLog })
        } else {
            this.setState({ depositLog: depositLog.source, loading: false, isReady: false })
        }
    }

    _refresh = async () => {
        console.log("_refresh")
        let user = await jwtDecode();
        if (this.state.walletSelect === "C") {
            this.setState({ pageIndex: 1, paymentUnit: '' }, () => {
                this.getDepositLog(user.id, 15)
                this.getWthdrawLog(user.id, 15);

                this.getListCoin();

            })
        } else {
            this.setState({ pageIndex: 1, paymentUnit: '' }, () => {
                this.getDepositFiat(user.id, 15);
                this.getWithdrawFiat(user.id, 15);
                this.getListFiat()
            })
        }

    }

    getWalletBalanceChange = async (data) => {
        let user = await jwtDecode();
        this.getWthdrawLog(user.id, 15)
    }

    async getDepositLog(id, pageSize) {
        const { paymentUnit } = this.state;
        let depositLog = await authService.getDepositCoinLog(id, this.state.pageIndex, pageSize);
        console.log(depositLog, "depositLog kakaka", paymentUnit);
        this.depositLog = depositLog.source;
        if (paymentUnit !== '') {
            let depositLog = this.depositLog.filter(e => e.currency == paymentUnit);
            this.setState({ depositLog })
        } else {
            this.setState({ depositLog: depositLog.source, loading: false, isReady: false })
        }
    }

    async getWthdrawLog(id, pageSize) {
        const { paymentUnit } = this.state;
        let withdrawLog = await authService.getWithdrawCoinLog(id, this.state.pageIndex, pageSize);
        // console.log(withdrawLog,"withdrawLog");
        this.withdrawLog = withdrawLog;
        if (paymentUnit !== '') {
            let withdrawLog = this.withdrawLog.filter(e => e.currency == paymentUnit);
            this.setState({ withdrawLog })
        } else {
            this.setState({ withdrawLog, isReady: false })

            withdrawLog.forEach(e => {
                if (e.id === this.state.requestId) {
                    this.setState({ statusWithdraw: e.status })
                }
            })
        }
    }

    loadMoreDepositeLog = async () => {
        //let depositLog = []
        let user = await jwtDecode()
        let depositLog = await authService.getDepositCoinLog(user.id, this.state.pageIndex + 1, 15);
        console.log("deposit log: ", this.state.pageIndex);
        if (depositLog.length > 0 && this.state.pageIndex) {
            console.log(this.state.depositLog, depositLog, this.state.pageIndex, "depositLoghihi");
            this.depositLog = depositLog.source;
            this.setState({ depositLog: this.state.depositLog.concat(depositLog.source), pageIndex: this.state.pageIndex + 1 })
        }
    }

    loadWithdrawlog = async () => {
        //let withdrawLog = []
        let user = await jwtDecode()
        let withdrawLog = await authService.getWithdrawCoinLog(user.id, this.state.pageIndex + 1, 15);
        if (withdrawLog.length !== 0) {
            this.withdrawLog = withdrawLog;
            this.setState({ withdrawLog: this.state.withdrawLog.concat(withdrawLog), pageIndex: this.state.pageIndex + 1 })
        }
    }
    loadMoreDepositeFiatLog = async () => {
        let user = await jwtDecode();

        let depositLog = await authService.getDepositFiatLog(user.id, this.state.pageIndex + 1, 15);
        console.log(depositLog, "loadMoreDepositeFiatLog ")
        if (depositLog && depositLog.source && depositLog.source.length > 0 && this.state.pageIndex) {
            this.depositLog = depositLog.source;
            this.setState({ depositLog: this.state.depositLog.concat(depositLog.source), pageIndex: this.state.pageIndex + 1 })
        }
    }

    loadWithdrawFiatlog = async () => {
        let user = await jwtDecode();
        let withdrawLog = await authService.getWithdrawFiatLog(user.id, this.state.pageIndex + 1, 15);
        if (withdrawLog.length !== 0) {
            this.withdrawLog = withdrawLog.source;
            this.setState({ withdrawLog: this.state.withdrawLog.concat(withdrawLog.source), pageIndex: this.state.pageIndex + 1 })
        }
    }

    async getListCoin() {
        this.setState({
            listCoin: []
        });
        let user = await jwtDecode();
        let response = await authService.getCrytoWallet(user.id);
        let listCoin = [], listImage = [];
        response.forEach(e => {
            listCoin.push({ symbol: e.symbol, name: e.name });
            listImage.push({ image: e.images });
        })
        this.setState({ listCoin, listImage });
    }
    async getListFiat() {
        this.setState({
            listCoin: []
        });
        let user = await jwtDecode();
        let response = await authService.getFiatWallet(user.id);
        console.log(response, "response kaka=========")
        this.setState({ listCoin: response });
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
                    isDisabled: false
                })
            } else {
                this.setState({
                    timer: 60 - Math.round((Date.now() - timerActive) / 1000),
                })
            }
        }, 1000);
        let user = await jwtDecode();
        let response = await authService.getTwoFactorEmailCode(user.sub);
        this.setState({ sessionId: response.data.sessionId, });
    }

    cancelWithdraw = async () => {
        let { requestId, sessionId, verifyCode } = this.state;
        let user = await jwtDecode();
        let data = { accId: user.id, requestId, sessionId, verifyCode };
        let res = await authService.cancelWithdrawCoin(data);
        if (res.status) {
            this.setState({ cancelModal: false, invalidCode: '', requestId: null });
            this.getDepositLog(user.id, 15);
            this.getWthdrawLog(user.id, 15);
        } else {
            this.setState({ invalidCode: res.message, verifyCode: '' })
        }
    }
    onChangeCurrency = (paymentUnit) => {
        // console.log(paymentUnit, "paymentUnit hihi");
        this.setState({
            paymentUnit: paymentUnit === 'ALL'.t() ? '' : paymentUnit,
            isNested2: false,
            isFilter: true
        })
    }
    onChangeSymbol = async (value) => {
        console.log(value, "value kakak");
        this.setState({
            walletId: value,
            isNested: false,
            isFilter: true,
            paymentUnit: '',
        })
        if (value === 0) {
            this.getListCoin();
        } else if (value === 1) {
            this.getListFiat();
        }
    }
    handleSearch = async () => {
        this.setState({
            isFilter: false,
            isOff: true,
            isOff2: true,
        })
        let user = await jwtDecode();
        if (this.state.walletId === 0) {
            this.setState({ pageIndex: 1, walletSelect: "C" }, () => {
                this.getDepositLog(user.id, 15)
                this.getWthdrawLog(user.id, 15);
            })
        } else if (this.state.walletId === 1) {
            this.setState({ pageIndex: 1, walletSelect: "F" }, () => {
                this.getDepositFiat(user.id, 15)
                this.getWithdrawFiat(user.id, 15);
            })
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.navigation.state.params && nextProps.navigation.state.params.isCash && this.state.walletSelect === "C") {
            // console.log(this.props.navigation.state.params.isCash,"isCash kakaka");
            this.setState({
                walletSelect: "F",
                walletId: 1
            }, () => this._refresh())
        }
        if(nextProps.walletBalanceChange !== this.props.walletBalanceChange){
            this.getWalletBalanceChange()
        }
    }



    render() {
        const { navigation } = this.props;
        const {
            openTab, depositLog,
            withdrawLog, symbol, listCoin,
            cancelModal, verifyCode, invalidCode, userInfo, loading,
            isReady
        } = this.state;
        return (
            <Container style={[styles.bgMain]}>
                <Spiner isVisible={isReady} />
                <HeaderFnx
                    title={"TRANSACTION_HISTORY".t()}
                    hasBack
                    navigation={navigation}
                    colorStatus={style.bgHeader.backgroundColor}
                    backgroundHeader={styles.backgroundSub.color}
                    hasRight={
                        <TouchableOpacity
                            onPress={() => this.setState({
                                isFilter: !this.state.isFilter
                            })}
                            style={{
                                padding: 10
                            }}
                        >
                            <Icon name={"filter"} size={18} color={this.state.isFilter ? styles.txtHl.color : styles.textWhite.color} />
                        </TouchableOpacity>
                    }
                />
                <ModalFilter
                    visible={this.state.isFilter}
                    onRequestClose={
                        () => this.setState({
                            isFilter: false,
                        })}
                    onDismiss={() => {
                        if (!this.state.isOff) {
                            this.setState({
                                isNested: true,
                            })
                        } else if (!this.state.isOff2) {
                            this.setState({
                                isNested2: true,
                            })
                        }
                    }}
                    isView={
                        <View style={{ flex: 1, }}>
                            <TouchableWithoutFeedback
                                style={stylest.ModalFilter}
                                onPress={
                                    () => this.setState({
                                        isFilter: false,
                                        isOff: true,
                                        isOff2: true
                                    })
                                }
                            >
                                <View style={stylest.ModalFilter} />
                            </TouchableWithoutFeedback>
                            <View
                                style={{
                                    backgroundColor: styles.backgroundSub.color
                                }}>
                                <HeaderFnx
                                    styledText={{ paddingLeft: 0, }}
                                    title={"TRANSACTION_HISTORY".t()}
                                    colorStatus={style.bgHeader.backgroundColor}
                                    backgroundHeader={styles.backgroundSub.color}
                                    hasRight={
                                        <TouchableOpacity
                                            onPress={() => this.setState({
                                                isFilter: !this.state.isFilter
                                            })}
                                            style={{
                                                padding: 10
                                            }}
                                        >
                                            <Icon name={"filter"} size={18} color={this.state.isFilter ? styles.txtHl.color : styles.textWhite.color} />
                                        </TouchableOpacity>
                                    }
                                />
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingHorizontal: 10
                                }}>
                                    <View style={[stylest.boxFilter, {
                                        backgroundColor: styles.bgInputWhite.color,
                                        borderWidth: 0.5,
                                        borderColor: style.textMain.color
                                    }]}>
                                        <PickerSearch
                                            textCenter={" - "}
                                            label={["name"]}
                                            value={"id"}
                                            onValueChange={this.onChangeSymbol}
                                            selectedValue={this.state.walletId}
                                            source={[
                                                { id: 0, name: "Coins" },
                                                { id: 1, name: "Fiat" }
                                            ]}
                                            placeholder={'SELECT_WALLET'.t()}
                                            textStyle={styles.textWhite}
                                            caretStyle={{
                                                color: style.textMain.color,
                                                fontSize: 18
                                            }}
                                            hasNested={Platform.OS === "ios" ? true : false}
                                            onPressChange={(data) => this.setState({
                                                isFilter: false,
                                                isOff: false,
                                                isOff2: true,

                                            })}
                                            isNested={true}
                                        />

                                    </View>
                                    <View style={[stylest.boxFilter, {
                                        backgroundColor: styles.bgInputWhite.color,
                                        borderWidth: 0.5,
                                        borderColor: style.textMain.color
                                    }]}>
                                        <PickerSearch
                                            headerItem={this.state.walletId === 0 ? { symbol: "ALL".t(), name: "" } : { currency: "ALL".t(), name: "" }}
                                            textCenter={" - "}
                                            label={[`${this.state.walletId === 0 ? "symbol" : "currency"}`, "name"]}
                                            value={`${this.state.walletId === 0 ? "symbol" : "currency"}`}
                                            onValueChange={this.onChangeCurrency}
                                            selectedValue={this.state.paymentUnit}
                                            source={this.state.listCoin}
                                            placeholder={'ALL'.t()}
                                            textStyle={styles.textWhite}
                                            caretStyle={{
                                                color: style.textMain.color,
                                                fontSize: 18
                                            }}
                                            hasNested={Platform.OS === "ios" ? true : false}
                                            onPressChange={() => this.setState({
                                                isOff2: false,
                                                isOff: true,
                                                isFilter: false,
                                            })}
                                            isNested={true}
                                        />
                                    </View>
                                </View>

                                <View>

                                    <TouchableOpacity style={[stylest.btnSearch,{
                                        backgroundColor:styles.bgButton.color
                                    }]}
                                        onPress={this.handleSearch}
                                    >
                                        <Text style={[style.textWhite]}>{'SEARCH'.t()}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    }
                />
                {/* <SignalRService
                    getWalletBalanceChange={this.onGetWalletBalanceChange}
                    listen_event={[constant.SOCKET_EVENT.PRICE_CHANGE_NOTIFY]} /> */}
                {Platform.OS === "ios" && <PickerSearch
                    textCenter={""}
                    // headerItem={{id:null, value: "ALL".t() }}
                    hiddenBtn={true}
                    isNested={this.state.isNested}
                    label={["name"]}
                    value={"id"}
                    onValueChange={this.onChangeSymbol}
                    selectedValue={this.state.walletId}
                    source={[{ id: 0, name: "Coins" }, { id: 1, name: "Fiat" }]}
                    placeholder={'ALL'.t()}
                    textStyle={style.textMain}
                    caretStyle={{
                        color: style.textMain.color,
                        fontSize: 18
                    }}
                    hasNested={Platform.OS === "ios" ? true : false}
                    onPressChange={(data) => this.setState({
                        isFilter: false,
                        isOff: false
                    })}
                    onBackChange={(data) => this.setState({
                        isFilter: true,
                        isOff: false,
                        isNested: false,
                    })}
                    onDismiss={() => {
                        this.setState({
                            isNested: false,
                            isFilter: true,
                            isOff: false
                        })
                    }}
                />}

                {Platform.OS === "ios" && <PickerSearch
                    textCenter={" - "}
                    headerItem={this.state.walletId === 0 ? { symbol: "ALL".t(), name: "" } : { currency: "ALL".t(), name: "" }}
                    hiddenBtn={true}
                    isNested={this.state.isNested2}
                    label={[`${this.state.walletId === 0 ? "symbol" : "currency"}`, "name"]}
                    value={`${this.state.walletId === 0 ? "symbol" : "currency"}`}
                    onValueChange={this.onChangeCurrency}
                    selectedValue={this.state.paymentUnit}
                    source={this.state.listCoin}
                    placeholder={'ALL'.t()}
                    textStyle={style.textMain}
                    caretStyle={{
                        color: style.textMain.color,
                        fontSize: 18
                    }}
                    hasNested={Platform.OS === "ios" ? true : false}
                    onPressChange={(data) => this.setState({
                        isFilter: false,
                        isOff2: false
                    })}
                    onBackChange={(data) => this.setState({
                        isFilter: true,
                        isOff2: false,
                        isNested2: false,
                    })}
                    onDismiss={() => {
                        this.setState({
                            isNested2: false,
                            isFilter: true,
                            isOff2: false
                        })
                    }}
                />}
                <View style={stylest.history}>
                    <View style={[style.row, { justifyContent: "flex-start" }]}>
                        <View style={[style.row, { justifyContent: 'flex-start', alignItems: 'center', }]}>
                            <TouchableOpacity onPress={() => {
                                this.setState({
                                    openTab: 'O',
                                    pageIndex: 1, paymentUnit: ''
                                })
                            }}
                                style={[style.tabOrderHeading, {
                                    minWidth: 80,
                                    borderBottomWidth: openTab === "O" ? 2 : 1,
                                    borderBottomColor: openTab === "O" ? '#4272ec' : styles.txtButtonTabMainTitle.color
                                }]}>
                                <Text style={openTab === 'O' ? { color: '#78afff', fontSize: 13 } : styles.txtMainTitle}>{'DEPOSITS'.t().toUpperCase()}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                this.setState({
                                    openTab: 'W',
                                    pageIndex: 1, paymentUnit: ''
                                })
                            }}
                                style={[style.tabOrderHeading, {
                                    minWidth: 80,
                                    borderBottomWidth: openTab === "W" ? 2 : 1,
                                    borderBottomColor: openTab === "W" ? '#4272ec' : styles.txtButtonTabMainTitle.color
                                }]}>
                                <Text style={openTab === 'W' ? { color: '#78afff', fontSize: 13 } : styles.txtMainTitle}>{'WITHDRAWALS'.t().toUpperCase()}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {
                    openTab === "O" ?
                        (<ItemHistory
                            openTab="O"
                            onMomentScrollEnd={() => {
                                if (this.state.walletSelect === "C") {
                                    this.loadMoreDepositeLog()
                                } else {
                                    this.loadMoreDepositeFiatLog();
                                }
                                // this.loadWithdrawlog()

                            }}
                            extraData={this.state}
                            onRefresh={this._refresh}
                            loading={loading}
                            dataSource={this.dsDp.cloneWithRows(depositLog)}
                            itemLog={depositLog}
                            currencyList={this.props.currencyList}
                            showCash={this.state.walletSelect === "C" ? false : true}

                            {...this.props}
                        />)
                        :
                        (<ItemHistory
                            openTab="R"
                            onMomentScrollEnd={() => {
                                if (this.state.walletSelect === "C") {
                                    this.loadWithdrawlog()
                                } else {
                                    this.loadWithdrawFiatlog();
                                }
                            }}
                            extraData={this.state}
                            onRefresh={this._refresh}
                            loading={loading}
                            dataSource={this.dsWd.cloneWithRows(withdrawLog)}
                            itemLog={withdrawLog}
                            currencyList={this.props.currencyList}
                            navigation={navigation}
                            showCash={this.state.walletSelect === "C" ? false : true}
                            onHiddenRow={
                                (dataHiddenRow) => {
                                    if (userInfo.twoFactorEnabled) {
                                        this.setState({ is_confirm: true, requestId: dataHiddenRow.id })
                                    } else {
                                        this.setState({ cancelModal: true })
                                    }
                                }

                            }
                            // }
                            userInfo={userInfo}
                            disableLeftSwipe={false}
                            onCancel={() => {
                                this.setState({ cancelModal: true })
                            }}
                            {...this.props}
                        />)
                }
                <Modal
                    transparent={true}
                    animationType={'none'}
                    visible={cancelModal}
                    onRequestClose={() => {
                        this.setState({ cancelModal: false })
                    }}>
                    {
                        userInfo.twoFactorEnabled ?
                            <View style={stylest.modalBackground}>
                                <KeyboardAwareScrollView onPress={Keyboard.dismiss}
                                    contentContainerStyle={stylest.modalBackground}>
                                    <View style={[stylest.activityIndicatorWrapper, {
                                        justifyContent: 'space-between',
                                    }]}>
                                        <Item style={[{ backgroundColor: 'transparent', borderBottomWidth: 0, marginVertical: 10 }]}>
                                            <Left>
                                                {invalidCode &&
                                                    <Text style={styles.bgSellOldNew}>{`${invalidCode}`.t()}</Text>}
                                            </Left>
                                            <Right>
                                                <TouchableOpacity
                                                    style={{ width: 20, height: 20, backgroundColor: style.container.backgroundColor, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}
                                                    onPress={() => {
                                                        this.setState({ cancelModal: false })
                                                    }}>
                                                    <Icon name={'times'} size={14} color={'#fff'} />
                                                </TouchableOpacity>
                                            </Right>
                                        </Item>
                                        <View style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                            {
                                                userInfo.twoFactorService === constant.TWO_FACTOR_TYPE.EMAIL_2FA ?
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        backgroundColor: '#171d2f',
                                                        marginBottom: 5
                                                    }}>
                                                        <TextInput
                                                            allowFontScaling={false}
                                                            style={{
                                                                flex: 3,
                                                                color: style.textWhite.color,
                                                                height: 40,
                                                                paddingHorizontal: 10
                                                            }}
                                                            placeholder={'EMAIL_VERIFICATION'.t()}
                                                            placeholderTextColor={style.textMain.color}
                                                            onChangeText={(verifyCode) => this.setState({ verifyCode })}
                                                            value={verifyCode}
                                                        />
                                                        <Button
                                                            disabled={this.state.isDisabled}
                                                            primary
                                                            style={[style.buttonNext, {
                                                                height: 40,
                                                                padding: 5,
                                                                width: dimensions.width / 4,
                                                                justifyContent: 'center',
                                                                borderTopLeftRadius: 0,
                                                                borderBottomLeftRadius: 0
                                                            }]}
                                                            onPress={() => { this.onSentMail() }}
                                                        >
                                                            <Text
                                                                style={{ color: 'white' }}> {this.state.checked ? (this.state.timer <= 0 ? 0 : this.state.timer) + "s" : "SEND_EMAIL".t()} </Text>
                                                        </Button>
                                                    </View>
                                                    :
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        backgroundColor: '#171d2f',
                                                        marginBottom: 10
                                                    }}>
                                                        <TextInput
                                                            allowFontScaling={false}
                                                            style={{ flex: 1, color: style.textWhite.color, padding: 10 }}
                                                            placeholder={'GOOGLE_AUTHENTICATION_CODE'.t()}
                                                            placeholderTextColor={style.textMain.color}
                                                            onChangeText={(verifyCode) => this.setState({ verifyCode })}
                                                            value={verifyCode}
                                                        />
                                                    </View>
                                            }
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 10 }}>
                                                <TouchableOpacity
                                                    style={[{
                                                        backgroundColor: style.buttonNext.backgroundColor,
                                                        flex: 1,
                                                        borderRadius: 2.5,
                                                        marginRight: 5,
                                                        borderColor: style.buttonNext.backgroundColor,
                                                        borderWidth: 1,
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }, style.buttonHeight]}
                                                    onPress={() => {
                                                        this.cancelWithdraw()
                                                    }}
                                                >
                                                    <Text style={{ color: 'white' }}>{'SUBMIT'.t()}</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[{
                                                        backgroundColor: this.state.checkCancel ? '#205AA7' : '',
                                                        flex: 1,
                                                        borderRadius: 2.5,
                                                        borderColor: '#205AA7',
                                                        borderWidth: 1,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }, style.buttonHeight]}
                                                    onPress={() => {
                                                        this.setState({ cancelModal: false })
                                                    }}
                                                >
                                                    <Text style={{ color: 'white' }}>{'CANCEL'.t()}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </KeyboardAwareScrollView>
                            </View>
                            :
                            <View style={stylest.modalBackground}>
                                <View style={[stylest.activityIndicatorWrapper, { height: dimensions.height / 2 }]}>
                                    <Image
                                        source={require('../../../assets/img/ic_exit.png')}
                                        style={{
                                            width: dimensions.width / 5,
                                            height: dimensions.width / 5,
                                            margin: dimensions.width / 20,
                                        }}
                                    />

                                    <Text style={[style.textWhite, { marginBottom: 20, fontSize: 24 }]}>{'2FA_REQUIRED'.t()}</Text>
                                    <Text style={[style.textWhite, { marginBottom: 20 }]}>{'2FA_REQUIRED_CONTENT'.t()}</Text>
                                    <Button block style={[style.buttonNext, { width: dimensions.width / 2 }]}
                                        onPress={() => {
                                            this.setState({ cancelModal: false })
                                        }}
                                    >
                                        <Text style={{ color: 'white', fontSize: 18 }}>{'CLOSE'.t()}</Text>
                                    </Button>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({ cancelModal: false }, () => { navigation.navigate('Account') })
                                        }}
                                    >
                                        <Text style={{ color: style.colorHighLight }}>{'2FA_REQUIRED_LINK'.t()}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                    }
                </Modal>
                <ConfirmModal visible={this.state.is_confirm} title={"CANCEL".t()}
                    content={"CONFIRM_TO_CANCEL_WIHTDRAWAL_REQUEST".t()}
                    onClose={() => this.setState({ is_confirm: false, resultType: "", resultText: "" })}
                    onOK={() => this.setState({ is_confirm: false, cancelModal: true })}
                    resultText={this.state.resultText} resultType={this.state.resultType}
                    ButtonOKText={"OK".t()} ButtonCloseText={"CLOSE".t()}
                />
            </Container>
        );
    }
}
const stylest = StyleSheet.create({
    item: {

        paddingVertical: 20,
        borderBottomWidth: 0,

    },
    itemTab: {
        borderBottomWidth: 0,
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#00000090',
    },
    activityIndicatorWrapper: {
        backgroundColor: '#1c2840',
        width: dimensions.width - 20,
        padding: 20,
        display: 'flex',
        justifyContent: 'space-between'
    },
    ModalFilter: {
        backgroundColor: "black",
        opacity: 0.5,
        position: "absolute",
        width: "100%",
        height: "100%"
    },
    history: {
        paddingHorizontal: 10,
        marginBottom: 5,
        marginTop: 10
        //flex: 1,
    },
    boxFilter: {
        height: 35,
        backgroundColor: '#1b2337',
        width: "49%",
        justifyContent: "center",
        paddingHorizontal: 10,
    },
    btnSearch: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
        borderRadius: 2.5,
        margin: 10,
        backgroundColor: style.buttonNext.backgroundColor
    },
})
const mapStateToProps = state => {
    return {
        statusBar: state.commonReducer.statusBar,
        walletBalance: state.tradeReducer.walletBalance,
        currencyList: state.commonReducer.currencyList,
        walletBalanceChange: state.tradeReducer.walletBalanceChange
    }
}
export default connect(mapStateToProps)(HistoryCoin);
