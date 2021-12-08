import React, { useState,useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import ButtonWithTitle from './ButtonWithTitle';
import colors from '../../configs/styles/colors';
import I18n from "react-native-i18n"
const ButtonTypeWallet = ({
    onIsActive,
    IsActive,
    style,
    title1="Coin",
    title2="FIAT".t()
}) => {
    // const [isActive, setActive] = useState("D");
    
    return (
        <View style={[stylest.flexRow,style]}>
            <ButtonWithTitle
                onPress={() => onIsActive("C")}
                title={title1}
                style={IsActive === "C" ? stylest.activeButton : stylest.button}
                size={IsActive === "C" ? 15 : 14}
                color={IsActive === "C" ? colors.tabbarActive : colors.description}
            />
            <ButtonWithTitle
                onPress={() => onIsActive("F")}
                title={title2}
                style={IsActive === "F" ? stylest.activeButton : stylest.button}
                size={IsActive === "F" ? 15 : 14}
                color={IsActive === "F" ? colors.tabbarActive : colors.description}
            />
        </View>

    );
}
const stylest = StyleSheet.create({
    button: {
        borderColor: colors.description,
        borderBottomWidth: 1.5,
        width: 80,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeButton: {
        borderColor: colors.tabbarActive,
        borderBottomWidth: 2,
        width: 80,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flexRow: {
        flexDirection: "row"
    }
})
export default ButtonTypeWallet;
