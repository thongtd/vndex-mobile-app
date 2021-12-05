import React from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Platform, Keyboard } from "react-native";
import { Button, Item, Left, Picker, Right, Input } from "native-base";
import { style } from "../../../config/style";
import Icon from "react-native-vector-icons/FontAwesome";
import { alertError, dimensions, formatTrunc, jwtDecode } from "../../../config/utilities";
import connect from "react-redux/es/connect/connect";
import { commonService } from "../../../services/common.service";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ModalAlert from "../../Shared/ModalAlert"
import NoteCast from './components/NoteCast';
import ButtonFnx from '../../Shared/ButtonFnx';
import PickerSearch from '../../Shared/PickerSearch';
import { authService } from '../../../services/authenticate.service';
import TextInputFnx from '../../Shared/TextInputFnx';
import {styles} from "react-native-theme";
class RequestForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitted: false,
            paymentMethod: 'B',
            selected: this.props.currency,
            amount: '',
            bankList: [],
            coinList: [],
            amountInvalid: false,
            bankId: '',
            infoCurrency: null
        }
    }

    componentDidMount() {
        this.getBankList();
    }
    async submit() {
        this.setState({ submitting: true })
        let { bankInfo, bankId, amount } = this.state;
        let { currency } = this.props;
        if (this.props.bankInfo) {
            return;
        }
        if (amount <= 0) {
            this.setState({ amountInvalid: true })
            this.modalError("AMOUNT_INVALID".t());
        }
        else if(bankId === null || bankId === undefined || bankId === ""){
            this.modalError("CHOOSE_BANK".t());
        }
        else {
            if (bankId !== null && bankId !== undefined) {
                let user = await jwtDecode();
                let accId = user.id;
                commonService.getItemDepositCast(currency, accId,bankId).then((bankInfo) => {
                    authService.getFiatDepositRequest(accId, currency, amount.str2Number(), bankInfo).then((res) => {
                        console.log(accId, currency, amount.str2Number(), bankInfo,res, "res data");
                        this.setState({ submitting: false })
                        if (res.status === "OK") {
                            if (res.data.status) {
                                this.props.onSuccess(bankInfo, amount, res.data.itemId, res.createdDate);
                                
                            }
                            else {
                                this.modalError(res.data.message.t());
                            }
                        }
                        else {
                            let msg = res.message.t();
                            for (let i in res.data.messageArray) {
                                msg = msg.replace('{' + i + '}', res.data.messageArray[i]);
                            }
                            this.modalError(msg);
                        }
                    })
                })
            }
        }

    }

    getBankList() {
        let { selected } = this.state;
        jwtDecode().then(acc => {
            let accId = acc.id;
            authService.getDepositBankAccount(selected, accId).then(bankList => {
                this.setState({ bankList })
            }).catch(err => console.log(err))
        })


    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.selected && nextProps.selected !== this.props.selected) {
            jwtDecode().then(acc => {
                let accId = acc.id;
                authService.getDepositBankAccount(nextProps.selected, accId).then(bankList => {
                    this.setState({ bankList, bankId: null })
                })
                authService.getWalletBalanceByCurrency(accId, nextProps.selected).then(infoCurrency => {
                    this.setState({ infoCurrency, bankId: null })
                }).catch(err => console.log(err))
            })
        }
    }

    onValueChange = (text) => {
        this.setState({
            bankId: text,
        })
    }

    modalError(content, visible = true) {
        this.setState({
            visible: visible,
            content: content,
        })
    }
    render() {
        let { infoCurrency, bankId, amount, paymentMethod, submitting, bankList, amountInvalid } = this.state;
        const { currencyList, currency, selected, available } = this.props;
        console.log(currencyList, infoCurrency, available, "selected");
        return (
            <React.Fragment>
                <KeyboardAwareScrollView style={{ flex: 1 }}
                    onPress={Keyboard.dismiss}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={{ marginBottom: 10 }}>
                        <View style={{
                            flexDirection: "column",
                            justifyContent: "center",
                            alignSelf: "center",
                            alignItems: "center",
                            alignContent: "center",
                            paddingVertical: 15
                        }}>
                            <Text style={styles.txtMainTitle}>{"AVAILABLE".t()}</Text>
                            <Text style={{
                                color: styles.textWhite.color,
                                fontWeight: "bold",
                                fontSize: 16
                            }}>{(available !== null && available !== undefined && infoCurrency === null) ? available : formatTrunc(currencyList, infoCurrency.available, infoCurrency.symbol)}</Text>
                        </View>
                        {/* <Text style={{ color: style.textMain.color, marginTop: 10, marginBottom: 5 }}>{'SELECT_WALLET'.t()}</Text> */}
                        <TextInputFnx
                            placeholder={'AMOUNT'.t()}
                            value={amount}
                            onChangeText={(text) => {
                                if (text) {
                                    this.setState({ amount: formatTrunc(currencyList, text.str2Number(), currency) })
                                }
                                else {
                                    this.setState({ amount: '' })
                                }
                            }}
                            keyboardType={'numeric'}
                        />

                        <View style={[style.inputView2,{borderRadius:3,marginTop:10}]}>
                            <PickerSearch
                                selectedValue={bankId}
                                onValueChange={this.onValueChange}
                                placeholder={'SELECT_BANK'.t()}
                                label={["bankName"]}
                                textCenter={""}
                                value={"bankId"}
                                source={bankList}
                                btnStyle={{ flexDirection: "row", justifyContent: "space-between", width: "95%", paddingTop: 9, }}
                                textStyle={{ color: styles.textWhite.color }}
                            />
                        </View>

                        <NoteCast styled={{ paddingRight: 10, }} />
                        <View style={{
                            marginTop: 10
                        }}>
                            <ButtonFnx
                                onClickFirst={() => this.submit()}
                                titleFirst={'SUBMIT'.t()}
                                hiddenSecond
                            />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <ModalAlert
                    content={this.state.content}
                    visible={this.state.visible}
                    onClose={() => this.setState({ visible: false })}
                />
            </React.Fragment>

        );
    }
}



const mapStateToProps = state => {
    return {
        currencyList: state.commonReducer.currencyList
    }
}
export default connect(mapStateToProps, {})(RequestForm);
