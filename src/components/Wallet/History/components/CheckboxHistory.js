import React, { Component } from 'react'
import { Text, View,Dimensions,TouchableOpacity } from 'react-native'
import { CheckBox } from 'native-base'
import { style } from "../../../../config/style"
const { width, height } = Dimensions.get('window');
const CheckboxHistory = ({
    onDeposit,
    onWithdraw,
    openTab,
    textDeposits='DEPOSITS'.t(),
    textWidthdraw='WITHDRAWALS'.t(),
    ...rest
}) => {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
            <TouchableOpacity
                onPress={
                    onDeposit
                }
                style={[style.buttonHeight, {
                    flexDirection: 'row', width: (width - 45) / 2,
                    borderBottomColor: '#fff', justifyContent: 'center', alignItems: 'center', backgroundColor: openTab === "O" ? '#193870' : '#152542'
                }]}
            >
                <CheckBox checked={openTab === 'O' && true} color={'#44a250'}
                    style={{ borderRadius: 0, left: 0, marginRight: 5 }}
                    onPress={
                        onDeposit
                    }
                />
                <Text style={[style.textWhite, { marginLeft: 5 }]}>{textDeposits.toUpperCase()}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={
                    onWithdraw
                }
                style={[style.buttonHeight, {
                    flexDirection: 'row', width: (width - 45) / 2,
                    borderBottomColor: '#fff', justifyContent: 'center', alignItems: 'center', backgroundColor: openTab === "W" ? '#193870' : '#152542'
                }]}
            >
                <CheckBox checked={openTab === 'W' && true} color={'#44a250'}
                    style={{ borderRadius: 0, left: 0, marginRight: 5 }}
                    onPress={
                    onWithdraw
                }
                />
                <Text style={[style.textWhite, { marginLeft: 5 }]}>{textWidthdraw.toUpperCase()}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CheckboxHistory;

