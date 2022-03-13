import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import TextFnx from '../../../../components/Text/TextFnx';
import colors from '../../../../configs/styles/colors';
import TextSeparators from '../../../../components/Text/TextSeparators';

import PropTypes from 'prop-types';
import Image from '../../../../components/Image/Image';
import { get, formatCurrency, convertToCurr, formatSCurrency, formatCurrencyFnx } from '../../../../configs/utils';
import {useSelector} from "react-redux"
import { Navigation } from 'react-native-navigation';
import { INFO_COIN_SCREEN, pushSingleScreenApp } from '../../../../navigation';
export const ItemCoin = ({
    item
} ) => {
    return (
             <View style={stylest.container}>
                <View style={stylest.itemLeft}>
                    <Image source={{ uri: get(item,"image") }} style={stylest.imgCoin} />
                    <View style={stylest.spacing}>
                        <TextFnx style={stylest.spacingCenter} weight="bold" color={colors.text}>
                        {get( item, 'symbol' )} 
                        </TextFnx>
                        <View style={stylest.lanscape}>
                            <TextFnx size={12} value={get( item, 'name' )} color={colors.text} />
                        </View>
                    </View>
                </View>
                
            </View>
    );
}
const stylest = StyleSheet.create({
    lanscape:{ flexDirection: "row" },
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: 60,
        borderBottomColor: colors.app.lineSetting,
        borderBottomWidth: 0.5
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: "center"
    },
    imgCoin: { width: 30, height: 30 },
    spacing: {
        paddingLeft: 10
    },
    itemRight:{
        justifyContent: "center",
        alignItems: "flex-end"
    },
    spacingCenter:{
        paddingBottom: 3,
        fontWeight: '600',
    }
})
ItemCoin.propTypes = {
    item: PropTypes.object
}

