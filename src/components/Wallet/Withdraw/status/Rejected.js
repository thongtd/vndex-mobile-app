import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { style } from "../../../../config/style"
import {styles} from "react-native-theme"
const Rejected = () => {
    return (
        <Text style={[styles.bgSellOldNew, { textAlign: 'center' }]}>
            {'WITHDRAWALS_REJECT_MESSAGE'.t()}
        </Text>
    )
}
export default Rejected;