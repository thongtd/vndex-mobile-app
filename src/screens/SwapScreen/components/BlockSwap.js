import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet } from 'react-native';
import TextFnx from '../../../components/Text/TextFnx';
import LayoutSpaceBetween from '../../../components/LayoutSpaceBetween';
import colors from '../../../configs/styles/colors';
import Layout from '../../../components/Layout/Layout';
import { blockCharSpecical, get } from '../../../configs/utils';
import icons from '../../../configs/icons';
import Icon from '../../../components/Icon';
import { TouchablePreview } from 'react-native-navigation/lib/dist/src/adapters/TouchablePreview';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input';
import Image from '../../../components/Image/Image';
import {useSelector} from "react-redux"
const BlockSwap = ({
    onSelect,
    textIcon,
    icon,
    textRightTop="You Pay".t(),
    available,
    value,
    onChangeText,
    onMax,
}) => {
    const logged = useSelector(state => state.authentication.logged)
    return (
        <Layout type="column" space={5}>
            <Layout
                style={{ paddingBottom: 10, }}
                isSpaceBetween>
                <Layout>
                    <TextFnx color={colors.subText} value={`${"AVAILABLE".t()}: `} />
                    <TextFnx isDart value={available} />
                </Layout>
                <TextFnx isDart value={textRightTop} />
            </Layout>
            <Layout>
                <View style={stylest.blockLeft}>
                    <TouchablePreview
                    onPress={onSelect}
                    >
                        <Layout
                            style={stylest.layoutBtnLeft}
                        >
                            <Image style={stylest.icLeft} source={{uri:icon}}/>
                            <TextFnx isDart weight="bold" value={textIcon} />
                            <Icon name="caret-down" color={colors.statusBar} />
                        </Layout>
                    </TouchablePreview>
                </View>
                <Input
                    hasValue
                    colorTextMax={colors.highlightTitle}
                    widthMax={"25%"}
                    heightMax={"100%"}
                    styleButtonMax={{
                        height: "100%",
                        justifyContent:"center",
                        alignItems:"center"
                    }}
                    isMax
                    onMax={onMax}
                    styleView={stylest.blockRight}
                    keyboardType={"decimal-pad"}
                    style={stylest.textInput}
                    value={value}
                    onChangeText={onChangeText}
                />
            </Layout>
        </Layout>
    );
}
const stylest = StyleSheet.create({
    layoutBtnLeft: {
        justifyContent: "space-between",
        alignItems: 'center',
        height:"100%",
    },
    btnMax: {
        width: "100%",
        height: 50,
        justifyContent: 'center',
        // paddingRight: 5
    },
    textBtnMax: {
        textAlign: "center",
        color: colors.highlightTitle
    },
    textInput: {
        width: "75%",
        height: "100%",
        paddingLeft: 10
    },
    blockLeft: {
        width: "25%",
        paddingHorizontal: 7,
        height: 50,
        borderWidth: 0.5,
        borderColor: colors.line,
        backgroundColor: colors.btnBlur,
        justifyContent: "center"
    },
    blockRight: {
        width: "75%",
        height: 50,
        borderWidth: 0.5,
        borderColor: colors.line,
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center"
    },
    icLeft: {
        width: 17,
        height: 17
    }
})
export default BlockSwap;
