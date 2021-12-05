import React, { Fragment } from 'react';
import { Text, View, Dimensions, RefreshControl } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Item, Left, Body } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome'
import { style } from '../../../config/style';
import  stylest from "../styles";
import { formatSCurrency, checkDimension, to_UTCDate } from "../../../config/utilities";
import Empty from '../../Shared/Empty';
import {styles} from "react-native-theme";
const { width, height } = Dimensions.get('window')
const OpenOrder = ({
    activeTab,
    openOrder,
    dataSource,
    currencyList,
    onCancel,
    loading,
    onRefresh
}) => (
        <Fragment>
            {
                activeTab === "O" ? (openOrder.length > 0 ?
                    <View>
                        <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingBottom: 5 }}>
                            <View style={{ flex: 1, paddingLeft: 2 }}>
                                <Text style={styles.txtMainTitle}>{'PRICE'.t()}</Text>
                            </View>
                            <View style={{
                                flex: 1.5, alignItems: 'flex-end',
                                paddingLeft: 5,
                                paddingRight: 15
                            }}>
                                <Text style={styles.txtMainTitle}>{'AMOUNT'.t()}</Text>
                            </View>
                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                <Text style={styles.txtMainTitle}>{'TIME'.t()}</Text>
                            </View>
                        </View>
                        <View style={{
                            marginBottom: 110
                        }}>
                            <SwipeListView
                                // useFlatList={true}
                                showsVerticalScrollIndicator={false}
                                refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
                                dataSource={dataSource}
                                renderRow={(e, i) => (
                                    <Item style={{
                                        paddingVertical: 7.5,
                                        paddingHorizontal: 10,
                                        backgroundColor:styles.bgSub.color,
                                        marginBottom: 0,
                                        marginTop: 5,
                                        borderBottomWidth: 0,
                                        flex: 1,
                                        height:60
                                    }} key={i}>
                                        <View style={{ flex: 1 }}>
                                            <View style={{
                                                flexDirection:"row"
                                            }}>
                                                <Text
                                                    style={[e.side === 'S' ? styles.bgSellOldNew : styles.bgBuyOldNew,{fontWeight:"bold"}]}>{e.symbol}</Text>
                                                <Text
                                                    style={[e.side === 'S' ? styles.bgSellOldNew : styles.bgBuyOldNew]}>/{e.paymentUnit}</Text>
                                            </View>

                                            <Text
                                                style={[styles.txtWhiteSub,stylest.paddingCommon]}>{formatSCurrency(currencyList, e.price, e.paymentUnit)}</Text>
                                        </View>
                                        <View style={{
                                            flex: 1.5,
                                            alignItems: 'flex-end',
                                            paddingLeft: 5,
                                            paddingRight: 15
                                        }}>
                                            <Text
                                                style={[styles.textWhite, checkDimension(width)]}>{formatSCurrency(currencyList, e.matchedQuantity, e.symbol)}</Text>
                                            <Text
                                                style={[styles.txtMainSub,stylest.paddingCommon, checkDimension(width)]}>{formatSCurrency(currencyList, e.quantity, e.symbol)}</Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                            <Text
                                                style={styles.textWhite}>{to_UTCDate(e.createdDate, 'DD-MM-YYYY')}</Text>
                                            <Text
                                                style={[styles.txtMainSub,stylest.paddingCommon]}>{to_UTCDate(e.createdDate, 'hh:mm:ss')}</Text>
                                        </View>
                                    </Item>
                                )}
                                renderHiddenRow={(data, secId, rowId, rowMap) => (
                                    <Item style={{
                                        backgroundColor: '#ff315d',
                                        marginTop: 7.5,
                                        height: 55,
                                        borderBottomWidth: 0
                                    }}
                                        onPress={() => onCancel(data, rowMap, secId, rowId)}
                                    >
                                        <Left style={{ flex: 2 }} />
                                        <Body style={{ flex: 2 }} />
                                        <View style={{ width: 50, justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon name={'trash'} color={'#fff'} size={20} />
                                        </View>

                                    </Item>
                                )}
                                rightOpenValue={-50}
                                disableRightSwipe={true}
                            />
                        </View>

                    </View>
                    :
                    <Empty style={{ paddingTop: '50%' }} />) : null
            }
        </Fragment>

    );

export default OpenOrder;
