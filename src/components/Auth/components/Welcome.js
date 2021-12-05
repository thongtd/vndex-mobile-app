import React, { Component } from 'react'
import { Text, View, Image,StyleSheet } from 'react-native'
import { style } from "../../../config/style"
import theme,{styles} from "react-native-theme"
export default class Welcome extends Component {
    render() {
        return (
            <View style={{ flex: -1 }}>
                <Text style={styles.textWhite}>{'WELCOME'.t()}</Text>
                <View style={stylest.logoWelcome}>
                    <Image source={theme.name === "light"?require('../../../assets/financex_logo_l.png'):require('../../../assets/img/logo-financex.png')}
                        style={{ maxWidth: '100%', height: 58 }}
                        resizeMode={'contain'} />
                </View>
            </View>
        )
    }
}
const stylest = StyleSheet.create({
   
    logoWelcome: {
        width: '50%',
        flex: 1,
        flexDirection: 'row',
        marginTop: -10
    },
})