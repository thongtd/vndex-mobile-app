import React from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Animated, Easing, Clipboard } from "react-native";
import { Button, Item, Left, Picker, Right, Body } from "native-base";
import { style } from "../../../config/style";
import Icon from "react-native-vector-icons/FontAwesome";
import { dimensions, formatTrunc, jwtDecode } from "../../../config/utilities";
import { authService } from "../../../services/authenticate.service";
import connect from "react-redux/es/connect/connect";
import ModalCopy from "../../Shared/ModalCopy";
import { constant } from '../../../config/constants';
import { ModalAlert } from '../../Shared';
import NoteCast from './components/NoteCast';
import ButtonFnx from '../../Shared/ButtonFnx';
import {styles} from "react-native-theme";
class BankPayment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bankInfo: null,
            submitting: false,
            isCopied: false
        }
        this.animatedValue = new Animated.Value(0)
    }

    componentDidMount() {
        jwtDecode().then(acc => {
            let accId = acc.id;
            this.setState({ accId });
            let { currency } = this.props;
            authService.getDepositBankAccount(currency, accId).then(res => {
                this.setState({ bankInfo: res })
            })
        })
        this.animate()

    }

    submit() {
        this.setState({ submitting: true })
        let { accId, bankInfo } = this.state;
        let { currency, amount } = this.props;
        if (this.props.bankInfo) {
            return;
        }
        authService.getFiatDepositRequest(accId, currency, amount.str2Number(), bankInfo).then((res) => {
            this.setState({ submitting: false })
            if (res.status === "OK") {
                if (res.data.status) {
                    this.props.onSuccess(bankInfo, amount, res.data.itemId);
                    this.setState({ is_error: false, messageText: "" })
                }
                else {
                    this.setState({ is_error: true, messageText: res.data.message.t() })
                }
            }
            else {
                let msg = res.message.t();
                for (let i in res.data.messageArray) {
                    msg = msg.replace('{' + i + '}', res.data.messageArray[i]);
                }
                this.setState({ is_error: true, messageText: msg })
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.bankInfo) {
            this.setState({ bankInfo: nextProps.bankInfo })
        }
    }


    cancel() {
        this.props.onClose();
    }

    animate() {
        this.animatedValue.setValue(0)
        Animated.timing(
            this.animatedValue,
            {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear
            }
        ).start(() => this.animate())
    }

    copyClipboard(url) {
        Clipboard.setString(url);
        this.setState({ isCopied: true });
        let self = this;
        setTimeout(function () {
            self.setState({ isCopied: false });
        }, 500);
    }

    render() {
        const {  submitting, is_error, messageText } = this.state
        const { amount, currencyList, currency, status } = this.props;
        // console.log(status,"status");
        console.log('bankInfo2', this.props.bankInfo)
        let bankInfo = this.props.bankInfo?this.props.bankInfo:this.state.bankInfo
        return (
            <View style={{}}>
                <View style={{ marginTop: 15, paddingLeft:2,paddingRight:4 }}>
                    <Item style={stylest.item}>
                        <Left style={{ flex: 5 }}>
                            <Text style={[stylest.headerText,styles.textWhite]}>{"BANK_TRANSFER".t()}</Text>
                        </Left>
                        <Right style={{ flex: 1 }}></Right>
                    </Item>
                    <Item style={stylest.item}>
                        <Left style={{
                            flex:0
                        }}>
                            <Text style={styles.txtMainTitle}>{"BANK_NAME".t()}</Text>
                        </Left>
                        <Right style={{
                            flex:1
                        }}>
                            <View style={[style.row]}>
                                <Text style={styles.textWhite}>{bankInfo.bankName}</Text>
                                <TouchableOpacity onPress={() => this.copyClipboard(bankInfo.bankName)}>
                                    <Icon name={"copy"} style={{ paddingLeft: 8 }} color={styles.txtWhiteTitle.color} size={15} />
                                </TouchableOpacity>
                            </View>
                        </Right>
                    </Item>
                    {bankInfo.bankBranchName && <Item style={stylest.item}>
                        <Left>
                            <Text style={styles.txtMainTitle}>{"BRANCH_NAME".t()}</Text>
                        </Left>
                        <Right>
                            <View style={style.row}>
                                <Text style={styles.textWhite}>{bankInfo.bankBranchName}</Text>
                                <TouchableOpacity onPress={() => this.copyClipboard(bankInfo.bankBranchName)}>
                                    <Icon name={"copy"} style={{ paddingLeft: 8 }} color={styles.txtWhiteTitle.color} size={15} />
                                </TouchableOpacity>
                            </View>
                        </Right>
                    </Item>
                    }
                    <Item style={stylest.item}>
                        <Left style={{ flex: 1, paddingRight: 5 }}>
                            <Text style={styles.txtMainTitle}>{"ACCOUNT_NAME".t()}</Text>
                        </Left>
                        <Right style={{ flex: 2 }}>
                            <View style={style.row}>
                                <Text style={[styles.textWhite, {}]} numberOfLines={2}>{bankInfo.bankAccountName}</Text>
                                <TouchableOpacity onPress={() => this.copyClipboard(bankInfo.bankAccountName)}>
                                    <Icon name={"copy"} style={{ paddingLeft: 8 }} color={styles.txtWhiteTitle.color} size={15} />
                                </TouchableOpacity>
                            </View>
                        </Right>
                    </Item>
                    <Item style={stylest.item}>
                        <Left>
                            <Text style={styles.txtMainTitle}>{"ACCOUNT_NUMBER".t()}</Text>
                        </Left>
                        <Right>
                            <View style={style.row}>
                                <Text style={styles.textWhite}>{bankInfo.bankAccountNo}</Text>
                                <TouchableOpacity onPress={() => this.copyClipboard(bankInfo.bankAccountNo)}>
                                    <Icon name={"copy"} style={{ paddingLeft: 8 }} color={styles.txtWhiteTitle.color} size={15} />
                                </TouchableOpacity>
                            </View>
                        </Right>
                    </Item>
                    <Item style={stylest.item}>
                        <Left>
                            <Text style={styles.txtMainTitle}>{"TRANSFER_DESCRIPTION".t()}</Text>
                        </Left>
                        <Right>
                            <View style={style.row}>
                                <Text style={styles.textWhite}>{bankInfo.description}</Text>
                                <TouchableOpacity onPress={() => this.copyClipboard(bankInfo.description)}>
                                    <Icon name={"copy"} style={{ paddingLeft: 8 }} color={styles.txtWhiteTitle.color} size={15} />
                                </TouchableOpacity>
                            </View>
                        </Right>
                    </Item>
                    <Item style={{ borderBottomWidth: 0 }}>
                        <Left>
                            <Text style={styles.txtMainTitle}>{"DEPOSIT_AMOUNT".t()}</Text>
                        </Left>
                        <Right>
                            <View style={style.row}>
                                <Text
                                    style={styles.textWhite}>{formatTrunc(currencyList, amount.str2Number(), currency)}</Text>
                                <TouchableOpacity
                                    onPress={() => this.copyClipboard(amount.str2Number().toString())}>
                                    <Icon name={"copy"} style={{ paddingLeft: 8 }} color={styles.txtWhiteTitle.color} size={15} />
                                </TouchableOpacity>
                            </View>
                        </Right>
                    </Item>
                    <NoteCast styled={{paddingRight: 10,}} />
                    {!this.props.bankInfo || (this.props.bankInfo && this.props.bankInfo.status !== constant.PAYMENT_STATUS.Completed) ?
                        !status &&
                        // <Item style={stylest.item}>
                        //      <Left style={{ marginRight: 5 }}>
                        //          <Button style={[style.btnSubmit, style.buttonHeight]} disabled={submitting} block
                        //             onPress={() => this.submit()}>
                        //             <Text style={styles.textWhite}>{'CONFIRM_REQUEST'.t()}</Text>
                        //         </Button>
                        //     </Left>

                        //     <Right style={{}}>
                        //         <Button style={[style.btnSubmit, style.buttonHeight, {
                        //             backgroundColor: '#192240',
                        //             borderWidth: 1
                        //         }]} block
                        //             onPress={() => this.cancel()}>
                        //             <Text style={styles.textWhite}>{'CANCEL'.t()}</Text>
                        //         </Button>
                        //     </Right>
                        // </Item>
                        <ButtonFnx
                            disabledFirst={submitting}
                            titleSecond={'CANCEL'.t()}
                            titleFirst={'CONFIRM_REQUEST'.t()}
                            onClickFirst={() => this.submit()}
                            onClickSecond={() => this.cancel()}
                        />
                        : null}
                </View>
                <ModalCopy visible={this.state.isCopied} />
                <ModalAlert
                    visible={is_error}
                    content={messageText}
                    onClose={
                        () => {
                            this.setState({
                                is_error: false
                            })
                        }
                    }
                />
            </View>
        );
    }
}

const stylest = StyleSheet.create({
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
        // height: dimensions.height / 1.2,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        borderRadius: 5
    },
    item: {
        borderBottomWidth: 0,
        marginBottom: 15
    },
    buttonArea: {
        flex: 1,
        flexDirection: 'row'
    },
    headerText: {
        color: 'white',
        fontSize: 16,
        // fontWeight: 'bold'
    }
})

const mapStateToProps = state => {
    return {
        currencyList: state.commonReducer.currencyList
    }
}
export default connect(mapStateToProps, {})(BankPayment);
