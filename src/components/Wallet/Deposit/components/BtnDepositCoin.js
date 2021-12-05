import React, { Component } from 'react'
import { Text,TouchableOpacity, View } from 'react-native'
import { Button } from 'native-base';
import { style } from '../../../../config/style';
import Icon from "react-native-vector-icons/FontAwesome5";
import {styles} from "react-native-theme";
const BtnDepositCoin = ({
    onPress,
    nameIcon,
    titleBtn,
    ...rest
}) => {
    return (
        <Button
            onPress={onPress}
            style={[{backgroundColor:"transparent",borderColor:'#1d2c43',borderWidth:1,elevation:0, width: "48%", alignSelf: "center",borderRadius:2.5, justifyContent: "center",flexDirection:"row" },rest.style]}>
            <Icon name={nameIcon} size={20} color={rest.colorIcon?rest.colorIcon:styles.textWhiteMain.color} />
               
            <Text style={[styles.textWhiteMain,rest.styleText]}>
              {"  "}{titleBtn}
            </Text>
        </Button>
    )
}
export default BtnDepositCoin;
