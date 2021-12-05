
import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome5";
import { style } from '../../../config/style';
import Tooltip from 'rn-tooltip';
import {formatTrunc,jwtDecode } from '../../../config/utilities';
// import { storageService } from '../../../services/storage.service';
// import { constant } from '../../../config/constants';
import { authService } from '../../../services/authenticate.service';
// import { Item } from 'native-base';
import ConfirmModal from '../../Shared/ConfirmModal';
// import { NavigationEvents } from "react-navigation";
import {styles} from "react-native-theme";
import {connect} from "react-redux";
class WalletDW extends Component {
    constructor(props) {
        super(props);
        this.state={
            active:null,
            navigate:null,
            is_confirm: false,
            keepLogin: null,
            infoCurrency: "",
            ButtonOKText: null,
            cryptoWallet: [],
            withdrawInfo: null,
            modalWithdrawCoinVisible: false,
            infoCurrencyCoin: "",
            data: [
                {
                    label: "DEPOSITS",
                    img: require("../../../assets/img/depositWL.png"), hasTooltip: true,
                    children: [
                        { label: "FIAT_WALLET_VALUE", img: require("../../../assets/img/Asset56.png"), navigate: "openModalDepositCash" },
                        { label: "COIN_WALLET_VALUE", img: require("../../../assets/img/Asset57.png"), navigate: "onDepositCoin" }]
                },
                {
                    label: "WITHDRAWALS",
                    img: require("../../../assets/img/withdrawWL.png"), hasTooltip: true,
                    children: [
                        { label: "FIAT_WALLET_VALUE", img: require("../../../assets/img/Asset56.png"), navigate: "openModalWithdrawCash" },
                        { label: "COIN_WALLET_VALUE", img: require("../../../assets/img/Asset57.png"), navigate: "onWithDrawCoin" }]
                },
            ],
            theme:"default"
        }
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.cryptoWallet !== this.props.cryptoWallet){
            if(nextProps.cryptoWallet.length > 0){
                this.getWithdrawInfo(nextProps.cryptoWallet)
            }
        }
        console.log(nextProps,"props walletDw");
        if((nextProps.theme !== this.props.theme) || (nextProps.theme !== this.state.theme)){
            // console.log(nextProps.theme,"theme")
            this.setState({
                theme:nextProps.theme 
            })
            this.setState({
                data:[
                    {
                        label: "DEPOSITS",
                        img:nextProps.theme==="light" ?require("../../../assets/img/ic_light_deposit.png"): require("../../../assets/img/depositWL.png"),
                        hasTooltip: true,
                        children: [
                            { label: "FIAT_WALLET_VALUE", img:nextProps.theme==="light" ?require("../../../assets/img/light_Ic_Fiat.png"):  require("../../../assets/img/Asset56.png"), navigate: "openModalDepositCash" },
                            { label: "COIN_WALLET_VALUE", img:nextProps.theme==="light" ?require("../../../assets/img/light_Ic_Coin.png"):  require("../../../assets/img/Asset57.png"), navigate: "onDepositCoin" }]
                    },
                    {
                        label: "WITHDRAWALS",
                        img: nextProps.theme==="light" ?require("../../../assets/img/ic_light_withdraw.png"):require("../../../assets/img/withdrawWL.png"), hasTooltip: true,
                        children: [
                            { label: "FIAT_WALLET_VALUE", img:nextProps.theme==="light" ?require("../../../assets/img/light_Ic_Fiat.png"): require("../../../assets/img/Asset56.png"), navigate: "openModalWithdrawCash" },
                            { label: "COIN_WALLET_VALUE", img:nextProps.theme==="light" ?require("../../../assets/img/light_Ic_Coin.png"): require("../../../assets/img/Asset57.png"), navigate: "onWithDrawCoin" }]
                    },
                ]
            })
        }
    }
    componentDidMount() {
        this.getWalletBalanceByCurrency()
       
    }
    async getWalletBalanceByCurrency() {
        try {
            let user = await jwtDecode();
            let infoCurrencyFiat =await authService.getWalletBalanceByCurrency(user.id, "VND"); 
            let infoCurrencyCoin = await authService.getWalletBalanceByCurrency(user.id, "BTC");

            if(infoCurrencyCoin !== this.state.infoCurrencyCoin){
                this.setState({ infoCurrencyCoin })
            }
    
            if(infoCurrencyFiat !== this.state.infoCurrency){
                this.setState({
                    infoCurrency:infoCurrencyFiat
                })
            }
        } catch (error) {
            console.log(error);
        }
       

    }

    openModalDepositCash = () => {
        let { infoCurrency} = this.state;
        let { currencyList, navigation,keepLogin } = this.props;
        if (keepLogin) {
            this.props.navigation.navigate("FiatDeposit", {
                fromHome: true,
                depositData: null,
                depositStep: 1,
                symbol: "VND",
                available:infoCurrency?formatTrunc(currencyList, infoCurrency.available, infoCurrency.symbol):0
            })
        } else {
            navigation.navigate("Login")
        }


    }

    openModalWithdrawCash = () => {
        // const { keepLogin } = this.state;
        const { navigation,keepLogin } = this.props;
        if (keepLogin) {
            if (keepLogin && keepLogin.twoFactorEnabled) {
                // this.setState(this.resetAll());
                navigation.navigate("WithdrawCast", {
                    symbol: "VND",
                    userInfo: keepLogin,
                    type: 0,
                    fromHome: true
                });
            } else {
                this.setState({
                    is_confirm: true,
                    title: "2FA_REQUIRED".t(),
                    content: "2FA_REQUIRED_CONTENT".t(),
                    ButtonOKText: "Enable 2FA".t(),
                    onOK: () => {
                        this.setState({
                            is_confirm: false
                        }, () => navigation.navigate('Account'))
                    }
                })
            }
        } else {
            navigation.navigate("Login")
        }

    }
    onDepositCoin = () => {
        // const { keepLogin } = this.state;
        const { navigation,keepLogin,cryptoWallet } = this.props;
        if (keepLogin) {
            const { infoCurrencyCoin,} = this.state;
            navigation.navigate('DepositCoin', {
                infoCurrency: infoCurrencyCoin,
                cryptoWallet,
                fromHome: true
            })
        } else {
            navigation.navigate("Login")
        }
    }

    getWithdrawInfo = (cryptoWallet) => {
        // const { cryptoWallet } = this.props;
        if (cryptoWallet.length > 0) {
            cryptoWallet.map((item, index) => {
                if (item.symbol === "BTC") {
                    console.log(item, "item kaka");
                    this.setState({
                        withdrawInfo: { minWithdrawal: item.minWithdrawal, transactionFee: item.transactionFee, deposit: item.deposit, withdraw: item.withdrawal }
                    })
                }
            })
        }
    }
    onWithDrawCoin = () => {
        const {infoCurrencyCoin, withdrawInfo, modalWithdrawCoinVisible } = this.state;
        const { navigation,keepLogin,cryptoWallet } = this.props;
        if (keepLogin) {
            if (keepLogin.twoFactorEnabled) {
                navigation.navigate('WithdrawCoin', {
                    infoCurrency: infoCurrencyCoin,
                    twoFactorService: keepLogin.twoFactorService,
                    withdrawInfo,
                    modalWithdrawCoinVisible,
                    toggleModalWithdrawCoin: this.toggleModalWithdrawCoin,
                    _onRefresh: () => console.log("refresh"),
                    cryptoWallet,
                    fromHome: true
                })
            } else {
                this.setState({
                    is_confirm: true,
                    title: "2FA_REQUIRED".t(),
                    content: "2FA_REQUIRED_CONTENT".t(),
                    ButtonOKText: "Enable 2FA".t(),
                    onOK: () => {
                        this.setState({
                            is_confirm: false
                        }, () => navigation.navigate('Account'))
                    }
                })
            }
        } else {
            navigation.navigate('Login')
        }

    }
    toggleModalWithdrawCoin = (e) => {
        this.setState({ modalWithdrawCoinVisible: e })
    }
    
    render() {
        const { navigation,keepLogin } = this.props;
        const { data, is_confirm, content, title, ButtonOKText,navigate,active } = this.state;
        return (
            <View style={stylest.container}>
                {data.map((item, index) => {
                    return (
                        <View style={{width:"48%"}} key={index}>
                          
                                <Tooltip
                                    onClose={()=>{
                                        // let {navigate} = this.state;
                                        if(navigate !== null){
                                            this[navigate](navigation, keepLogin);
                                            this.setState({
                                                navigate:null
                                            })
                                        }
                                        if(active !== null){
                                            this.setState({
                                                active:null
                                            })
                                        }
                                        
                                    }}
                                    backgroundColor={styles.bgTooltipOldNew.color}
                                    containerStyle={{
                                        borderRadius: 0,
                                    }}
                                    height={65}
                                    width={140}
                                    overlayColor={"transparent"}
                                    popover={
                                        <View style={{
                                            justifyContent: "space-around",
                                            flexDirection: "row",
                                            width: "100%"
                                        }}>
                                            {item.hasTooltip && item.children.map((item2, i) => {
                                                return (
                                                    <View key={i} onStartShouldSetResponder={() => this.setState({
                                                        navigate:item2.navigate
                                                    })} style={[stylest.item,{width:"50%"}]}>
                                                        <Image style={{ width: 30, height: 30 }} source={item2.img} />
                                                        <Text style={[styles.textWhite, stylest.textSize,{
                                                            paddingTop:3
                                                        }]}>{item2.label.t()}</Text>
                                                    </View>
                                                )
                                            })}
                                        </View>
                                    }>
                                    <View key={index} onStartShouldSetResponder={() => this.setState({
                                                        active:index
                                                    })} style={[stylest.itemTitle,{
                                                        backgroundColor:styles.bgBoxDWWhite.color
                                                    }]}>
                                        <Image style={{ width: 20, height: 20 }} source={item.img} />
                                        <Text style={[active === index?{color:'#77b0ff'}:styles.textWhite, stylest.textSize,{paddingTop:3}]}>{"  "}{item.label.t()}</Text>
                                    </View>
                                </Tooltip>
                          
                        </View>

                    )
                })}
                <ConfirmModal
                    visible={is_confirm}
                    title={title}
                    content={content}
                    onClose={() => this.setState({
                        is_confirm: false,
                    })}
                    onOK={this.state.onOK}
                    ButtonOKText={ButtonOKText}
                    ButtonCloseText={"CLOSE".t()}
                />
            </View>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        theme:state.commonReducer.theme
    }
}

export default connect(mapStateToProps)(WalletDW)
const stylest = StyleSheet.create({
    item: {
        flexDirection: "column",
        alignItems: "center"
    },
    itemTitle:{
        flexDirection: "row",
        alignItems: "center",
        // borderColor:style.textWhite.color,
        // borderWidth:0.5,
        justifyContent:"center",
        paddingVertical:5,
        backgroundColor:"#354660",
        // paddingBottom:7
    },
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "transparent",
        paddingHorizontal: 0,
        paddingTop: 8,
        flex: 1,
        // marginBottom: 5,
        width:"70%"
    },
    textSize: {
        fontSize: 14
    }
})