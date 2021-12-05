import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { style } from '../../../../../config/style';
import {styles} from "react-native-theme";
const Step3 = ({
    renderStatusWithdraw
}) => {
    return (
        <View style={{
            paddingTop: 20
        }}>
            <View style={{
                backgroundColor: styles.bgSub.color,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                borderWidth:0.5,
                borderColor:style.colorBorderBox,
                borderRadius:2.5
            }}>
                {
                    renderStatusWithdraw
                }
            </View>
        </View>
    )
}
export default Step3;