import React, { Component } from 'react'
import { Text, View,StyleSheet } from 'react-native'
import TextField from '../../Shared/TextField';
import {style} from "../../../config/style";
import { Item } from 'native-base';
import Icon from "react-native-vector-icons/FontAwesome5";
import {styles} from "react-native-theme"
const EmailField =({
    onChangeText,
    onNext,
    email
}) =>{
    return (
        <React.Fragment>
            <Text style={{
                fontWeight: '600',
                color: styles.textWhite.color,
                marginTop: 15,
                marginBottom: 12,
            }}>{"EMAIL".t()}</Text>
            <Item style={[styled.inputStyle, { borderBottomWidth: 0.5, borderBottomColor: styles.line.color }]}>
                <Icon
                    name="envelope"
                    size={15}
                    color={style.textTitle.color}
                    style={{
                        paddingRight: 10
                    }}
                />
                <TextField
                    value={email}
                    onChangeText={onChangeText}
                    placeholder={'Enter your email or phone'.t()}
                    style={[styles.textWhite, { marginLeft: -5, }]}
                    returnKeyType={"done"}
                    onEnter={onNext}
                    secureTextEntry={false}
                    keyboardType={'email-address'}
                />
            </Item>
        </React.Fragment>
    )
}

export default EmailField;
const styled = StyleSheet.create({
    content: {
        flex: 1,
        paddingVertical: 20,
        marginLeft: 20,
        marginRight: 20
    },
    inputStyle: {
        color: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: '#44588c'
    }
})
