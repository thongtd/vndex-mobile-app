import React, { Component } from 'react';
import { View, Text, ImageBackground, Image } from 'react-native';
import { storageService } from './src/services/storage.service';
import { style } from './src/config/style';
import Orientation from 'react-native-orientation';
export default class SplashScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            src: require("./src/assets/Loading.png"),
            bg: style.container.backgroundColor,
            lg: require("./src/assets/Logo.png"),
        };
        storageService.getItem("theme").then(val => {
            if (val && val === "light") {
                this.setState({
                    src: require("./src/assets/light_Loading.png"),
                    bg: "#fff",
                    lg: require("./src/assets/Logo.png"),
                });
            } else {
                this.setState(
                    {
                        src: require("./src/assets/Loading.png"),
                        bg: style.container.backgroundColor,
                        lg: require("./src/assets/img/logo-financex.png"),
                    }
                );
            }
        })
    }
    componentWillMount() {
        Orientation.lockToPortrait();
    }
    render() {
        return (
            <View style={{
                backgroundColor: this.state.bg,
                width: '100%', height: '100%',
                justifyContent: "center"
            }}>
                <ImageBackground resizeMode={"cover"} source={this.state.src} style={[{width: '80%', height: '100%', position: "absolute", left: 0 },{opacity:0.5}]}>

                </ImageBackground>
                <View style={{
                    alignSelf:"center"
                }}>
                <Image resizeMode="contain" source={this.state.lg} style={{
                    width: 280,
                    height: 60,
                }} />
                </View>
                
                <View style={{
                    position: "absolute",
                    bottom: 20,
                    alignSelf:"center"
                }}>
                    <Text style={style.textMain}>© 2018 Financex.io. All Rights Reserved</Text>
                </View>

            </View>

        );
    }
}
