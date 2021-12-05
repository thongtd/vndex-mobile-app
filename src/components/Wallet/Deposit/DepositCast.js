import { TouchableOpacity, Text, View, Platform, ActivityIndicator, StatusBar,BackHandler } from "react-native";
import { formatTrunc, jwtDecode } from "../../../config/utilities";
import React, { Component } from "react";
import BankPayment from "./BankPayment";
import RequestForm from "./RequestForm";
import { authService } from "../../../services/authenticate.service";
import ConfirmBankPayment from "./ConfirmBankPayment";
import ConfirmModal from "../../Shared/ConfirmModal";
import { constant } from "../../../config/constants";
import connect from "react-redux/es/connect/connect";
import { style } from "../../../config/style";
import { Button, Header, Left } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { getDepositLog, getWithdrawLog, setCurrencyWithdrawFiat } from "../../../redux/action/wallet.action";
import { Spiner, HeaderFnx } from "../../Shared"
import { NavigationEvents } from "react-navigation"
import { setStatusBar } from "../../../redux/action/common.action"
import PickerSearch from "../../Shared/PickerSearch";
import { commonService } from "../../../services/common.service";
import ContainerFnx from "../../Shared/ContainerFnx";
import {styles} from "react-native-theme";
class DepositCast extends Component {
    constructor(props) {
        super(props)
        this.state = {
            submitted: false,
            paymentMethod: "B",
            amount: 0,
            currency: this.props.navigation.state.params.symbol,
            openConfirm: false,
            requestData: {},
            openCancel: false,
            step: 1,
            isReady: true,
            coinList: [],
            selected: this.props.navigation.state.params.symbol,
            autoEnable:false
        }
    }

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        jwtDecode().then(res => {
            this.setState({ accId: res.id, isReady: false })
        })
        let params = this.props.navigation.state.params;
        console.log('params', params);
        if (params.depositData) {
            let data = params.depositData;
            if (data.status === constant.PAYMENT_STATUS.Open || data.status === constant.PAYMENT_STATUS.Pending) {
                this.setState({
                    step: 3,
                    createdDate: data.createdDate
                })
            }
            else {
                this.setState({
                    step: 2,
                    status: params && params.status
                })
            }
            this.setState({
                bankInfo: data,
                amount: formatTrunc(this.props.currencyList, data.amount, this.state.currency),
                requestId: data.id,
                dataLoad: true
            })
        }
        else if (params.depositStep) {
            this.setState({ step: params.depositStep })
        }
        this.getBankList()
    }
    handleBackPress = () => {
        this.close() // works best when the goBack is async
        return true;
    }
    getBankList() {
        jwtDecode().then(user => {
            if(user){
                authService.getFiatWallet(user.id).then(coinList => {
                    this.setState({ coinList })
                }).catch(err => console.log(err))
            }else{
                commonService.getFiatList().then(coinList => {
                    this.setState({ coinList })
                }).catch(err => console.log(err))
            }
        }).catch(err => console.log(err))
        
       
    }
    onSubmit = (paymentMethod, amount, currency) => {
        this.setState({ step: 2, paymentMethod, currency, amount })
    }

    openConfirm = (bankInfo, amount, requestId, createdDate) => {
        this.setState({ bankInfo, amount, requestId, createdDate, step: 3 })
        // this.setState({ step: 3 })
    }

    cancelDepositFiat = (requestId) => {
        authService.cancelDepositFiat(requestId).then(res => {
            if (res) {
                if (res.result.status) {
                    this.setState({ openCancel: false })
                    this.props.getDepositLog(1, 15, this.state.currency);
                    this.props.navigation.goBack();
                }
            }
        })
    }
    componentWillUnmount() {
        this.backHandler.remove()
    }
    close = () => {
        this.props.getDepositLog(1, 15, this.state.currency);
        this.props.navigation.goBack();
        this.props.setCurrencyWithdrawFiat(this.state.currency);
    }
    onCoinChange = (text) => {
        this.setState({
            selected: text,
            currency: text
        })
    }
    renderStep() {
        const { createdDate, status, currency, amount, bankInfo, requestId, step, selected } = this.state;
        let params = this.props.navigation.state.params;
        switch (step) {
            case 1:
                return (
                    <RequestForm
                        selected={selected}
                        onSubmit={this.onSubmit}
                        currency={currency}
                        bankInfo={bankInfo}
                        onClose={this.close}
                        onSuccess={this.openConfirm}
                        available={params.available}
                        />
                )
            case 2:
                return (
                    <BankPayment
                        status={status}
                        onClose={this.close}
                        bankInfo={bankInfo}
                        currency={currency}
                        amount={amount}
                        onSuccess={this.openConfirm} />
                )
            case 3:
                return (
                    <ConfirmBankPayment
                        createdDate={createdDate}
                        currency={currency}
                        onClose={this.close}
                        data={{ bankInfo, amount, requestId }}
                        navigation={this.props.navigation}
                        onCancel={() => this.setState({ openCancel: true })}
                    />
                )
            default:
                return <RequestForm onSubmit={this.onSubmit} currency={currency}
                    onClose={this.close} />;
        }
    }

    render() {
        const { requestId, openCancel, currency, isReady, step, selected, coinList } = this.state;
        const { navigation } = this.props;
        let params = this.props.navigation.state.params;
        return (
            <View style={{ flex: 1, backgroundColor: styles.bgMain.color }}>
                <NavigationEvents
                    onWillFocus={() => this.props.setStatusBar('#1c2840')}
                />
                {
                    isReady ?
                        (<Spiner isVisible={isReady} />)
                        :
                        (
                            <ContainerFnx
                                spaceTop={0}
                                colorStatus={style.bgHeader.backgroundColor}
                                title={'DEPOSITS'.t() + ' ' + currency}
                                hasBack
                                isbtnSpecial
                                onPress={this.close}
                                style={style.bgHeader}
                                navigation={navigation}
                                hasRight={
                                    step === 1 ?
                                        <PickerSearch
                                            autoEnable={params.fromHome?true:false}
                                            selectedValue={selected}
                                            onValueChange={this.onCoinChange}
                                            placeholder={'SELECT_BANK'.t()}
                                            label={["currency","name"]}
                                            textCenter={" - "}
                                            value={"currency"}
                                            source={coinList}
                                            hasBtn={
                                                <Icon style={{
                                                    padding:20
                                                }} name={"list"} size={15} color={styles.textWhite.color} />
                                            }
                                        /> : null
                                }
                            >
                                {this.renderStep()}
                                <ConfirmModal visible={openCancel} title={"CANCEL_DEPOSIT_FIAT".t()}
                                    content={"CANCEL_DEPOSIT_FIAT_CONFIRM".t()}
                                    onClose={() => this.setState({
                                        openCancel: false,
                                        resultType: "",
                                        resultText: ""
                                    })} onOK={() => this.cancelDepositFiat(requestId)}
                                    resultText={this.state.resultText}
                                    resultType={this.state.resultType} ButtonOKText={"OK".t()}
                                    ButtonCloseText={"CLOSE".t()}
                                />
                            </ContainerFnx>
                           
                        )
                }
            </View>


        )
    }
}

const mapStateToProps = (state) => {
    return {
        currencyList: state.commonReducer.currencyList
    }
}
export default connect(mapStateToProps, {setCurrencyWithdrawFiat, setStatusBar, getDepositLog, getWithdrawLog })(DepositCast);
