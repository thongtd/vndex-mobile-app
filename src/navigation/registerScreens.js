// @flow

import React from 'react';
import { Navigation } from 'react-native-navigation';

import {
  SplashScreen,
  WalletScreen,
  SettingScreen,
  DappScreen,
  SwapScreen,
  LoginScreen,
  RegisterScreen
} from '../screens';
import { Provider } from '../redux';

import {
  SPLASH_SCREEN,
  SWAP_SCREEN,
  DAPP_SCREEN,
  SETTING_SCREEN,
  WALLET_SCREEN,
  LOGIN_SCREEN,
  REGISTER_SCREEN,
  ALERT_NOTICE_PASSWORD,
  PICKER_SEARCH,
  CONFIRM_REGISTER_SCREEN,
  ALERT_ACCOUNT_ACTIVE,
  RESET_SCREEN,
  CONFIRM_RESET_SCREEN,
  CONFIRM_LOGIN_SCREEN,
  SUPPORT_SCREEN,
  PASSCODE_SCREEN,
  PASSCODE_AUTH_SCREEN,
  CHANGE_PASSWORD,
  SECURITY_SCREEN,
  FA_CODE_EMAIL,
  
  ENABLE_2FA_GG,
  BACK_UP_KEY,
  GUIDE_SET_UP_GG,
  SET_UP_CODE,
  SWAP_CONFIRM_SCREEN,
  HISTORY_SWAP_SCREEN,
  CALENDAR_SCREEN,
  INFO_COIN_SCREEN,
  INFO_FIAT_SCREEN,
  MODAL_ALERT,
  DEPOSIT_COIN_SCREEN,
  DEPOSIT_FIAT_SCREEN,
  HISTORY_DEPOSIT_COIN_SCREEN,
  HISTORY_DEPOSIT_FIAT_SCREEN,
  WITHDRAW_COIN_SCREEN,
  WITHDRAW_FIAT_SCREEN,
  TRANSACTION_HISTORY
} from './Screens';
import AlertNoticePassword from '../components/Alert/AlertNoticePassword';
import PickerSearchBox from '../components/Picker/PickerSearchBox';
import ConfirmScreen from '../screens/RegisterScreen/ConfirmScreen';
import AlertAccountActive from '../components/Alert/AlertAccountActive';
import { ResetScreen, ConfirmResetScreen } from '../screens/ResetScreen';
import ConfirmLoginScreen from '../screens/LoginScreen/ConfirmLoginScreen';
import SupportScreen from '../screens/SettingScreen/SupportScreen';
import PasscodeScreen from '../screens/SettingScreen/PasscodeScreen';
import PasscodeAuthScreen from '../screens/SettingScreen/PasscodeAuthScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen/ChangePasswordScreen';
import SecurityScreen from '../screens/SecurityScreen/SecurityScreen';
import FaCodeEmail from '../screens/SecurityScreen/FaCodeEmail';

import Enable2FaGG from '../screens/SecurityScreen/Enable2FaGG';
import BackupKeyScreen from '../screens/SecurityScreen/BackupKeyScreen';
import GuideSetupGG from '../screens/SecurityScreen/GuideSetupGG';
import SetupCodeScreen from '../screens/SecurityScreen/SetupCodeScreen';
import SwapConfirmScreen from '../screens/SwapScreen/childrensScreens/SwapConfirmScreen';
import HistorySwapScreen from '../screens/SwapScreen/childrensScreens/HistorySwapScreen';
import CalendarScreen from '../screens/SwapScreen/childrensScreens/CalendarScreen';
import InfoCoinScreen from '../screens/WalletScreen/screenChildren/InfoCoinScreen';
import InfoFiatScreen from '../screens/WalletScreen/screenChildren/InfoFiatScreen';
import ModalAlert from '../components/Alert/ModalAlert';
import DepositCoinScreen from '../screens/WalletScreen/screenChildren/DepositCoinScreen';
import DepositFiatScreen from '../screens/WalletScreen/screenChildren/DepositFiatScreen';
import HistoryDepositCoin from '../screens/WalletScreen/screenChildren/HistoryDepositCoin';
import ConfirmDepositFiatScreen from '../screens/WalletScreen/screenChildren/ConfirmDepositFiatScreen';
import HistoryDepositFiat from '../screens/WalletScreen/screenChildren/HistoryDepositFiat';
import WithdrawCoinScreen from '../screens/WalletScreen/screenChildren/WithdrawCoinScreen';
import WithdrawFiatScreen from '../screens/WalletScreen/screenChildren/WithdrawFiatScreen';
import HistoryTransactions from '../screens/WalletScreen/screenChildren/HistoryTransactions';
import { KycScreen } from '../screens/KycScreen';
import { KYC_SCREEN, REF_SCREEN } from '.';
import { RefScreen } from '../screens/RefScreen';

function WrappedComponent(Component) {
  return function inject(props) {
    const EnhancedComponent = () => (
      <Provider>
        <Component {...props} />
      </Provider>
    );

    return <EnhancedComponent />;
  };
}

export default function () {
  Navigation.registerComponent(DAPP_SCREEN, () => WrappedComponent(DappScreen),);
  Navigation.registerComponent(SWAP_SCREEN, () => WrappedComponent(SwapScreen),);
  Navigation.registerComponent(SETTING_SCREEN, () => WrappedComponent(SettingScreen),);
  Navigation.registerComponent(WALLET_SCREEN, () => WrappedComponent(WalletScreen));
  Navigation.registerComponent(SPLASH_SCREEN, () => WrappedComponent(SplashScreen));
  Navigation.registerComponent(LOGIN_SCREEN,()=>WrappedComponent(LoginScreen));
  Navigation.registerComponent(KYC_SCREEN,()=>WrappedComponent(KycScreen));
  Navigation.registerComponent(REF_SCREEN,()=>WrappedComponent(RefScreen));
  Navigation.registerComponent(REGISTER_SCREEN,()=>WrappedComponent(RegisterScreen))
  Navigation.registerComponent(CONFIRM_REGISTER_SCREEN,()=>WrappedComponent(ConfirmScreen))
  Navigation.registerComponent(RESET_SCREEN,()=>WrappedComponent(ResetScreen))
  Navigation.registerComponent(CONFIRM_RESET_SCREEN,()=>WrappedComponent(ConfirmResetScreen))
  Navigation.registerComponent(CONFIRM_LOGIN_SCREEN,()=>WrappedComponent(ConfirmLoginScreen))
  Navigation.registerComponent(SUPPORT_SCREEN,()=>WrappedComponent(SupportScreen))
  Navigation.registerComponent(PASSCODE_SCREEN,()=>WrappedComponent(PasscodeScreen))
  Navigation.registerComponent(PASSCODE_AUTH_SCREEN,()=>WrappedComponent(PasscodeAuthScreen))
  Navigation.registerComponent(CHANGE_PASSWORD,()=>WrappedComponent(ChangePasswordScreen))
  Navigation.registerComponent(SECURITY_SCREEN,()=>WrappedComponent(SecurityScreen))
  Navigation.registerComponent(FA_CODE_EMAIL,()=>WrappedComponent(FaCodeEmail))
  Navigation.registerComponent(ENABLE_2FA_GG,()=>WrappedComponent(Enable2FaGG))
  Navigation.registerComponent(BACK_UP_KEY,()=>WrappedComponent(BackupKeyScreen))
  Navigation.registerComponent(GUIDE_SET_UP_GG,()=>WrappedComponent(GuideSetupGG))
  Navigation.registerComponent(SET_UP_CODE,()=>WrappedComponent(SetupCodeScreen))
  Navigation.registerComponent(SWAP_CONFIRM_SCREEN,()=>WrappedComponent(SwapConfirmScreen))
  Navigation.registerComponent(HISTORY_SWAP_SCREEN,()=>WrappedComponent(HistorySwapScreen))
  Navigation.registerComponent(CALENDAR_SCREEN,()=>WrappedComponent(CalendarScreen))
  Navigation.registerComponent(INFO_COIN_SCREEN,()=>WrappedComponent(InfoCoinScreen))
  Navigation.registerComponent(INFO_FIAT_SCREEN,()=>WrappedComponent(InfoFiatScreen))
  Navigation.registerComponent(DEPOSIT_COIN_SCREEN,()=>WrappedComponent(DepositCoinScreen))
  Navigation.registerComponent(DEPOSIT_FIAT_SCREEN,()=>WrappedComponent(DepositFiatScreen))
  Navigation.registerComponent(HISTORY_DEPOSIT_FIAT_SCREEN,()=>WrappedComponent(HistoryDepositFiat))
  Navigation.registerComponent(HISTORY_DEPOSIT_COIN_SCREEN,()=>WrappedComponent(HistoryDepositCoin))
  Navigation.registerComponent(WITHDRAW_COIN_SCREEN,()=>WrappedComponent(WithdrawCoinScreen))
  Navigation.registerComponent(WITHDRAW_FIAT_SCREEN,()=>WrappedComponent(WithdrawFiatScreen))
  Navigation.registerComponent(TRANSACTION_HISTORY,()=>WrappedComponent(HistoryTransactions))

//modal screen
  Navigation.registerComponent(ALERT_NOTICE_PASSWORD,()=>WrappedComponent(AlertNoticePassword))
  Navigation.registerComponent(PICKER_SEARCH,()=>WrappedComponent(PickerSearchBox))
  Navigation.registerComponent(ALERT_ACCOUNT_ACTIVE,()=>WrappedComponent(AlertAccountActive))
  Navigation.registerComponent(MODAL_ALERT,()=>WrappedComponent(ModalAlert))
  

}
