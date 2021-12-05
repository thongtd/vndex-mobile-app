import React, { Component } from 'react'
import { Text, View, TextInput, StyleSheet } from 'react-native'
import { style } from '../../config/style'
import { Button } from "native-base";
import { dimensions, formatTrunc, jwtDecode } from "../../config/utilities";
import LabelField from '../Account/components/LabelField';
import {styles} from "react-native-theme"
// const SendEmailField = ({
//     placeholder,
//     onChangeText,
//     value,
//     onSend,
//     checked,
//     timer,
//     titleBtn,
//     ...rest
// }) => {
//     return (
//         <View style={{
//             flexDirection: 'row', borderRadius: 2.5
//         }}>
//             <TextInput
//                 {...rest}
//                 onFocus={rest.onFocus}
//                 onBlur={rest.onBlur}
//                 allowFontScaling={false}
//                 style={stylest.textInput}
//                 placeholder={placeholder}
//                 placeholderTextColor={style.textMain.color}
//                 onChangeText={onChangeText}
//                 value={value}
//                 keyboardType={'numeric'}
//                 ref={rest.ref2}
//             />
//             <Button
//                 primary
//                 style={stylest.buttonField}
//                 disabled={checked}
//                 onPress={onSend}
//             >
//                 <Text style={{ color: 'white' }}>{checked ? (timer <= 0 ? 0 : timer) + "s" : titleBtn} </Text>
//             </Button>
//         </View>
//     )
// }
// export default SendEmailField;
const SendEmailField = ({
    placeholder,
    onChangeText,
    value,
    onSend,
    checked,
    timer,
    titleBtn,
    label,
    ...rest
}) => {
    return (
        <React.Fragment>
            {label && <LabelField label={placeholder} />}
            <View style={{
                flexDirection: 'row', borderRadius: 2.5
            }}>
                <TextInput
                    {...rest}
                    onFocus={rest.onFocus}
                    onBlur={rest.onBlur}
                    allowFontScaling={false}
                    style={[stylest.textInput2,styles.textWhite]}
                    placeholder={label?"":placeholder}
                    placeholderTextColor={style.textMain.color}
                    onChangeText={onChangeText}
                    value={value}
                    keyboardType={'numeric'}
                    ref={rest.ref2}
                />
                <Button
                    primary
                    style={[stylest.buttonField,{
                        backgroundColor:styles.bgButton.color
                    }]}
                    disabled={checked}
                    onPress={onSend}
                >
                    <Text style={{ color: 'white' }}>{checked ? (timer <= 0 ? 0 : timer) + "s" : titleBtn} </Text>
                </Button>
            </View>
        </React.Fragment>

    )
}
export default SendEmailField;
const stylest = StyleSheet.create({
    textInput2: {
        flex: 3,
        paddingHorizontal: 10,
        borderWidth: 0.5,
        borderRightWidth: 0,
        borderColor: style.colorBorderBox,
        height: 40,
        color: 'white',
        borderTopLeftRadius: 2.5,
        borderBottomLeftRadius: 2.5
    },
    textInput: {
        flex: 3,
        paddingHorizontal: 10,
        backgroundColor: '#19243a',
        height: 40,
        color: 'white',
        borderTopLeftRadius: 2.5,
        borderBottomLeftRadius: 2.5
    },
    buttonField: {
        padding: 5,
        width: dimensions.width / 4,
        justifyContent: 'center',
        backgroundColor: '#21386b',
        borderTopRightRadius: 2.5,
        borderBottomRightRadius: 2.5,
        height: 40,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderWidth: 0.5,
        borderColor: '#21386b',
    }
})