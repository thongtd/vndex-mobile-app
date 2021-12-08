import React from 'react';
import { View } from 'react-native';

const LayoutSpaceHorizontal = ({
    children,
    space,
    style={paddingHorizontal: space,flex:1},
    ...rest
}) => (
        <View style={style}>
            {children}
        </View>
    );

export default LayoutSpaceHorizontal;
