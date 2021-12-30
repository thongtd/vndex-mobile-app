import React, {useEffect} from 'react';
import {
  Platform,
  Text,
  View,
  StyleSheet,
  Image,
  NativeModules,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import icons from '../../configs/icons';
import PropTypes from 'prop-types';
import {SafeAreaView} from '../index';
import colors from '../../configs/styles/colors';
import WellCome from '../WellCome';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {fullHeight, isIos} from '../../configs/utils';
import DeviceInfo from 'react-native-device-info';
import Spinner from './Spinner';
import {StatusBar} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {BUTTON_ICON_RIGHT_NAV} from '../../navigation';
import BgLogin from 'assets/svg/bgLogin.svg';
const {StatusBarManager} = NativeModules;
let hasNotch = DeviceInfo.hasNotch();
const LayoutSplashScreen = ({
  isSplashScreen,
  children,
  isLogin,
  isLoadding,
  componentId,
  title = '',
  ...rest
}) => {
  useEffect(() => {
    Navigation.mergeOptions(componentId, {
        animations: {
            setRoot: {
              waitForRender: true,
              alpha: {
                from: 0,
                to: 1,
                duration: 300,
              },
            },
            push: {
              waitForRender: true,
              alpha: {
                from: 0,
                to: 1,
                duration: 300,
              },
            },
            showModal: {
              waitForRender: true,
            },
        },
      topBar: {
        animate: true,
        visible: true,
        drawBehind: true,
        background: {
          color: 'transparent',
        },
        borderHeight: 0,
        elevation: 0,
        noBorder: true,
        title:{
            text:title
        }
        // rightButtons: [
        //     {
        //         id: 'CustomComponent',
        //         component: {
        //             name: BUTTON_ICON_RIGHT_NAV,
        //             passProps: {
        //                 originComponentId: componentId,
        //                 title:"ok",
        //                 color:colors.highlight
        //                 // Any other prop you want to pass over
        //             }
        //         }
        //     }]
      },
    });
    return () => {};
  }, [componentId]);

  return (
    // <LinearGradient
    //     start={{ x: 0.0, y: 0.25 }}
    //     end={{ x: 0.5, y: 1.0 }}
    //     colors={[colors.gradientFrom, colors.gradientTo]}
    //     style={stylest.linearGradient}>
    <ImageBackground
      source={isLogin ? icons.bgLogin : icons.bgSignup}
      resizeMode="cover"
      style={{flex: 1}}>
      {/* <View style={{
            flex: 1,
            backgroundColor:colors.baseBg
        }}> */}

      <SafeAreaView
        style={{
          flex: 1,
        }}>
        <KeyboardAwareScrollView
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Spinner visible={isLoadding} />
          <View
            style={{
              paddingHorizontal: '7%',
              flex: 1,
            }}>
            {/* {isSplashScreen ? (<View style={stylest.viewLogo}>
                                <Image source={icons.logo} style={stylest.logo} resizeMode={"contain"} />
                            </View>) : <WellCome />} */}

            {children}
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>

      {/* </View> */}
    </ImageBackground>

    // </LinearGradient>
  );
};
LayoutSplashScreen.propTypes = {};

var stylest = StyleSheet.create({
  linearGradient: {
    flex: 1,
    // paddingHorizontal: 60,
  },
  logo: {
    width: 210,
    height: 65,
  },
  viewLogo: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '23%',
  },
});

export default LayoutSplashScreen;
