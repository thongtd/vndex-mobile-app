// @flow

import {Navigation} from 'react-native-navigation';

import {
  SPLASH_SCREEN,
  SWAP_SCREEN,
  DAPP_SCREEN,
  WALLET_SCREEN,
  SETTING_SCREEN,
  LOGIN_SCREEN,
  REGISTER_SCREEN,
  CONFIRM_REGISTER_SCREEN,
  RESET_SCREEN,
  CONFIRM_RESET_SCREEN,
} from './Screens';

import colors from '../configs/styles/colors';
import {optionTabbar, Tabbar} from './helpers';
import {IdNavigation} from '../configs/constant';
import {
  hiddenModal,
  hiddenTabbar,
  hiddenTabbarShowHeader,
  isSameScreen,
  resetScreenGlobal,
} from '../configs/utils';

// Register all screens on launch
// registerScreens();
export function pushTutorialScreen() {
  Navigation.setDefaultOptions({
    layout: {backgroundColor: 'transparent'},
    screenBackgroundColor: 'transparent',
    modalPresentationStyle: 'overCurrentContext',
    componentBackgroundColor: 'transparent',
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
      },
    },
    topBar: {
      background: {
        color: 'red',
      },
      title: {
        color: 'white',
      },
      backButton: {
        title: '', // Remove previous screen name from back button
        color: 'white',
      },
      buttonColor: 'white',
    },
    statusBar: {
      style: 'light',
    },
    layout: {
      orientation: ['portrait'],
    },
    bottomTabs: {
      titleDisplayMode: 'alwaysShow',
    },
    bottomTab: {
      textColor: 'gray',
      selectedTextColor: 'black',
      iconColor: 'gray',
      selectedIconColor: 'black',
    },
  });

  Navigation.setRoot({
    root: {
      stack: {
        children: [
          {
            component: {
              name: SPLASH_SCREEN,
              options: {
                topBar: {
                  visible: false,
                },
                statusBar: {
                  style: 'light',
                  backgroundColor: 'transparent',
                  drawBehind: true,
                  visible: true,
                },
              },
            },
          },
        ],
      },
    },
  });
}

export function pushSingleScreenApp(
  componentId,
  screen,
  passProps = {},
  options = {},
  hiddenTab = true,
) {
  if (isSameScreen(screen)) {
    return;
  }
  return Navigation.push(componentId, {
    component: {
      name: screen,
      passProps,
      options: hiddenTab ? hiddenTabbar() : options,
    },
  });
}
export function pushWithHeaderSingleScreenApp(
  componentId,
  screen,
  passProps = {},
  title,
  options = {},
) {
  if (isSameScreen(screen)) {
    return;
  }
  return Navigation.push(componentId, {
    component: {
      name: screen,
      passProps,
      options: {...hiddenTabbarShowHeader(title), ...options},
    },
  });
}
export function pop(componentId) {
  resetScreenGlobal();
  return Navigation.pop(componentId);
}
export function popTo(componentId) {
  return Navigation.popTo(componentId);
}
export function showModal(screen, passProps, isHidden = false) {
  if (isSameScreen(screen)) {
    return;
  }
  return Navigation.showModal(hiddenModal(screen, passProps, isHidden));
}
export function dismissAllModal() {
  resetScreenGlobal();
  return Navigation.dismissAllModals();
}

export function pushTabBasedApp(currenIndex = 0) {
  resetScreenGlobal();
  return Navigation.setRoot({
    root: {
      bottomTabs: {
        children: [
          Tabbar(
            WALLET_SCREEN,
            require('assets/icons/XWallet_menu_wallet.png'),
            'WALLET'.t(),
            IdNavigation.Wallet.menu,
          ),
          Tabbar(
            SWAP_SCREEN,
            require('assets/icons/XWallet_menuSwap.png'),
            'Swap',
            IdNavigation.Swap.Menu,
          ),
          Tabbar(
            DAPP_SCREEN,
            require('assets/icons/XWallet_menuDapp.png'),
            'Dapp',
            IdNavigation.Dapp.menu,
          ),
          Tabbar(
            SETTING_SCREEN,
            require('assets/icons/XWallet_menu_setting.png'),
            'Setting',
            IdNavigation.Setting.menu,
          ),
        ],
        options: {
          bottomTabs: {currentTabIndex: currenIndex},
          topBar: {visible: false},
        },
      },
    },
  });
}
