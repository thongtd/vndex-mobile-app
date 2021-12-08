import React from 'react';
import RN,{ Text, View } from 'react-native';
import PropTypes from 'prop-types';
const LayoutSpaceBetween = ({
    children,
    style,
    ...rest
}) => (
    <View {...rest} style={[stylest.container,style]}>
        {children}
    </View>
);
const stylest = RN.StyleSheet.create({
    container:{
        flexDirection: 'row',
        justifyContent: "space-between",
    }
})
LayoutSpaceBetween.propTypes={
    style:PropTypes.object
}
export default LayoutSpaceBetween;
