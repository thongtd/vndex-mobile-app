import React, { Component } from 'react';
import { View, Text, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { style } from "../../../../config/style"
import { dimensions, formatCurrency, formatTrunc, jwtDecode, to_UTCDate } from "../../../../config/utilities";
import Icon from "react-native-vector-icons/FontAwesome";
import {
    Body,
    Button,
    Container,
    Content,
    Input,
    Item,
    Left,
    List,
    Right,
    Switch,
    Tab,
    TabHeading,
    Tabs, Thumbnail, CheckBox, Picker,
} from "native-base"
import { constant } from '../../../../config/constants';
import { authService } from '../../../../services/authenticate.service';
import {styles} from "react-native-theme";
import Empty from '../../../Shared/Empty';
const ItemHistory = ({
    itemLog,
    onMomentScrollEnd,
    loading,
    onRefresh = null,
    dataSource,
    extraData = null,
    currencyList,
    disableRightSwipe = true,
    disableLeftSwipe = true,
    onHandleItem,
    showCash = true,
    navigation,
    openTab = "O",
    userInfo,
    ...rest
}) => {
    console.log(dataSource, "data src");
    openModalDepositCash = (data) => {
        if (data !== null) {
            if (data.status === constant.PAYMENT_STATUS.Open
                || data.status === constant.PAYMENT_STATUS.Pending) {
                navigation.navigate("FiatDeposit", {
                    depositData: data,
                    depositStep: 3,
                    symbol: data.walletCurrency
                })
            }
            else {
                navigation.navigate("FiatDeposit", {
                    depositData: data,
                    depositStep: 2,
                    symbol: data.walletCurrency,
                    status: data.status
                })
            }
        }
        else {
            navigation.navigate("FiatDeposit", {
                depositData: data,
                depositStep: 1,
                symbol: data.walletCurrency
            })
        }
    }
    openModalWithdrawCash = async (data) => {
        console.log(data,"data kaka");
        let user = await jwtDecode();
        if (user) {
            authService.getFiatRequest(user.id, data.id).then(val => {
                let currentRequest = Object.assign(val, {}, {
                    estimatedTime: val.ttl || '00:00:00',
                    currentPosition: val.status >= 4 ? 4 : val.status,
                    amount: data.amount,
                    messageText: val.status === 6 ? "WITHDRAWALS_REJECT_MESSAGE".t() : (val.status === 5 ? "WITHDRAWAL_CANCEL".t() : (val.status === 4 ? "WITHDRAWAL_SUCCESS".t() : '')),
                    messageType: (val.status === 6 || val.status === 5) ? "E" : 'S',
                    loadWithdrawType: 1,
                    selectedUnit: data.walletCurrency,
                    data: data
                })
                navigation.navigate("WithdrawCast", { currentRequest })
            })
        }
        
        
    }
   
    return (
        <ScrollView style={styles.bgMain}
            onMomentumScrollEnd={
                onMomentScrollEnd
            }
            extraData={
                extraData
            }
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={
                        onRefresh
                    } />
            }
        >
            {
                itemLog.length > 0 ?
                    <SwipeListView
                        dataSource={
                            dataSource
                        }
                        disableRightSwipe={disableRightSwipe}
                        renderRow={data => (
                            <Item style={{
                                backgroundColor: styles.bgSub.color,
                                marginTop: 7.5,
                                marginLeft: 10,
                                marginRight: 10,
                                height: 60,
                                borderBottomWidth: 0,
                                paddingHorizontal: 10
                            }}
                                onPress={showCash === false ? (openTab === "O" ? () => navigation.navigate('HistoryDepositCoin', { data }) : () => {
                                    if (userInfo.twoFactorEnabled) {
                                        navigation.navigate('HistoryWithdrawCoin', { data })
                                    } else {
                                        rest.onCancel
                                    }
                                }) :openTab === "O" ? ()=> this.openModalDepositCash(data):()=>this.openModalWithdrawCash(data)}
                            >
                                <Left>

                                    <Text style={styles.txtMainSub}>{to_UTCDate(data.createdDate, 'DD/MM/YYYY hh:mm:ss')}</Text>
                                </Left>
                                <Body style={{ alignItems: 'flex-start' }}>
                                    <Text style={[styles.txtMainSub]}>{'STATUS'.t()}</Text>
                                    <Text
                                        style={data.status == 4 ? styles.bgBuyOldNew : (data.status == 5 || data.status == 6) ? styles.bgSellOldNew : (data.status == 3) ?{color:"#f9ca07"}:styles.textWhite}>
                                        {`${data &&data.statusLable && data.statusLable.toUpperCase()}`.t()}</Text>
                                </Body>
                                <Right>
                                    <Text style={[styles.textWhite,{fontWeight:"bold"}]}>{showCash ? data.walletCurrency : data.currency}</Text>
                                    <Text
                                        style={styles.textWhite}>{showCash ? formatTrunc(currencyList, data.amount, data.walletCurrency) : formatCurrency(data.amount, 8)}</Text>
                                </Right>
                            </Item>
                        )}
                        renderHiddenRow={(data, secId, rowId, rowMap) => (
                            (data.status == 1 || data.status == 2) &&
                            <Item style={{
                                backgroundColor: '#ff315d',
                                marginTop: 7.5,
                                marginLeft: 15,
                                marginRight: 15,
                                height: 60,
                                borderBottomWidth: 0
                            }}
                                onPress={
                                    (hihi) => rest.onHiddenRow(data)
                                }
                            >
                                <Left />
                                <Body />
                                <Right style={{ marginRight: 15 }}>
                                    <Icon name={'trash'} color={'#fff'} size={20} />
                                </Right>
                            </Item>
                        )}
                        rightOpenValue={-50}
                        disableLeftSwipe={disableLeftSwipe}
                    />
                    :
                    <Empty style={{
                        paddingTop: '50%' 
                    }} />
                    // <View style={stylest.noData}>
                    //     <Icon name={'file'} size={30} color={'#323232'} />
                    //     <Text style={{ color: '#323232' }}>{'NO_DATA_TO_EXPORT'.t()}</Text>
                    // </View>
            }
        </ScrollView>
    );
}
export default ItemHistory;
const stylest = StyleSheet.create({
    item: {
        borderBottomWidth: 0,
        paddingVertical: 10,
    },
    itemModal: {
        borderBottomWidth: 0,
        paddingVertical: 10,
    },
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#00000090',
    },
    activityIndicatorWrapper: {
        backgroundColor: '#192240',
        width: dimensions.width - 20,
        height: dimensions.height / 1.5,
        // borderRadius: 10,
        padding: 10,
        display: 'flex',
        // alignItems: 'center',
        // justifyContent: 'center'
    },
    noData: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 80
    },
    hiddenRow: {
        backgroundColor: '#c5321e',
        marginTop: 7.5,
        marginLeft: 10,
        marginRight: 10,
        borderBottomWidth: 0
    },
    showRow: {
        backgroundColor: '#1c2840',
        marginTop: 7.5,
        marginLeft: 10,
        marginRight: 10,
        borderBottomWidth: 0
    }
})