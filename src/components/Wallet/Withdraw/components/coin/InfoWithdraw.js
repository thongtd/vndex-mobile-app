import React from 'react';
import { Text, View } from 'react-native';
import { Item, Left } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { style } from '../../../../../config/style';
import { formatSCurrency } from "../../../../../config/utilities";
import { connect } from 'react-redux';
import I18n from "react-native-i18n"
import {styles} from "react-native-theme";
var locale = I18n.currentLocale();
const InfoWithdraw = ({
    currentPosition = 2, //state
    currencyList,
    amount,
    symbol,
    toAddress,
    tag,
    infoCurrency,
    language
}) => {
    // console.log(currencyList, amount, symbol, toAddress, "full data")
    return (
        <React.Fragment>
            {
                currentPosition !== 0 &&
                <View style={{ paddingTop: 20 }}>
                    <View style={[{
                        borderBottomWidth: 0, paddingBottom: 10
                    }]}>
                        <View style={{ flexDirection: 'row', flex: 1, marginBottom: 10 }}>
                            <View style={{ flex: -1, flexDirection: 'row', paddingRight: 10 }}>
                                <Text style={[styles.txtMainTitle, {}]}>{'AMOUNT'.t()}</Text>
                            </View>
                            <View style={{
                                flex: 0.1
                            }} />
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <Text style={[styles.textWhite, {}]}>{amount}</Text>
                                <Text style={styles.textWhite}> ({symbol})</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <View style={{ flex: -1, flexDirection: 'row', paddingRight: 10 }}>
                                <Text style={styles.txtMainTitle}>{'RECEIVED_ADDRESS'.t()}</Text>
                            </View>
                            <View style={{
                                flex: 0.1
                            }} />
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', }}>
                                <Text style={[styles.textWhite, { lineHeight: 20, textAlign: "right" }]}>{toAddress}</Text>
                            </View>
                        </View>
                        {infoCurrency.extraFields && infoCurrency.extraFields.length > 0 && infoCurrency.extraFields.map((item, index) => {
                            // console.log(item,language,"item info widthdraw")
                            return (
                                <View style={{ flexDirection: 'row', flex: 1, marginTop: 10 }}>
                                    <View style={{ flex: -1, flexDirection: 'row', paddingRight: 10 }}>
                                        <Text style={styles.txtMainTitle}>{item.localizations[language] && item.localizations[language].FieldName}</Text>
                                    </View>
                                    <View style={{
                                        flex: 0.1
                                    }} />
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                        <Text style={[styles.textWhite, { lineHeight: 20,textAlign: "right" },
                                        (item.toExtraField === "" || item.toExtraField === null) && { fontSize: 27, paddingTop: 10 }
                                        ]}>{(item.toExtraField === "" || item.toExtraField === null) ? "--" : item.toExtraField}</Text>
                                    </View>
                                </View>
                            )
                        })}


                    </View>
                    <Item style={[{ borderBottomWidth: 0, marginTop: 20, marginBottom: 10 }]}>
                        <Left style={{ flexDirection: 'row' }}>
                            <Icon name={'warning'} size={16} color={'orange'} />
                            <Text style={[styles.textWhite, { marginLeft: 5 }]}>{'WARNING'.t()}</Text>
                        </Left>
                    </Item>
                    <Text style={[styles.bgSellOldNew]} numberOfLines={2}>{'NOTE_WITHDRAWAL'.t()}</Text>
                </View>
            }
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    return {
        language: state.commonReducer.language,
    }
}
export default connect(mapStateToProps)(InfoWithdraw);
