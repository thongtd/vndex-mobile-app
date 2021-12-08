import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import TextFnx from './Text/TextFnx';
import icons from '../configs/icons';
const WellCome = ({
    style = stylest.wellcome
}) => (
        <>
            <View style={style}>
                <TextFnx size={25} value={`${"WELLCOME_TO".t()} `} />
                <View style={{ width: 90, height: 25 }}>
                    <Image source={icons.textXwalet} style={{ width: "100%", height: "100%" }} resizeMode="contain" />
                </View>
            </View>
        </>
    );
const stylest = StyleSheet.create({
    wellcome: {
        justifyContent: "center",
        alignItems:"center",
        // alignSelf: "center",
        paddingTop: 80,
        flexDirection: "row"
    }
})
export default WellCome;
