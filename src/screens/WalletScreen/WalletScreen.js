import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {Text, View, StyleSheet, BackHandler} from 'react-native';
import TopBarWallet from '../../components/TopBarWallet';
import CheckBox from '@react-native-community/checkbox';
import Container from '../../components/Container';
import colors from '../../configs/styles/colors';
import {TextWhite} from '../../components';
import TextSeparators from '../../components/Text/TextSeparators';
import ButtonTypeWallet from '../../components/Button/ButtonTypeWallet';
import I18n from 'react-native-i18n';
import {Navigation} from 'react-native-navigation';
import {switchLangTabbar} from '../../navigation/helpers';
import SearchInput from './components/SearchInput';
import ButtonSortSymbol from './components/ButtonSortSymbol';
import LayoutSpaceBetween from '../../components/LayoutSpaceBetween';
import TextFnx from '../../components/Text/TextFnx';
import HeaderWalletScreen from './components/HeaderWalletScreen';
import ListCoin from './components/ListCoin';
import ListFiat from './components/ListFiat';
import Input from '../../components/Input';
import Button from '../../components/Button/Button';
import {TouchablePreview} from 'react-native-navigation/lib/dist/src/adapters/TouchablePreview';
import {
  pushSingleScreenApp,
  LOGIN_SCREEN,
  PASSCODE_SCREEN,
  PASSCODE_AUTH_SCREEN,
  TRANSACTION_HISTORY,
} from '../../navigation';
import {IdNavigation} from '../../configs/constant';
import {
  hiddenTabbar,
  listenerEventEmitter,
  removeEventEmitter,
  createAction,
  get,
  emitEventEmitter,
  backHandler,
  resetScreenGlobal,
} from '../../configs/utils';
import useAppState from 'react-native-appstate-hook';
import {showModal} from '../../navigation/Navigation';
import {useDispatch, useSelector} from 'react-redux';
import GuideSetupGG from '../SecurityScreen/GuideSetupGG';
import SignalRService from '../../services/signalr.service';
import {orderBy} from 'lodash';
import {
  GET_ASSET_CRYPTO_WALLETS_SUCCESS,
  GET_ASSET_FIAT_WALLET_SUCCESS,
  GET_COIN_BY_TYPE_COIN_SUCCESS,
  GET_COIN_BY_TYPE_FIATS_SUCCESS,
} from '../../redux/modules/wallet/actions';
import DepsitSvg from 'assets/svg/deposit.svg';
import WithdrawSvg from 'assets/svg/withdraw.svg';
const WalletScreen = ({componentId}) => {
  const logged = useSelector(state => state.authentication.logged);
  const [i18n, setI18n] = useState(I18n);
  const [isCheck, setCheck] = useState(true);
  const [Timer, setTimer] = useState(60);
  const langGlobal = useSelector(state => state.authentication.lang);
  const isPasscode = useSelector(state => state.authentication.isPasscode);
  const [IsActive, setIsActive] = useState('C');
  const [isSort, setSort] = React.useState(false);
  const cryptoWallet = useSelector(state => state.market.cryptoWallet);
  const fiatsWallet = useSelector(state => state.wallet.fiatsWallet);
  const dispatcher = useDispatch();
  const [HiddenCrypto, setHiddenCrypto] = useState(
    cryptoWallet.filter(
      (item, index) => get(item, 'available') + get(item, 'pending') !== 0,
    ),
  );
  
  useEffect(() => {
    const navigationButtonEventListener = Navigation.events().registerNavigationButtonPressedListener(({ buttonId }) => {
      if(buttonId == IdNavigation.PressIn.historyTransaction){
        pushSingleScreenApp(componentId,TRANSACTION_HISTORY,null, {
          topBar:{
            rightButtons:[{
              id: IdNavigation.PressIn.filterTransaction,
              icon:require("assets/icons/Filter.png")
            }]
          }
        })
      }
    });
    return () => {
      navigationButtonEventListener.remove();
    }
  }, [])
  // const fiatsWalletType = useSelector(state => state.wallet.fiatsWalletType);
  // const coinsWalletType = useSelector(state => state.wallet.coinsWalletType);
  useEffect(() => {
    // backHandler(() => resetScreenGlobal());
    switchLangTabbar();
    // if (isPasscode && Timer == 60) {
    //   showModal(PASSCODE_AUTH_SCREEN);
    // }
  }, []);
  useEffect(() => {
    let availableZeroCrypto = cryptoWallet.filter(
      (item, index) => get(item, 'available') + get(item, 'pending') !== 0,
    );
    // let availableZeroFiat = fiatsWallet.filter(
    //   (item, index) => get(item, 'available') + get(item, 'pending') !== 0,
    // );
    setHiddenCrypto(availableZeroCrypto);
    // setHiddenFiat(availableZeroFiat);
  }, [cryptoWallet]);
  

  const onHidden = () => {
    setCheck(!isCheck);
  };
  return (
    <Container
      
      isTopBar={true}
      title={'Property Overview'.t()}
      customTopBar={<HeaderWalletScreen componentId={componentId} />}>
      <SignalRService />
      <Button
        spaceVertical={20}
        isReverse
        isSubmit
        isClose
        textSubmit={"DEPOSIT".t()}
        textClose={"WITHDRAW".t()}
        iconLeftSubmit={<DepsitSvg />}
        iconLeftClose={<WithdrawSvg />}
      />
      <View style={stylest.blockTopWallet}>
        {logged && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <CheckBox
              style={{height: 20, width: 20}}
              //   boxType="square"
              onTintColor={colors.iconButton}
              onCheckColor={colors.iconButton}
              value={isCheck}
              onValueChange={onHidden}
            />
            <TextFnx
              spaceLeft={10}
              color={colors.text}
              value={`${'HIDE_BALANCE'.t()} `}
            />
          </View>
        )}
        <SearchInput />
      </View>

      {/* <LayoutSpaceBetween style={stylest.spaceSorting}>
        <ButtonSortSymbol onCheck={() => onSort(logged)} isCheck={isSort} />
        <TextFnx color={colors.description} value={'AVAILABLE'.t()} />
      </LayoutSpaceBetween> */}

      <ListCoin
        componentId={componentId}
        isCheck={isCheck}
        data={HiddenCrypto}
      />
    </Container>
  );
};
const stylest = StyleSheet.create({
  blockTopWallet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 50,
    alignItems: 'center',
  },
  spaceSorting: {paddingVertical: 5},
});
export default WalletScreen;
