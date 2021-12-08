import React from 'react';
import { Text, View,SafeAreaView,StyleSheet } from 'react-native';

const SafeAreaViewFnx = ({
    children,
    style=styles.container
}) => (
    <SafeAreaView style={style}>
       {children}
    </SafeAreaView>
);
const styles = StyleSheet.create({
    container:{flex:1}
});
export default SafeAreaViewFnx;
