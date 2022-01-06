import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Button from '../../components/Button/Button'
import { LOGIN_SCREEN, pushSingleScreenApp } from '../../navigation'

const LiquidSwapScreen = ({
    componentId
}) => {
    return (
        <View>
            <Text>Liquid Swap</Text>
            <Button 
            isNormal
            onPress={()=>pushSingleScreenApp(componentId,LOGIN_SCREEN)}
            />
        </View>
    )
}

export default LiquidSwapScreen

const styles = StyleSheet.create({})
