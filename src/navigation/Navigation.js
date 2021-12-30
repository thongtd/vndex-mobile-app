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
import {COMMAND_SCREEN, HOME_SCREEN, LIQUID_SWAP_SCREEN, STO_SCREEN} from '.';

// Register all screens on launch
// registerScreens();
export function pushTutorialScreen() {
  Navigation.setDefaultOptions({
    layout: {
      backgroundColor: 'transparent',
      componentBackgroundColor: 'transparent',
    },
    screenBackgroundColor: 'transparent',
    modalPresentationStyle: 'overCurrentContext',
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
      showModal: {
        waitForRender: true,
      },
    },
    topBar: {
      visible: true,
      background: {
        color: colors.navigation,
      },
      title: {
        color: 'white',
      },

      backButton: {
        color: '#8A8779',
      },
      buttonColor: 'white',
    },
    statusBar: {
      style: 'dark',
      backgroundColor: colors.baseBg,
      visible: true,
    },
    layout: {
      orientation: ['portrait'],
    },
    bottomTabs: {
      titleDisplayMode: 'alwaysShow',
      backgroundColor: '#252424',
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
                  style: 'dark',
                  backgroundColor: colors.baseBg,
                  // drawBehind: true,
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
  // if (isSameScreen(screen)) {
  //   return;
  // }
  return Navigation.push(componentId, {
    component: {
      name: screen,
      passProps,
      options: {...hiddenTabbar(), ...options},
    },
  });
}

export function pushSingleHiddenTopBarApp(
  componentId,
  screen,
  passProps = {},
  options = {},
  hiddenTab = true,
) {
  // if (isSameScreen(screen)) {
  //   return;
  // }
  return Navigation.push(componentId, {
    component: {
      name: screen,
      passProps,
      options: {
        animations: {
          setRoot: {
            waitForRender: true,
          },
          push: {
            waitForRender: true,
          },
          showModal: {
            waitForRender: true,
          },
        },
        bottomTabs: {
          visible: false,
          drawBehind: true,
        },
        statusBar: {
          style: 'dark',
          backgroundColor: colors.baseBg,
          // drawBehind: true,
          visible: true,
        },
        topBar: {
          animate: true,
          visible: false,
        },
        ...options,
      },
    },
  });
}

export function pop(componentId) {
  // resetScreenGlobal();
  return Navigation.pop(componentId);
}
export function popTo(componentId) {
  return Navigation.popTo(componentId);
}
export function showModal(screen, passProps, isHidden = true) {
  // if (isSameScreen(screen)) {
  //   return;
  // }
  return Navigation.showModal(hiddenModal(screen, passProps, isHidden));
}
export function dismissAllModal() {
  // resetScreenGlobal();
  return Navigation.dismissAllModals();
}

export function pushTabBasedApp(currenIndex = 0) {
  // resetScreenGlobal();
  return Navigation.setRoot({
    root: {
      bottomTabs: {
        children: [
          Tabbar(
            HOME_SCREEN,
            require('assets/icons/Home.png'),
            'HOME'.t(),
            IdNavigation.Home.menu,
          ),
          Tabbar(
            STO_SCREEN,
            require('assets/icons/Sto.png'),
            'STO'.t(),
            IdNavigation.Sto.Menu,
          ),
          Tabbar(
            LIQUID_SWAP_SCREEN,
            require('assets/icons/swap.png'),
            'LIQUID_SWAP'.t(),
            IdNavigation.LiquidSwap.menu,
          ),
          Tabbar(
            COMMAND_SCREEN,
            require('assets/icons/History.png'),
            'COMMAND'.t(),
            IdNavigation.Command.menu,
          ),
          Tabbar(
            WALLET_SCREEN,
            require('assets/icons/Union.png'),
            'WALLET'.t(),
            IdNavigation.Wallet.menu,
            'Property Overview'.t(),
          ),
        ],
        options: {
          bottomTabs: {currentTabIndex: currenIndex},
        },
      },
    },
  });
}
