import React, { Component } from 'react'
import { View, Text, TouchableOpacity, ListView, StyleSheet, Alert, Modal } from 'react-native'
import { Body, Item, Left, Right, Button } from "native-base";
import { style } from "../../config/style";
import { SwipeListView } from "react-native-swipe-list-view";
import { convertUTC, formatSCurrency, jwtDecode, splitPair, to_UTCDate } from "../../config/utilities";
import Icon from "react-native-vector-icons/FontAwesome";
import { tradeService } from "../../services/trade.service";
import { connect } from "react-redux";
import { authService } from "../../services/authenticate.service";
import { BUY, constant } from "../../config/constants";
import ConfirmModal from "../Shared/ConfirmModal";
import SignalRService from '../../services/signalr.service';
import Empty from '../Shared/Empty';
import {NavigationEvents} from "react-navigation";
import {styles} from "react-native-theme";
import TouchableOpacityFnx from '../Shared/TouchableOpacityFnx';
class OpenOrder extends Component {
    constructor(props) {
        super(props);
        console.log("test vao day");
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            openOrder: [],
            recentOrder: [],
            activeTab: "O",
            is_confirm: false,
            is_confirm_1: false,
            orderIds: null
        }
    }
    getRecentOrder(pair) {
        let { symbol, unit } = splitPair(pair);
        const top = 20;
        tradeService.getRecentOrder(symbol, unit, top)
            .then(response => {
                this.setState({ recentOrder: response })
            })
    }

    componentDidMount() {
        this.getData(this.props.pair);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.onRefresh === true) {
            this.getData(this.props.pair);
        }else if(nextProps.logged === true){
            this.getData(this.props.pair);
        }else if(nextProps.logged === false){
            this.setState({
                openOrder:[]
            })
        }
        if(nextProps.walletBalanceChange.walletBalances !== this.props.walletBalanceChange.walletBalances){
            console.log("vao data roi")
            this.onGetWalletBalanceChange()
        }
        if (nextProps.pair != this.props.pair) {
            this.getData(nextProps.pair)
        }
        if (nextProps.tradingMatchOrder != this.props.tradingMatchOrder) {
            this.getData(this.props.pair);
        }
        if (nextProps.newOrder && nextProps.newOrder !== this.props.newOrder) {
            // console.log(nextProps.newOrder)
            let openOrder = this.state.openOrder;
            openOrder.unshift(nextProps.newOrder)
            this.setState({ openOrder })
        }
    }

    getData = (pair) => {
        this.getRecentOrder(pair);
        authService.checkLogged().then(logged => {
            if (logged) {
                jwtDecode().then(acc => {
                    this.getOpenOrder(pair, acc.id);
                })
            }
        })
    }

    getOpenOrder(pair, accId) {
        tradeService.getOpenOrder(accId, null, null, null, null, null, 1, 15)
            .then(response => {
                if (response.data.source) {
                    this.setState({ openOrder: response.data.source })
                }
            })
    }
    openConfirm = (data, secId, rowId, rowMap) => {
        // this.setState({ is_confirm_1: true, orderIds: data.id })
        this.cancelOrder(data.id)
        // console.log(rowMap,"row Map");
        setTimeout(() => {
            if (rowMap[`${secId}${rowId}`] !== null) {
                rowMap[`${secId}${rowId}`].closeRow()
            }
        }, 200)

    }

    async cancelOrder(ids) {
        // let ids = this.state.orderIds;
        let orderIds = [ids];
        console.log(orderIds,"orderIds hiihi");
        let content = await jwtDecode();
        let accId = content.id;
        let res = await tradeService.cancel_order(accId, orderIds);
        if (res.status == 200) {
            this.getData(this.props.pair);
            this.setState({ is_confirm_1: false })
        } else {

        }
        
    }

    cancelAll = async () => {
        let orderIds = [];
        this.state.openOrder.forEach(e => {
            orderIds.push(e.id)
        })
        let content = await jwtDecode();
        let accId = content.id;

        let res = await tradeService.cancel_order(accId, orderIds);
        if (res.status == 200) {
            this.setState({ resultText: "", resultType: "" })
            this.getData(this.props.pair);
            this.setState({ is_confirm: false })
        } else {
            this.setState({ resultText: res.data.message.t(), resultType: "error" })
        }
    }
    onGetWalletBalanceChange=(data)=>{
        console.log(data,"data change");
        this.getData(this.props.pair);
    }
    render() {
        const { openOrder, activeTab, is_confirm, is_confirm_1 } = this.state;
        const { currencyList, navigation,logged } = this.props;
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return (
            
            <View style={{ paddingHorizontal: 10 }}>
                {/* <SignalRService
                        getWalletBalanceChange={this.onGetWalletBalanceChange}
                        listen_event={[constant.SOCKET_EVENT.PRICE_CHANGE_NOTIFY]} /> */}
                <View style={[stylest.item, style.row, { backgroundColor: style.tabActiveColor, marginBottom: 10, justifyContent: 'space-between', paddingVertical: 0, paddingHorizontal: 0 }]}>
                    <View style={[style.row, { justifyContent: 'flex-start', alignItems: 'center' }]}>
                        <View style={{ borderBottomWidth: 1, borderBottomColor: '#4972f3', paddingHorizontal: 10, paddingVertical: 5 }}>
                            <Text style={{ color: '#77b0ff' }}>{'OPEN_ORDERS'.t()}</Text>
                        </View>
                    </View>
                    {logged && <Right style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <TouchableOpacityFnx onPress={() => this.setState({ is_confirm: true })}
                            style={[style.btnCancelAll, { height: null,paddingHorizontal:20 }]}>
                            <Text style={styles.bgSellOldNew}>{'CANCEL_ALL'.t()}</Text>
                        </TouchableOpacityFnx>
                    </Right>}
                    
                </View>
                <View>
                    <View style={{ flexDirection: 'row', paddingHorizontal: 15, }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.txtMainTitle}>{'PRICE'.t()}</Text>
                        </View>
                        <View style={{ flex: 1.5, alignItems: 'flex-end', paddingRight: 15 }}>
                            <Text style={styles.txtMainTitle}>{'AMOUNT'.t()}</Text>
                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text style={styles.txtMainTitle}>{'TIME'.t()}</Text>
                        </View>
                    </View>
                    {openOrder.length > 0 
                       ? <SwipeListView
                       dataSource={this.ds.cloneWithRows(openOrder)}
                       renderRow={data => (
                           <Item style={{
                               backgroundColor:styles.bgSub.color,
                               marginTop: 7.5,
                               height: 60,
                               borderBottomWidth: 0,
                               paddingHorizontal: 10
                           }}>
                               <View style={{ flex: 1 }}>
                                   <View style={{ flexDirection: 'row' }}>
                                       <Text style={{ color: data.side === "B" ? "#00d154" : "#ff315d", fontWeight: 'bold' }}>{data.symbol}/</Text>
                                       <Text style={{ color: data.side === "B" ? "#00d154" : "#ff315d" }}>{data.paymentUnit}</Text>
                                   </View>

                                   <Text
                                       style={[styles.txtMainSub,stylest.paddingCommon]}>{formatSCurrency(currencyList, data.price, data.paymentUnit)}</Text>
                               </View>
                               <View style={{ flex: 1.5, alignItems: 'flex-end', paddingRight: 15, paddingLeft: 5 }}>
                                   <Text
                                       style={styles.textWhite}>
                                       {formatSCurrency(currencyList, data.matchedQuantity, data.symbol)}
                                   </Text>
                                   <Text style={[styles.txtMainSub,stylest.paddingCommon]}>{formatSCurrency(currencyList, data.quantity, data.symbol)}</Text>
                               </View>
                               <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                   <Text style={styles.textWhite}>{to_UTCDate(data.createdDate, 'DD-MM-YYYY')}</Text>
                                   <Text
                                       style={[styles.txtMainSub,stylest.paddingCommon]}>{to_UTCDate(data.createdDate, 'hh:mm:ss')}</Text>
                               </View>
                           </Item>
                       )}
                       renderHiddenRow={(data, secId, rowId, rowMap) => (
                           <Item style={{
                               backgroundColor: '#ff315d',
                               marginTop: 7.5,
                               height: 60,
                               borderBottomWidth: 0
                           }}
                               onPress={() => {
                                   // this.cancelOrder(data)
                                   // setTimeout(() => {
                                   //     console.log(rowMap, secId, rowId, data, "row map hiih");
                                   //     if (rowMap[`${secId}${rowId}`] !== null) {
                                   //         rowMap[`${secId}${rowId}`].closeRow()
                                   //     }
                                   // }, 1200)
                                   this.openConfirm(data, secId, rowId, rowMap)
                               }}>
                               <Left style={{ flex: 2 }} />
                               <Body style={{ flex: 2 }} />
                               <View style={{ width: 50, justifyContent: 'center', alignItems: 'center' }}>
                                   <Icon name={'trash'} color={'#fff'} size={20} />
                               </View>
                           </Item>
                       )}
                       rightOpenValue={-50}
                       disableRightSwipe={true}
                   />:<Empty style={{paddingVertical:30}} />}
                    
                </View>
                <ConfirmModal visible={is_confirm} title={"CANCEL_ALL".t()} content={"CANCEL_ALL_CONFIRM".t()}
                    onClose={() => this.setState({ is_confirm: false, resultType: "", resultText: "" })} onOK={() => this.cancelAll()}
                    resultText={this.state.resultText} resultType={this.state.resultType} ButtonOKText={"OK".t()} ButtonCloseText={"CLOSE".t()}
                />
                <ConfirmModal visible={is_confirm_1} title={"CANCEL_ORDERS".t()} content={"CONFIRM_TO_CANCEL_SELECTED_ORDERS".t()}
                    onClose={() => this.setState({ is_confirm_1: false, resultType: "", resultText: "" })} onOK={() => this.cancelOrder()}
                    resultText={this.state.resultText} resultType={this.state.resultType} ButtonOKText={"OK".t()} ButtonCloseText={"CLOSE".t()}
                />
            </View>
        )
    }
}

const stylest = StyleSheet.create({
    item: {
        borderBottomWidth: 0,
        // paddingLeft: 10,
        paddingVertical: 5
    },
    tabHeading: {
        padding: 15,
        backgroundColor: style.colorDart,
        borderWidth: 1,
        borderColor: style.depositBtnColor,
        height: 30,
        paddingHorizontal: 20
    },
    paddingCommon:{
        paddingTop:4
    }
})
const mapStateToProps = state => {
    return {
        tradingMatchOrder: state.tradeReducer.tradingMatchOrder,
        currencyList: state.commonReducer.currencyList,
        logged:state.commonReducer.logged,
        walletBalanceChange: state.tradeReducer.walletBalanceChange
    }
}
export default connect(mapStateToProps, {})(OpenOrder);
