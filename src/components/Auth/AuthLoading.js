import React from 'react';
import {
    ActivityIndicator,
    StatusBar,
    StyleSheet,
    View,
    ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
class AuthLoading extends React.Component {
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        const auth_token = await AsyncStorage.getItem('auth_token')
        if (auth_token === null) {
            this.props.navigation.navigate('Login')
        }else {
            this.props.navigation.navigate('Order')
        }
    };

    // Render any loading content that you like here
    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            >
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}
export default AuthLoading;
