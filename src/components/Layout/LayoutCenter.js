import React from 'react';
import { Text, View } from 'react-native';

const LayoutCenter = ({
    children,
}) => (
    <View style={{
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"column"
    }}>
       {children}
    </View>
);

export default LayoutCenter;
