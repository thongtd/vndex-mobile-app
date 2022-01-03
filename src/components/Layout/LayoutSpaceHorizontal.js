import React from 'react';
import { View } from 'react-native';

const LayoutSpaceHorizontal = ({
    children,
    space,
    style,
    ...rest
}) => (
        <View style={[{paddingHorizontal: space,flex:1},style]}>
            {children}
        </View>
    );

export default LayoutSpaceHorizontal;
