import React from 'react';
import { Text, View } from 'react-native';
import { thousandsSeparators } from '../../configs/utils';
import PropTypes from 'prop-types'
import colors from '../../configs/styles/colors';
import TextFnx from './TextFnx';
const TextSeparators = ({
    style,
    value=0,
    size,
    weight,
    color,
    suffix
}) => (
    <TextFnx size={size} color={color} weight={weight} style={style}>
        {value}{suffix && ` ${suffix}`}
    </TextFnx>
);
TextSeparators.propTypes ={
    style:PropTypes.object,
    size:PropTypes.number,
    weight:PropTypes.string,
    color:PropTypes.string,
    value:PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    suffix:PropTypes.string
}
export default TextSeparators;
