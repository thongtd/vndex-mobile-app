import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import TextWhite from '../Text/TextWhite';
import { TouchablePreview } from 'react-native-navigation/lib/dist/src/adapters/TouchablePreview';

import PropTypes from 'prop-types'
import TextFnx from '../Text/TextFnx';
const ButtonWithTitle = ({
    textStyle,
    title,
    style,
    onPress,
    color,
    size,
    weight,
    children,
    space,
    width,
    height,
    ...rest
}) => (
        <View style={{
            width:width,
            height:height
        }}>
            <TouchablePreview
                onPress={onPress}
            >
                <View {...rest}
                    style={style}>
                    {children || <TextFnx
                        style={textStyle}
                        color={color}
                        size={size}
                        weight={weight}
                        space={space}
                    >
                        {title}
                    </TextFnx>}

                </View>
            </TouchablePreview>
        </View>

    );
ButtonWithTitle.propTypes = {
    title: PropTypes.string,
    textStyle: PropTypes.object,
    onPress: PropTypes.func,
    size: PropTypes.number,
    weight: PropTypes.string,
    color: PropTypes.string,
    style: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),

}
export default ButtonWithTitle;
