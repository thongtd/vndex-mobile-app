import React, { Component } from 'react'
import { Text, View,TouchableOpacity } from 'react-native'
import {style} from "../../../config/style";
import {styles} from "react-native-theme";
const HaveAccountField = ({
    navigation
}) =>{
    return (
        <View style={{
            flexDirection: "row",
            justifyContent: "center"
        }}>
            <Text style={[styles.textMain, { paddingRight: 5 }]}>
                {"I_ALREADY_HAVE_AN_ACCOUNT".t()}
            </Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={{ fontSize: 14, color: styles.textHighLightOld.color }}>
                    {"LOGIN".t()}
                </Text>
            </TouchableOpacity>
        </View>

    )
}
export default HaveAccountField;