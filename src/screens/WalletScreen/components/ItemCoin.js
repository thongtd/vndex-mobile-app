import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import TextFnx from '../../../components/Text/TextFnx';
import colors from '../../../configs/styles/colors';
import TextSeparators from '../../../components/Text/TextSeparators';

import PropTypes from 'prop-types';
import Image from '../../../components/Image/Image';
import { get, formatCurrency, convertToCurr, formatSCurrency, formatCurrencyFnx } from '../../../configs/utils';
import {useSelector} from "react-redux"
import { Navigation } from 'react-native-navigation';
import { INFO_COIN_SCREEN, pushSingleScreenApp } from '../../../navigation';
export const ItemCoin = ({
    item,
    componentId
}) => {
    const logged = useSelector(state=>state.authentication.logged);
    let colorPriceChange = item.priceChange < 0 ?colors.red :( item.priceChange > 0 ?colors.green:colors.subText);
    var zero = 0;
    let valuePriceChange =get(item,"priceChange") > 0 ? ` +${get(item,"priceChange").toFixed(2)}%` : get(item,"priceChange")?` ${get(item,"priceChange").toFixed(2)}%`:` ${ zero.toFixed(2)}%`;
    const currencyList = useSelector(state => state.market.currencyList)
    const conversion = useSelector(state => state.market.conversion)
    // console.log(item,"item kaka")
    const onHandleToInfo =()=>{
        pushSingleScreenApp(componentId,INFO_COIN_SCREEN,{item:item,isCoin:true})
    }
    return (
        <TouchableOpacity
            onPress={logged?onHandleToInfo:()=>{}}
        >
             <View style={stylest.container}>
                <View style={stylest.itemLeft}>
                    <Image source={{ uri: get(item,"images") }} style={stylest.imgCoin} />
                    <View style={stylest.spacing}>
                        <TextFnx style={stylest.spacingCenter} weight="bold" color={colors.text}>
                            {logged&& get(item,"symbol")} 
                        </TextFnx>
                        <View style={stylest.lanscape}>
                            <TextFnx size={12} value={get(item,"name")} color={colors.text} />
                            {/* <TextFnx color={colorPriceChange} value={get(item,"name")} /> */}
                        </View>
                    </View>
                </View>
                <View style={stylest.itemRight}>
                    {logged?<TextFnx style={[stylest.spacingCenter,{fontWeight:"normal"}]} color={colors.text} value={get(item,"available")} />:<TextFnx style={[stylest.spacingCenter,{fontWeight:"normal"}]} color={colors.text} value={"--"} />}
                    {/* {logged?<TextSeparators suffix="VND" color={colors.subText} value={get(item,"lastestPrice")?formatCurrencyFnx((get(item,"available")+get(item,"pending"))*get(item,"lastestPrice"),0):0} />:<TextFnx color={colors.subText} value="--" />} */}
                </View>
            </View>
           
        </TouchableOpacity>

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

