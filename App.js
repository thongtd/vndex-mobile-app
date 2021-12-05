/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { StyleSheet, Linking, Text, View, StatusBar, PixelRatio, TextInput, Alert, Picker, Platform } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/redux/store'
import Stack from "./src/navigation/Stack";
import { _t } from "./src/language/i18n";
import { commonService } from "./src/services/common.service";
import I18n from "react-native-i18n";
import { style } from "./src/config/style";
// import SplashScreen from 'react-native-splash-screen';
import { SafeAreaView } from 'react-navigation'
import { replaceLang } from './src/config/utilities';
import { getAppstoreAppVersion } from "react-native-appstore-version-checker";
import { ModalAlert } from "./src/components/Shared"
import { APP_STORE_URL } from "./src/config/API";
import themes from "./src/theme/theme"
import codePush from "react-native-code-push";
import {storageService} from "./src/services/storage.service";
// import DeviceInfo from 'react-native-device-info';
// import OneSignal from 'react-native-onesignal'; // Import package from node modules
import SafeAreaFnx from './src/components/Shared/SafeAreaFnx';
import theme from 'react-native-theme';

import SplashScreen from "./SplashScreen";
import {
    setCustomView,
    setCustomTextInput,
    setCustomText,
    setCustomImage,
    setCustomTouchableOpacity
} from 'react-native-global-props';
type Props = {};
const customTextProps = {
    style: {
        fontSize: 14,
        fontFamily: 'Roboto',
    },
    allowFontScaling: false
};
const customTextInputProps = {
    style: {
        fontSize: 14 / PixelRatio.getFontScale(),
        fontFamily: 'Roboto',
    },
    allowFontScaling: false
};

setCustomTextInput(customTextInputProps);
setCustomText(customTextProps);
String.prototype.t = function () {
    let str: String = _t(this);
    str = str.replace('[missing "vi-VN.', '');
    str = str.replace('[missing "en-US.', '');
    str = str.replace('" translation]', '');
    return str;
}

String.prototype.replaceAll = function (search, replacement) {
    let target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.str2Number = function () {
    let target = this;
    return Number(target ? target.replace(new RegExp(",", 'g'), "") : '0');
};

class App extends Component<Props> {
    constructor(props) {
        super(props)
    }
    // componentWillUnmount() {
    //     OneSignal.removeEventListener('received', this.onReceived);
    //     OneSignal.removeEventListener('opened', this.onOpened);
    //     OneSignal.removeEventListener('ids', this.onIds);
    //   }

    //   onReceived(notification) {
    //     console.log("Notification received: ", notification);
    //   }

    //   onOpened(openResult) {
    //     console.log('Message: ', openResult.notification.payload.body);
    //     console.log('Data: ', openResult.notification.payload.additionalData);
    //     console.log('isActive: ', openResult.notification.isAppInFocus);
    //     console.log('openResult: ', openResult);
    //   }

    //   onIds(device) {
    //     console.log('Device info: ', device);
    //   }

componentWillMount() {
    // theme.active('light')
    
}
    render() {

        return (
            <Provider store={store}>
                <AppChildren />
            </Provider>
        );
    }
}
let codePushOptions = { 
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
    installMode:codePush.InstallMode.IMMEDIATE
 };
// export default codePush(codePushOptions)(App)
export default App;



class AppChildren extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isUpdate: false,
            isSplashscreen:true
        }
        this.getTheme();
        // OneSignal.init("6911eccf-032a-480a-b65f-de4a6f5c5894");
        // OneSignal.addEventListener('received', this.onReceived);
        // OneSignal.addEventListener('opened', this.onOpened);
        // OneSignal.addEventListener('ids', this.onIds);


        if (Text.defaultProps == null) Text.defaultProps = {};
        Text.defaultProps.allowFontScaling = false;
        TextInput.defaultProps.fontSize = 14 / PixelRatio.getFontScale();
        Text.defaultProps.style = {
            fontFamily: 'Roboto',
        }
        TextInput.defaultProps.style = {
            fontFamily: 'Roboto',
        }
        TextInput.defaultProps = { ...(TextInput.defaultProps || {}), allowFontScaling: false };


    }
    getTheme=()=>{
        storageService.getItem("theme").then((val) =>{
            if(val && val === "light"){
                theme.active("light");
                // this.props.changeTheme("light");
            }else{
                theme.active();
                // this.props.changeTheme("default");
            }
        })
    

    }
    componentDidMount() {
        if (Platform.OS === "android") {
            this.getVersionApk();
        }
        // console.log(UserAgent.userAgent,"vao toi day roi");
        StatusBar.setHidden(false);
        StatusBar.setBarStyle('light-content')
        //StatusBar.setBackgroundColor('transparent')
        console.disableYellowBox = true;
        // SplashScreen.hide();
        setTimeout(()=>{
            this.setState({
                isSplashscreen:false
            });
        },3500)
    }

    getVersionApk = () => {
        getAppstoreAppVersion("com.financex") //put any apps packageId here
            .then(appVersion => {
                console.log(appVersion,"appVersion");
                if (appVersion !== "1.3.5") {
                    this.setState({
                        isUpdate: true
                    })
                }
            })
            .catch(err => {
                this.setState({
                    isUpdate: false
                })
                console.log("error occurred", err);
            });
    }
    render() {
        const { isUpdate,isSplashscreen } = this.state;

        return (
            <SafeAreaFnx>
                {isSplashscreen?<SplashScreen />:(
               <React.Fragment>
                    <Stack />
                <ModalAlert
                    contentType={"UPDATE_APP".t()}
                    visible={isUpdate}
                    content={"NEW_VERSION_AVAILABLE".t()}
                    ButtonOKText={"UPDATE_APP".t()}
                    onOK={() => {
                        Linking.openURL(APP_STORE_URL)
                    }}
                    onClose={() => {
                        this.setState({
                            isUpdate: false
                        })
                    }}
                />    
               </React.Fragment>
                )}
            </SafeAreaFnx>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});