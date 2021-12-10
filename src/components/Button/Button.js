import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '../Icon';
import colors from '../../configs/styles/colors';
import TextFnx from '../Text/TextFnx';
import { TouchablePreview } from 'react-native-navigation/lib/dist/adapters/TouchablePreview';
import ButtonSubmitClose from './ButtonSubmitClose';

import PropTypes from 'prop-types'
const Button = ({
    typeIconRight,
    iconLeft,
    iconRight,
    isSubmit,
    isClose,
    isInput,
    isTitle,
    onInput,
    onSubmit,
    onClose,
    isInputCircle,
    isButtonCircle = true,
    spaceVertical,
    placeholder = "placeholder",
    textSubmit,
    textClose,
    isPlaceholder = true,
    width,
    height,
    style,
    textStyle,
    color,
    size,
    weight,
    title,
    onTitle,
    bgButtonColor,
    spaceHorizontal,
    sizeIconRight,
    label,
    ...rest
}) => (
        <>
        {rest.isLabel && <TextFnx style={stylest.label} value={label} />}
            {(isSubmit || isClose) && (
                <View style={[stylest.flexRow, { marginVertical: spaceVertical }]}>
                    {isSubmit && <ButtonSubmitClose
                        title={textSubmit}
                        isSubmit
                        isButtonCircle={isButtonCircle}
                        onPress={onSubmit}
                        bgButtonColor={bgButtonColor}
                        style={style}
                        {...rest}
                    />}
                    {isSubmit && isClose && <View style={{ flex: 0.05 }} />
                    }
                    {isClose && <ButtonSubmitClose
                        bgButtonColor={bgButtonColor}
                        title={textClose}
                        isClose
                        isButtonCircle={isButtonCircle}
                        onPress={onClose}
                        style={style}
                        {...rest}
                    />}

                </View>
            )}
            {isInput && <TouchablePreview
                {...rest}
                onPress={onInput}
            >
                <View style={[isInputCircle ? stylest.inputCircle : stylest.inputView, { marginVertical: spaceVertical }]}>
                    {iconLeft && <Icon name={iconLeft} style={[stylest.iconLeft]} />}
                    <View style={stylest.inputCore}>
                        <TextFnx value={placeholder} color={isPlaceholder ? colors.description : colors.text} />
                    </View>
                    {iconRight && <Icon size={sizeIconRight} type={typeIconRight} name={iconRight} style={[stylest.iconRight, stylest.icon]} />}
                </View>
            </TouchablePreview>}
            {isTitle && <View style={{
                width:width,
                height:height
            }}>
                <TouchablePreview
                onPress={onTitle}
                >
                    <View style={style}>
                        <TextFnx spaceHorizontal={spaceHorizontal} weight={weight} style={textStyle} size={size} color={color} value={title} />
                    </View>
                </TouchablePreview>
            </View>}

        </>

    );
const stylest = StyleSheet.create({
    flexRow: {
        flexDirection: "row"
    },
    inputView: {
        width: "100%",
        borderColor: colors.line,
        borderWidth: 0.5,
        height: 40,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 10,
        backgroundColor: colors.background,
        borderRadius: 5,
    },
    inputCircle: {
        width: "100%",
        borderColor: colors.line,
        borderWidth: 0.5,
        height: 40,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 10,
        borderRadius: 25,
        backgroundColor: colors.background
    },
    inputCore: {
        height: 40,
        flex: 1,
        justifyContent: "center"
    },
    iconLeft: {
        color: colors.description,
        height: 40,
        lineHeight: 40,
        paddingRight: 10
    },
    iconRight: {
        color: colors.description,
    },
    icon: {
        width: 40,
        height: 40,
        lineHeight: 40,
        textAlign: "center"
    },
    label: {
        paddingTop: 10,
        color: colors.subText,

    },
})

Button.propTypes = {
    iconLeft: PropTypes.string,
    iconRight: PropTypes.string,
    isSubmit: PropTypes.bool,
    isClose: PropTypes.bool,
    isInput: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
    onInput: PropTypes.func,
}
export default Button;
