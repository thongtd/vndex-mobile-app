import React, {PureComponent} from 'react'
import {StyleSheet, Text, TouchableOpacity, View, FlatList, ListView, Dimensions, ScrollView} from "react-native";
import {Body, Button, Item, Left, Right, Content, Container} from "native-base";
import {style} from "../../config/style";
import {fillTopOrder, formatCurrency, formatTrunc, splitPair, to_UTCDate} from "../../config/utilities";
import {BUY, constant, SELL} from "../../config/constants";
import Icon from "react-native-vector-icons/FontAwesome";
import {tradeService} from "../../services/trade.service";
import {httpService} from "../../services/http.service";
import connect from "react-redux/es/connect/connect";
import SignalRService from "../../services/signalr.service";
import TopBuyItem from './TopBuy'
import TopSellItem from './TopSell'
import throttle from 'lodash/throttle'
import {SwipeListView} from "react-native-swipe-list-view";
import {styles} from "react-native-theme"
const {height, width} = Dimensions.get('window')

class RecentTrade extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            symbol: '',
            unit: '',
            orderSell: [],
            orderBuy: [],
            recentOrder: [],
            activeTab: 'O'
        }
    }

    render() {
        let recentOrder = this.props.data;
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const {currencyList} = this.props;
        return (
            <View style={{marginTop: 10}}>
                {recentOrder.length > 0 ?
                    <View style={{height: height / 3}}>
                        <View style={{flexDirection: 'row', paddingLeft: 15, marginBottom: 10, marginTop: 10}}>
                            <View style={{flex: 1}}>
                                <Text style={style.textMain}>{'PRICE'.t()}</Text>
                            </View>
                            <View style={{flex: 1, alignItems: 'flex-end',}}>
                                <Text style={style.textMain}>{'AMOUNT'.t()}</Text>
                            </View>
                            <Right style={{flex: 1, alignItems: 'flex-end', marginRight: 15}}>
                                <Text style={style.textMain}>{'TIME'.t()}</Text>
                            </Right>
                        </View>
                        <ScrollView>
                            <SwipeListView
                                dataSource={ds.cloneWithRows(recentOrder)}
                                renderRow={(e, i) => (
                                    <Item style={{
                                        marginLeft: 15,
                                        marginRight: 15,
                                        marginBottom: 5,
                                        alignItems: 'center',
                                        borderBottomWidth: 0
                                    }} key={i}>
                                        <View style={{flex: 1, marginRight: 7.5}}>
                                            <Text
                                                style={e.colorCode > 0 ? styles.bgBuyOldNew : styles.bgSellOldNew}>{formatTrunc(currencyList, e.price, e.paymentUnit)}</Text>
                                        </View>
                                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                                            <Text
                                                style={style.textWhite}>{formatTrunc(currencyList, e.qtty, e.symbol)}</Text>
                                        </View>
                                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                                            <Text
                                                style={[style.textMain]}>{to_UTCDate(e.createdDate, 'hh:mm:ss')}</Text>
                                        </View>
                                    </Item>
                                )}
                                disableRightSwipe={true}
                            />
                        </ScrollView>
                    </View>
                    :
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: 80}}>
                        <Icon name={'file'} size={30} color={'#323232'}/>
                        <Text style={{color: '#323232'}}>{'NO_DATA_TO_EXPORT'.t()}</Text>
                    </View>
                }
            </View>
        )
    }
}

const stylest = StyleSheet.create({
    fontSize: {
        fontSize: 12,
    },
    item: {
        borderBottomWidth: 0,
        paddingBottom: 5
    },
    order: {
        flexDirection: 'row',
        // height: height/3
    },
    coin: {
        borderColor: '#343f85',
        borderWidth: 0,
        borderRadius: 0,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        // paddingHorizontal: 20,
        // paddingVertical: 15
    },
});
const mapStateToProps = state => {
    return {
        buyData: state.tradeReducer.buyData,
        sellData: state.tradeReducer.sellData,
        currencyList: state.commonReducer.currencyList,
        orderData: state.tradeReducer.orderData
    }
}
export default connect(mapStateToProps, {})(RecentTrade);
