import React, { useState,useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
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
                // width={"50%"}
                weight={"bold"}
                style={IsActive === "C" ? stylest.activeButton : stylest.button}
                size={14}
                color={IsActive === "C" ? colors.iconButton : colors.subText}
            />
            <ButtonWithTitle
                onPress={() => onIsActive("F")}
                title={title2}
                // width={"50%"}
                weight={"bold"}
                style={IsActive === "F" ? stylest.activeButton : stylest.button}
                size={14}
                color={IsActive === "F" ? colors.iconButton : colors.subText}
            />
        </View>

    );
}
var width = Dimensions.get('window').width;
const stylest = StyleSheet.create({
    button: {
        width: width/2-50,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeButton: {
        borderColor: colors.iconButton,
        borderBottomWidth: 2,
        width: width/2-40,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flexRow: {
        flexDirection: "row",
        justifyContent:"space-around",
        alignItems:"center",
        flex:1
    }
})
export default ButtonTypeWallet;
