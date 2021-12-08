import React from 'react';
import { Text, View } from 'react-native';
import TextFnx from './TextFnx';
import Icon from '../Icon';
import { constant } from '../../configs/constant';
import colors from '../../configs/styles/colors';

const TextDot = ({
    value,
    color,
    style,
    size,
    weight,
    colorDot=colors.statusBar,
    sizeDot=13
}) => (
    <View style={{flexDirection:"row",
    marginVertical:2.5
    }}>
        <Icon style={{
            marginTop: 2,
            width:15
        }} color={colorDot} size={sizeDot} type={constant.TYPE_ICON.Octicons} name="primitive-dot" />
        <TextFnx style={[{
            width:"96%"
        },style]} color={color} size={size} weight={weight} value={`${value}`} />
    </View>
);

export default TextDot;
