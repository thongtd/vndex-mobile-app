import React from 'react';
import {Navigation} from 'react-native-navigation';
import {Provider} from 'react-redux';
import {Text} from "react-native";
import { withNavigationProvider, NavigationProvider } from 'react-native-navigation-hooks'
import {
  SplashScreen,
  WalletScreen,
  SettingScreen,
  DappScreen,
  SwapScreen,
  LoginScreen,
  RegisterScreen
} from '../screens';
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
import { KYC_SCREEN, REF_SCREEN } from './Screens';
import {RefScreen}  from '../screens/RefScreen';
import { KycScreen } from '../screens/KycScreen';
import { ACCOUNTP2P_SCREEN, BUTTON_ICON_RIGHT_NAV, COMMAND_SCREEN, HISTORY_LOGIN_SCREEN, HOME_SCREEN, LIQUID_SWAP_SCREEN, PAYMENT_METHOD_SCREEN, REFFERAL_FRIEND_SCREEN, ROSE_DETAIL_SCREEN, SEND_REG_SCREEN, STEP2KYC_SCREEN, STEP3KYC_SCREEN, STO_SCREEN, TOTAL_COMMISSION_SCREEN, UPDATE_ACCOUNT_SCREEN } from '.';
import Step2Kyc from '../screens/KycScreen/Step2Kyc';
import Step3Kyc from '../screens/KycScreen/Step3Kyc';
import RoseDetails from '../screens/RefScreen/RoseDetails';
import ReferralFriends from '../screens/RefScreen/ReferralFriends';
import TotalCommisstion from '../screens/RefScreen/TotalCommisstion';
import AccountP2PScreen from '../screens/AccountP2P/AccountP2PScreen';
import PaymentMethodScreen from '../screens/PaymentMethod/PaymentMethodScreen';
import HistoryLoginScreen from '../screens/HistoryLogin/HistoryLoginScreen';
import VerifyRegScreen from '../screens/RegisterScreen/VerifyRegScreen';
import ButtonWithTitle from '../components/Button/ButtonWithTitle';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import CommandScreen from '../screens/CommandScreen/CommandScreen';
import StoScreen from '../screens/StoScreen/StoScreen';
import LiquidSwapScreen from '../screens/LiquidSwapScreen/LiquidSwapScreen';
import ButtonIcon from '../components/Button/ButtonIcon';
import UpdateAccountScreen from '../screens/UpdateAccountScreen/UpdateAccountScreen';
const WrapScreen = (ReduxScreen, store) => props => (
  <Provider store={store}>
    <ReduxScreen {...props} />
  </Provider>
);

export const registerScreens = store => {
    
  Navigation.registerComponent(DAPP_SCREEN, () => withNavigationProvider(WrapScreen(DappScreen, store)),()=>DappScreen);
  Navigation.registerComponent(SWAP_SCREEN, () => withNavigationProvider(WrapScreen(SwapScreen, store)),()=>SwapScreen);
  Navigation.registerComponent(SETTING_SCREEN, () => withNavigationProvider(WrapScreen(SettingScreen, store)),()=>SettingScreen);
  Navigation.registerComponent(WALLET_SCREEN, () => withNavigationProvider(WrapScreen(WalletScreen, store)),()=>WalletScreen);
  Navigation.registerComponent(SPLASH_SCREEN, () => withNavigationProvider(WrapScreen(SplashScreen, store)),()=>SplashScreen);
  Navigation.registerComponent(LOGIN_SCREEN,()=>withNavigationProvider(WrapScreen(LoginScreen, store)),()=>LoginScreen);
  Navigation.registerComponent(REF_SCREEN,()=>withNavigationProvider(WrapScreen(RefScreen, store)),()=>RefScreen);
  Navigation.registerComponent(ROSE_DETAIL_SCREEN,()=>withNavigationProvider(WrapScreen(RoseDetails, store)),()=>RoseDetails);
  Navigation.registerComponent(REFFERAL_FRIEND_SCREEN,()=>withNavigationProvider(WrapScreen(ReferralFriends, store)),()=>ReferralFriends);
  Navigation.registerComponent(TOTAL_COMMISSION_SCREEN,()=>withNavigationProvider(WrapScreen(TotalCommisstion, store)),()=>TotalCommisstion);
  Navigation.registerComponent(ACCOUNTP2P_SCREEN,()=>withNavigationProvider(WrapScreen(AccountP2PScreen, store)),()=>AccountP2PScreen);
  Navigation.registerComponent(PAYMENT_METHOD_SCREEN,()=>withNavigationProvider(WrapScreen(PaymentMethodScreen, store)),()=>PaymentMethodScreen);
  Navigation.registerComponent(HISTORY_LOGIN_SCREEN,()=>withNavigationProvider(WrapScreen(HistoryLoginScreen, store)),()=>HistoryLoginScreen);

  Navigation.registerComponent(KYC_SCREEN,()=>withNavigationProvider(WrapScreen(KycScreen, store)),()=>KycScreen);
  Navigation.registerComponent(STEP2KYC_SCREEN,()=>withNavigationProvider(WrapScreen(Step2Kyc, store)),()=>Step2Kyc);
  Navigation.registerComponent(STEP3KYC_SCREEN,()=>withNavigationProvider(WrapScreen(Step3Kyc, store)),()=>Step3Kyc);
  
  Navigation.registerComponent(REGISTER_SCREEN,()=>withNavigationProvider(WrapScreen(ConfirmScreen, store)),()=>ConfirmScreen);
  Navigation.registerComponent(CONFIRM_REGISTER_SCREEN,()=>withNavigationProvider(WrapScreen(ConfirmScreen, store)),()=>ConfirmScreen);
  Navigation.registerComponent(SEND_REG_SCREEN,()=>withNavigationProvider(WrapScreen(VerifyRegScreen, store)),()=>VerifyRegScreen);
  
  Navigation.registerComponent(RESET_SCREEN,()=>withNavigationProvider(WrapScreen(ResetScreen, store)),()=>ResetScreen);
  Navigation.registerComponent(CONFIRM_RESET_SCREEN,()=>withNavigationProvider(WrapScreen(ConfirmResetScreen, store)),()=>ConfirmResetScreen);
  Navigation.registerComponent(CONFIRM_LOGIN_SCREEN,()=>withNavigationProvider(WrapScreen(ConfirmLoginScreen, store)),()=>ConfirmLoginScreen);
  Navigation.registerComponent(SUPPORT_SCREEN,()=>withNavigationProvider(WrapScreen(SupportScreen, store)),()=>SupportScreen);
  Navigation.registerComponent(PASSCODE_SCREEN,()=>withNavigationProvider(WrapScreen(PasscodeScreen, store)),()=>PasscodeScreen);
  Navigation.registerComponent(PASSCODE_AUTH_SCREEN,()=>withNavigationProvider(WrapScreen(PasscodeAuthScreen, store)),()=>PasscodeAuthScreen);
  Navigation.registerComponent(CHANGE_PASSWORD,()=>withNavigationProvider(WrapScreen(ChangePasswordScreen, store)),()=>ChangePasswordScreen);
  Navigation.registerComponent(SECURITY_SCREEN,()=>withNavigationProvider(WrapScreen(SecurityScreen, store)),()=>SecurityScreen);
  Navigation.registerComponent(FA_CODE_EMAIL,()=>withNavigationProvider(WrapScreen(FaCodeEmail, store)),()=>FaCodeEmail);
  Navigation.registerComponent(ENABLE_2FA_GG,()=>withNavigationProvider(WrapScreen(Enable2FaGG, store)),()=>Enable2FaGG);
  Navigation.registerComponent(BACK_UP_KEY,()=>withNavigationProvider(WrapScreen(BackupKeyScreen, store)),()=>BackupKeyScreen);
  Navigation.registerComponent(GUIDE_SET_UP_GG,()=>withNavigationProvider(WrapScreen(GuideSetupGG, store)),()=>GuideSetupGG);
  Navigation.registerComponent(SET_UP_CODE,()=>withNavigationProvider(WrapScreen(SetupCodeScreen, store)),()=>SetupCodeScreen);
  Navigation.registerComponent(SWAP_CONFIRM_SCREEN,()=>withNavigationProvider(WrapScreen(SwapConfirmScreen, store)),()=>SwapConfirmScreen);
  Navigation.registerComponent(HISTORY_SWAP_SCREEN,()=>withNavigationProvider(WrapScreen(HistorySwapScreen, store)),()=>HistorySwapScreen);
  Navigation.registerComponent(CALENDAR_SCREEN,()=>withNavigationProvider(WrapScreen(CalendarScreen, store)),()=>CalendarScreen);
  Navigation.registerComponent(INFO_COIN_SCREEN,()=>withNavigationProvider(WrapScreen(InfoCoinScreen, store)),()=>InfoCoinScreen);
  Navigation.registerComponent(INFO_FIAT_SCREEN,()=>withNavigationProvider(WrapScreen(InfoFiatScreen, store)),()=>InfoFiatScreen);
  Navigation.registerComponent(DEPOSIT_COIN_SCREEN,()=>withNavigationProvider(WrapScreen(DepositCoinScreen, store)),()=>DepositCoinScreen);
  Navigation.registerComponent(DEPOSIT_FIAT_SCREEN,()=>withNavigationProvider(WrapScreen(DepositFiatScreen, store)),()=>DepositFiatScreen);
  Navigation.registerComponent(HISTORY_DEPOSIT_FIAT_SCREEN,()=>withNavigationProvider(WrapScreen(HistoryDepositFiat, store)),()=>HistoryDepositFiat);
  Navigation.registerComponent(HISTORY_DEPOSIT_COIN_SCREEN,()=>withNavigationProvider(WrapScreen(HistoryDepositCoin, store)),()=>HistoryDepositCoin);
  Navigation.registerComponent(WITHDRAW_COIN_SCREEN,()=>withNavigationProvider(WrapScreen(WithdrawCoinScreen, store)),()=>WithdrawCoinScreen);
  Navigation.registerComponent(WITHDRAW_FIAT_SCREEN,()=>withNavigationProvider(WrapScreen(WithdrawFiatScreen, store)),()=>WithdrawFiatScreen);
  Navigation.registerComponent(TRANSACTION_HISTORY,()=>withNavigationProvider(WrapScreen(HistoryTransactions, store)),()=>HistoryTransactions);
  Navigation.registerComponent(HOME_SCREEN,()=>withNavigationProvider(WrapScreen(HomeScreen, store)),()=>HomeScreen);
  Navigation.registerComponent(COMMAND_SCREEN,()=>withNavigationProvider(WrapScreen(CommandScreen, store)),()=>CommandScreen);
  Navigation.registerComponent(STO_SCREEN,()=>withNavigationProvider(WrapScreen(StoScreen, store)),()=>StoScreen);
  Navigation.registerComponent(LIQUID_SWAP_SCREEN,()=>withNavigationProvider(WrapScreen(LiquidSwapScreen, store)),()=>LiquidSwapScreen);
  Navigation.registerComponent(UPDATE_ACCOUNT_SCREEN,()=>withNavigationProvider(WrapScreen(UpdateAccountScreen, store)),()=>UpdateAccountScreen);
//modal screen
  Navigation.registerComponent(ALERT_NOTICE_PASSWORD,()=>withNavigationProvider(WrapScreen(AlertNoticePassword, store)),()=>AlertNoticePassword);
  Navigation.registerComponent(PICKER_SEARCH,()=>withNavigationProvider(WrapScreen(PickerSearchBox, store)),()=>PickerSearchBox);
  Navigation.registerComponent(ALERT_ACCOUNT_ACTIVE,()=>withNavigationProvider(WrapScreen(AlertAccountActive, store)),()=>AlertAccountActive);
  Navigation.registerComponent(MODAL_ALERT,()=>withNavigationProvider(WrapScreen(ModalAlert, store)),()=>ModalAlert);
  
//component screen
Navigation.registerComponent(BUTTON_ICON_RIGHT_NAV,()=>withNavigationProvider(WrapScreen(ButtonIcon, store)),()=>ButtonIcon);
};
