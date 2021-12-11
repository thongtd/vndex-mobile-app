import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, Switch } from 'react-native';
import ButtonIcon from '../Button/ButtonIcon';
import ButtonWithTitle from '../Button/ButtonWithTitle';
import icons from '../../configs/icons';
import colors from '../../configs/styles/colors';
import TextFnx from '../Text/TextFnx';
import { TouchablePreview } from 'react-native-navigation/lib/dist/adapters/TouchablePreview';
import Icon from '../Icon';
import { isAndroid } from '../../configs/utils';
// import Logo from 'assets/svg/Logo.svg';
import IcLock from 'assets/svg/ic_lock.svg';
const ItemSetting = ({
    onPress,
    onValueChange = () => { },
    hasSwitch,
    textRight,
    iconRight = false,
    nameIcon,
    colorIcon = colors.description,
    textLeft,
    iconLeft,
    isBorder = false,
    sizeIconLeft = {
        width: 25,
        height: 25,
    },
    sizeIconRight = 18,
    IsSwitch,
    height = 50,
    iconLeftSvg,
    ...rest
}) => {
    return (
        <TouchablePreview
            onPress={onPress}
        >
            <View style={[stylest.container, { height: height, }, isBorder && { borderBottomWidth: 0.5 }]}>
                <View style={stylest.blockLeft}>
                    {iconLeftSvg && iconLeftSvg}
                    {/* <Image source={iconLeft} style={sizeIconLeft} resizeMode="contain" /> */}
                    <TextFnx style={stylest.textLeft} value={textLeft} color={colors.text} />
                </View>
                {hasSwitch ? <Switch value={IsSwitch} style={isAndroid()?{marginRight:-3.5}:{}} onValueChange={onValueChange} /> : (iconRight ? <Icon size={sizeIconRight} color={colorIcon} name={"chevron-right"} /> : <TextFnx color={colors.text} value={textRight} />)}
            </View>
        </TouchablePreview>
    );
}
const stylest = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomColor: colors.line,
        paddingHorizontal: "1%",
    },
    blockLeft: {
        flexDirection: "row",
        alignItems: "center"
    },
    textLeft: {
        color:colors.text,
        paddingLeft: "3%",
    }
})
export default ItemSetting;
