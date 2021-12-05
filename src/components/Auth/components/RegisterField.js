import React, { Component } from 'react'
import { Text, View } from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome5";
import {style} from "../../../config/style"
import {styles} from "react-native-theme"
const RegisterField = ({
    nameCountry,
    ...rest
}) => {
    return (
        <View
            style={{
                alignItems: "center",
                borderBottomWidth: 0.5,
                borderBottomColor: styles.line.color,
                paddingVertical: 10,
                flexDirection: "row",
                justifyContent: "space-between"
            }}>
            <View style={{
                flexDirection: "row",
                alignItems: "center"
            }}>
                <Icon name="globe-americas"
                    size={15}
                    color={style.textTitle.color}
                    style={{
                        paddingRight: 10
                    }}
                />
                <Text style={{
                    color:rest.country?styles.textWhite.color:styles.textPlaceHolder.color,
                    fontSize: 14
                }}>
                    {nameCountry?nameCountry:'CHOOSE_YOUR_COUNTRY'.t()}
                </Text>
            </View>
            <View>
                <Icon name="sort-down"
                    size={15}
                    color={style.textTitle.color}
                />
            </View>
        </View>
    )
}
export default RegisterField