import React from 'react';
import {
    View,
    Text,
    Modal,
    TextInput,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    TouchableWithoutFeedback,
    Keyboard,
    Linking,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ScrollView,
    StatusBar,
    BackHandler
} from 'react-native';
import { style } from "../../../config/style/index";
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    dimensions,
    formatCurrency,
    formatSCurrency,
    jwtDecode,
    formatTrunc,
    formatNumberOnChange
} from "../../../config/utilities";
import DropdownAlert from 'react-native-dropdownalert';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { constant } from "../../../config/constants";
import { authService } from "../../../services/authenticate.service";
import CountDown from 'react-native-countdown-component';
import { connect } from 'react-redux';
import SignalRService from "../../../services/signalr.service";
import SliderCustomize from "../../Shared/Slider";
import ConfirmModal from "../../Shared/ConfirmModal";
import { SendEmailField, HeaderFnx } from "../../Shared"
import Step2 from './StepForWithdraw/coin/Step2';
import Step0 from './StepForWithdraw/coin/Step0';
import Step1 from './StepForWithdraw/coin/Step1';
import Step3 from './StepForWithdraw/coin/Step3';
import Rejected from './status/Rejected';
import Processing from './status/Processing';
import EmailSent from './status/EmailSent';
import Complete from './status/Complete';
import Cancelled from './status/Cancelled';
import CancelModal from './components/coin/CancelModal';
import InfoWithdraw from './components/coin/InfoWithdraw';
import BtnWithdraw from './components/coin/BtnWithdraw';
import I18n from "react-native-i18n"
import { NavigationEvents } from "react-navigation"
import { setStatusBar } from "../../../redux/action/common.action"
import ContainerFnx from '../../Shared/ContainerFnx';
import PickerSearch from '../../Shared/PickerSearch';
import { setCurrencyWithdrawFiat } from '../../../redux/action/wallet.action';
import {styles} from "react-native-theme"
const { width, height } = Dimensions.get('window');
// var locale = I18n.locale;

// const labels = ["1", "2", "3", "4"];
class WithdrawCoin extends React.Component {
    constructor(props) {
        super(props);
        this.onGetWalletBalanceChange = this.getWalletBalanceChange
        var { infoCurrency } = this.props.navigation.state.params;
        this.state = {
            cryptoAddress: null,
            symbol: null,
            addressQrCode: null,
            currentPosition: 0,
            timer: 60,
            seconds: 9,
            checked: false,
            checkTextChange: false,
            minute: 0,
            checkTime: false,
            // tạm thời để check count down time chờ comfirm mail
            checkCancel: false,
            modalWithdrawCoinVisible: null,
            step1: false,
            step2: false,
            withdrawInfo: this.props.navigation.state.params.withdrawInfo,
            //
            amount: '',
            toAddress: '',
            twoFactorService: null,
            verifyCode: '',
            otp: '',
            customerEmail: '',
            accId: '',
            disable: false,
            sessionId: null,
            requestId: null,
            code: null,
            estimatedTime: null,
            h: 0,
            m: 0,
            s: 0,
            contact: false,
            input2FA: false,
            msgError: '',
            withdrawLog: [],
            statusWithdraw: null,
            isEmailCode: null,
            is_confirm: false,
            content: null,
            title: null,
            ButtonOKText: null,
            id: 12,
            timerOtp: 60,
            isViewContent: false,
            tag: null,
            isDisableTag: false,
            extraFields: infoCurrency.extraFields,
            infoCurrency: infoCurrency,
            dataCheck: [],
            errData: [],
            language: "en-US"

        }
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.language !== this.props.language) {
            this.setState({
                language: nextProps.language
            })
        }
        if(nextProps.walletBalanceChange !== this.props.walletBalanceChange){
            this.getWalletBalanceChange();
        }
    };

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        this.getDataWithdraw();
    }
    componentWillUnmount() {
        this.backHandler.remove()
    }
    handleBackPress = () => {
        this.props.setCurrencyWithdrawFiat(this.state.symbol);
    }
    getDataWithdraw = async () => {
        let user = await jwtDecode();
        const { modalWithdrawCoinVisible, withdrawInfo, twoFactorService } = this.props.navigation.state.params;
        const { infoCurrency } = this.state;
        if (infoCurrency.extraFields && infoCurrency.extraFields.length > 0) {
            infoCurrency.extraFields.map((item, index) => {
                item.toExtraField = "";
            })
        }

        this.setState({
            customerEmail: user.sub,
            accId: user.id,
            symbol: infoCurrency.symbol,
            cryptoAddress: infoCurrency.cryptoAddress,
            addressQrCode: infoCurrency.addressQrCode,
            modalWithdrawCoinVisible,
            withdrawInfo,
            twoFactorService,
            fromTag: infoCurrency.cryptoDestinationTag
        })
    }

    getWalletBalanceChange = async () => {
        let user = await jwtDecode();
        let withdrawRes = await authService.getWithdrawCoinLog(user.id, 1, 15);
        let withdrawLog = withdrawRes.source.filter(e => e.currency === this.state.symbol);
        this.setState({ withdrawLog })
        withdrawRes.forEach(e => {
            if (e.id === this.state.requestId) {
                this.setState({ statusWithdraw: e.status })
            }
        })
    }

    async onSentMail() {
        this.setState({ disable: true, checked: true });
        let timerActive = new Date().getTime();
        this.interval = setInterval(() => {
            if (this.state.timer <= 0) {
                clearInterval(this.interval);
                this.setState({
                    checked: false,
                    timer: 60,
                    disable: true
                })
            } else {
                this.setState({
                    timer: 60 - Math.round((Date.now() - timerActive) / 1000),
                })
            }
        }, 1000);

        let user = await jwtDecode();
        let response = await authService.getTwoFactorEmailCode(user.sub);
        this.setState({ sessionId: response.data.sessionId })
    }

    async onSentOtp() {
        this.setState({ disableOtp: true, checkedOtp: true, });
        let timerActive = new Date().getTime();
        this.intervalOtp = setInterval(() => {
            if (this.state.timerOtp <= 0) {
                clearInterval(this.intervalOtp);
                this.setState({
                    checkedOtp: false,
                    disableOtp: false,
                    timerOtp: 60
                })
            } else {
                this.setState({
                    timerOtp: 60 - Math.round((Date.now() - timerActive) / 1000),
                })
            }
        }, 1000);
        let { requestId } = this.state;
        let user = await jwtDecode();
        let response = await authService.getOtp(user.sub, 'COIN_WITHDRAWAL', requestId);
        this.setState({ sessionId: response.sessionId })
    }
    getBanlanceCurrency = async (symbol) => {
        let user = await jwtDecode();
        let infoCurrency = await authService.getWalletBalanceByCurrency(user.id, symbol);
        this.setState({ infoCurrency });
    }
    componentDidUpdate = (prevProps, prevState) => {
        if (prevState.symbol !== this.state.symbol) {
            this.getBanlanceCurrency(this.state.symbol);
            this.getWithdrawInfo(this.state.symbol)
        }
    };
    getWithdrawInfo=(symbol)=>{
        const {cryptoWallet } = this.props.navigation.state.params;
        if(cryptoWallet.length >0){
            cryptoWallet.map((item,index)=>{
                if(item.symbol === symbol){
                    this.setState({
                        withdrawInfo: { 
                            minWithdrawal: item.minWithdrawal, 
                            transactionFee: item.transactionFee, 
                            deposit: item.deposit,
                            withdraw: item.withdrawal 
                        }
                    })
                    // console.log(item,"item symbol symbol===========")
                }
                
            })
        }
    }

    renderStep = () => {
        const { infoCurrency } = this.state;
        console.log(infoCurrency, "infoCurrency")
        const { currencyList, navigation } = this.props;
       
        const {
            symbol, amount, toAddress, withdrawInfo, twoFactorService, timer, checked, disable, verifyCode, currentPosition, code, requestId, tag, isDisableTag
        } = this.state;

        const store = {
            step0: {
                infoCurrency,
                amount,
                onChangeAmount: (amount) => this.setState({ amount:formatNumberOnChange(currencyList, amount, symbol) }),
                onPressMountMax: () => this.setState({ amount:formatTrunc(currencyList, infoCurrency.available, symbol) }),
                withdrawInfo,
                toAddress,
                onChangeAddress: (toAddress) => this.setState({ toAddress }),
                onSubmitStep0: () => this.submit(amount, toAddress, tag),
                onChangeExtraFields: (value, name) => {
                    // console.log(extra,hi,"kaka")
                    infoCurrency.extraFields.map((item, index) => {
                        if (item.name == name) {
                            console.log("khop roi");
                            item.toExtraField = value;
                            this.setState({
                                infoCurrency: infoCurrency
                            })
                            console.log(infoCurrency.extraFields, "khop roi");
                        }
                    })
                },
                language: this.props.language,
                tag: this.state.tag,
                symbol,
                dataCheck: this.state.dataCheck,
                switchDisable: (name) => {
                    infoCurrency.extraFields.map(async (item, index) => {
                        if (item.name === name) {
                            item.toExtraField = ""
                            await this.setState({
                                [`isDisable${item.name}`]: !this.state[`isDisable${item.name}`],
                                infoCurrency: infoCurrency,
                            });
                            if (this.state[`isDisable${item.name}`] === true) {
                                var dataState = this.state.dataCheck;
                                var dataPush = dataState.push({
                                    name: item.name,
                                    [`isDisable${item.name}`]: this.state[`isDisable${item.name}`]
                                })
                                console.log(dataState, "data push");
                                this.setState({
                                    dataCheck: dataState
                                })
                            } else {
                                var arrNew = this.state.dataCheck.filter((filter, i) => item.name !== filter.name);

                                this.setState({
                                    dataCheck: arrNew
                                })
                            }
                            // store.step0.kaka = "hhiih";
                            // store.step0[`isDisable${item.name}`] = this.state[`isDisable${item.name}`]
                        }
                    })

                }
            },
            step1: {
                twoFactorService,
                onChangeVerifyCode: (verifyCode) => this.setState({ verifyCode }),
                verifyCode,
                disable,
                checked,
                timer,
                onSendEmail: () => this.onSentMail()
            },
            step2: {
                codeOtp: (code) => this.setState({ code }),
                value: code,
                requestId,
                sessionId: (sessionId) => this.setState({ sessionId })
            },
            step3: {
                renderStatusWithdraw: this.renderStatusWithdraw()
            }
        }
        switch (currentPosition) {
            case 0:
                return (
                    <Step0
                        {...store.step0}
                    />
                )
            case 1:
                return (
                    <Step1
                        {...store.step1}
                    />
                )
            case 2:
                return (
                    <Step2
                        {...store.step2}
                    />
                )
            case 3:
                return (
                    <Step3 {...store.step3} />
                )
            default:
                return
        }
    }

    renderStatusWithdraw = () => {
        const { statusWithdraw, m, s, contact, code, checked, timer, tag } = this.state;

        const storeStatus = {
            processing: {
                until: 60 * m + s,
                onFinishTimer: () => this.setState({ contact: true }),
                contact,
                onMail: () => Linking.openURL(constant.SUPPORT.MAIL),
                onTelegram: () => Linking.openURL(constant.SUPPORT.TELEGRAM),
                onFacebook: () => Linking.openURL(constant.SUPPORT.FACEBOOK),

            },
            emailSent: {
                onChangeCode: (code) => this.setState({ code }),
                code,
                onResendOtp: () => this.resendOtp(),
                checked,
                timer
            }
        }

        switch (statusWithdraw) {
            case constant.STATUS_FUNDS.Rejected:
                return (
                    <Rejected />
                )
            case constant.STATUS_FUNDS.Processing:
                return (
                    <Processing
                        {...storeStatus.processing}
                    />
                )
            case constant.STATUS_FUNDS.Completed:
                return (
                    <Complete />
                )
            case constant.STATUS_FUNDS.Cancelled:
                return (
                    <Cancelled />
                )
            case constant.STATUS_FUNDS.EmailSent:
                return (
                    <EmailSent
                        {...storeStatus.emailSent}
                    />
                )
            default:
                return (
                    <Processing
                        {...storeStatus.processing}
                    />
                )
        }
    }

    submit(amount, toAddress, tag) {
        const { infoCurrency } = this.state;
        const { symbol } = infoCurrency;
        const { isDisableTag, language } = this.state;
        var errData = []
        if (!amount) {
            this.setState({
                is_confirm: true,
                title: 'WARNING'.t(),
                content: 'Please enter your amount'.t()
            })
        } else if (amount > infoCurrency.available) {
            this.setState({
                is_confirm: true,
                title: 'WARNING'.t(),
                content: 'Not enough available'.t()
            })
        } else if (amount == 0 || amount < this.state.withdrawInfo.minWithdrawal || amount > infoCurrency.available) {
            this.setState({
                is_confirm: true,
                title: 'WARNING'.t(),
                content: `${"Enter your amount greater than".t()} ${this.state.withdrawInfo.minWithdrawal}`
            })
        } else if (!toAddress) {
            this.setState({
                is_confirm: true,
                title: 'WARNING'.t(),
                content: 'Please enter received address'.t()
            })
        } else if (infoCurrency.extraFields && infoCurrency.extraFields.length > 0) {
            infoCurrency.extraFields.map((item, index) => {
                var regex = new RegExp(item.regexValidate);
                if (item.isRequired === true && item.toExtraField === "" || item.toExtraField === null) {
                    let errDt = {
                        name: item.name,
                        err: "err Required"
                    };
                    errData.push(errDt);

                    this.setState({
                        is_confirm: true,
                        title: 'WARNING'.t(),
                        content: `${"PLEASE_ENTER".t()} ${item.localizations[language].FieldName}`,
                    })
                    return;
                } else if (item.isRequired === true && regex.test(item.toExtraField) === false) {
                    let errDt = {
                        name: item.name,
                        err: "err Required"
                    };
                    errData.push(errDt);
                    this.setState({
                        is_confirm: true,
                        title: 'WARNING'.t(),
                        content: `${item.localizations[language].FieldName} ${"Invalid".t()}`,
                    })
                    return;
                } else if (item.isRequired === false && regex.test(item.toExtraField) === false && !this.state[`isDisable${item.name}`] && item.toExtraField.length > 0) {
                    let errDt = {
                        name: item.name,
                        err: "err invalid"
                    };
                    errData.push(errDt);
                    this.setState({
                        is_confirm: true,
                        title: 'WARNING'.t(),
                        content: `${item.localizations[language].FieldName} ${"Invalid".t()}`,
                    })
                    return;
                } else if (item.isRequired === false && (item.toExtraField === "" || item.toExtraField === null) && !this.state[`isDisable${item.name}`]) {
                    let errDt = {
                        name: item.name,
                        err: "err Required"
                    };
                    errData.push(errDt);

                    this.setState({
                        is_confirm: true,
                        title: 'WARNING'.t(),
                        content: `${"PLEASE_ENTER".t()} ${item.localizations[language].FieldName}`,
                    })
                    return;
                } else {
                    this.setState({ currentPosition: 1, msgError: '' })
                }
            })
        }
        else {
            this.setState({ currentPosition: 1, msgError: '' })
        }
    }


    handleSubmit() {
        console.log("submit roi");
        Keyboard.dismiss();
        let { currentPosition } = this.state;
        switch (currentPosition) {
            case 1:
                if (!this.state.verifyCode) {
                    this.setState({
                        is_confirm: true,
                        checked: false,
                        title: 'WARNING'.t(),
                        content: 'PLEASE_INPUT_YOUR_2FA_CODE'.t()
                    })
                } else {
                    this.handleRequestCoinWithdraw();
                }
                return
            case 2:
                this.confirmOtpCoin();
                return
            case 3:
                this.setState({ currentPosition: 3 });
                return
            default:
                return
        }
    }

    handleRequestCoinWithdraw = async () => {
        console.log("vao request roi");
        let { amount, toAddress, verifyCode, symbol, cryptoAddress, customerEmail, accId, sessionId, tag, infoCurrency } = this.state;
        var fromExtraFields = [];
        var toExtraFields = [];
        if (infoCurrency.extraFields && infoCurrency.extraFields.length > 0) {
            infoCurrency.extraFields.map((item, index) => {
                var toReq = {
                    name: item.name,
                    value: item.toExtraField
                };
                var fromReq = {
                    name: item.name,
                    value: item.value
                };
                toExtraFields.push(toReq)
                fromExtraFields.push(fromReq)
            })
        }
        let data = {
            amount, toAddress, verifyCode, symbol, fromAddress: cryptoAddress, customerEmail, accId, via: 2, sessionId, fromExtraFields, toExtraFields
        }
        this.setState({ disable: true })
        let response = await authService.createWithdrawalCoin(data);
        console.log(response, "response when submit")
        if (response.status === 'OK') {
            let estimatedTime = response.data.estimatedTime.split(':');
            let otpToken = response.data.otpToken;
            this.setState({
                disable: false,
                currentPosition: 2,
                sessionId: otpToken.sessionId,
                requestId: response.data.requestId,
                h: Number(estimatedTime[0]),
                m: Number(estimatedTime[1]),
                s: Number(estimatedTime[2]),
                msgError: '',
                checked: false,
                timer: 60
            })
        } else {
            this.setState({
                currentPosition: 1,
                disable: false,
                is_confirm: true,
                title: 'WARNING'.t(),
                content: `${response.message}`.t()
            });
        }
    }


    confirmOtpCoin = async () => {
        let { sessionId, requestId, code } = this.state;
        let data = { sessionId, requestId, code };
        console.log(code, "code hihi")
        if (code) {
            this.setState({ disable: true })
            let response = await authService.confirmOtpCoin(data);
            if (response.code === 1) {
                this.setState({ disable: false, currentPosition: 3, isEmailCode: null })
            } else {
                this.setState({ currentPosition: 2, is_confirm: true, content: `${response.message}`.t(), title: 'WARNING'.t() })
            }
        } else {
            this.setState({ isEmailCode: 'OTP'.t(), is_confirm: true, content: `OTP`.t(), title: 'WARNING'.t() })
        }
    }

    cancelWithdraw = async () => {
        let { requestId, sessionId, verifyCode } = this.state;
        let user = await jwtDecode();
        let data = { accId: user.id, requestId, sessionId, verifyCode };
        if (this.state.currentPosition == 2) {
            let res = await authService.cancelWithdrawCoin(data);
            if (res) {
                this.setState({
                    currentPosition: 0,
                    amount: '0',
                    toAddress: '',
                    input2FA: false,
                    timer: 60,
                    disable: false,
                    checked: false
                });
            }
        } else {
            this.setState({
                currentPosition: 0,
                amount: '0',
                toAddress: ''
            })
        }
        this.props.navigation.state.params._onRefresh();
        // this.props.navigation.goBack();
        this.close();
    }
    onHandleSelected = (text) => {
        this.setState({
            symbol: text
        })
    }
    close = () => {
        const { setCurrencyWithdrawFiat, navigation } = this.props;
        const {fromHome,cryptoWallet } = navigation.state.params;
        const {currentPosition} = this.state;
        if(fromHome){
            navigation.goBack();
        }else{
            navigation.goBack();
            setCurrencyWithdrawFiat(this.state.symbol);
        }
        
    }
    render() {
        const { currencyList, navigation } = this.props;
        const { _onRefresh, cryptoWallet,fromHome } = navigation.state.params;
        const {
            cryptoAddress, symbol, checkSubmit, checkCancel, step1, step2, modalWithdrawCoinVisible,
            amount, toAddress, code, currentPosition, verifyCode, input2FA, msgError, isEmailCode, is_confirm, content, title, ButtonOKText, isViewContent, twoFactorService, checked, timer, tag, infoCurrency, selectedUnit
        } = this.state;

        return (
            <ContainerFnx
                spaceTop={0}
                isbtnSpecial
                onPress={this.close}
                backgroundHeader={styles.bgMain.color}
                title={`${'WITHDRAWALS'.t()} ${symbol}`}
                hasBack
                navigation={navigation}
                colorStatus={style.bgHeader.backgroundColor}
                // listen_event={[constant.SOCKET_EVENT.PRICE_CHANGE_NOTIFY]}
                // getWalletBalanceChange={this.onGetWalletBalanceChange}
                hasRight={
                    currentPosition === 0 ?
                        <PickerSearch
                            autoEnable={fromHome?true:false}
                            renderItem={(data) => {
                                // console.log(data, "data kaka");
                                return (
                                    <View style={{
                                        borderBottomWidth: 0.5,
                                        borderBottomColor: styles.borderBottomItem.color,
                                        height: 45,
                                        flexDirection: "row"
                                    }}>
                                        <View style={{
                                            alignItems:"center",
                                            alignSelf:"center"
                                        }}>
                                            <Image source={{ uri: data.images }} style={{
                                                width: 15,
                                                height: 15,
                                            }} />
                                        </View>

                                        <Text style={{
                                            color: styles.textWhite.color,
                                            fontSize: 14,
                                            paddingLeft: 15,
                                            lineHeight: 45,
                                            fontWeight:"bold"
                                        }}>{data.symbol}
                                        </Text>
                                        <Text style={[styles.txtMainSub, {
                                            fontSize: 12,
                                            paddingLeft: 15,
                                            lineHeight: 45
                                        }]}>
                                            ({data.name})
                                    </Text>
                                    </View>
                                )
                            }}
                            selectedValue={symbol}
                            onValueChange={this.onHandleSelected}
                            placeholder={''}
                            label={["symbol"]}
                            textCenter={""}
                            value={"symbol"}
                            source={cryptoWallet}
                            hasBtn={
                                <Icon name={"list"} size={15} style={{
                                    padding: 20
                                }} color={styles.textWhite.color} />
                            }
                        /> : null
                }
            >
                <KeyboardAwareScrollView onPress={Keyboard.dismiss}
                    contentContainerStyle={{}}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={{ zIndex: 0, flex: 1, justifyContent: 'center', paddingTop: 15 }}>
                        <SliderCustomize width={dimensions.width - 90} activeIndex={this.state.currentPosition - 1} />

                        <View style={{ paddingTop: 0, paddingBottom: 5, flex: 1 }}>
                            {this.renderStep()}
                        </View>
                        {/* <View style={{ marginTop: 10 }}> */}
                        <BtnWithdraw
                            currentPosition={currentPosition}
                            onHandleSubmit={() => {
                                this.handleSubmit()
                            }}
                            onGoBack={() => {
                                this.setState({ checked: false, timer: 60, disable: false })
                                _onRefresh()
                                // navigation.goBack()
                                this.close();
                            }}
                            onCancelVisible={
                                () => {
                                    this.setState({
                                        input2FA: true,
                                        modalWithdrawCoinVisible: false,
                                        verifyCode: '',
                                        checked: false,
                                        timer: 60,
                                        disable: false
                                    })
                                }
                            }
                            checkCancel={checkCancel}
                        />
                        <InfoWithdraw
                            currentPosition={this.state.currentPosition}
                            currencyList={currencyList}
                            amount={amount}
                            symbol={symbol}
                            toAddress={toAddress}
                            tag={tag}
                            infoCurrency={infoCurrency}
                        />


                        {/* </View> */}
                    </View>
                </KeyboardAwareScrollView>
                {/*end-step*/}
                {/*input-2FA*/}

                <ConfirmModal
                    visible={is_confirm}
                    title={title}
                    content={content}
                    onClose={() => this.setState({ is_confirm: false, resultType: "", resultText: "" })}
                    resultText={this.state.resultText} resultType={this.state.resultType}
                    ButtonOKText={ButtonOKText}
                    ButtonCloseText={"CLOSE".t()}

                />
                <ConfirmModal
                    visible={input2FA}
                    title={`${'WITHDRAWALS'.t()} ${symbol}`}
                    isViewContent={true}
                    viewContent={
                        <CancelModal
                            twoFactorService={twoFactorService}
                            verifyCode={verifyCode}
                            onChangeVerifyCode={(verifyCode) => this.setState({ verifyCode })}
                            onSendEmail={() => this.onSentMail()}
                            checked={checked}
                            timer={timer}
                        />
                    }
                    onClose={() => this.setState({
                        input2FA: false
                    })}
                    onOK={this.cancelWithdraw}
                    ButtonOKText={'CANCEL'.t()}
                />
            </ContainerFnx>

        )
    }
}

const mapStateToProps = state => {
    return {
        walletBalance: state.tradeReducer.walletBalance,
        currencyList: state.commonReducer.currencyList,
        language: state.commonReducer.language,
        walletBalanceChange: state.tradeReducer.walletBalanceChange
    }
}
export default connect(mapStateToProps, { setCurrencyWithdrawFiat, setStatusBar })(WithdrawCoin);
