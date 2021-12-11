import React from 'react';
import { Text, View, StyleSheet, Image, NativeModules, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import icons from "../../configs/icons"
import PropTypes from 'prop-types'
import { SafeAreaView } from '../index';
import colors from '../../configs/styles/colors';
import WellCome from '../WellCome';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { fullHeight, isIos } from '../../configs/utils';
import DeviceInfo from 'react-native-device-info';
import Spinner from './Spinner';
import { StatusBar } from 'react-native';
const { StatusBarManager } = NativeModules;
let hasNotch = DeviceInfo.hasNotch();
const LayoutSplashScreen = ({
    isSplashScreen,
    children,
    isLoadding,
    ...rest
}) => {
    return (
        // <LinearGradient
        //     start={{ x: 0.0, y: 0.25 }}
        //     end={{ x: 0.5, y: 1.0 }}
        //     colors={[colors.gradientFrom, colors.gradientTo]} 
        //     style={stylest.linearGradient}>
        <View style={{
            flex: 1,
            backgroundColor:colors.baseBg
        }}>
            
            <StatusBar barStyle="light-content"/>
                <SafeAreaView >

                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <Spinner visible={isLoadding} />
                        <View style={{
                            paddingHorizontal: "7%",
                            height: isIos() ? (hasNotch ? fullHeight - 60 : fullHeight - 20) : fullHeight,
                        }}>

                            {/* {isSplashScreen ? (<View style={stylest.viewLogo}>
                                <Image source={icons.logo} style={stylest.logo} resizeMode={"contain"} />
                            </View>) : <WellCome />} */}
                            <View style={{
                                flex: 1,
                                height: "100%"
                            }}>
                                {children}
                            </View>
                        </View>
                    </KeyboardAwareScrollView>


                </SafeAreaView>
            
        </View>

        // </LinearGradient>
    );
}
LayoutSplashScreen.propTypes = {
}

var stylest = StyleSheet.create({
    linearGradient: {
        flex: 1
        // paddingHorizontal: 60,
    },
    logo: {
        width: 210,
        height: 65
    },
    viewLogo: {
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "23%"
    }
});

export default LayoutSplashScreen;
