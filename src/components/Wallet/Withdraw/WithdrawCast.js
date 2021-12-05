import React, { Fragment } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    BackHandler,
    TextInput
} from 'react-native';
import { Button, Left, Header } from 'native-base';
import { style } from "../../../config/style/index";
import Icon from 'react-native-vector-icons/FontAwesome';
import { alertError, dimensions, formatCurrency, formatTrunc, jwtDecode } from "../../../config/utilities";
import { constant } from "../../../config/constants";
import { authService } from "../../../services/authenticate.service";
import connect from "react-redux/es/connect/connect";
import { httpService } from "../../../services/http.service";
import ConfirmModal from "../../Shared/ConfirmModal";
import SignalRService from "../../../services/signalr.service";
import { commonService } from "../../../services/common.service";
import Step0 from "./StepForWithdraw/step0";
import Step1 from "./StepForWithdraw/step1";
import Step2 from "./StepForWithdraw/step2";
import Step3 from "./StepForWithdraw/step3";
import Step4 from "./StepForWithdraw/step4";
import { getWithdrawLog, setCurrencyWithdrawFiat } from "../../../redux/action/wallet.action";
import SliderCustomize from "../../Shared/Slider";
import ModalAlert from "../../Shared/ModalAlert";
import { Spiner, HeaderFnx, SendEmailField } from "../../Shared";
import _ from "lodash"
import ContainerApp from '../../Shared/ContainerApp';
const { width, height } = Dimensions.get('window');
import { setStatusBar, noticeChange } from "../../../redux/action/common.action"
import { NavigationEvents } from "react-navigation"
import ContainerFnx from '../../Shared/ContainerFnx';
import PickerSearch from '../../Shared/PickerSearch';
// const labels = ["1", "2", "3", "4"];
import {styles} from "react-native-theme";
class WithdrawCast extends React.Component {
    constructor(props) {
        super(props);
        const currentRequest = this.props.navigation.state.params.currentRequest;
        this.state = {
            visibleCastWithdraw: this.props.visibleCastWithdraw,
            currentPosition: currentRequest ? currentRequest.currentPosition : 0,
            submitted: false,
            paymentMethod: 'BankTransfer',
            selectedUnit: currentRequest ? currentRequest.selectedUnit : this.props.navigation.state.params.symbol,
            amount: '',
            isAmount: '',
            seconds: 9,
            checkTextChange: false,
            minute: 0,
            checkTime: false,
            checkCancel: false,
            sessionId: '',
            //
            h: 0,
            m: 0,
            s: 0,
            contact: false,
            activeBalance: {
                available: 0,
                pending: 0,
                total: 0
            },
            coinList: [
            ],
            bankAccounts: [],
            branchList: [],
            twoFACode: '',
            paymentGatewayId: 'b11f8efc-a8cc-425f-995b-8d4c08771424',
            OTP: '',
            request: {},
            openConfirm: false,
            paymentGateway: [
                {
                    "code": "BankTransfer",
                    "name": "Bank Transfer",
                    "imageUrl": "https://media-fnx.s3-ap-southeast-1.amazonaws.com/20181112/62120025/internetBanking.jpg",
                    "ordNo": 0,
                    "isDeposit": true,
                    "isWithdrawal": false,
                    "config": {
                        "fee_rate": null,
                        "fixed_fee": null
                    },
                    "id": "b11f8efc-a8cc-425f-995b-8d4c08771424"
                }
            ],
            activeMethod: {
                "code": "BankTransfer",
                "name": "Bank Transfer",
                "imageUrl": "https://media-fnx.s3-ap-southeast-1.amazonaws.com/20181112/62120025/internetBanking.jpg",
                "ordNo": 0,
                "isDeposit": true,
                "isWithdrawal": false,
                "config": {
                    "fee_rate": null,
                    "fixed_fee": null
                },
                "id": "b11f8efc-a8cc-425f-995b-8d4c08771424"
            },
            bankList: [],
            currentRequest: currentRequest || {},
            isReady: true,
            data: null,
            isSearchList: false,
            labelCoin: '',
            name: '',
            hasAcc: false,
            itemObj: '',
            vertifyCode:'',
            isViewContent:false,
            timer: 60,
            checked: false,
        }
    }

    async componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        let user = await jwtDecode();
        this.getCoinList();
        this.getBalance(this.state.selectedUnit)
        this.getBankAccount();
        this.getPaymentGateway();
        await this.getBankCurrencyCode(this.state.selectedUnit);
        this.setState({
            customerEmail: user.sub,
            accId: user.id,
            branches: [],
            isReady: false
        })
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.walletBalanceChange && nextProps.walletBalanceChange.notityType === 2 && this.state.currentPosition === 3) {
            this.getBalance(this.state.selectedUnit);
            jwtDecode().then(acc => {
                if (acc) {
                    authService.getWithdrawFiatLog(acc.id, 1, 15).then(withdrawRes => {
                        if (withdrawRes) {
                            let withdrawLog = withdrawRes.source.filter(e => e.id === this.state.request.requestId && e.status >= 4);
                            if (withdrawLog.length > 0) {
                                this.setState({ currentPosition: 4 })
                                console.log(withdrawLog);
                                if (withdrawLog[0].status === constant.PAYMENT_STATUS.Completed) {
                                    this.getBalance(this.state.selectedUnit)
                                    this.setState({ messageType: 'S', messageText: "WITHDRAWAL_SUCCESS".t() })
                                }
                                else if (withdrawLog[0].status === constant.PAYMENT_STATUS.Rejected) {
                                    this.setState({ messageType: 'E', messageText: "WITHDRAWALS_REJECT_MESSAGE".t() })
                                }
                                else {
                                    this.setState({ messageType: 'E', messageText: withdrawLog[0].statusText })
                                }
                            }
                        }
                    })
                }
            })
        }
    }

    getBankCurrencyCode = async (currencyCode) => {
        let bankList = await authService.getBankByCurrencyCode(currencyCode);
        this.setState({ bankList })
    }

    getCoinList() {
        jwtDecode().then(user => {
            if(user){
                authService.getFiatWallet(user.id).then(coinList => {
                    this.setState({ coinList })
                }).then((coinList) => {
                    var coinFilter = coinList.filter((item, index) => item.currency == this.state.selectedUnit);
        
                    this.setState({
                        labelCoin: `${coinFilter[0].currency} - ${coinFilter[0].name}`
                    })
                }).catch(err => console.log(err))
            }else{
                commonService.getFiatList().then(coinList => {
                    this.setState({ coinList })
                    console.log(coinList, "coinList");
                    return coinList
                }).then((coinList) => {
                    var coinFilter = coinList.filter((item, index) => item.currency == this.state.selectedUnit);
        
                    this.setState({
                        labelCoin: `${coinFilter[0].currency} - ${coinFilter[0].name}`
                    })
                }).catch(err => console.log(err))
            }
        }).catch(err => console.log(err))
        
    }

    getBalance(symbol) {
        jwtDecode().then(acc => {
            if (acc) {
                let accId = acc.id;
                authService.getWalletBalanceByCurrency(accId, symbol).then(res => {
                    this.setState({ activeBalance: res })
                })
            }
        })
    }


    getBankAccount() {
        jwtDecode().then(acc => {
            if (acc) {
                let accId = acc.id;
                authService.getBankAccount(accId).then(res => {
                    this.setState({ bankAccounts: res })
                })
            }
        })
    }

    getPaymentGateway() {
        console.log(this.state.selectedUnit,"selected Unit");
        authService.getPaymentGateway(this.state.selectedUnit).then(res => {
            if (res) {
                console.log(res,"res pay ment gateway");
                res.map((item, index) => {
                    if (item.code === "BankTransfer") {
                        this.setState({ paymentGatewayId: item.id });
                    }
                })
                // this.setState({ paymentGateway: res });
            }
            else {
                this.modalError("PAYMENT_GATEWAY_NOT_EXIST".t());
            }
        })
    }


    handleClose = () => {
        const {currentPosition,coinList} = this.state;
        const {navigation,getWithdrawLog,noticeChange,setCurrencyWithdrawFiat} = this.props;
        const { fromHome } = this.props.navigation.state.params;

        if(fromHome){
            navigation.goBack();
        }else{
            getWithdrawLog(1, 15, this.state.selectedUnit);
            navigation.goBack();
            noticeChange(2)
            setCurrencyWithdrawFiat(this.state.selectedUnit);
        }
       
    }

    createWithdrawRequest(model, twoFACode) {
        // this.setState({isReady: true})
        let { selectedUnit, paymentGatewayId, sessionId } = this.state;
        const self = this;
        let { selectedBank, selectedBranch, receiveBankAccountNo, receiveBankAccountName, amount, isSave, branchList } = model;
        this.setState({
            twoFACode,
            branchList
        })
        let bankInfo = this.getSelectedBank(selectedBank)
        let bankCurrencySettings = bankInfo.bankCurrencySettings;
        let min = 0, max = 9999999999999;
        if (!twoFACode) {
            let errorText = "2FA_REQUIRED".t();
            this.modalError(errorText);
            return;
        }
        jwtDecode().then(acc => {
            const accId = acc.id, customerEmail = acc.sub;
            authService.createFiatWithdrawalRequest(accId, selectedUnit, selectedBank,selectedUnit ==="IDR"?"":selectedBranch, receiveBankAccountName,
                receiveBankAccountNo, amount.str2Number(), twoFACode, paymentGatewayId, customerEmail, sessionId).then(res => {
                    // console.log(accId, selectedUnit, selectedBank, selectedBranch, receiveBankAccountName,
                    //     receiveBankAccountNo, amount.str2Number(), twoFACode, paymentGatewayId, customerEmail, sessionId, "full data");
                    this.setState({ isReady: false })
                    if (res.status) {
                        this.getBalance(this.state.selectedUnit);
                        let estimatedTime = res.estimatedTime.split(':');
                        let request = Object.assign(res, {},
                            {
                                paymentGatewayId,
                                receiveBankAccountName,
                                selectedBranch,
                                receiveBankAccountNo,
                                amount,
                                currentBank: this.getSelectedBank(selectedBank),
                                currentBranch: this.getSelectedBranch(selectedBranch),
                                sessionId
                            });
                        // console.log(res)
                        this.setState({
                            request,
                            currentPosition: 2,
                            errorText: '',
                            h: Number(estimatedTime[0]),
                            m: Number(estimatedTime[1]),
                            s: Number(estimatedTime[2]),
                        });
                    }
                    else {
                        let errorText = res.message.t();
                        this.modalError(errorText);
                    }
                })
                .catch(err => {
                    httpService.onError(err, this.props.navigation);
                })
        })
    }

    addBankAccount = async (model) => {
        let acc = await jwtDecode();
        if (acc) {
            let { selectedBank, selectedBranch, receiveBankAccountNo, receiveBankAccountName, amount, isSave, branchList } = model;

            const {paymentGatewayId,selectedUnit } = this.state;
            authService.addBankAccount(acc.id, selectedBank,selectedUnit ==="IDR"?"":selectedBranch, receiveBankAccountNo, receiveBankAccountName, paymentGatewayId).then(res => {
                console.log(res,paymentGatewayId,"save data");
                this.getBankAccount();
            })
                .catch(err => {

                })
        }
    }

    checkWithdraw = (model) => {

        let { selectedUnit, paymentGatewayId, sessionId } = this.state;
        const self = this;
        let { selectedBank, selectedBranch, receiveBankAccountNo, receiveBankAccountName, amount, isSave, branchList } = model;
        this.setState({
            request: {
                paymentGatewayId,
                receiveBankAccountName,
                selectedBranch,
                receiveBankAccountNo,
                amount,
                currentBank: this.getSelectedBank(selectedBank),
                currentBranch: this.getSelectedBranch(selectedBranch),
                sessionId
            },
            
        })
        let bankInfo = this.getSelectedBank(selectedBank)
        let bankCurrencySettings = bankInfo.bankCurrencySettings;
        let min = 0, max = 9999999999999;
        if (bankCurrencySettings && bankCurrencySettings.length > 0) {
            let setting = bankCurrencySettings.filter(o => o.currencyCode === selectedUnit);
            if (setting.length > 0) {
                min = setting[0].minWithdrawal;
                max = setting[0].maxWithdrawal;
            }
        }
        console.log(model, max, min, "model kaka");
        if (!selectedBank) {
            this.modalError(`${"PLEASE_SELECT".t()} ${'SELECT_BANK'.t()}`);
            return;
        } else if (!selectedBranch && selectedUnit !== "IDR") {
            this.modalError(`${"PLEASE_SELECT".t()} ${'SELECT_BRANCH'.t()}`);
            return;
        } else if (!receiveBankAccountName) {
            this.modalError(`${"PLEASE_ENTER".t()} ${'RECEIVING_BANK_ACCOUNT_NAME'.t()}`);
            return;
        } else if (!receiveBankAccountNo) {
            this.modalError(`${"PLEASE_ENTER".t()} ${'ACCOUNT_NUMBER'.t()}`);
            return;
        } else if (amount.str2Number() < min) {
            let errorText = "MINI_AMOUNT_WITHDRAWAL_VALIDATE".t().replace('{0}', formatTrunc(this.props.currencyList, min, selectedUnit, true));
            this.modalError(errorText);
            return;
        } else if (amount.str2Number() > max) {
            let errorText = "MAX_AMOUNT_WITHDRAWAL_VALIDATE".t().replace('{0}', formatTrunc(this.props.currencyList, max, selectedUnit, true));
            this.modalError(errorText);
            return;
        } else {
            this.setState({
                currentPosition: 1,
                amount: '0',
                selectedBankAccount: '',
                selectedBranch: '',
                selectedBank: '',
                receiveBankAccountName: '',
                receiveBankAccountNo: '',
                twoFACode: '',
                OTP: '',
                errorText: '',
                timer: 60,
                checked: false,
                isSave: false,
                model
            })
        }

        if (isSave) {
            console.log("isSave kaka")
            this.addBankAccount(model).then((res) => {
                console.log(res,"isSave")
            });
        }

    }
    handleNext = (model, twoFaCode) => {
        const { currentPosition, amount } = this.state;
        switch (currentPosition) {
            case 0:
                if (this.state.activeMethod) {
                    this.setState({
                        branchList:model.branchList
                    },()=>this.checkWithdraw(model))
                    
                }

                break
            case 1:
                this.createWithdrawRequest(this.state.model, twoFaCode);
                break;
            default:
                break
        }
    }

    onUnitChange = async (text) => {
        this.setState({ selectedUnit: text })
        this.getBankAccount();
        await this.getBankCurrencyCode(text);
        this.getBalance(text);
    }
    onPressInput = () => {
        this.setState({
            data: this.state.coinList,
            isSearchList: true,
            itemObj: ["currency", "name"],
            name: "coin",
            hasAcc: false
        })
    }
    async onSentMail() {
     
        this.setState({checked: true });
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
    onHandleSelected = (currency) => {
        console.log(currency,"currency selected")
        this.setState({
            selectedUnit: currency,
        })
        this.getBankAccount();
        this.getBankCurrencyCode(currency);
        this.getBalance(currency);
    }
    componentWillUnmount() {
        this.backHandler.remove()
    }
    handleBackPress = () => {
        this.handleClose() // works best when the goBack is async
        return true;
    }
    renderStep = () => {
        const {
            activeBalance, selectedUnit, bankAccounts, messageType, paymentGateway, coinList,
            bankList, paymentMethod, request, messageText, currentRequest
        } = this.state;
        const { userInfo } = this.props.navigation.state.params;
        const { currencyList, navigation } = this.props;
        const currentBank = this.getSelectedBank(request.selectedBank);
        const currentBranch = this.getSelectedBranch(request.selectedBranch);
        console.log(selectedUnit, "selectedUnit");
        switch (this.state.currentPosition) {
            case 0:
                return (
                    <Step0
                        labelCoin={this.state.labelCoin}
                        isSearchList={this.state.isSearchList}
                        data={this.state.data}
                        itemObj={this.state.itemObj}
                        name={this.state.name}
                        hasAcc={this.state.hasAcc}
                        onPress={this.onPressInput}
                        onHandleBack={() => this.setState({
                            isSearchList: false
                        })}
                        onHandleSelected={this.onHandleSelected}

                        activeBalance={activeBalance}
                        coinList={coinList}
                        currencyList={currencyList}
                        selectedUnit={selectedUnit}
                        paymentGateway={paymentGateway}
                        paymentMethod={paymentMethod}
                        submit={this.handleNext}
                        unitChange={this.onUnitChange}
                        setPaymentMethod={(item) =>
                            this.setState({
                                paymentMethod: item.code,
                                activeMethod: item,
                                paymentGatewayId: item.id
                            })}
                        bankAccounts={bankAccounts}
                        bankList={bankList}
                        userInfo={userInfo}
                        setSessionId={(sessionId) => this.setState({ sessionId })} 
                    />
                )
            case 1:
                return (
                    <Step1
                        selectedUnit={selectedUnit}
                        bankAccounts={bankAccounts}
                        bankList={bankList}
                        onNext={this.handleNext}
                        userInfo={userInfo}
                        currencyList={currencyList}
                        setSessionId={(sessionId) => this.setState({ sessionId })}
                        handleBack={this.handleBack}
                        request={request}
                        currentRequest={currentRequest}
                    />
                )
            case 2:
                return (
                    <Step2
                        currencyList={currencyList}
                        request={request}
                        selectedUnit={selectedUnit}
                        currentBank={currentBank}
                        currentBranch={currentBranch}
                        currentRequest={currentRequest}
                        submit={this.handleConfirm}
                        confirmCancel={() => {
                            console.log("openConfirm")
                            this.setState({ openConfirm: true })}}
                    />
                )
            case 3:
                return (
                    <Step3
                        currentRequest={currentRequest}
                        selectedUnit={selectedUnit}
                        request={request}
                        currencyList={currencyList}
                    />
                )
            case 4:
                return (
                    <Step4
                        currentRequest={currentRequest}
                        request={request}
                        currencyList={currencyList}
                        selectedUnit={selectedUnit}
                        messageType={messageType}
                        messageText={messageText} />
                )
            default:
                this.setState({ currentPosition: 0 })
                return
        }
    }

    handleConfirm = async (OTP, sessionId) => {
        this.setState({ isReady: true })
        await this.confirmOtp(OTP, sessionId);
    }
    modalError(content, visible = true) {
        this.setState({
            visible: visible,
            content: content,
            isReady: false
        })
    }
    confirmOtp = async (OTP, sessionId) => {
        const { request, currentRequest } = this.state
        console.log(OTP, "request otp");
        // console.log(currentRequest, "curent request otp");
        // console.log(sessionId, "sessionId otp");
        if (typeof sessionId !== "undefined" && _.isEmpty(request) !== true && _.isEmpty(currentRequest) === true) {
            let user = await jwtDecode();
            if (user) {
                authService.getFiatRequest(user.id, request.requestId)
                    .then(res => {

                        if (res) {
                            authService.confirmFiatWithdrawByOTP(sessionId, res.id, OTP).then(res2 => {
                                this.setState({ isReady: false })
                                if (res2) {
                                    if (res2.status) {
                                        this.setState({
                                            otpResult: res2,
                                            currentPosition: 3,
                                            messageText: res2.message,
                                            errorText: ''
                                        })
                                    }
                                    else {
                                        this.modalError(res2.message.t());
                                        return;
                                    }
                                }
                            }).catch(err => this.setState({
                                isReady: false
                            }))
                        } else {
                            this.setState({
                                isReady: false
                            })
                        }

                    })
                    .catch(err => this.setState({
                        isReady: false
                    }))
            }
        } else if (sessionId && _.isEmpty(request) === true && _.isEmpty(currentRequest) !== true) {

            authService.confirmFiatWithdrawByOTP(sessionId ? sessionId : currentRequest.sessionId, currentRequest.id, OTP).then(res => {
                this.setState({ isReady: false })
                if (res) {
                    if (res.status) {
                        this.setState({
                            otpResult: res,
                            currentPosition: 3,
                            messageText: res.message,
                            errorText: ''
                        })
                    }
                    else {
                        this.modalError(res.message.t());
                        return;
                    }
                }
            }).catch(err => this.setState({
                isReady: false
            }))
        } else if (_.isEmpty(request) !== true && typeof sessionId === "undefined" && _.isEmpty(currentRequest) === true) {

            authService.confirmFiatWithdrawByOTP(request.otpToken.sessionId, request.requestId, OTP).then(res => {
                this.setState({ isReady: false })
                if (res) {
                    if (res.status) {
                        this.setState({
                            otpResult: res,
                            currentPosition: 3,
                            messageText: res.message,
                            errorText: ''
                        })
                    }
                    else {

                        this.modalError(res.message.t());
                        return;
                    }
                }
            }).catch(err => {
                console.log(err, "err")
                this.setState({
                    isReady: false
                })
            }

            )
        } else {
            this.modalError("Token has expired".t())
        }
        // debugger;

    }

    cancelWithdraw = async () => {
        this.setState({ openConfirm: false })
        let { request, twoFACode,vertifyCode,sessionId,currentRequest } = this.state;
        console.log(vertifyCode, request,currentRequest,"request2");
        let user = await jwtDecode();
        if (user) {
            authService.cancelWithdrawFiat(user.id,sessionId?sessionId:(Object.keys(currentRequest).length !== 0?currentRequest.sessionId:request.otpToken.sessionId),Object.keys(currentRequest).length !== 0?currentRequest.id:request.requestId, vertifyCode).then(res => {
                if (!res.status) {
                    this.setState({
                        openConfirm: false,
                        vertifyCode: null,
                        messageText: null,
                        resultType: null,
                        resultText: null,
                    })
                    this.modalError(res.message.t());
                }
                else {
                    this.setState({
                        openConfirm: false,
                        vertifyCode: null,
                        messageText: null,
                        resultType: null,
                        resultText: null,
                    })
                    this.handleClose();
                }
            })
        }
    }

    getSelectedBank(id) {
        let bk = this.state.bankList.filter(o => o.id === id);
        if (bk.length > 0) {
            return bk[0]
        }
        else {
            return {}
        }
    }

    getSelectedBranch(id) {
        let bk = this.state.branchList.filter(o => o.id === id);
        if (bk.length > 0) {
            return bk[0]
        }
        else {
            return {}
        }
    }

    handleBack = () => {
        this.setState({
            currentPosition: this.state.currentPosition - 1,
            errorText: ''
        })
    }

    render() {
        let { selectedUnit, openConfirm, isReady,currentPosition,coinList } = this.state;
        let { navigation } = this.props;
        const { userInfo,fromHome } = this.props.navigation.state.params;
        console.log(userInfo,this.props.navigation.state.params, "userInfo");
        return (
            <ContainerFnx
            spaceTop={0}
                colorStatus={style.colorWithdraw}
                navigation={navigation}
                title={`${'WITHDRAWALS'.t()} ${selectedUnit}`}
                hasBack
                isbtnSpecial
                onPress={this.handleClose}
                backgroundHeader={styles.backgroundSub.color}
                // listen_event={[constant.SOCKET_EVENT.PRICE_CHANGE_NOTIFY]}
                hasRight={
                    currentPosition === 0 ?
                    <PickerSearch
                        autoEnable={fromHome?true:false}
                        selectedValue={selectedUnit}
                        onValueChange={this.onHandleSelected}
                        placeholder={'SELECT_ACCOUNT'.t()}
                        label={["currency","name"]}
                        textCenter={" - "}
                        value={"currency"}
                        source={coinList}
                        hasBtn={
                            <Icon name={"list"} size={15} style={{
                                padding:20
                            }} color={styles.textWhite.color} />
                        }
                    /> : null
                }
            >
            <Spiner isVisible={isReady} />
                <View>
                    <View
                    style={{
                        paddingTop:15
                    }}
                    >
                        <SliderCustomize width={dimensions.width - 90} activeIndex={this.state.currentPosition - 1} />

                        <Text
                            style={[styles.bgSellOldSell, { paddingVertical: 5 }]}>{this.state.errorText && `${this.state.errorText}`.t()}</Text>
                        {this.renderStep()}
                    </View>
                </View>
                <ModalAlert
                    content={this.state.content}
                    visible={this.state.visible}
                    onClose={() => this.setState({ visible: false })}
                />
                 <ModalAlert
                    visible={openConfirm}
                    contentType={"CANCEL_WITHDRAW_FIAT".t()}
                    content={"CANCEL_WITHDRAW_FIAT_CONFIRM".t()}
                    
                    ButtonOKText={"OK".t()}
                    onClose={() => {
                        this.setState({
                            openConfirm: false,
                            isViewContent: false,
                            vertifyCode: null,
                            messageText: null,
                            resultType: null,
                            resultText: null,
                        })
                    }}
                    resultText={this.state.resultText}
                    resultType={this.state.resultType}
                    isViewContent={this.state.isViewContent}
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
                                                backgroundColor:"transparent",
                                                borderWidth:0.5,borderColor:style.colorBorderBox,borderBottomWidth:0.5,color: styles.textWhite.color 
                                            }]}
                                            placeholder={"INPUT_YOUR_2FA_CODE_GG".t()}
                                            placeholderTextColor={style.textMain.color}
                                            keyboardType={'numeric'}
                                            onChangeText={(text) => this.setState({ vertifyCode: text })}
                                            value={this.state.vertifyCode} />
                                    </View>
                            }
                        </View>
                    )}
                    onOK={() => {
                        if (this.state.isViewContent === true) {
                            return this.cancelWithdraw()
                        } else {
                            this.setState({
                                content: null,
                                isViewContent: true
                            })
                        }
                    }}
                />
            </ContainerFnx>
        )
    }
}

const mapStateToProps = state => {
    return {
        statusBar: state.commonReducer.statusBar,
        walletBalance: state.tradeReducer.walletBalance,
        balance: state.tradeReducer.balance,
        currencyList: state.commonReducer.currencyList,
        walletBalanceChange: state.tradeReducer.walletBalanceChange,
    }
}
export default connect(mapStateToProps, { setStatusBar, getWithdrawLog, noticeChange,setCurrencyWithdrawFiat })(WithdrawCast);
