import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

import PropTypes from 'prop-types';
import colors from '../../../configs/styles/colors';
import TextSeparators from '../../../components/Text/TextSeparators';
import TextFnx from '../../../components/Text/TextFnx';
import Image from '../../../components/Image/Image';
import { get, formatCurrency } from '../../../configs/utils';
import {useSelector} from "react-redux"
import { pushSingleScreenApp, INFO_COIN_SCREEN, INFO_FIAT_SCREEN } from '../../../navigation';
const ItemFiat = ({
    item,
    componentId
}) => {
    const logged = useSelector(state=>state.authentication.logged);
    const onHandleToInfo =()=>{
        pushSingleScreenApp(componentId,INFO_FIAT_SCREEN,{item:item})
    }
    const currencyList = useSelector(state => state.market.currencyList)
    return (
        <TouchableOpacity
            onPress={logged?onHandleToInfo:()=>{}}
        >
            <View style={stylest.container}>
                <View style={stylest.itemLeft}>
                    <Image source={{ uri:get(item,"image")}} style={stylest.imgCoin} />
                    <TextFnx style={stylest.textLeftFist} color={colors.text} value={logged?get(item,"currency"):get(item,"symbol")} />
                    <TextFnx color={colors.text} value={`  (${get(item,"name")})`} />
                </View>
                {logged?<TextSeparators color={colors.text} value={formatCurrency(get(item,"available"),get(item,"currency"),currencyList)} />:<TextFnx color={colors.text} value={"--"} />}
            </View>
        </TouchableOpacity>
    );
}
const stylest = StyleSheet.create({
    textLeftFist:{
        paddingLeft: 10,
        fontWeight: '600',
    },
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: 60,
        borderBottomColor: colors.line,
        borderBottomWidth: 0.5,
        alignItems: "center"
    },
    itemLeft: {
        flexDirection: "row",
        alignItems: "center"
    },
    imgCoin:{
        width: 30,
        height: 30,
    }
})
ItemFiat.propTypes = {
    item: PropTypes.object
}
export default ItemFiat;
