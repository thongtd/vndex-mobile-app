import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types'
import colors from '../../configs/styles/colors';
import TextFnx from './TextFnx';

const TextWhite = ({
    children,
    style
}) => (
        <TextFnx style={style}>
            {children}
        </TextFnx>
    );
TextWhite.propTypes = {
    style: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
    ]),
}
const stylest = StyleSheet.create({
    colorWhite: { color: colors.background, fontSize: 14 }
})
export default TextWhite;
