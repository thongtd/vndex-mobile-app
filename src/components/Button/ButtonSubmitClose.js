import React from 'react';
import { Text, View,StyleSheet } from 'react-native';
import { TouchablePreview } from 'react-native-navigation/lib/dist/adapters/TouchablePreview';
import TextFnx from '../Text/TextFnx';
import colors from '../../configs/styles/colors';

const ButtonSubmitClose = ({
    style,
    onPress,
    isSubmit,
    isClose,
    isButtonCircle,
    title=isSubmit?"SUBMIT".t():"CLOSE".t(),
    bgButtonColor=isSubmit?colors.iconButton:colors.tabbar,
    ...rest
}) => (
    <View style={stylest.flex}>
        <TouchablePreview
            onPress={onPress}
            {...rest}
        >
            <View style={[isButtonCircle?stylest.btnCircle:stylest.btn,{backgroundColor:bgButtonColor},style]}>
                <TextFnx color={colors.black} value={title} />
            </View>
        </TouchablePreview>
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
