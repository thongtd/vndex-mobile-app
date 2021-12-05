import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome5";
import { style } from '../../../config/style';
import Tooltip from 'rn-tooltip';
import { jwtDecode, formatTrunc } from '../../../config/utilities';
import { storageService } from '../../../services/storage.service';
import { constant } from '../../../config/constants';
import { authService } from '../../../services/authenticate.service';
import { Item } from 'native-base';
import ConfirmModal from '../../Shared/ConfirmModal';
import { NavigationEvents } from "react-navigation";
import theme,{styles} from "react-native-theme";
import {connect} from "react-redux";
class MenuSelectQuickly extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
                    label: "MARKET",
                    img: require("../../../assets/img/Asset51.png"),
                    navigate: "MarketWatchSelect"
                },
                {
                    label: "DEPOSITS",
                    img: require("../../../assets/img/Asset52.png"), hasTooltip: true,
                    children: [
                        { label: "FIAT_WALLET_VALUE", img: require("../../../assets/img/Asset56.png"), navigate: "openModalDepositCash" },
                        { label: "COIN_WALLET_VALUE", img: require("../../../assets/img/Asset57.png"), navigate: "onDepositCoin" }]
                },
                {
                    label: "WITHDRAWALS",
                    img: require("../../../assets/img/Asset53.png"), hasTooltip: true,
                    children: [
                        { label: "FIAT_WALLET_VALUE", img: require("../../../assets/img/Asset56.png"), navigate: "openModalWithdrawCash" },
                        { label: "COIN_WALLET_VALUE", img: require("../../../assets/img/Asset57.png"), navigate: "onWithDrawCoin" }]
                },
                {
                    label: "SECURITY",
                    img: require("../../../assets/img/Asset54.png"), hasTooltip: true,
                    children: [
                        { label: "Email", img: require("../../../assets/img/Asset59.png"), navigate: "goToEmailVerification" },
                        {
                            label: "GG Authen", img: require("../../../assets/img/Asset58.png"), navigate: "goToGoogleAuthVerification"
                        }]
                },

            ]
        }
    }
    componentDidMount() {
        this.checkKeepLogin();
        this.getWalletBalanceByCurrency();
    }
    checkKeepLogin = () => {
       
        jwtDecode().then(user => {
            if (user) {
                this.props.showReady(false,true)
                authService.keepLogin(user.id).then((keepLogin)=>{
                    this.setState({
                        keepLogin,
                    })
                }).catch(err => console.log(err))
            } else {
                this.props.showReady(false,false)
                this.setState({
                    keepLogin: null
                })
            }
        }).catch(err => {
            this.props.showReady(false,false)
            this.setState({
                keepLogin: null
            })
        })
    }
componentWillReceiveProps(nextProps) {
    if(nextProps.data !== this.props.data){
        const {infoCurrencyFiat,infoCurrencyCoin,cryptoWallet} = nextProps.data;
        console.log(infoCurrencyFiat,"data duoiok")
        if(infoCurrencyCoin !== this.state.infoCurrencyCoin){
            
            this.setState({ infoCurrencyCoin })
        }
        if(infoCurrencyFiat !== this.state.infoCurrency){
            this.setState({
                infoCurrency:infoCurrencyFiat
            })
        }
        if(cryptoWallet !== this.state.cryptoWallet){
            this.setState({
                cryptoWallet
            },()=>this.getWithdrawInfo())
        }
    }
    if(nextProps.theme !== this.props.theme){
        this.setState({
            data:[
                {
                    label: "MARKET",
                    img:theme.name==="light" ?require("../../../assets/img/light_Ic_Market.png"):require("../../../assets/img/Asset51.png"),
                    navigate: "MarketWatchSelect"
                },
                {
                    label: "DEPOSITS",
                    img:theme.name==="light" ?require("../../../assets/img/light_ic_deposit.png"): require("../../../assets/img/Asset52.png"),
                    hasTooltip: true,
                    children: [
                        { label: "FIAT_WALLET_VALUE", img:theme.name==="light" ?require("../../../assets/img/light_Ic_Fiat.png"):  require("../../../assets/img/Asset56.png"), navigate: "openModalDepositCash" },
                        { label: "COIN_WALLET_VALUE", img:theme.name==="light" ?require("../../../assets/img/light_Ic_Coin.png"):  require("../../../assets/img/Asset57.png"), navigate: "onDepositCoin" }]
                },
                {
                    label: "WITHDRAWALS",
                    img: theme.name==="light" ?require("../../../assets/img/light_ic_withdraw.png"):require("../../../assets/img/Asset53.png"), hasTooltip: true,
                    children: [
                        { label: "FIAT_WALLET_VALUE", img:theme.name==="light" ?require("../../../assets/img/light_Ic_Fiat.png"): require("../../../assets/img/Asset56.png"), navigate: "openModalWithdrawCash" },
                        { label: "COIN_WALLET_VALUE", img:theme.name==="light" ?require("../../../assets/img/light_Ic_Coin.png"): require("../../../assets/img/Asset57.png"), navigate: "onWithDrawCoin" }]
                },
                {
                    label: "SECURITY",
                    img:theme.name==="light" ?require("../../../assets/img/light_Ic_2FA.png"): require("../../../assets/img/Asset54.png"), hasTooltip: true,
                    children: [
                        { label: "Email", img: theme.name==="light" ?require("../../../assets/img/light_Ic_email.png"):require("../../../assets/img/Asset59.png"), navigate: "goToEmailVerification" },
                        {
                            label: "GG Authen", img:theme.name==="light" ?require("../../../assets/img/light_Ic_2FA_GG.png"): require("../../../assets/img/Asset58.png"), navigate: "goToGoogleAuthVerification"
                        }]
                },

            ]
        })
    }
    console.log(nextProps.data,"data duoi2");
}

    getWalletBalanceByCurrency() {
        const {infoCurrencyFiat,infoCurrencyCoin,cryptoWallet} = this.props.data;
        console.log(cryptoWallet,"data duoi")
        if(infoCurrencyCoin !== this.state.infoCurrencyCoin){
            
            this.setState({ infoCurrencyCoin })
        }
        if(infoCurrencyFiat !== this.state.infoCurrency){
            this.setState({
                infoCurrency:infoCurrencyFiat
            })
        }
        if(cryptoWallet !== this.state.cryptoWallet){
            this.setState({
                cryptoWallet
            },()=>this.getWithdrawInfo())
        }
    }
    goToEmailVerification(navigation, keepLogin) {
        if (keepLogin) {
            if (keepLogin.twoFactorEnabled && keepLogin.twoFAType === constant.TWO_FACTOR_TYPE.GG2FA) {
                this.setState({
                    is_confirm: true,
                    content: "TURN_OFF_2FA_GG_FIRST".t(),
                    title: 'WARNING'.t(),
                    ButtonOKText: null
                })
            } else {
                navigation.navigate('EmailVerification', {
                    twoFAType: keepLogin.twoFAType,
                    twoFactorEnabled: keepLogin.twoFactorEnabled
                })
            }
        } else {
            navigation.navigate('Login')
        }

    }

    goToGoogleAuthVerification(navigation, keepLogin) {
        if (keepLogin) {
            if (keepLogin.twoFactorEnabled && keepLogin.twoFAType === constant.TWO_FACTOR_TYPE.EMAIL_2FA) {
                this.setState({
                    is_confirm: true,
                    content: "TURN_OFF_2FA_EMAIL_FIRST".t(),
                    title: 'WARNING'.t(),
                })
            } else if (keepLogin.twoFactorEnabled && keepLogin.twoFAType === constant.TWO_FACTOR_TYPE.GG2FA) {
                navigation.navigate('TwoFactor', {
                    twoFAType: keepLogin.twoFAType,
                    twoFactorEnabled: keepLogin.twoFactorEnabled
                })
            } else {
                navigation.navigate('GuideGoogleAuth1', {
                    twoFAType: keepLogin.twoFAType,
                    twoFactorEnabled: keepLogin.twoFactorEnabled
                })
            }
        } else {
            navigation.navigate('Login')
        }
    }

    openModalDepositCash = () => {
        let { infoCurrency, keepLogin } = this.state;
        let { currencyList, navigation } = this.props;
        if (keepLogin) {
            this.props.navigation.navigate("FiatDeposit", {
                fromHome: true,
                depositData: null,
                depositStep: 1,
                symbol: "VND",
                available: formatTrunc(currencyList, infoCurrency.available, infoCurrency.symbol)
            })
        } else {
            navigation.navigate("Login")
        }


    }

    openModalWithdrawCash = () => {
        const { keepLogin } = this.state;
        const { navigation } = this.props;
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
        const { keepLogin } = this.state;
        const { navigation } = this.props;
        if (keepLogin) {
            const { infoCurrencyCoin, cryptoWallet } = this.state;
            navigation.navigate('DepositCoin', {
                infoCurrency: infoCurrencyCoin,
                cryptoWallet,
                fromHome: true
            })
        } else {
            navigation.navigate("Login")
        }

    }
    getWithdrawInfo = () => {
        const { cryptoWallet } = this.state;
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
        const { keepLogin, infoCurrencyCoin, cryptoWallet, withdrawInfo, modalWithdrawCoinVisible } = this.state;
        const { navigation } = this.props;
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
        const { data, keepLogin, is_confirm, content, title, ButtonOKText,navigate,active } = this.state;
        const { navigation } = this.props;
        console.log(data, "item data");
        return (
            <View style={[stylest.container,{
                backgroundColor:styles.bgSub.color
            }]}>
                <NavigationEvents
                    onWillFocus={(payload) => {
                        this.checkKeepLogin();
                        this.getWalletBalanceByCurrency();
                        this.props.showReady(true);
                        if(active !== null){
                            this.setState({
                                active:null
                            })
                        }
                    }}
                />
                {data.map((item, index) => {
                    return (
                        <View style={{width:"25%"}} key={index}>
                            {item.hasTooltip ? (
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
                                                    })} style={[stylest.item]}>
                                        <Image style={{ width: 30, height: 30 }} source={item.img} />
                                        <Text style={[active === index?{color:'#77b0ff'}:styles.textWhite, stylest.textSize,{paddingTop:3}]}>{item.label.t()}</Text>
                                    </View>
                                </Tooltip>
                            ) : <View
                                onStartShouldSetResponder={() => {
                                    this.setState({
                                        active:'F'
                                    })
                                    navigation.navigate("MarketWatchSelect", {
                                        unit: 'VND',
                                        _i: 0,
                                    })
                                }}
                                key={index} style={[stylest.item]}>
                                    <Image style={{ width: 30, height: 30 }} source={item.img} />
                                    <Text style={[active === "F"?{color:'#77b0ff'}:styles.textWhite, stylest.textSize,{paddingTop:3}]}>{item.label.t()}</Text>
                                </View>}


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

export default connect(mapStateToProps)(MenuSelectQuickly);
const stylest = StyleSheet.create({
    item: {
        flexDirection: "column",
        alignItems: "center"
    },
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: style.colorWithdraw,
        paddingHorizontal: 0,
        paddingVertical: 10,
        flex: 1,
        marginBottom: 5
    },
    textSize: {
        fontSize: 12
    }
})
