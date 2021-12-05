import React, { Component } from 'react'
import { Text, View,Platform, TouchableOpacity } from 'react-native'
import { Icon } from 'native-base';

const IconAlertInfoRule = ({
onInfoAlert,
styled={
    marginTop:10,
    color: "#486db4",
    marginRight: 2,
    fontSize: 16
}
}) => {
    return (
        <TouchableOpacity
            onPress={onInfoAlert}
        >
            <Icon style={styled} active name='alert' />
        </TouchableOpacity>
    )
}
export default IconAlertInfoRule;
