import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { fullWidth, fullHeight } from '../../configs/utils';
import {
    UIActivityIndicator,
} from 'react-native-indicators';
import colors from '../../configs/styles/colors';
const Spinner = ({
    visible
}) => (
        <>
            {visible && <View style={stylest.spinner}>
                <UIActivityIndicator color={colors.text} />
            </View>}
        </>

    );
const stylest = StyleSheet.create({
    spinner: {
        width: fullWidth,
        height: fullHeight,
        position: "absolute",
        top: 0,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 100,
        zIndex: 100,
    }
})
export default Spinner;
