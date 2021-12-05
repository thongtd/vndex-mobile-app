import React, { Component } from 'react'
import { Text, View, Dimensions } from 'react-native'
import Spinner from 'react-native-spinkit';
const { width, height } = Dimensions.get('window')
import { style } from "../../config/style"
const Spiner = ({
    isVisible = false,
    backgroundStyle,
    style={ position: "absolute", top: "42%", right: "45%", zIndex: 10 },
    ...rest
}) => {
    return (
        <React.Fragment>
            {isVisible && <View style={{
                position: "absolute",
                width: width, height: height, zIndex: 11,
                backgroundColor: "transparent"
            }}>
                {/* <View opacity={0} style={{ position: "absolute", top: 0, backgroundColor: "transparent", width: "100%", height: "100%", zIndex: 9 }}>
                </View> */}
                <Spinner style={style} isVisible={true} size={40} type={'ThreeBounce'} color={"#6cf7fe"} />
            </View>}
        </React.Fragment>
    )
}
export default Spiner;
