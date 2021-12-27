import React from 'react';
import { Text, View,StyleSheet, TouchableOpacity } from 'react-native';
import { TouchablePreview } from 'react-native-navigation/lib/dist/src/adapters/TouchablePreview';

import TextFnx from '../Text/TextFnx';
import colors from '../../configs/styles/colors';
import Icon from '../Icon';

const ButtonSubmitClose = ({
    style,
    iconLeftSvg,
    onPress,
    isSubmit,
    isClose,
    isButtonCircle,
    title=isSubmit?"SUBMIT".t():"CLOSE".t(),
    bgButtonColor=isSubmit?colors.iconButton:colors.btnClose,
    ...rest
}) => (
    <View style={stylest.flex}>
        <TouchableOpacity
            onPress={onPress}
            {...rest}
        >
            <View style={[isButtonCircle?stylest.btnCircle:stylest.btn,{backgroundColor:bgButtonColor, flexDirection:"row"},style]}>
                {iconLeftSvg && iconLeftSvg}
                <TextFnx spaceLeft={iconLeftSvg?5:0} color={isSubmit?colors.black:colors.textBtnClose} value={title} />
            </View>
        </TouchableOpacity>
    </View>
);
const stylest = StyleSheet.create({
    flex:{
        flex: 1
    },
    btn:{
        height: 40,
        justifyContent:"center",
        alignItems:"center",
        borderRadius: 8,
        
    },
    btnCircle:{
        height: 40,
        justifyContent:"center",
        alignItems:"center",
        borderRadius: 25,
    }
})
export default ButtonSubmitClose;
