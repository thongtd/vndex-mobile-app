import React, { Component } from 'react'
import { View ,Dimensions} from 'react-native'
import {styles} from "react-native-theme";
const {width,height} = Dimensions.get("window");
const ContainerApp = ({
    backgroundStyle = styles.backgroundMain.color,
    children,
    styled,
    styledRoot,
    ...rest
}) => {
    return (
        <View style={styledRoot?styledRoot:{
            backgroundColor: backgroundStyle,
            flex:1
            // width:width,
            // height:height
        }}>
            <View style={[{
                marginHorizontal: 10,
            }, styled]}>
                {children}
            </View>
        </View>

    )
}
export default ContainerApp