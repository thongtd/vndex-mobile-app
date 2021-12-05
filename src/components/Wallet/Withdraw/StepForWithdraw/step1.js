import { Platform, ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity, Keyboard, KeyboardAvoidingView } from "react-native";
import { Button, CheckBox, Item, Left, Picker, Right } from "native-base";
import { dimensions, formatTrunc, jwtDecode } from "../../../../config/utilities";
import Icon from "react-native-vector-icons/FontAwesome";
import { style } from "../../../../config/style";
import { constant } from "../../../../config/constants";
import React from "react";
import { authService } from "../../../../services/authenticate.service";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SendEmailField } from "../../../Shared"
import InputFieldFnx from "../../../Shared/InputFieldFnx"
import SearchList from "../../../Shared/SearchList"
import WithdrawInfo from "../WithdrawInfo";
import {styles} from "react-native-theme";

type Props = {
    bankAccounts: Array,
    bankList: Array,
    selectedUnit: String,
    onNext: any,
    userInfo: {},
    currencyList: Array
};

export default class Step1 extends React.Component<Props>{
    constructor(props) {
        super(props);
        this.state = {
            selectedBankAccount: '',
            selectedBranch: '',
            selectedBank: '',
            receiveBankAccountName: '',
            receiveBankAccountNo: '',
            twoFACode: '',
            isSave: false,
            amount: '0',
            timer: 60,
            checked: false,
            branchList: [],
            isTwoFa: false,
            data: null,
            isSearchList: false,
            labelBankAccount: '',
            labelSelectedBank: '',
            labelSelectedBranch: '',
            name: '',
            hasAcc: false
        }
    }
    componentDidMount() {
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
        let {userInfo} = this.props;
        if(userInfo.twoFactorService === constant.TWO_FACTOR_TYPE.EMAIL_2FA){
            this.onSentMail();
        }
    }

    componentWillUnmount() {
        this.keyboardDidHideListener.remove();
    }

    keyboardDidHide = () => {
        // this.input.blur();
        this.setState({
            isTwoFa: false
        })
    };

    onBankAccountChange = (text) => {
        console.log(text, "text selected");
        this.setState({
            selectedBankAccount: text
        })
        const bankAccInfo = this.props.bankAccounts.filter(o => o.id === text)[0];
        console.log(bankAccInfo, "BankAccInfo");
        if (bankAccInfo) {
            this.setState({
                selectedBank: bankAccInfo.bank.id,
                selectedBranch: bankAccInfo.bankBranch.id,
                paymentGatewayId: bankAccInfo.paymentGatewayId,
                receiveBankAccountName: bankAccInfo.bankAccountName,
                receiveBankAccountNo: bankAccInfo.bankAccountNo
            })
            this.getBankBranch(bankAccInfo.bank.id);
        }
    }

    onBankChange = (text) => {
        this.setState({
            selectedBank: text
        })
        this.getBankBranch(text);
    }

    onBranchChange = (text) => {
        this.setState({
            selectedBranch: text
        })
    }

    getBankBranch(bankId) {
        authService.getBankBranchByBankId(bankId).then(res => {
            console.log(res, "get bank branch");
            this.setState({ branchList: res })
        })
    }

    onNext = () => {
        Keyboard.dismiss();
        const { branchList, selectedBankAccount, selectedBranch, selectedBank, receiveBankAccountName, receiveBankAccountNo, twoFACode, isSave, amount } = this.state;
        let model = {
            selectedBankAccount,
            selectedBranch,
            selectedBank,
            receiveBankAccountName,
            receiveBankAccountNo,
            twoFACode,
            isSave,
            amount,
            branchList
        }
        this.props.onNext(null, twoFACode);
    }

    async onSentMail() {
        this.setState({ checked: true, });
        let timerActive = new Date().getTime();
        this.interval = setInterval(() => {
            if (this.state.timer <= 0) {
                clearInterval(this.interval);
                this.setState({
                    checked: false,
                    timer: 60
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
            this.props.setSessionId(response.data.sessionId);
        }
    }
    onFocusTwoFA = () => {
        console.log("focus vao 2 fa");
        this.setState({
            isTwoFa: true
        })
    }
    onBlurTwoFa = () => {
        this.setState({
            isTwoFa: false
        })
    }
    handleSelected = (data, name) => {
        console.log(data, name, "click selected");
        if (name === "bankAcc") {
            this.setState({
                labelBankAccount: `${data.bank.name} - ${data.bankAccountName}`,
                selectedBankAccount: data.id,
                isSearchList: false
            })
            const bankAccInfo = this.props.bankAccounts.filter(o => o.id === data.id)[0];
            console.log(bankAccInfo, "BankAccInfo");
            if (bankAccInfo) {
                this.setState({
                    selectedBank: bankAccInfo.bank.id,
                    labelSelectedBank: bankAccInfo.bank.name,
                    selectedBranch: bankAccInfo.bankBranch.id,
                    labelSelectedBranch: bankAccInfo.bankBranch.name,
                    paymentGatewayId: bankAccInfo.paymentGatewayId,
                    receiveBankAccountName: bankAccInfo.bankAccountName,
                    receiveBankAccountNo: bankAccInfo.bankAccountNo
                })
                this.getBankBranch(bankAccInfo.bank.id);
            }
        } else if (name === "selectWallet") {
            console.log(data, "data hyhy");
            this.setState({
                labelSelectedBank: `${data.name}`,
                selectedBank: data.id,
                isSearchList: false,
                labelSelectedBranch: null,
                selectedBranch: null
            })
            this.getBankBranch(data.id)
        } else if (name === "selectBranch") {
            this.setState({
                labelSelectedBranch: `${data.name}`,
                selectedBranch: data.id,
                isSearchList: false
            })
        }
    }
    render() {
        const { bankAccounts, bankList, selectedUnit, userInfo, currencyList,currentRequest,request } = this.props;
        const { branchList } = this.state;
        var BankFilter = bankAccounts.filter((item, i) => item.bankId);
        console.log(BankFilter, "bank filter");
        console.log(this.state.isTwoFa, "isTwo 2 fa");
        return (
            <KeyboardAwareScrollView style={{ height: this.state.isTwoFa ? dimensions.height / 2.25 : dimensions.height / 1.25, padding: 0 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >

                <View style={{ marginBottom: 30 }}>
                    {/* <Text style={{ color: style.textMain.color, marginTop: 10, marginBottom: 5 }}>{'2FA_REQUIRED'.t()}</Text> */}
                    {
                        userInfo.twoFactorService === constant.TWO_FACTOR_TYPE.EMAIL_2FA ?

                            <SendEmailField
                                onFocus={this.onFocusTwoFA}
                                onBlur={this.onBlurTwoFa}
                                placeholder={'PLEASE_INPUT_YOUR_2FA_CODE'.t()}
                                onChangeText={(twoFACode) => this.setState({ twoFACode })}
                                value={this.state.twoFACode}
                                checked={this.state.checked}
                                onSend={() => {
                                    this.onSentMail()
                                    this.setState({ checked: true })
                                }}
                                timer={this.state.timer}
                                titleBtn={"SEND_EMAIL".t()}
                                ref2={input => this.twoFACode = input}
                            />
                            :
                            <View style={[{
                                flexDirection: 'row', 
                                // backgroundColor: '#19243a', 
                                borderRadius: 2.5
                            },

                            ]}>
                                <TextInput
                                    onFocus={this.onFocusTwoFA}
                                    onBlur={this.onBlurTwoFa}
                                    allowFontScaling={false}
                                    style={[style.input, { flex: 3,borderWidth:0.5,borderColor:style.colorBorderBox },styles.textWhite]}
                                    placeholder={'GOOGLE_AUTHENTICATION_CODE'.t()}
                                    placeholderTextColor={styles.txtMainTitle.color}
                                    onChangeText={(twoFACode) => this.setState({ twoFACode })}
                                    keyboardType={'numeric'}
                                    value={this.state.twoFACode}
                                    ref={input => this.twoFACode = input}
                                />
                            </View>
                    }
                </View>

                <View style={{ flexDirection: 'row'}}>
                    <Button style={[style.btnCancel, style.buttonHeight,{borderWidth:0,
        backgroundColor: styles.bgBtnClose.color,}]} transparent block
                        onPress={() => this.props.handleBack()}>
                        <Text style={styles.textWhiteMain}>{'BACK'.t()}</Text>
                    </Button>
                    <Button style={[style.buttonNext, style.buttonHeight, { flex: 1, marginLeft: 5,backgroundColor:styles.bgButton.color }]} block
                        onPress={() => this.onNext()}>
                        <Text style={style.textWhite}>{'CONTINUE'.t()}</Text>
                    </Button>
                </View>
                <WithdrawInfo currentRequest={currentRequest} request={request} selectedUnit={selectedUnit} currencyList={currencyList} />
                <Item style={[style.item, { marginTop: 20, marginBottom: 10 }]}>
                    <Left style={{ flexDirection: 'row' }}>
                        <Icon name={'warning'} size={16} color={'orange'} />
                        <Text style={[styles.textWhite, { marginLeft: 5 }]}>{'WARNING'.t()}</Text>
                    </Left>
                </Item>
                <Text style={[styles.bgSellOldNew]} numberOfLines={2}>{'NOTE_WITHDRAWAL'.t()}</Text>
            </KeyboardAwareScrollView>
        );
    }
}
