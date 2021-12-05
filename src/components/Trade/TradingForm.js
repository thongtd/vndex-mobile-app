import React, { Component } from 'react'
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    PixelRatio,
    TouchableWithoutFeedback,
    BackHandler
} from 'react-native'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Body, Button, Input, Item, Left, Right, Content } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { style } from "../../config/style";
import { BUY, constant, ORDER_TYPE, SELL, via } from "../../config/constants";
import {
    dimensions,
    formatNumberCurrency,
    formatNumberOnChange,
    formatTrunc,
    jwtDecode,
    splitPair,
    getDecimal
} from "../../config/utilities";
import connect from "react-redux/es/connect/connect";
import { tradeService } from "../../services/trade.service";
import { authService } from "../../services/authenticate.service";
import DropdownAlert from 'react-native-dropdownalert';
import { httpService } from "../../services/http.service";
import throttle from "lodash/throttle";
import ConfirmModal from "../Shared/ConfirmModal";
import { NavigationActions } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import _ from "lodash"
import KeyBoardFnx from '../Shared/KeyBoardFnx';
import {styles} from "react-native-theme";
import TouchableWithoutFeedbackFnx from '../Shared/TouchableWithoutFeedbackFnx';
import TouchableOpacityFnx from '../Shared/TouchableOpacityFnx';
import Tooltip from 'rn-tooltip';
class TradingForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            is_error: false,
            messageText: "",
            messageType: 0,
            symbol: 'BTC',
            unit: 'VND',
            castBalance: {
                addressQrCode: "",
                available: 0,
                cryptoAddress: "",
                pending: 0,
                symbol: "VND"
            },
            coinBalance: {
                addressQrCode: "",
                available: 0,
                cryptoAddress: "",
                pending: 0,
                symbol: "VND"
            },
            quantity: '0',
            price: '0',
            fee: 0,
            accId: '',
            customerEmail: '',
            percent: 0,
            decimalSymbol: 8,
            is_confirm: false,
            content: null,
            title: null,
            ButtonOKText: null,
            decimalSymbolFull: 8,
            decimalUnit: 8,
            decimalUnitFull: 100,
            status: false,
            heightKeyboard: 0,
            configBuySellNow: null,
            activeNow: "L",
            lastestPrice: ""
        }
        this.timer = new Date().getTime();

    }

    async componentDidMount() {
        let { symbol, unit } = splitPair(this.props.pair);
        this.getBalance(symbol, unit);
        authService.checkLogged().then(val => {
            if (val) {
                this.getFee(unit);
            }
        })
        this.getDecimal(this.props.currencyList, symbol, unit);
        this.handleKeyBoard();
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        this.getBuySellNow(symbol, unit)
    }
    getBuySellNow = async (symbol, unit) => {
        try {
            let configBuySellNow = await tradeService.getBuySellNowByPair(symbol, unit);
            if (configBuySellNow) {
                this.props.isBuySellNow(configBuySellNow.enabledBuySellNow);
                this.setState({
                    configBuySellNow
                });
            }
        } catch (error) {
            console.log(error)
        }
        // console.log(configBuySellNow,"configBuySellNow");
    }
    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        this.backHandler.remove()
    }
    handleBackPress = () => {
        this.setState({ modalVisible: false, percent: 0 });

    }
    handleKeyBoard = () => {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardWillShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardWillHide',
            this._keyboardDidHide,
        );
    }
    _keyboardDidShow = (e) => {
        console.log(e.endCoordinates.height, "height keyboard")
        this.setState({
            status: true,
            heightKeyboard: e.endCoordinates.height
        })
    }
    _keyboardDidHide = () => {
        this.setState({
            status: false,
            heightKeyboard: 0
        })
    }
    getDecimal = (cuList, symbol, unit) => {
        if (cuList && cuList.length > 0 && symbol && unit)
            cuList.map((item, index) => {
                if (item.code === symbol) {
                    this.setState({
                        decimalSymbol: item.decimalFormat
                    })
                }
                if (item.code === unit) {
                    this.setState({
                        decimalUnit: item.decimalFormat
                    })
                }
            })
    }
    handleTextChange = async (text) => {
        if (text !== null || text !== "") {
            let position = text.indexOf(".");
            if (position !== -1) {
                this.setState({
                    decimalSymbolFull: this.state.decimalSymbol + position + 1
                })
            } else {
                this.setState({
                    decimalSymbolFull: 100
                })
            }
        } else {
            this.setState({
                decimalSymbolFull: 100
            })
        }
        this.setState({ quantity: formatNumberOnChange(this.props.currencyList, text, this.state.symbol) });
    }

    onPriceChange = (text) => {
        if (text !== null || text !== "") {
            let position = text.indexOf(".");
            if (position !== -1) {
                this.setState({
                    decimalUnitFull: this.state.decimalUnit + position + 1
                })
            } else {
                this.setState({
                    decimalUnitFull: 100
                })
            }
        } else {
            this.setState({
                decimalUnitFull: 100
            })
        }
        this.setState({ price: formatNumberOnChange(this.props.currencyList, text, this.state.unit) })
    }

    getBalance(symbol, unit) {
        jwtDecode().then(acc => {
            if (acc) {
                let accId = acc.id;
                authService.getWalletBalanceByCurrency(accId, symbol).then(res => {
                    this.setState({ coinBalance: res })
                })
                authService.getWalletBalanceByCurrency(accId, unit).then(res => {
                    this.setState({ castBalance: res })
                })
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        let { symbol, unit } = splitPair(nextProps.pair);
        let {configBuySellNow} = this.state;
        // console.log(nextProps.bestPrice, "nextProps.bestPrice tren");
        if (nextProps.price && nextProps.price != this.props.price) {
            // console.log(nextProps.price, "price kaka");
            this.setState({ price: nextProps.price, lastestPrice: nextProps.price })
        }
        if (nextProps.pair != this.props.pair) {
            this.getBalance(symbol, unit);
            this.getDecimal(this.props.currencyList, symbol, unit);
            this.setState({
                symbol, unit
            })
            this.getBuySellNow(symbol, unit)
        }

        if (nextProps.visible != this.props.visible) {
            this.getBalance(symbol, unit);

            this.getFee(unit);
            this.setState({
                modalVisible: nextProps.visible,
                quantity: '0',
                activeNow:"L"
            },()=>this.activeLimitOrder())
        }
        if (nextProps.walletBalance != this.props.walletBalance) {
            // console.log(nextProps.walletBalance, "nextProps.walletBalance");
            if (nextProps.walletBalance && nextProps.walletBalance.length > 0) {
                // console.log(nextProps.walletBalance)
                nextProps.walletBalance.forEach(item => {
                    if (symbol === item.symbol) {
                        this.setState({ coinBalance: item });
                    }
                    if (unit === item.symbol) {
                        this.setState({ coinBalance: item });
                    }
                })
            }
        }
        if(nextProps.bestPrice !== 0 && nextProps.bestPrice !== this.props.bestPrice && this.state.activeNow === "N" && configBuySellNow){
            // this.getTimer()
            console.log(nextProps.bestPrice,configBuySellNow, "nextProps.bestPrice duoi");
            let timer = new Date().getTime();
            let timeSetup =configBuySellNow.durationCalculatePrice || 1000;
            if(timer > this.timer + timeSetup){
                this.timer = timer;
                this.setState({
                    // price:nextProps.bestPrice,
                    lastestPrice:nextProps.bestPrice
                },()=>this.activeBuySellNow());
                
            }
        }
    }


    createNewOrder(side) {
        const { quantity, price, symbol, unit,lastestPrice,configBuySellNow,activeNow } = this.state;
        var {percentWithLastestPrice,enabledBuySellNow,buySellNowMaxOrderQtty} = configBuySellNow;
        if (quantity.str2Number() === 0) {
            return;
        } else if (price.str2Number() === 0) {
            return;
        }else if(enabledBuySellNow && quantity.str2Number() > buySellNowMaxOrderQtty){
            return this.setState({ submitting: false, is_confirm: true, content: `${"Order quantity error".t()}${buySellNowMaxOrderQtty}`, title: "ERROR".t() })
        }

        this.setState({ submitting: true });
        jwtDecode().then(acc => {
            if (acc && configBuySellNow) {
                let accId = acc.id, customerEmail = acc.sub;
               
                tradeService.create_new_order(
                    symbol, 
                    unit, 
                    quantity.str2Number(), 
                    price.str2Number(), 
                    ORDER_TYPE.LIMIT_ORDER, 
                    side, 
                    customerEmail, 
                    accId, 
                    via,
                    activeNow === "N"?(enabledBuySellNow?lastestPrice.str2Number():0):0,
                    activeNow === "N"?(enabledBuySellNow?percentWithLastestPrice:0):0
                    )
                    .then(response => {
                        if (response.status === "ERROR") {
                            this.setState({ submitting: false, is_confirm: true, content: response.message === "Placed order is failed"?"Placed order is failed".t():response.message, title: "ERROR".t() })
                        }
                        else {
                            this.setState({ quantity: '0' });
                            let order = response.data;
                            this.props.refresh({
                                symbol,
                                id: order.orderId,
                                paymentUnit: unit,
                                matchedQuantity: 0,
                                createdDate: order.createdDate,
                                quantity: quantity.str2Number(),
                                price: price.str2Number(),
                                side
                            });

                            this.props.close();
                            this.setState({ submitting: false })
                            this.setError("")
                        }
                    })
                    .catch(err => {
                        this.setState({ submitting: false })
                        httpService.onError(err.data, this.props.navigation);
                    })
            }
        })
    }

    setError(message) {
        this.setState({ is_error: true, messageText: message })
    }

    getFee = (symbol) => {
        tradeService.getTransFeeBySymbol(symbol).then(res => {
            this.setState({ fee: res })
        })
    }
    activeBuySellNow = () => {
        let { lastestPrice, configBuySellNow, unit } = this.state;
        let { side, currencyList } = this.props;
        if (lastestPrice && configBuySellNow) {
            let PercentPrice = (lastestPrice.str2Number() * configBuySellNow.percentWithLastestPrice) / 100;
            let price = side === SELL ? (Number(lastestPrice.str2Number()) - Number(PercentPrice)) : (Number(lastestPrice.str2Number()) + Number(PercentPrice));
            //    console.log(price,"price kaka2");
            //    console.log(lastestPrice.str2Number(),lastestPrice,PercentPrice,"price kaka lastestPrice")
            this.props.activeBSNow("N");
            this.setState({
                activeNow: "N",
                price: formatTrunc(currencyList, price, unit)
            });
        }

    }
    activeLimitOrder=()=>{
        let {lastestPrice} = this.state;
        this.props.activeBSNow("L");
         this.setState({
            activeNow: "L",
            price:lastestPrice
        })
    }
    render() {
        const {
            modalVisible, messageText, messageType, unit, price, status, heightKeyboard,
            quantity, symbol, fee, submitting, percent, castBalance, coinBalance, is_confirm, content, title, ButtonOKText, decimalUnitFull, activeNow,
            configBuySellNow
        } = this.state;
        const { side, currencyList } = this.props;
        console.log(configBuySellNow, "configBuySellNow")
        return (
            <React.Fragment>

                <Animatable.View
                    animation={{
                        0: {
                            translateY: modalVisible ? (configBuySellNow && configBuySellNow.enabledBuySellNow ? 185 : 155) : 80,
                        },
                        0.5: {
                            translateY: modalVisible ? 80 : (configBuySellNow && configBuySellNow.enabledBuySellNow ? 205 : 175),
                        },
                    }}
                    delay={0}
                    duration={150}
                    direction="alternate"
                    easing="ease-in-out"
                    useNativeDriver
                    style={{ position: "absolute", bottom: Platform.OS === 'ios' ? (status ? heightKeyboard - 50 : 0) : 0, zIndex: 20, height: 255, backgroundColor: styles.bgMain.color }}>
                    <KeyboardAvoidingView
                        onPress={Keyboard.dismiss} contentContainerStyle={stylest.modalBackground}
                        behavior={Platform.OS === 'ios' ? 'padding' : ''}>
                        <TouchableWithoutFeedbackFnx onPress={() => Keyboard.dismiss()}>
                            <View style={[stylest.activityIndicatorWrapper, Platform.OS === 'ios' ? stylest.shadowIOS : stylest.shadowAndroid,styles.backgroundSub]}>
                                <Item style={[style.item, { height:36, borderRadius: 2.5, }]}>
                                    <Left style={{ flex: 4 }}>
                                        <View style={[style.row, {
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginBottom: Platform.OS === 'android' ? 10 : 0
                                        }]}>
                                            <TouchableOpacityFnx onPress={() => {
                                                this.props.setSide(BUY);
                                                this.setState({ percent: 0, quantity: '0' }, () => {
                                                    let { activeNow } = this.state;
                                                    if (activeNow === "N") {
                                                        this.activeBuySellNow()
                                                    }else if(activeNow === "L"){
                                                        this.activeLimitOrder()
                                                    }
                                                })
                                            }}
                                                disabled={side === BUY}
                                                style={[
                                                    {
                                                        width: 100,
                                                        borderBottomWidth: side === BUY ? 2 : 1,
                                                        borderBottomColor: side === BUY ? styles.bgBuyOldNew.color : styles.txtMainTitle.color
                                                    }]}>
                                                <Text style={[side === BUY ? {
                                                    color: '#78afff',
                                                    fontSize: 13
                                                } : styles.txtMainTitle, {
                                                    paddingBottom: 10,
                                                    textAlign: 'center'
                                                }]}>{'BUY'.t()}</Text>
                                            </TouchableOpacityFnx>
                                            <TouchableOpacityFnx onPress={() => {
                                                this.props.setSide(SELL);
                                                //this.getBalance(symbol);
                                                this.setState({ percent: 0, quantity: '0' }, () => {
                                                    let { activeNow } = this.state;
                                                    if (activeNow === "N") {
                                                        this.activeBuySellNow()
                                                    }else if(activeNow === "L"){
                                                        this.activeLimitOrder()
                                                    }
                                                })
                                            }}
                                                disabled={side === SELL}
                                                style={[
                                                    {
                                                        width: 100,
                                                        borderBottomWidth: side === SELL ? 2 : 1,
                                                        borderBottomColor: side === SELL ? styles.bgSellOldNew.color : styles.txtMainTitle.color
                                                    }]}>
                                                <Text style={[side === SELL ? {
                                                    color: '#78afff',
                                                    fontSize: 13
                                                } : styles.txtMainTitle, {
                                                    paddingBottom: 10,
                                                    textAlign: 'center'
                                                }]}>{'SELL'.t()}</Text>
                                            </TouchableOpacityFnx>
                                        </View>
                                    </Left>
                                    <Right style={{ alignItems: 'flex-end'}}>
                                        <TouchableOpacityFnx
                                            style={{
                                                height: 36,
                                                paddingLeft: 30,
                                                //    paddingRight:5
                                            }}
                                            onPress={() => {
                                                if (status) {
                                                    Keyboard.dismiss();
                                                    setTimeout(() => {
                                                        this.setState({ modalVisible: false, percent: 0 });
                                                        this.setError("")
                                                        this.props.close()
                                                    }, 150)
                                                } else {
                                                    Keyboard.dismiss();
                                                    this.setState({ modalVisible: false, percent: 0 });
                                                    this.setError("")
                                                    this.props.close()
                                                }
                                            }}>
                                            <View style={style.btnCloseModal}>
                                                <Icon name={'times'} size={14} color={'#fff'} />
                                            </View>

                                        </TouchableOpacityFnx>
                                    </Right>
                                </Item>
                                {messageText ? <View style={[style.item, { justifyContent: 'center', paddingBottom: 10 }]}>
                                    <Text style={{ color: messageType ? styles.bgBuyOldNew.color : styles.bgSellOldNew.color }}>{messageText}</Text>
                                </View> : null}
                                {configBuySellNow && configBuySellNow.enabledBuySellNow && (
                                    <Item style={[style.item, { borderRadius: 2.5, paddingBottom: 10, paddingLeft: 0 }]}>
                                        <Tooltip
                                            backgroundColor={styles.bgTooltipOldNew.color}
                                            containerStyle={{
                                                borderRadius: 0,
                                            }}
                                            height={100}
                                            width={120}
                                            overlayColor={"transparent"}
                                            popover={
                                                <View style={{
                                                    justifyContent: "space-around",
                                                    flexDirection: "column",
                                                    width: "100%",
                                                   
                                                }}>
                                                    <View onStartShouldSetResponder={this.activeLimitOrder} style={[stylest.item, {width: "100%",height:49,alignItems:"center",alignSelf:"center" }]}>
                                                        <Text style={[styles.textWhite, stylest.textSize, {
                                                            paddingTop: 12
                                                        }]}>
                                                            {"LIMIT_ORDER".t()}
                                                        </Text>
                                                    </View>
                                                    <View style={{
                                                        width:"100%",borderBottomColor:"grey",borderBottomWidth:0.5,
                                                        height:2
                                                    }}>
                                                    </View>
                                                    <View onStartShouldSetResponder={this.activeBuySellNow} style={[stylest.item, { width: "100%",height:49,alignItems:"center",alignSelf:"center" }]}>

                                                        <Text style={[styles.textWhite, stylest.textSize, {
                                                            paddingTop: 22
                                                        }]}>{side === SELL ? "SELL_NOW".t() : "BUY_NOW".t()}</Text>
                                                    </View>

                                                </View>

                                            }>
                                            <View style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                width: 150,
                                                justifyContent: "flex-start"
                                            }}>
                                                <Text style={[styles.textWhite]}>{activeNow === "N" ? (side === SELL ? "SELL_NOW".t() : "BUY_NOW".t()) : "LIMIT_ORDER".t()}{"   "}</Text>
                                                <Icon name="caret-down" size={20} color={style.colorMain} />
                                            </View>
                                        </Tooltip>
                                    </Item>
                                )}

                                <Item style={[style.item, { borderRadius: 2.5, paddingBottom: 10, paddingLeft: 0 }]}>
                                    <Left>
                                        <Text style={[styles.txtMainTitle, {
                                            paddingTop: 0,
                                        }]}>{"BALANCES".t()}</Text>
                                    </Left>
                                    <Right>
                                        <View style={{
                                            flexDirection: "row"
                                        }}>
                                            <Text style={styles.textWhite}>
                                                {
                                                    side === BUY ? formatTrunc(currencyList, castBalance.available, unit) : formatTrunc(currencyList, coinBalance.available, symbol)
                                                }
                                            </Text>
                                            <Text
                                                style={[styles.textMain, {
                                                    paddingTop: 0,
                                                    paddingLeft: 15,
                                                }]}>{side === BUY ? unit : symbol}</Text>
                                        </View>
                                    </Right>
                                </Item>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ flex: 1, marginRight: 2.5 }}>
                                        <Item style={[stylest.input, { borderRadius: 2.5, backgroundColor:activeNow === "N"?styles.bgDisable.color:"transparent" }]}>
                                            <Text style={{ color: style.normalTextColor }} />
                                            <Input
                                                allowFontScaling={false}
                                                style={[styles.textWhite, {
                                                    paddingLeft: 10,
                                                   
                                                }]}
                                                value={price}
                                                keyboardType='numeric'
                                                onChangeText={this.onPriceChange}
                                                maxLength={decimalUnitFull}
                                                disabled={activeNow === "N" ? true : false}
                                            />
                                            <Text style={[styles.textMain, {
                                                paddingTop: 0,
                                                paddingRight: 10
                                            }]}>{unit}</Text>
                                        </Item>
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 2.5 }}>
                                        <Item style={[stylest.input, { borderRadius: 2.5, }]}>
                                            <Text style={[styles.textMain, { paddingTop: 0 }]} />
                                            <Input allowFontScaling={false} style={[styles.textWhite, {
                                                paddingLeft: 10
                                            }]} value={quantity}
                                                keyboardType='numeric'
                                                onChangeText={this.handleTextChange}
                                                maxLength={this.state.decimalSymbolFull}
                                            />
                                            <Text
                                                style={[styles.textMain, {
                                                    paddingTop: 0,
                                                    paddingRight: 10
                                                }]}>{symbol}</Text>
                                        </Item>
                                    </View>
                                </View>
                                <View style={{
                                    justifyContent: 'space-between',
                                    marginVertical: 5,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    height: 32,
                                }}>
                                    {[25, 50, 75, 100].map((item, index) => {
                                        return (
                                            <TouchableOpacityFnx
                                                onPress={() => {
                                                    this.setState({ percent: item });
                                                    if (price.str2Number() > 0) {
                                                        if (side === SELL) {
                                                            let qtty = item * coinBalance.available / 100;
                                                            this.setState({ quantity: formatTrunc(currencyList, qtty, symbol) });
                                                        }
                                                        else {
                                                            this.setState({ quantity: formatTrunc(currencyList, (item * castBalance.available / 100) / (price.str2Number() * (1 + fee / 100)), symbol) })
                                                        }
                                                    }
                                                    else {
                                                        this.setState({ quantity: '0' })
                                                    }
                                                }}
                                                style={{
                                                    width: "23.5%",
                                                    lineHeight: 32,
                                                    backgroundColor: styles.bgButton.color,
                                                    alignSelf: "center",
                                                    alignItems: 'center',
                                                    paddingVertical: 6,
                                                    marginLeft: 1
                                                }} key={index}>
                                                <Text style={style.textWhite}>{item}%</Text>
                                            </TouchableOpacityFnx>
                                        )
                                    })}
                                </View>
                                <View style={{ marginVertical: 10 }}>
                                    <Item style={[style.item,]}>
                                        <Left>
                                            <Text style={{
                                                color: styles.txtMainTitle.color,
                                                paddingTop: 0,
                                            }}>{'TOTAL'.t()} </Text>
                                        </Left>
                                        <Right>
                                            <View style={{
                                                flexDirection: "row",
                                            }}>
                                                <Text style={{
                                                    paddingRight: 10,
                                                    color: side === BUY ? styles.bgBuyOldNew.color : styles.bgSellOldNew.color
                                                }}>
                                                    {price.str2Number() > 0 ? side === BUY ? formatTrunc(currencyList, price.str2Number() * quantity.str2Number() * (1 + fee / 100), unit) : formatTrunc(currencyList, (price.str2Number() * quantity.str2Number()), unit) : '0'}</Text>
                                                <Text
                                                    style={[styles.textMain, { paddingTop: 0 }]}>{unit}</Text>
                                            </View>
                                        </Right>
                                    </Item>
                                </View>
                                {
                                    side === BUY
                                        ? <TouchableOpacityFnx block style={[style.buttonBuy, style.buttonHeight, {
                                            marginLeft: 1,
                                            borderRadius: 2.5,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }]} disabled={submitting}
                                            onPress={() => {
                                                Keyboard.dismiss();
                                                this.setState({ percent: 0 })
                                                this.createNewOrder(side)
                                            }}><Text
                                                style={[style.textWhite, { fontWeight: "bold" }]}>{"BUY".t()} {symbol}</Text></TouchableOpacityFnx>
                                        : <TouchableOpacityFnx block style={[style.buttonSell, style.buttonHeight, {
                                            marginLeft: 1,
                                            borderRadius: 2.5,
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }]} disabled={submitting}
                                            onPress={() => {
                                                Keyboard.dismiss();
                                                this.setState({ percent: 0 })
                                                this.createNewOrder(side)
                                            }}><Text
                                                style={[style.textWhite, { fontWeight: "bold" }]}>{"SELL".t()} {symbol}</Text></TouchableOpacityFnx>
                                }
                            </View>
                        </TouchableWithoutFeedbackFnx>
                    </KeyboardAvoidingView>
                    <ConfirmModal
                        visible={is_confirm}
                        title={title}
                        content={content}
                        onClose={() => this.setState({ is_confirm: false, resultType: "", resultText: "" })}
                        resultText={this.state.resultText} resultType={this.state.resultType}
                        ButtonOKText={ButtonOKText}
                        ButtonCloseText={"CLOSE".t()}
                    />
                </Animatable.View>

            </React.Fragment>

        )
    }
}

const stylest = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1c2840',
        height: '100%'
    },
    header: {
        backgroundColor: "#1c2840"
    },
    headerItem: {
        flexDirection: "row",
        alignItems: "flex-end",
        padding: 10
    },
    marketData: {
        backgroundColor: "#1c2840",
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#1c2840",
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    content: {
        backgroundColor: "#151d30"
    },
    chart: {
        height: dimensions.height * 2 / 5,
        backgroundColor: "#151d30"
    },
    order: {
        flexDirection: 'row',
        // height: height/3
    },
    item: {
        borderBottomWidth: 0,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5
    },
    btnOrder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#00000040'
    },
    btnBuy: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 10,
        backgroundColor: '#44a250'
    },
    btnSell: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 10,
        backgroundColor: '#c5321e'
    },
    lastPrice: {
        fontWeight: '600',
        fontSize: 12,
        color: '#44a250'
    },
    currencyVolume: {
        color: '#343f85',
        fontSize: 10
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
        backgroundColor: '#1c2840',
        width: dimensions.width,
        // height: dimensions.height / 2,
        justifyContent: 'space-between',
        padding: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        zIndex: 999
    },
    loadingArea: {
        backgroundColor: '#00000040',
        width: dimensions.width,
        height: dimensions.height / 2.2,
        justifyContent: 'space-between',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    input: {
        backgroundColor: 'transparent',
        borderRadius: 2.5,
        height: 40,
        marginBottom: 5,
        // marginHorizontal: 5,
        justifyContent: 'center',
        borderTopWidth: 0.5,
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: style.colorBorderTrade
    },
    fontSize: {
        fontSize: 10,
    },
    sliderPseudo: {
        position: 'absolute',
        width: '100%',
        height: 9,
        top: '50%',
        zIndex: -1,
    },
    itemSeparator: {
        position: 'absolute',
        width: 2,
        height: 9,
        top: -4.5,
        borderRadius: 1,
    },
    shadowIOS: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
    },
    shadowAndroid: {
        elevation: 24,
    },
    textSize: {
        fontSize: 12
    }
});
const mapStateToProps = state => {
    return {
        walletBalance: state.tradeReducer.walletBalance,
        balance: state.tradeReducer.balance,
        currencyList: state.commonReducer.currencyList,
        tradingMarketWatch: state.tradeReducer.tradingMarketWatch
    }
}
export default connect(mapStateToProps, {})(TradingForm);
