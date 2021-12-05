import React, { Fragment } from 'react';
import {
    View,
    Text,
    Dimensions,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    StyleSheet
} from 'react-native';
import {
    Item,
    Left,
    Right,
    Body,
} from 'native-base';
import stylest  from "../styles"
import {styles} from "react-native-theme";
import { style } from "../../../config/style";
import Icon from 'react-native-vector-icons/FontAwesome'
import {
    convertUTC,
    formatSCurrency, to_UTCDate, checkDimension,
} from "../../../config/utilities";
import Empty from '../../Shared/Empty';
const { width, height } = Dimensions.get('window')
const OrderHistory = ({
    orderBook,
    activeTab,
    isSwitch,
    getOrderDetail,
    orderDetails,
    _i,
    expand,
    activeSymbol,
    extraData,
    isRefreshHistory,
    onEndReached,
    currencyList,
    onRefresh,
    loading,
    paymentUnit
}) => (
        <Fragment>
            {
                activeTab === "R" ? (orderBook.length > 0 ?
                    <View style={{ paddingHorizontal: 0 }}>
                        <Item style={[{
                            borderBottomWidth: 0,
                        }, { paddingHorizontal: 10, marginBottom: 5 }]}>
                            <Left style={{ flex: 1.3, }}>
                                <Text style={styles.txtMainTitle}>{'PAIR'.t()}</Text>
                            </Left>
                            <Body style={{
                                alignItems: 'flex-end',
                                flex: 1.5,
                                paddingRight: 10
                            }}>
                                <Text style={styles.txtMainTitle}>{'AVG__PRICE'.t()}</Text>
                            </Body>
                            <Right style={{ alignItems: 'flex-end', flex: 2 }}>
                                <Text style={styles.txtMainTitle}>{'FILLED__AMOUNT'.t()}</Text>
                            </Right>
                        </Item>
                        <View style={{
                            // height:"100%",
                            marginBottom: 110
                        }}>
                            <FlatList
                                refreshControl={<RefreshControl
                                    refreshing={loading}
                                    onRefresh={onRefresh} />}
                                showsVerticalScrollIndicator={false}
                                data={!isSwitch ? orderBook : orderBook.filter(e => e.avgPrice !== 0 && e.orderPrice)}
                                renderItem={({ item, index }) => (
                                    <View>
                                        <Item
                                            style={{
                                                paddingVertical: 7.5,
                                                paddingHorizontal: 10,
                                                height: 60,
                                                backgroundColor: item.avgPrice !== 0 ? styles.bgSub.color : styles.bgBoxCancel.color,
                                                marginBottom: 0,
                                                marginTop: 5,
                                                borderBottomWidth: 0,
                                                flex: 1
                                            }}
                                            onPress={() => item.avgPrice !== 0 ? getOrderDetail(item.orderId, index, item.symbol) : null}>
                                            <Left style={{
                                                backgroundColor: 'transparent',
                                                flex: 1.3,
                                                // paddingRight: 15
                                            }}>
                                                <View style={{
                                                    flexDirection:"row"
                                                }}>
                                                    <Text
                                                        style={[item.side === 'S' ?(item.avgPrice !== 0 ?styles.bgSellOldNew:styles.txtCancelSell ):(item.avgPrice !== 0 ? styles.bgBuyOldNew:styles.txtCancelBuy), { fontWeight: "bold" }]}>{item.symbol}
                                                    </Text>
                                                    <Text
                                                        style={item.side === 'S' ?(item.avgPrice !== 0 ?styles.bgSellOldNew:styles.txtCancelSell ) :(item.avgPrice !== 0 ? styles.bgBuyOldNew:styles.txtCancelBuy)}>/{item.paymentUnit}</Text>
                                                    
                                                </View>
                                                <Text
                                                        style={[item.avgPrice !== 0 ?styles.txtMainSub:styles.txtCancel, {
                                                            fontSize: 10,
                                                            lineHeight: 19
                                                        },stylest.paddingCommon]}>{convertUTC(item.createdDate)}</Text>

                                            </Left>
                                            <Body style={{
                                                alignItems: 'flex-end',
                                                flex: 1.5,
                                                paddingRight: 10
                                            }}>
                                                <Text
                                                    style={[item.avgPrice !== 0?styles.textWhite:styles.txtCancel, checkDimension(width)]}>{item.avgPrice === 0 ? 0 : formatSCurrency(currencyList, item.avgPrice, item.paymentUnit)}</Text>
                                                <Text
                                                    style={[stylest.paddingCommon,item.avgPrice !== 0?styles.txtMainSub:styles.txtCancel, checkDimension(width)]}>{item.orderPrice === 0 ? 0 : formatSCurrency(currencyList, item.orderPrice, item.paymentUnit)}</Text>
                                            </Body>
                                            <Right style={{ alignItems: 'flex-end', flex: 2 }}>
                                                <Text
                                                    style={item.avgPrice !== 0?styles.textWhite:styles.txtCancel}>{formatSCurrency(currencyList, item.matchQtty, item.symbol)}</Text>
                                                <Text
                                                    style={[stylest.paddingCommon,item.avgPrice !== 0?styles.txtMainSub:styles.txtCancel]}>{formatSCurrency(currencyList, item.orderQtty, item.symbol)}</Text>
                                            </Right>
                                        </Item>
                                        {
                                            orderDetails[index] && _i == index &&
                                                expand ?
                                                <View style={{
                                                    margin: 0,
                                                    marginLeft: 2,
                                                    paddingBottom: 7.5,
                                                    flex: 1,
                                                    borderWidth: 0.5,
                                                    borderColor: styles.bgBtnClose.color,
                                                    borderTopWidth: 0
                                                }}>
                                                    <Item style={[stylest.item, {
                                                        paddingHorizontal: 5,
                                                        paddingBottom: 0,
                                                        paddingTop: 7.5
                                                    }]}>
                                                        <Left
                                                            style={{ flex: 1 }}>
                                                            <Text
                                                                style={styles.txtMainTitle}>{"TIME".t()}</Text>
                                                        </Left>
                                                        <Body
                                                            style={{
                                                                flex: 1,
                                                                alignItems: 'flex-end',
                                                                alignSelf: 'flex-end'
                                                            }}>
                                                            <Text
                                                                style={styles.txtMainTitle}>{"PRICE".t()}</Text>
                                                        </Body>
                                                        <Right
                                                            style={{ flex: 1.25 }}>
                                                            <Text
                                                                style={styles.txtMainTitle}>{"EXEC".t()}</Text>
                                                        </Right>
                                                    </Item>
                                                    <FlatList
                                                        data={orderDetails[index]}
                                                        renderItem={({ item }) => (
                                                            <Item style={{
                                                                paddingHorizontal: 5,
                                                                paddingBottom: 0,
                                                                paddingTop: 5,
                                                                borderBottomWidth: 0
                                                            }}>
                                                                <Left
                                                                    style={{ flex: 1 }}>
                                                                    <Text
                                                                        style={styles.textWhiteOp}
                                                                        numberOfLines={1}>{to_UTCDate(item.createdDate, 'DD-MM HH:mm:ss')}</Text>
                                                                </Left>
                                                                <Body
                                                                    style={{
                                                                        flex: 1,
                                                                        alignItems: 'flex-end'
                                                                    }}>
                                                                    <Text
                                                                        style={styles.textWhiteOp}>{formatSCurrency(currencyList, item.price, paymentUnit)}</Text>
                                                                </Body>
                                                                <Right
                                                                    style={{ flex: 1.25 }}>
                                                                    <Text
                                                                        style={styles.textWhiteOp}>{formatSCurrency(currencyList, item.qtty, activeSymbol)}</Text>
                                                                </Right>
                                                            </Item>
                                                        )}
                                                        keyExtractor={(item, index) => index.toString()}
                                                        extraData={extraData}
                                                    />
                                                </View>
                                                :
                                                null
                                        }
                                    </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                                extraData={extraData}
                                ListFooterComponent={() => {
                                    if (!isRefreshHistory) return null;
                                    return (
                                        <ActivityIndicator size="small" color="#06ffff" />
                                    );
                                }}
                                onEndReachedThreshold={0.05}
                                onEndReached={
                                    onEndReached
                                }

                            />

                        </View>

                    </View>
                    :
                    <Empty style={{ paddingTop: '50%' }} />
                ) : null
            }
        </Fragment>
    );
export default OrderHistory;

