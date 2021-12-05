import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, TouchableWithoutFeedback,DeviceEventEmitter } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import Home from "../components/Home/Home";
import Trade from "../components/Trade/Trade";
import Order from "../components/Order/Order";
import Wallet from "../components/Wallet/Wallet";
import Account from "../components/Account/Account";
import Icon from 'react-native-vector-icons/FontAwesome';
import { authService } from "../services/authenticate.service";
import { style } from "../config/style";
import { storageService } from "../services/storage.service";
import { jwtDecode } from "../config/utilities";
import { httpService } from "../services/http.service";
import { _t } from "../language/i18n";
import I18n from '../language/i18n'
import { commonService } from "../services/common.service";
import TabBarIcon from "./TabBarIcon";
import { constant } from '../config/constants';
import ChartFnx from '../components/Trade/Chart/ChartTest';
import theme,{ styles } from 'react-native-theme';
import { connect } from 'react-redux'
import TouchableWithoutFeedbackFnx from '../components/Shared/TouchableWithoutFeedbackFnx';
class TabBarRoot extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pass:true,
            active: "HOME",
            itemTabs: [
                { name: "HOME", navigate: "Home", icon: "home" },
                { name: "TRADE", navigate: "Trade", icon: "line-chart" },
                { name: "ORDERS", navigate: "Order", icon: "check" },
                { name: "BALANCES", navigate: "Wallet", icon: "money" },
                { name: "ACCOUNT", navigate: "Account", icon: "user-o" },
            ]
        }
        this.eventListener = DeviceEventEmitter.addListener('eventScreen',this.handleEvent);
    }
    // componentWillReceiveProps(nextProps) {
    //     console.log(nextProps,"props new kak");
    // }
    componentWillMount() {
        theme.setRoot(this)
    }
    async componentDidUpdate(prevProps, prevState) {
        // let screen = await storageService.getItem("screen");
        // console.log(screen,this.state.active,prevState.active,"active kakak");
        // if(screen !== prevState.active){
        //     this.setState({
        //         active:screen
        //     })
        // }
        // console.log(prevState,prevProps,"prevState Tabbar");
    }
    componentWillUnmount(){
        //remove listener
        this.eventListener.remove();
  }
  handleEvent=(event)=>{
      this.setState({
          active:event.name
      })
      console.log(event,"event kakaka");
    //Do something with event object
   }
    renderItem = ({ item, index }) => {
        const { active } = this.state;
      
        return <TouchableWithoutFeedbackFnx
            onPress={() => {
                const { navigation } = this.props;
                commonService.getLanguage().then(lang => {
                    if (lang) {
                        I18n.locale = lang;
                    }
                    else {
                        commonService.setLanguage(I18n.locale == "en" ? "en-US" : "vi-VN")
                    }
                })
                authService.getToken().then(val => {
                    if ((!val && item.name === "ORDERS") || (!val && item.name === "BALANCES")) {
                        navigation.navigate("Login");
                    } else {
                        this.setState({
                            active: item.name
                        })
                        navigation.navigate(item.navigate)
                    }
                }).catch(err => console.log(err))

            }}
        >
            <View style={{
                flexDirection: "column",
                alignItems: "center",
            }}>
                <Icon name={item.icon} color={(active === item.name) ? styles.txtHl.color : styles.textMain.color} size={18} />
                <Text style={{
                    fontSize: 11,
                    color: active === item.name ? styles.txtHl.color : styles.textMain.color
                }}>
                    {`${item.name.t()}`}
                </Text>
            </View>
        </TouchableWithoutFeedbackFnx>
    }
    getScreen=async()=>{
       let screen = await storageService.getItem("screen");
       console.log(screen,"screen duoi");
       if(this.state.pass){
        this.setState({
            active:screen,
            pass:false
           })
       }
    }
    render() {
        this.getScreen();
        const { itemTabs } = this.state;
        theme.setRoot(this);
        const { navigation } = this.props;
        storageService.getItem("screen").then(val=>console.log(val,"val kaka"));
        // const {screen} = navigation.state.params;
       
       console.log( this.props.navigation,"routeName kaka");
        return (
            <View style={{
                height: 50,
                backgroundColor: styles.backgroundSub.color,
                elevation: 0.5,
                shadowOpacity: 0.75,
                shadowRadius: 5,
                shadowColor: 'black',
                shadowOffset: { height: 0, width: 0 },
                elevation: 5
            }}>
                <FlatList

                    contentContainerStyle={{
                        justifyContent: "space-around",
                        flexDirection: "row",
                        paddingTop: 7
                    }}
                    extraData={this.state}
                    data={itemTabs}
                    renderItem={this.renderItem}
                    scrollEnabled={false}
                    keyExtractor={(item, index) => index.toString()}
                />

            </View>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        theme:state.commonReducer.theme
    }
}
connect(mapStateToProps)(TabBarRoot);

const tabBarOnPress = async ({ navigation, defaultHandler }) => {
    commonService.getLanguage().then(lang => {
        if (lang) {
            I18n.locale = lang;
        }
        else {
            commonService.setLanguage(I18n.locale == "en" ? "en-US" : "vi-VN")
        }
    })
    authService.getToken().then(val => {
        if (!val) {
            navigation.navigate("Login");
        } else {
            defaultHandler();
        }
    }).catch(err => console.log(err))

};

export const TabBar = createBottomTabNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <TabBarIcon tintColor={tintColor} label={'HOME'} name={'home'} />
            )
        }
    },
    Trade: {
        screen: Trade,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <TabBarIcon tintColor={tintColor} label={'TRADE'} name={'line-chart'} />
            )
        }
    },
    Order: {
        screen: Order,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <TabBarIcon tintColor={tintColor} label={'ORDERS'} name={'check'} />
            ),
            tabBarOnPress: tabBarOnPress
        }
    },
    Wallet: {
        screen: Wallet,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <TabBarIcon tintColor={tintColor} label={'BALANCES'} name={'money'} />
            ),
            tabBarOnPress: tabBarOnPress
        }
    },
    Account: {
        screen: Account,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
                <TabBarIcon tintColor={tintColor} label={'ACCOUNT'} name={'user-o'} />
            ),
            // tabBarOnPress: tabBarOnPress
        }
    },
}, {
        tabBarComponent:(props)=> (<TabBarRoot {...props} test={"kaka"} />),
        initialRoute: 'Home',
        tabBarOptions: {
            showLabel: false,
            showIcon: true,
            activeTintColor: '#06ffff',
            inactiveTintColor: '#486db4',
            // activeBackgroundColor: '#4061ac',
            style: {
                backgroundColor: "#fff",
                shadowColor: "#101226",
                shadowOpacity: 0.8,
                shadowRadius: 5,
                shadowOffset: {
                    height: 2,
                    width: 2
                }
            },
            upperCaseLabel: false,
            fontSize: 30,
            labelStyle: {
                fontSize: 12,
            },
            indicatorStyle: {
                backgroundColor: '#fff',
            },
        }
    })
