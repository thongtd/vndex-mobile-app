import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {Text, View, StyleSheet, BackHandler} from 'react-native';
import TopBarWallet from '../../components/TopBarWallet';
import Container from '../../components/Container';
import colors from '../../configs/styles/colors';
import {TextWhite} from '../../components';
import TextSeparators from '../../components/Text/TextSeparators';
import ButtonTypeWallet from '../../components/Button/ButtonTypeWallet';
import I18n from 'react-native-i18n';
import {Navigation} from 'react-native-navigation';
import {switchLangTabbar} from '../../navigation/helpers';
import SearchInput from './components/SearchInput';
import CheckBox from 'react-native-check-box';
import ButtonSortSymbol from './components/ButtonSortSymbol';
import LayoutSpaceBetween from '../../components/LayoutSpaceBetween';
import TextFnx from '../../components/Text/TextFnx';
import HeaderWalletScreen from './components/HeaderWalletScreen';
import ListCoin from './components/ListCoin';
import ListFiat from './components/ListFiat';
import Input from '../../components/Input';
import Button from '../../components/Button/Button';

import {
  pushSingleScreenApp,
  LOGIN_SCREEN,
  PASSCODE_SCREEN,
  PASSCODE_AUTH_SCREEN,
  TRANSACTION_HISTORY,
  PICKER_SEARCH,
  DEPOSIT_COIN_SCREEN,
  WITHDRAW_COIN_SCREEN,
} from '../../navigation';
import {IdNavigation, spacingApp} from '../../configs/constant';
import {
  hiddenTabbar,
  listenerEventEmitter,
  removeEventEmitter,
  createAction,
  get,
  emitEventEmitter,
  backHandler,
  resetScreenGlobal,
  getPropsData,
} from '../../configs/utils';
import useAppState from 'react-native-appstate-hook';
import {dismissAllModal, showModal} from '../../navigation/Navigation';
import {useDispatch, useSelector} from 'react-redux';
import GuideSetupGG from '../SecurityScreen/GuideSetupGG';
import SignalRService from '../../services/signalr.service';
import {orderBy} from 'lodash';
import DepsitSvg from 'assets/svg/deposit.svg';
import WithdrawSvg from 'assets/svg/withdraw.svg';

import {
  GET_ASSET_CRYPTO_WALLETS_SUCCESS,
  GET_ASSET_FIAT_WALLET_SUCCESS,
  GET_COIN_BY_TYPE_COIN_SUCCESS,
  GET_COIN_BY_TYPE_FIATS_SUCCESS,
} from '../../redux/modules/wallet/actions';
const WalletScreen = ({componentId}) => {
  const logged = useSelector(state => state.authentication.logged);
  const [i18n, setI18n] = useState(I18n);
  const [isCheck, setCheck] = useState(true);
  const [CurrencyActive, setCurrencyActive] = useState('');
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
  const [HiddenFiat, setHiddenFiat] = useState(
    fiatsWallet.filter(
      (item, index) => get(item, 'available') + get(item, 'pending') !== 0,
    ),
  );
  const fiatsWalletType = useSelector(state => state.wallet.fiatsWalletType);
  const coinsWalletType = useSelector(state => state.wallet.coinsWalletType);
  useEffect(() => {
    backHandler(() => resetScreenGlobal());
    switchLangTabbar();
    if (isPasscode && Timer == 60) {
      showModal(PASSCODE_AUTH_SCREEN);
    }
  }, []);
  useEffect(() => {
    let availableZeroCrypto = cryptoWallet.filter(
      (item, index) => get(item, 'available') + get(item, 'pending') !== 0,
    );
    let availableZeroFiat = fiatsWallet.filter(
      (item, index) => get(item, 'available') + get(item, 'pending') !== 0,
    );
    setHiddenCrypto(availableZeroCrypto);
    setHiddenFiat(availableZeroFiat);
  }, [cryptoWallet, fiatsWallet]);
  const {appState} = useAppState({
    onChange: newAppState => {},
    onForeground: () => console.log('App went to Foreground'),
    onBackground: () => console.log('App went to background'),
  });
  useEffect(() => {
    listenerEventEmitter('timer', timer => {
      setTimer(timer - 1);
    });
    if (appState === 'background') {
      if (isPasscode && Timer == 60) {
        showModal(PASSCODE_AUTH_SCREEN);
      }
    }
    return () => {
      removeEventEmitter('timer');
    };
  }, [appState, isPasscode]);

  const onSelectCoin = isDeposit => {
    let data = orderBy(cryptoWallet, ['symbol'], ['asc']);

    let propsData = getPropsData(
      data,
      'images',
      'symbol',
      CurrencyActive,
      item => handleActive(item, isDeposit),
    );
    showModal(PICKER_SEARCH, propsData);
  };
  useEffect(() => {
    const navigationButtonEventListener =
      Navigation.events().registerNavigationButtonPressedListener(
        ({buttonId}) => {
          if (buttonId == IdNavigation.PressIn.historyTransaction) {
            pushSingleScreenApp(componentId, TRANSACTION_HISTORY, null, {
              topBar: {
                rightButtons: [
                  {
                    id: IdNavigation.PressIn.filterTransaction,
                    icon: require('assets/icons/Filter.png'),
                  },
                ],
              },
            });
          }
        },
      );
    return () => {
      navigationButtonEventListener.remove();
    };
  }, []);
  const handleActive = (item, isDeposit) => {
    setCurrencyActive(get(item, 'symbol'));
    // setInfoCoin(item);
    if (isDeposit) {
      pushSingleScreenApp(componentId, DEPOSIT_COIN_SCREEN, {data: item});
    } else {
      pushSingleScreenApp(componentId, WITHDRAW_COIN_SCREEN, {data: item});
    }

    dismissAllModal();
    // InfoDataGlobal(item);
  };

  return (
    <Container
      onClickLeft={() => {}}
      isTopBar={false}
      customTopBar={<HeaderWalletScreen componentId={componentId} />}>
      <SignalRService />
     <View style={{
       flexDirection:"row",
       paddingBottom:20,
       marginTop:-30
     }}>
       <View style={{
         flex:0.5
       }}>

       </View>
       <View style={{
         flex:1.5
       }}>
       <Button
        isReverse
        onSubmit={() => onSelectCoin(false)}
        onClose={() => onSelectCoin(true)}
        isSubmit
        isClose
        textSubmit={'WITHDRAW'.t()}
        textClose={'DEPOSIT'.t()}
        colorTitleClose={colors.black}
        bgButtonColorSubmit={colors.app.yellowHightlight}
        bgButtonColorClose={colors.app.yellowHightlight}
        iconLeftSubmit={<WithdrawSvg />}
        iconLeftClose={<DepsitSvg />}
      />
       </View>
     </View>
      <View style={{
          backgroundColor:colors.app.backgroundLevel2,
          marginHorizontal:-spacingApp,
          paddingHorizontal:spacingApp,
          paddingTop:20,
          borderTopLeftRadius:15,
          borderTopRightRadius:15,
          flex:1
      }}>
        <SearchInput />

        <ListCoin
          componentId={componentId}
          isCheck={isCheck}
          data={HiddenCrypto}
        />
      </View>
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
