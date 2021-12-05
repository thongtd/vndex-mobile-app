import React, { Component } from 'react'
import { Text, View, Dimensions,Platform,StyleSheet } from 'react-native'
import { style } from '../../../config/style'
import {
    formatCurrency,
    jwtDecode,
    formatSCurrency
} from "../../../config/utilities";
import { constant } from "../../../config/constants";

import SignalRService from '../../../services/signalr.service';
import { storageService } from "../../../services/storage.service"
import { authService } from "../../../services/authenticate.service"
import { getLastestPriceBySymbol } from "../../../redux/action/market.action";
import { connect } from "react-redux";
import { NavigationEvents } from "react-navigation";
const { height, width } = Dimensions.get('window')
import {styles} from "react-native-theme"
class InfoCoin extends Component {
    constructor(props) {
        super(props)
        var d = new Date();
        var n = d.getTime();
        this.timerNow = n;
        this.timer = 500;
        this.state = {
            keepLogin: null,
            isLeave:false
        }
        this.onUpdateMarketData = this.getMarketData;
    }
    // componentWillReceiveProps(nextProps) {
    //     console.log(nextProps, "nextProps");
    // }

    getMarketData = (marketData) => {
        if (marketData) {
            console.log(marketData)
            let { tradingCoins, activeUnit } = this.state;
            for (let i in tradingCoins) {
                let item = tradingCoins[i];
                if (item.symbol === marketData.symbol && item.tradingCurrency === marketData.paymentUnit) {
                    tradingCoins[i] = Object.assign({}, item, marketData);
                    break;
                }
            }
            var d = new Date();
            var n = d.getTime();
            if (n > this.timerNow + this.timer) {
                this.timerNow = n;

                this.setState({ tradingCoins: tradingCoins })
            }
            // this.setState({ tradingCoins: tradingCoins })
        }
    }
    checkKeepLogin = async () => {
        // console.log("da vao");
        let user = await jwtDecode();
        // console.log(user, "users hihi");
        let userInfo = await storageService.getItem(constant.STORAGEKEY.USER_INFO);
        try {
            let keepLogin = await authService.keepLogin(user.id);
            if (keepLogin) {
                this.setState({ keepLogin })
            } else {
                this.setState({ keepLogin: userInfo })
            }
        } catch (e) {
            // httpService.onError()
            console.log(e, "err");
        }
    }
    getMarketWatch = () => {
        authService.getMarketWatch().then(res => {
            if (res) {
                this.setState({
                    marketWatch: res
                })
            }
        });
    }
    handleLated = () => {
        const { marketWatch, keepLogin } = this.state;
        const { symbolCoin } = this.props;
        var lated;
        if (marketWatch && symbolCoin && keepLogin && marketWatch.length > 0) {
            marketWatch.map((item, data) => {
                if (item.tradingCurrency === keepLogin.currencyCode) {
                    if (item.tradingCoins.length > 0) {
                        item.tradingCoins.map((item2, index) => {
                            if (item2.symbol == symbolCoin) {
                                lated = item2;
                            }
                        })

                    }
                }
            })
            return lated
        }

    }
    componentDidMount = async () => {
        await this.checkKeepLogin();
        await this.getMarketWatch();
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.marketData !== this.props.marketData){
            this.getMarketData(nextProps.marketData)
        }
       
    }
    render() {
        // console.log(this.state.keepLogin, "keepLogin");
        const { infoCurrency,currencyList } = this.props;
        // console.log(this.handleLated(), "handle");
        // if (typeof this.handleLated() !== "undefined") {
        //     this.props.getLastestPriceBySymbol({
        //         test:"data"
        //     });
        // }
        console.log(infoCurrency,"infoCurrency in wallet");
        const market = this.handleLated();
        return (
            <View style={{
                backgroundColor: styles.bgInfoWlWhite.color,
                // height: height / 4,
                width: width,
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                paddingBottom: 25
            }}>
                <NavigationEvents
                    onWillFocus={(payload) => {
                        this.setState({
                            isLeave: false,
                        })
                    }}
                    onWillBlur={() => {
                        this.setState({
                            isLeave: true,
                        })
                    }}
                />
                {/* <SignalRService
                activeTab={null}
                    // getMarketData={this.onUpdateMarketData}
                    offEvent={this.state.isLeave}
                    listen_event={[constant.SOCKET_EVENT.MARKET_WATCH]} /> */}
                <View style={{
                    flexDirection: "column",
                    paddingHorizontal: 30,
                }}>
                    <View style={{ flexDirection: "row",paddingBottom:5 }}>
                        <View style={{
                            flex: 1
                        }}>
                            <Text style={[styles.txtMainTitle, { paddingVertical: 2.5 }]}>{'AVAILABLE'.t()}</Text>
                            <Text
                                style={[styles.textWhite, { paddingVertical: 2.5 }]}>{infoCurrency.available && formatSCurrency(currencyList,infoCurrency.available, infoCurrency.symbol)}</Text>
                        </View>
                        <View style={{
                            flex: 1
                        }}>
                            <Text style={[styles.txtMainTitle, { paddingVertical: 2.5 }]}>{'PENDING'.t()}</Text>
                            <Text
                                style={[styles.textWhite, { paddingVertical: 2.5 }]}>{infoCurrency.pending && formatCurrency(infoCurrency.pending, 8)}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row",paddingBottom:5 }}>
                        <View style={{
                            flex: 1
                        }}>
                            <Text style={[styles.txtMainTitle, { paddingVertical: 2.5 }]}>{'PROMOTION'.t()}</Text>
                            <Text
                                style={[styles.textWhite, { paddingVertical: 2.5 }]}>{infoCurrency && infoCurrency.promotion}</Text>
                        </View>
                        <View style={{
                            flex: 1
                        }}>
                            <Text style={[styles.txtMainTitle, { paddingVertical: 2.5 }]}>{'TOTAL_AMOUNT'.t()}</Text>
                            <Text
                                style={[styles.textWhite, { paddingVertical: 2.5 }]}
                            >{infoCurrency && formatSCurrency(currencyList,Number(infoCurrency.available) + Number(infoCurrency.pending), infoCurrency.symbol)}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row",paddingBottom:5 }}>
                        <View style={{
                            flex: 1
                        }}>
                            <Text style={[styles.txtMainTitle, { paddingVertical: 2.5 }]}>{`${"LAST_PRICE".t()} (${this.state.keepLogin ? this.state.keepLogin.currencyCode : null})`}</Text>
                            <Text
                                style={[styles.textWhite, { paddingVertical: 2.5 }]}>{typeof market !== "undefined" ? formatCurrency(market.lastestPrice,0) : 0}</Text>
                        </View>
                        <View style={{
                            flex: 1
                        }}>
                            <Text style={[styles.txtMainTitle, { paddingVertical: 2.5 }]}>{`${"VALUE".t()} (${this.state.keepLogin ? this.state.keepLogin.currencyCode : null})`}</Text>
                            <Text
                                style={[styles.textWhite, { paddingVertical: 2.5 }]}>{typeof market !== "undefined"? formatCurrency(
                                    (
                                    Number(infoCurrency.available) + Number(infoCurrency.pending)

                                ) * 
                                Number(market.lastestPrice)
                                ,0):0}</Text>
                        </View>
                    </View>

                </View>
            </View >
        )
    }
}
// const styles = StyleSheet.create({
//     fontIOS:{
//         fontFamily:"Roboto"
//     }
// })
const mapStateToProps = (state) => {
    return {
        lastestPrice: state.marketReducer.lastestPrice,
        marketData:state.marketReducer.marketData
    }
}

export default connect(mapStateToProps, { getLastestPriceBySymbol })(InfoCoin);
