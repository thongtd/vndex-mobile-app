import React from 'react';
import { View, Text, TouchableOpacity, Linking, Image, TextInput, StyleSheet, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { Button, Container, Item, Left, Right, Header } from 'native-base';
import { style } from "../../../config/style";
import Icon from "react-native-vector-icons/FontAwesome";
import StepIndicator from "react-native-step-indicator";
import { dimensions, formatSCurrency, jwtDecode } from "../../../config/utilities";
import { constant } from "../../../config/constants";
import CountDown from "react-native-countdown-component";
import { connect } from 'react-redux';
import { authService } from "../../../services/authenticate.service";
import SignalRService from "../../../services/signalr.service";
import SliderCustomize from '../../Shared/Slider';
import ConfirmModal from "../../Shared/ConfirmModal"
import { Spiner } from "../../Shared";
import { HeaderFnx } from "../../Shared"
import I18n from "react-native-i18n"
import { setStatusBar } from "../../../redux/action/common.action"
import { NavigationEvents } from "react-navigation"
import ContainerFnx from '../../Shared/ContainerFnx';
import { SendEmailField } from '../../Shared';
import Toast from 'react-native-simple-toast';
import { styles } from "react-native-theme";
var locale = I18n.locale;

const customStyles = {
    stepIndicatorSize: 20,
    currentStepIndicatorSize: 22,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: 'green',
    stepStrokeFinishedColor: 'green',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorUnFinishedColor: '#aaaaaa',
    labelColor: style.textMain.color,
    labelSize: 14,
    currentStepLabelColor: 'green',
    marginBottom: 10
}

class HistoryWithdrawCoin extends React.Component {
    constructor(props) {
        super(props);
        this.onGetWalletBalanceChange = this.getWalletBalanceChange
        this.state = {
            value: 0,
            symbol: null,
            address: null,
            code: null,
            createdDate: null,
            txId: null,
            requestId: null,
            statusWithdraw: 6,
            h: null,
            m: null,
            s: null,
            currentPosition: 0,
            contact: false,
            checked: false,
            timer: 60,
            isReady: true,
            isDisabled: false,
            sessionId: null,
            is_confirm: false,
            content: null,
            title: null,
            ButtonOKText: null
        }
        this.confirmOtp = this.confirmOtp.bind(this);
    }

    componentDidMount() {
        const { data } = this.props.navigation.state.params;

        this.openWithdrawInfo(data)
    }

    async openWithdrawInfo(data) {
        console.log(data, "data hi");
        let user = await jwtDecode();
        let assetRequest = await authService.getAssetRequest(user.id, data.id);
        if (assetRequest) {
            if (data.currency) {
                this.setState({
                    symbol: data.currency,
                    createdDate: data.createdDate,
                    status: data.statusLable,
                    value: data.amount,
                    address: data.toAddress,
                    txId: data.txId,
                    requestId: data.id,
                    statusWithdraw: assetRequest.status,
                    requestId: data.id,
                    isReady: false,
                    requestId: data.id,
                    extraFields: typeof data.toExtraFields !== "undefined" ? data.toExtraFields : null
                })
            } else {
                this.setState({

                    statusWithdraw: assetRequest.status,
                    requestId: data.id,
                    isReady: false,

                })
            }

            if (assetRequest.ttl) {
                let estimatedTime = assetRequest.ttl.split(':');
                this.setState({
                    h: Number(estimatedTime[0]),
                    m: Number(estimatedTime[1]),
                    s: Number(estimatedTime[2]),
                    isReady: false
                })
            }
        }
        if (assetRequest.status === constant.STATUS_FUNDS.EmailSent) {
            this.setState({ currentPosition: 2 })
        } else {
            this.setState({ currentPosition: 3 })
        }

    }

    getWalletBalanceChange = async () => {
        let user = await jwtDecode();
        let withdrawRes = await authService.getWithdrawCoinLog(user.id, 1, 15);
        let withdrawLog = withdrawRes.filter(e => e.currency === this.state.symbol);
        this.setState({ withdrawLog })
        withdrawRes.forEach(e => {
            if (e.id === this.state.requestId) {
                this.setState({ statusWithdraw: e.status })
            }
        })
    }

    renderStatusWithdraw = () => {
        switch (this.state.statusWithdraw) {
            case constant.STATUS_FUNDS.Rejected:
                return (
                    <Text style={[styles.bgSellOldNew, {
                        textAlign: 'center',
                        padding: 15
                    }]}>{'WITHDRAWALS_REJECT_MESSAGE'.t()}</Text>
                )
            case constant.STATUS_FUNDS.Processing:
                return (
                    <View style={{ padding: 10 }}>
                        <Text
                            style={[style.textMain, {
                                marginBottom: 10,
                                textAlign: 'center'
                            }]}>{'TIME_COMPLETE'.t()}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <CountDown
                                until={60 * this.state.m + this.state.s}
                                size={18}
                                onFinish={() => this.setState({ contact: true })}
                                digitBgColor={'transparent'}
                                digitTxtColor={styles.textWhite.color}
                                timeToShow={['H']}
                                labelH={''}
                                labelM={''}
                                labelS={''}
                            />
                            <Text style={{ color: styles.textWhite.color, fontSize: 18, paddingTop: 10 }}> : </Text>
                            <CountDown
                                until={60 * this.state.m + this.state.s}
                                size={18}
                                onFinish={() => this.setState({ contact: true })}
                                digitBgColor={'transparent'}
                                digitTxtColor={styles.textWhite.color}
                                timeToShow={['M']}
                                labelH={''}
                                labelM={''}
                                labelS={''}
                            />
                            <Text style={{ color: styles.textWhite.color, fontSize: 18, paddingTop: 10 }}> : </Text>
                            <CountDown
                                until={60 * this.state.m + this.state.s}
                                size={18}
                                onFinish={() => this.setState({ contact: true })}
                                digitBgColor={'transparent'}
                                digitTxtColor={styles.textWhite.color}
                                timeToShow={['S']}
                                labelH={''}
                                labelM={''}
                                labelS={''}
                            />
                        </View>
                        {
                            this.state.contact &&
                            <View>
                                <Text style={[styles.bgSellOldNew, { textAlign: 'center' }]}>{'WITHDRAWAL_SUPPORT'.t()}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <TouchableOpacity
                                        style={{ marginHorizontal: 10, padding: 10 }}
                                        onPress={() => {
                                            Linking.openURL(constant.SUPPORT.MAIL)
                                        }}
                                    >
                                        <Image source={require('../../../assets/img/ic_email_sp.png')}
                                            style={{ width: 17, height: 13 }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ marginHorizontal: 10, padding: 10 }}
                                        onPress={() => {
                                            Linking.openURL(constant.SUPPORT.TELEGRAM)
                                        }}
                                    >
                                        <Image source={require('../../../assets/img/ic_telegram_sp.png')}
                                            style={{ width: 18, height: 15 }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ marginHorizontal: 10, padding: 10 }}
                                        onPress={() => {
                                            Linking.openURL(constant.SUPPORT.FACEBOOK)
                                        }}
                                    >
                                        <Image source={require('../../../assets/img/ic_fb_sp.png')}
                                            style={{ width: 8, height: 17 }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </View>
                )
            case constant.STATUS_FUNDS.Completed:
                return (
                    <Text
                        style={[styles.bgBuyOldNew, { textAlign: 'center', paddingVertical: 15, paddingHorizontal: 10 }]}>{'WITHDRAWAL_SUCCESS'.t()}</Text>
                )
            case constant.STATUS_FUNDS.Cancelled:
                return (
                    <Text style={[styles.bgSellOldNew, { textAlign: 'center', paddingVertical: 15, paddingHorizontal: 10 }]}>{'WITHDRAWAL_CANCEL'.t()}</Text>
                )
            case constant.STATUS_FUNDS.EmailSent:
                return (
                    <View>
                        <SendEmailField
                            maxLength={constant.MAX_OTP}
                            placeholder={'OTP'.t()}
                            onChangeText={(code) => this.setState({ code })}
                            value={this.state.code}
                            disabled={this.state.isDisabled}
                            onSend={() => {
                                this.resendOtp(), this.setState({ checked: true })
                            }}
                            checked={this.state.checked}
                            timer={this.state.timer}
                            titleBtn={"SEND_EMAIL".t()}
                        />

                        <Button block style={[style.buttonNext, style.buttonHeight, { marginTop: 30, backgroundColor: styles.bgButton.color }]} onPress={this.confirmOtp}>
                            <Text style={style.textWhite}>{'SUBMIT'.t()}</Text>
                        </Button>
                    </View>
                )
            default:
                return
        }
    }

    async resendOtp() {
        Toast.showWithGravity("OTP code has been sent to your email".t(), Toast.LONG, Toast.CENTER);
        const { id } = this.props.navigation.state.params.data;
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
        let response = await authService.getOtp(user.sub, 'COIN_WITHDRAWAL', id);
        console.log(response, "respon history draw");
        if (response) {
            this.setState({ sessionId: response.sessionId, requestId: id })
        }

    }

    async confirmOtp() {
        const { sessionId, code, requestId } = this.state;
        if (code !== null && code.length > 0) {
            try {
                let data = { sessionId, code, requestId };
                let response = await authService.confirmOtpCoin(data);
                // console.log('repponse: ', response);
                if (response.code === 1) {
                    console.log(response, "response kaak")
                    this.openWithdrawInfo(response);
                } else {
                    // Alert.alert('WARNING'.t(), `${response.message}`.t(), [{ text: 'CLOSE'.t() }])
                    this.setState({
                        is_confirm: true,
                        content: "Token has expired".t(),
                        title: 'WARNING'.t()
                    })
                }
            } catch (error) {
                this.setState({
                    is_confirm: true,
                    content: error,
                    title: 'WARNING'.t()
                })
            }
        } else {
            // Alert.alert('WARNING'.t(), `OTP`.t(), [{ text: 'CLOSE'.t() }])
            this.setState({
                is_confirm: true,
                content: `OTP`.t(),
                title: 'WARNING'.t()
            })
        }
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.walletBalanceChange !== this.props.walletBalanceChange) {
            this.getWalletBalanceChange();
        }
    }

    render() {
        const { value, symbol, address, isReady, is_confirm, ButtonOKText, content, title, extraFields } = this.state;
        const { currencyList, navigation, language } = this.props;
        return (
            <ContainerFnx
                spaceTop={0}
                title={`${'WITHDRAWALS'.t()} ${symbol}`}
                hasBack
                navigation={navigation}
                style={{ marginLeft: 0, backgroundColor: "#1c2840" }}
                colorStatus={style.colorWithdraw}
            // getWalletBalanceChange={this.onGetWalletBalanceChange}
            // listen_event={[constant.SOCKET_EVENT.PRICE_CHANGE_NOTIFY]}
            >
                {
                    isReady ?

                        <Spiner isVisible={isReady} />
                        :
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'column',
                            }}
                        >
                            <View
                            >
                                <View style={{
                                    justifyContent: "center",
                                    paddingTop: 15
                                }}>
                                    <SliderCustomize width={dimensions.width - 90} activeIndex={this.state.currentPosition - 1} />
                                </View>

                                <View>
                                    <View style={{
                                        backgroundColor: this.state.currentPosition === 2 ? 'transparent' : styles.bgSub.color,
                                        paddingVertical: 5, marginTop: 20,
                                        borderWidth: this.state.currentPosition === 2 ? 0 : 0.5,
                                        borderColor: style.colorBorderBox,
                                        borderRadius: 2.5
                                    }}>
                                        {
                                            this.renderStatusWithdraw()
                                        }
                                    </View>
                                    <View>
                                        <View style={[stylest.itemTab, {
                                            backgroundColor: 'transparent',
                                            marginTop: 20
                                        }]}>
                                            <View style={{
                                                justifyContent: "space-between",
                                                flexDirection: "row"
                                            }}>

                                                <Text style={[styles.txtMainTitle]}>{'AMOUNT'.t()}</Text>
                                                <Text
                                                    style={[styles.textWhite]}>{formatSCurrency(currencyList, Number(value), symbol)} ({symbol})</Text>
                                            </View>
                                            <View style={{
                                                justifyContent: "space-between",
                                                flexDirection: "row"
                                            }}>
                                                <Text style={[styles.txtMainTitle, { paddingVertical: 10 }]}>{'RECEIVED_ADDRESS'.t()}</Text>
                                                <Text style={[styles.textWhite, { paddingVertical: 10 }]} numberOfLines={2}>{address}</Text>
                                            </View>
                                            {extraFields && extraFields.length > 0 && extraFields.map((item, index) => {
                                                return (
                                                    <View style={{
                                                        justifyContent: "space-between",
                                                        flexDirection: "row",
                                                        paddingBottom: 10
                                                    }}>
                                                        <Text style={[styles.txtMainTitle]}>
                                                            {item.localizations[language].FieldName}
                                                        </Text>
                                                        <Text style={[styles.textWhite,
                                                        (item.value === "" || item.value === null || !item.value) && { fontSize: 27, marginTop: -5 }
                                                        ]} numberOfLines={2}> {item.value ? item.value : "--"}
                                                        </Text>
                                                    </View>
                                                )
                                            })}

                                        </View>
                                    </View>
                                    <Item style={[{
                                        borderBottomWidth: 0,
                                        marginTop: 20,
                                        backgroundColor: 'transparent',
                                        marginBottom: 10
                                    }]}>
                                        <Left style={{ flexDirection: 'row' }}>
                                            <Icon name={'warning'} size={16} color={'#f6ff00'} />
                                            <Text style={[styles.textWhite, { marginLeft: 5 }]}>{'WARNING'.t()}</Text>
                                        </Left>
                                    </Item>
                                    <Text style={[styles.bgSellOldNew, { paddingBottom: 15 }]} numberOfLines={2}>{'NOTE_WITHDRAWAL'.t()}</Text>
                                </View>
                            </View>
                        </View>
                }
                <ConfirmModal
                    visible={is_confirm}
                    title={title}
                    content={content}
                    onClose={() => this.setState({ is_confirm: false, resultType: "", resultText: "" })}
                    resultText={this.state.resultText} resultType={this.state.resultType}
                    ButtonOKText={ButtonOKText}
                    ButtonCloseText={"CLOSE".t()}
                />
            </ContainerFnx>
        );
    }
}
const stylest = StyleSheet.create({
    itemTab: {
        borderBottomWidth: 0
    },
    input: {
        backgroundColor: '#19243a',
        borderRadius: 2,
        height: 40,
        justifyContent: 'center'
    }
})
const mapStateToProps = state => {
    return {
        currencyList: state.commonReducer.currencyList,
        language: state.commonReducer.language,
        walletBalanceChange: state.tradeReducer.walletBalanceChange
    }
}
export default connect(mapStateToProps, { setStatusBar })(HistoryWithdrawCoin);
