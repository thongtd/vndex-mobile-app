import React from 'react';
import { Text, View } from 'react-native';
import colors from '../../configs/styles/colors';
import PropTypes from 'prop-types';
const TextFnx = ({
    isDart,
    color =isDart?colors.text: colors.background,
    children,
    size = 14,
    weight = "normal",
    style,
    value,
    space=0,
    align,
    spaceHorizontal,
    spaceTop,
    spaceBottom,
    spaceLeft,
    spaceRight,
    ...rest
}) => (
        <Text {...rest}  
            style={style ? style : {
                color: color,
                fontSize: size,
                fontWeight: weight,
                paddingVertical:space,
                textAlign:align ,
                paddingHorizontal: spaceHorizontal,
                paddingTop: spaceTop,
                paddingBottom: spaceBottom,
                paddingLeft: spaceLeft,
                paddingRight: spaceRight,
            }}
        >
            {children || value}
        </Text>
    );
    TextFnx.propTypes = {
    style: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object
    ]),
    size:PropTypes.number,
    weight:PropTypes.string,
    color:PropTypes.string,
    value:PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.element
    ]),
}
export default TextFnx;
