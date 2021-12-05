import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { style } from '../../../config/style'
import {
    formatCurrency,
} from "../../../config/utilities";
const ItemInfoCoin = ({
    infoCurrency
}) => {
    return (
        <View style={{ flexDirection: "row", }}>
            <View style={{
                flex: 1
            }}>
                <Text style={[style.textMain, { paddingVertical: 2.5 }]}>{'AVAILABLE'.t()}</Text>
                <Text
                    style={[style.textWhite, { paddingVertical: 2.5 }]}>{infoCurrency.available && formatCurrency(infoCurrency.available, 8)}</Text>
            </View>
            <View style={{
                flex: 1
            }}>
                <Text style={[style.textMain, { paddingVertical: 2.5 }]}>{'PROMOTION'.t()}</Text>
                <Text
                    style={style.textWhite}>{infoCurrency && infoCurrency.promotion}</Text>
            </View>
        </View>
    )
}

export default ItemInfoCoin;