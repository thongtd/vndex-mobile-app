import { Text, View,StyleSheet,Dimensions,TouchableOpacity,ScrollView } from 'react-native'
import React from 'react';
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: 'center',
        //flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#00000090',
    },
    activityIndicatorWrapper: {
        backgroundColor: '#1c2840',
        width: width - 20,
        padding: 20,
        // justifyContent: 'center',
        marginLeft: 10,
        marginRight: 10
    },
    item: {
        borderBottomWidth: 0
    },
    input: {
        backgroundColor: '#19243a',
        borderRadius: 2,
        height: 40,
        marginBottom: 5,
        justifyContent: 'center'
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center'
    },
    rowItems: {
        borderWidth: 1,
        borderColor: '#e3e3e3',
        color: '#e3e3e3',
        borderRadius: 7,
        width: 14,
        height: 14,
        textAlign: 'center',
        fontSize: 9.5,
    }
})

export default styles;