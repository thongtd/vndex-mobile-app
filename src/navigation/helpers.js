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
            id: IdNavigation.Swap.Menu,
            text: 'SWAP'.t(),
            title:"title"
        },
        {
            id: IdNavigation.Wallet.menu,
            text: 'WALLET'.t(),
            title:"title"
        },
        {
            id: IdNavigation.Dapp.menu,
            text: 'Dapp',
            title:"title"
        },
        {
            id: IdNavigation.Setting.menu,
            text: 'SETTING'.t(),
            title:"title"
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

export const itemScreen = ( nameScreen) => {
    return {
        component: {
            name: nameScreen,
            options: {
                statusBar: {
                    backgroundColor: 'transparent',
                    drawBehind: true,
                    visible: true
                },
                topBar:{
                    title:{
                        text:""
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
            id: IdNavigation.Setting.menu,
            name: SETTING_SCREEN
        },
    ]
    let screenData = [];
    dataScreen.map((item, index) => {
        screenData.push(itemScreen(item.id, item.name))
    })
    return screenData;
}


export const getChildrenNavigation = (Navigation) => {
    let children;
    switch (Navigation) {
        case IdNavigation.Dapp.menu:
            children = [
                ...stackCommons("Dapp")
            ]
            break;
        case IdNavigation.Setting.menu:
            children = [
                itemScreen(IdNavigation.Setting.Login, LOGIN_SCREEN),
                itemScreen(IdNavigation.Setting.confirmLogin, CONFIRM_LOGIN_SCREEN),
                itemScreen(IdNavigation.Setting.menu, SETTING_SCREEN),
            ]
            break;
        case IdNavigation.Wallet.menu:
            children = [
                ...stackCommons("Wallet")
            ]
            break;
        case IdNavigation.Swap.Menu:
            children = [
                ...stackCommons("Swap")
            ]
            break;
        default:
            break;
    }
    return children;
}
export const Tabbar = (nameScreen, ic, text, id) => {
    return {
        stack: {
            id:id,
            children:[itemScreen(nameScreen)],
            options: {
                bottomTab: {
                    icon: ic,
                    text: text,
                    iconColor: colors.tabbar,
                    selectedIconColor: colors.tabbarActive,
                    fontSize: 12,
                    selectedFontSize: 12,
                    selectedTextColor: colors.tabbarActive,
                    testID: id,
                }
            },
        },
    }
}