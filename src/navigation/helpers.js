import colors from "../configs/styles/colors"
import {
    SWAP_SCREEN,
    SETTING_SCREEN,
    DAPP_SCREEN,
    WALLET_SCREEN,
    LOGIN_SCREEN,
    REGISTER_SCREEN,
    RESET_SCREEN,
    CONFIRM_LOGIN_SCREEN
} from "./Screens"
import { Navigation } from "react-native-navigation";
import { IdNavigation } from "../configs/constant";


export const switchLangTabbar = () => {
    let tabbarArrays = [
        {
            id: IdNavigation.Home.Menu,
            text: 'HOME'.t(),
            title:"title"
        },
        {
            id: IdNavigation.Sto.menu,
            text: 'STO'.t(),
            title:"title"
        },
        {
            id: IdNavigation.LiquidSwap.menu,
            text: 'LIQUID_SWAP'.t(),
            title:"title"
        },
        {
            id: IdNavigation.Command.menu,
            text: 'COMMAND'.t(),
            title:"title"
        },
        {
            id: IdNavigation.Wallet.menu,
            text: 'WALLET'.t(),
            title:"Property Overview".t()
        },
    ];
    tabbarArrays.map((item, index) => {
        Navigation.mergeOptions(item.id, {
            topBar:{
                title:{
                    text:item.title
                }
            },
            bottomTab: {
                text: item.text
            }
        });
    })
}

export const itemScreen = ( nameScreen,title="") => {
    if((nameScreen == WALLET_SCREEN)){
        return {
            component: {
                name: nameScreen,
                options: {
                    statusBar: {
                        backgroundColor: colors.baseBg,
                        style:'dark',
                        // drawBehind: true,
                        visible: true
                    },
                    topBar:{
                        title:{
                            text:title
                        },
                        rightButtons:[{
                            id: IdNavigation.PressIn.historyTransaction,
                            icon:require("assets/icons/timer.png")
                          }]
                    }
                }
            }
        }
    }
    return {
        component: {
            name: nameScreen,
            options: {
                statusBar: {
                    backgroundColor: colors.baseBg,
                    style:'dark',
                    // drawBehind: true,
                    visible: true
                },
                topBar:{
                    title:{
                        text:title
                    }
                }
            }
        }
    }
}

export const stackCommons = (typeScreen) => {
    let dataScreen = [
        // {
        //     id: IdNavigation.Setting.menu,
        //     name: SETTING_SCREEN
        // },
        {
            id: IdNavigation.Wallet.menu,
            name: WALLET_SCREEN
        },
        // {
        //     id: IdNavigation.Dapp.menu,
        //     name: DAPP_SCREEN
        // },
        // {
        //     id: IdNavigation.Swap.Menu,
        //     name: SWAP_SCREEN
        // },
        {
            id: IdNavigation[typeScreen].Menu,
            name: LOGIN_SCREEN
        },
        {
            id: IdNavigation.Home.menu,
            name: SETTING_SCREEN
        },
    ]
    let screenData = [];
    dataScreen.map((item, index) => {
        screenData.push(itemScreen(item.id, item.name))
    })
    return screenData;
}



export const Tabbar = (nameScreen, ic, text, id,title) => {
    return {
        stack: {
            id:id,
            children:[itemScreen(nameScreen, title)],
            options: {
                bottomTab: {
                    icon: ic,
                    text: text,
                    iconColor: colors.subText,
                    selectedIconColor: colors.iconButton,
                    fontSize: 12,
                    selectedFontSize: 12,
                    selectedTextColor: colors.iconButton,
                    testID: id,
                }
            },
        },
    }
}