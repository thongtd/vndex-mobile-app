/**
 * Withdraw Step 0
 * QuyetHS edited at 22-01-2019
 *
 * @format
 * @flow
 */
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity, Keyboard, KeyboardAvoidingView } from "react-native";
import { Body, Button, Item, Left, CheckBox, Right, Picker } from "native-base";
import { dimensions, formatSCurrency, formatTrunc, jwtDecode } from "../../../../config/utilities";
import Icon from "react-native-vector-icons/FontAwesome";
import { style } from "../../../../config/style";
import React from "react";
// import stylest from "react-native-material-dropdown/src/components/item/stylest";
import InputFieldFnx from "../../../Shared/InputFieldFnx"
import SearchList from "../../../Shared/SearchList"
import { authService } from "../../../../services/authenticate.service";
import { constant } from "../../../../config/constants";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {styles} from "react-native-theme";
type Props = {
    activeBalance: Array,
    coinList: Array,
    currencyList: Array,
    selectedUnit: String,
    paymentGateway: Array,
    paymentMethod: String,
    unitChange: any
};

export default class Step0 extends React.Component<Props> {
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
            amount: "",
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
        console.log(branchList,"branchList");
        this.props.submit(model);
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
                let bk = this.getSelectedBank(bankAccInfo.bank.id);
                this.setState({
                    selectedBank: bk !== null? bankAccInfo.bank.id:null,
                    labelSelectedBank:bk !== null ?bankAccInfo.bank.name:null,
                    selectedBranch:bk !== null ? bankAccInfo.bankBranch.id:null,
                    labelSelectedBranch:bk !== null ? bankAccInfo.bankBranch.name:null,
                    paymentGatewayId: bankAccInfo.paymentGatewayId,
                    receiveBankAccountName: bankAccInfo.bankAccountName,
                    receiveBankAccountNo: bankAccInfo.bankAccountNo
                })
                
                console.log(bk,"Data bank");
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
    getSelectedBank(id) {
        let bk = this.props.bankList.filter(o => o.id === id);
        if (bk.length > 0) {
            return bk[0]
        }
        else {
            return null
        }
    }

    render() {
        const { activeBalance, coinList, currencyList, selectedUnit, paymentGateway, paymentMethod } = this.props;
        const {
            labelCoin,
            isSearchList,
            data,
            itemObj,
            name,
            hasAcc,
            onPress,
            onHandleBack,
            onHandleSelected
        } = this.props;
        const { bankAccounts, bankList, userInfo } = this.props;
        const { branchList } = this.state;
        var BankFilter = bankAccounts.filter((item, i) => item.bankId);
        var bankFilterCurrency = BankFilter.filter((item,i)=>item.bank.bankCurrencySettings[0].currencyCode === selectedUnit);
        console.log(bankFilterCurrency,"bankFilterCurrency");
        return (
            <KeyboardAwareScrollView style={{ height: this.state.isTwoFa ? dimensions.height / 2.32 : dimensions.height / 1.32, padding: 0 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View>
                    <View style={{ paddingBottom: 10, alignItems: 'center', backgroundColor: 'transparent', borderRadius: 2.5 }}>
                        <View style={{ marginBottom: 5 }}>
                            <Text style={[styles.txtMainTitle]}>{'AVAILABLE'.t()}</Text>
                        </View>
                        <View>
                            <Text style={[styles.textWhite, style.fontSize18, { fontWeight: '500' }]}>{formatSCurrency(currencyList, activeBalance.available, selectedUnit)}</Text>
                        </View>
                    </View>
                    <View style={{
                        marginVertical: 10
                    }}>
                        <View style={{ backgroundColor: 'transparent', borderRadius: 2.5, }}>
                            <InputFieldFnx
                                styleTextField={styles.txtMainTitle.color}
                                hasDropdown
                                selected={this.state.labelBankAccount}
                                placeholder={'SELECT_ACCOUNT'.t()}
                                onPress={() => {
                                    this.setState({
                                        data: bankFilterCurrency,
                                        isSearchList: true,
                                        itemObj: ["bankAccountName"],
                                        name: "bankAcc",
                                        hasAcc: true
                                    })
                                }}
                                styled={
                                    stylesT.boxSelect
                                }
                            // hasAcc={true}
                            />
                            <SearchList
                                visibleModal={this.state.isSearchList}
                                handleBack={
                                    () => {
                                        this.setState({
                                            isSearchList: false
                                        }
                                        )
                                    }
                                }
                                data={this.state.data}
                                itemObj={this.state.itemObj}
                                selected={this.handleSelected}
                                name={this.state.name}
                                hasAcc={this.state.hasAcc}
                            />

                        </View>
                    </View>

                    <View style={{ marginVertical: 10 }}>
                        <View style={{ backgroundColor: 'transparent', borderRadius: 2.5}}>
                            <InputFieldFnx
                                styleTextField={styles.txtMainTitle.color}
                                hasDropdown
                                hasIcon={false}
                                selected={this.state.labelSelectedBank}
                                placeholder={'SELECT_BANK'.t()}
                                onPress={() => {
                                    this.setState({
                                        data: bankList,
                                        isSearchList: true,
                                        itemObj: ["name"],
                                        name: "selectWallet",
                                        hasAcc: false
                                    })
                                }}
                                styled={
                                    stylesT.boxSelect
                                }
                            />

                        </View>
                    </View>
                    {selectedUnit !== "IDR" && <View style={{
                        marginVertical: 10
                    }}>
                        <View style={{ backgroundColor: 'transparent', borderRadius: 2.5}}>
                            <InputFieldFnx
                                styleTextField={styles.txtMainTitle.color}
                                hasDropdown
                                hasIcon={false}
                                selected={this.state.labelSelectedBranch}
                                placeholder={'SELECT_BRANCH'.t()}
                                onPress={() => {
                                    this.setState({
                                        data: branchList,
                                        isSearchList: true,
                                        itemObj: ["name"],
                                        name: "selectBranch",
                                        hasAcc: false
                                    })
                                }}
                                styled={
                                    stylesT.boxSelect
                                }
                            />

                        </View>
                    </View>}
                    <View style={{
                        marginVertical: 10
                    }}>
                        <View style={{ backgroundColor: 'transparent', borderRadius: 2.5 }}>
                            <TextInput
                                placeholderTextColor={styles.txtMainTitle.color}
                                placeholder={'RECEIVING_BANK_ACCOUNT_NAME'.t()}
                                onFocus={this.onFocusTwoFA}
                                onBlur={this.onBlurTwoFa}
                                allowFontScaling={false}
                                style={[style.input,{borderWidth:0.5,borderColor:style.colorBorderBox,color:styles.textWhite}]}
                                value={this.state.receiveBankAccountName}
                                disabled={this.state.submitting}
                                onChangeText={(text) => {
                                    this.setState({ receiveBankAccountName: text })
                                }}
                                returnKeyType={"next"}
                                onSubmitEditing={() => { this.receiveBankAccountNo.focus(); }}
                                blurOnSubmit={false}
                            />
                        </View>
                    </View>
                    <View style={{
                        marginVertical: 10
                    }}>
                        <View style={{ backgroundColor: 'transparent', borderRadius: 2.5 }}>
                            <TextInput
                                placeholder={'ACCOUNT_NUMBER'.t()}
                                placeholderTextColor={styles.txtMainTitle.color}
                                onFocus={this.onFocusTwoFA}
                                onBlur={this.onBlurTwoFa}
                                allowFontScaling={false}
                                style={[style.input,{borderWidth:0.5,borderColor:style.colorBorderBox,color:styles.textWhite}]}
                                value={this.state.receiveBankAccountNo}
                                disabled={this.state.submitting}
                                onChangeText={(text) => {
                                    this.setState({ receiveBankAccountNo: text })
                                }}
                                ref={input => this.receiveBankAccountNo = input}
                                returnKeyType={"next"}
                                onSubmitEditing={() => { this.amount.focus(); }}
                                blurOnSubmit={false}
                            />
                        </View>
                    </View>
                    <TouchableOpacity style={[style.row]}
                        onPress={() => this.setState({ isSave: !this.state.isSave })}
                    >
                        <View style={{ alignItems: 'flex-start' }}>
                            <CheckBox checked={this.state.isSave} color={styles.bgBuyOldNew.color}
                                style={{ left: 0,width:18,height:18,lineHeight:16 }}
                                onPress={() => this.setState({ isSave: !this.state.isSave })} />
                        </View>
                        <View style={{ marginLeft: 5 }}>
                            <Text style={styles.txtMainTitle}>&nbsp;&nbsp;{"SAVE_BANK_ACCOUNT".t()}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{
                        marginVertical: 10
                    }}>
                        <View style={{ backgroundColor: 'transparent', borderRadius: 2.5 }}>
                            <TextInput
                                placeholder={'WITHDRAWAL_AMOUNT'.t()}
                                placeholderTextColor={styles.txtMainTitle.color}
                                onFocus={this.onFocusTwoFA}
                                onBlur={this.onBlurTwoFa}
                                allowFontScaling={false}
                                style={[style.input,{borderWidth:0.5,borderColor:style.colorBorderBox,color:styles.textWhite}]}
                                value={this.state.amount}
                                disabled={this.state.submitting}
                                onChangeText={(amount) => {
                                    if (amount) {
                                        if (amount.substr(amount.length - 1) !== '.') {
                                            this.setState({ amount: formatTrunc(this.props.currencyList, amount.str2Number(), selectedUnit) })
                                        }
                                        else {
                                            this.setState({ amount: formatTrunc(this.props.currencyList, amount.str2Number(), selectedUnit) + "." })
                                        }
                                    }
                                    else {
                                        this.setState({ amount: '0' })
                                    }
                                }}
                                keyboardType={'numeric'}
                                returnKeyType={"next"}
                                ref={input => this.amount = input}
                            />
                        </View>
                    </View>
                    <Item style={[style.item, { paddingBottom: 10, justifyContent: 'space-between' }]}>
                        <View style={{ flexDirection: 'row', marginLeft: -2 }}>
                            <Text style={styles.txtMainTitle}>{'FEE'.t()}: </Text>
                            <Text style={styles.bgSellOldNew}>{'RECEIVER_PAYS_FEE'.t()}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.txtMainTitle}>{'TOTAL_AMOUNT'.t()}: </Text>
                            <Text
                                style={styles.textWhite}>{formatTrunc(this.props.currencyList, this.state.amount.str2Number(), selectedUnit)}</Text>
                        </View>
                    </Item>
                    <View style={{ marginBottom: 15, marginLeft: 2 }}>
                        <Text style={[styles.textWhite, {
                            fontSize: 16,
                            fontWeight: '500',
                            marginBottom: 10
                        }]}>{'TUTORIALS'.t()}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{   borderBottomWidth: 0.5, borderTopWidth: 0.5, borderColor: styles.borderTutorial.color }}>
                            <View style={[stylesT.row, { paddingRight: 10 }]}>
                                <Text style={[stylesT.rowItems, { borderColor: styles.rowItem.color },styles.rowItem]}>1</Text>
                                <Text style={[styles.textWhite, {
                                    fontSize: 14,
                                }]}> {'MAKE_WITHDRAWAL'.t()}</Text>
                            </View>
                            <View style={[stylesT.row, { paddingHorizontal: 10 }]}>
                                <Text style={[stylesT.rowItems, { borderColor: styles.rowItem.color },styles.rowItem]}>2</Text>
                                <Text style={[styles.textWhite, { fontSize: 14, }]}> {'VERIFY_2FA'.t()}</Text>
                            </View>
                            <View style={[stylesT.row, { paddingHorizontal: 10 }]}>
                                <Text style={[stylesT.rowItems, { borderColor: styles.rowItem.color },styles.rowItem]}>3</Text>
                                <Text style={[styles.textWhite, {
                                    fontSize: 14,
                                }]}> {'CONFIRM_EMAIL'.t()}</Text>
                            </View>
                            <View style={[stylesT.row, { paddingLeft: 10 }]}>
                                <Text style={[stylesT.rowItems, { borderColor: styles.rowItem.color },styles.rowItem]}>4</Text>
                                <Text style={[styles.textWhite, { fontSize: 14 }]}> {'COMPLETE'.t()}</Text>
                            </View>
                        </ScrollView>
                    </View>
                    <View>
                        <Button style={[style.buttonNext, style.buttonHeight,{backgroundColor:styles.bgButton.color}]} block
                            onPress={this.onNext}>
                            <Text style={style.textWhite}>{'CONTINUE'.t()}</Text>
                        </Button>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        )
    }
}

const stylesT = StyleSheet.create({
    row: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center'
    },
    rowItems: {
        borderWidth: 1,
        borderColor: '#e3e3e3',
        color: '#e3e3e3',
        borderRadius: 7,
        width: 14,
        height: 14,
        textAlign: 'center',
        fontSize: 9.5,
    },
    boxSelect:{
        alignItems: "center",
        borderWidth: 0.5,
        borderColor:style.colorBorderBox,
        paddingVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal:10,
        borderRadius: 2.5
    }
})