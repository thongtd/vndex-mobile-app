import React, { Component } from 'react'
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import { style } from '../../../../../config/style'
import { formatCurrency } from "../../../../../config/utilities";
// import { Item, Input, Button } from 'native-base';
import {
    Container,
    Content,
    Item,
    Button,
    Left,
    Right,
    Input,
    Body,
    Header,
    CheckBox
} from 'native-base';
import stylest from './styles';
import I18n from "react-native-i18n"
import TextInputFnx from '../../../../Shared/TextInputFnx';
import { styles } from "react-native-theme";
// var locale = I18n.currentLocale();
const Step0 = ({
    infoCurrency,
    amount,
    onChangeAmount,
    onPressMountMax,
    withdrawInfo,
    onSubmitStep0,
    onChangeAddress,
    toAddress,
    onChangeExtraFields,
    tag,
    symbol,
    switchDisable,
    language,
    // isDisableTag,
    ...rest
}) => {
    function checkBox(name) {
        var check;
        if (rest.dataCheck.length > 0) {
            rest.dataCheck.map((dtCheck, index) => {
                if (name === dtCheck.name) {
                    console.log("vao check");
                    check = true
                }
            })
            return check;
        } else {
            return null
        }
    }
    console.log(language, infoCurrency, "languageInfoCurrency");
    return (
        <View style={{ justifyContent: 'space-around' }}>
            <View style={{ marginBottom: 20 }}>
                <View style={{ paddingVertical: 5, alignItems: 'center' }}>
                    <View style={{ marginBottom: 5 }}>
                        <Text style={styles.txtMainTitle}>{'AVAILABLE_AMOUNT'.t()}</Text>
                    </View>
                    <View>
                        <Text style={[styles.textWhite, style.fontSize18, { fontWeight: '500' }]}>{formatCurrency(infoCurrency.available, 8)}</Text>
                    </View>
                </View>
            </View>
            <Item style={[stylest.item, stylest.inputItem]}>
                <Input allowFontScaling={false}
                    style={[stylest.input, styles.textWhite]} value={amount}
                    placeholder={'AMOUNT'.t()}
                    placeholderTextColor={styles.txtMainTitle.color}
                    onChangeText={onChangeAmount} keyboardType={'numeric'} />
                <TouchableOpacity
                    style={[style.buttonNext, {
                        width: 100,
                        justifyContent: 'center',
                        height: 40,
                        alignItems: 'center',
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        backgroundColor: styles.bgButton.color
                    }]}
                    onPress={onPressMountMax}
                >
                    <Text style={style.textWhite}>{'MAX'.t()}</Text>
                </TouchableOpacity>
            </Item>

            <View style={{ paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 1 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.txtMainTitle}>{'FEE'.t()}: </Text>
                    <Text style={styles.textWhite}>{formatCurrency(withdrawInfo.transactionFee, 8)}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.txtMainTitle}>{'YOU_WILL_GET'.t()}: </Text>
                    <Text
                        style={styles.textWhite}>{formatCurrency(amount - withdrawInfo.transactionFee > 0 ? amount - withdrawInfo.transactionFee : 0, 8)}</Text>
                </View>
            </View>
            <TextInputFnx
                value={toAddress}
                onChangeText={onChangeAddress}
                placeholder={'RECEIVED_ADDRESS'.t()}
            />

            {infoCurrency.extraFields && infoCurrency.extraFields.length > 0 && infoCurrency.extraFields.map((item, index) => (
                <View key={index}>
                    {!item.isRequired && (
                        <Item style={[style.item, { marginTop: 6 }]}>
                            <Left style={{
                                flex: 2.5
                            }}>
                                <TouchableOpacity
                                    onPress={
                                        () => switchDisable(item.name)
                                    }
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center"
                                    }}
                                >
                                    <CheckBox
                                        checked={checkBox(item.name)}
                                        color={'#44a250'}
                                        onPress={() => switchDisable(item.name)}
                                        style={{
                                            // width: 17,
                                            // height: 17,
                                            // lineHeight: 15,
                                            borderWidth: 0.5,
                                            marginTop: -13,
                                            marginLeft: -10
                                        }}
                                    />
                                    <Text style={[styles.textWhite, { marginLeft: 20, marginBottom: 10, fontWeight: '500' }]}>{`${'_NO'.t()} ${item.localizations[language].FieldName}`}
                                        {/* {console.log(locale,"locale")} */}
                                    </Text>

                                </TouchableOpacity>
                            </Left>
                            <Right style={{
                                flex: 1
                            }}>
                            </Right>
                        </Item>
                    )}
                    <TextInputFnx
                        value={item.toExtraField}
                        onChangeText={(text2) => onChangeExtraFields(text2, item.name)}
                        placeholder={`${item.localizations[language].FieldName}`}
                        disabled={checkBox(item.name)}
                        keyboardType={"numeric"}
                    />

                </View>
            )
            )}
            <View style={{ marginBottom: 15, marginTop: 10, marginLeft: 2 }}>
                <Text style={[styles.textWhite, {
                    fontSize: 16,
                    fontWeight: '500',
                    marginBottom: 10
                }]}>{'TUTORIALS'.t()}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{
                     borderBottomWidth: 0.5, borderTopWidth: 0.5, borderColor: styles.borderTutorial.color
                }}>

                        <View style={[stylest.row, { paddingRight: 10 }]}>
                            <Text style={[stylest.rowItems, { borderColor: styles.rowItem.color }, styles.rowItem]}>1</Text>
                            <Text style={[styles.textWhite, {
                                fontSize: 14,
                            }]}> {'MAKE_WITHDRAWAL'.t()}</Text>
                        </View>
                        <View style={[stylest.row, { paddingHorizontal: 10 }]}>
                            <Text style={[stylest.rowItems, { borderColor: styles.rowItem.color }, styles.rowItem]}>2</Text>
                            <Text style={[styles.textWhite, { fontSize: 14, }]}> {'VERIFY_2FA'.t()}</Text>
                        </View>
                        <View style={[stylest.row, { paddingHorizontal: 10 }]}>
                            <Text style={[stylest.rowItems, { borderColor: styles.rowItem.color }, styles.rowItem]}>3</Text>
                            <Text style={[styles.textWhite, {
                                fontSize: 14,
                            }]}> {'CONFIRM_EMAIL'.t()}</Text>
                        </View>
                        <View style={[stylest.row, { paddingLeft: 10 }]}>
                            <Text style={[stylest.rowItems, { borderColor: styles.rowItem.color }, styles.rowItem]}>4</Text>
                            <Text style={[styles.textWhite, { fontSize: 14 }]}> {'COMPLETE'.t()}</Text>
                        </View>
                </ScrollView>
            </View>
            <Button block style={[style.buttonNext, style.buttonHeight, {
                backgroundColor: styles.bgButton.color
            }]}
                onPress={onSubmitStep0}>
                <Text style={style.textWhite}>{'SUBMIT'.t()}</Text>
            </Button>
        </View>
    )
}

export default Step0;
