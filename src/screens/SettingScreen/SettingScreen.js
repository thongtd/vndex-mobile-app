import React, {useState, useEffect} from 'react';
import {Text, Clipboard, View, TouchableOpacity} from 'react-native';
import Container from '../../components/Container';
import HeaderWalletScreen from '../WalletScreen/components/HeaderWalletScreen';
import HeaderSettingScreen from './components/HeaderSettingScreen';
import ItemSetting from '../../components/Item/ItemSetting';
import icons from '../../configs/icons';
import {useActionsAuthen} from '../../redux/modules/authentication';

import {
  get,
  hiddenTabbar,
  hiddenModal,
  checkLang,
  createAction,
  size,
  removeTokenAndUserInfo,
  toast,
} from '../../configs/utils';
import {constant, fontSize} from '../../configs/constant';
import {useDispatch, useSelector} from 'react-redux';
import {
  pushSingleScreenApp,
  SUPPORT_SCREEN,
  PICKER_SEARCH,
  PASSCODE_SCREEN,
  CHANGE_PASSWORD,
  SECURITY_SCREEN,
  LOGIN_SCREEN,
  KYC_SCREEN,
  REF_SCREEN,
  ACCOUNTP2P_SCREEN,
  PAYMENT_METHOD_SCREEN,
  HISTORY_LOGIN_SCREEN,
  UPDATE_ACCOUNT_SCREEN,
  LIST_UPDATE_ACCOUNT_SCREEN,
} from '../../navigation';
import {Navigation} from 'react-native-navigation';
import i18n from 'react-native-i18n';
import ItemList from '../../components/Item/ItemList';
import {
  CHECK_STATE_LOGIN,
  LANGUAGES,
  SET_USER_INFO,
} from '../../redux/modules/authentication/actions';
import {switchLangTabbar} from '../../navigation/helpers';
import {storageService} from '../../services/storage.service';
import {
  dismissAllModal,
  pop,
  pushSingleHiddenTopBarApp,
  showModal,
} from '../../navigation/Navigation';
import Button from '../../components/Button/Button';
// import ButtonSubmitClose from 'components/Button/ButtonSubmitClose';
import St1 from 'assets/svg/st1.svg';
import St2 from 'assets/svg/st2.svg';
import St3 from 'assets/svg/st3.svg';
import St4 from 'assets/svg/st4.svg';
import St5 from 'assets/svg/st5.svg';
import St6 from 'assets/svg/st6.svg';
import St7 from 'assets/svg/st7.svg';
import Close from 'assets/svg/ic_close.svg';
import Accp2p from 'assets/svg/accp2p.svg';
import CopyIC from 'assets/svg/ic_copy.svg';

import PaymentMethod from 'assets/svg/paymentMethod.svg';
import TickIc from 'assets/svg/tick.svg';
import Logo from 'assets/svg/Logo.svg';
import {
  GET_CRYPTO_WALLET_SUCCESS,
  GET_FIAT_WALLET_SUCCESS,
  GET_ASSET_CRYPTO_WALLETS_SUCCESS,
} from '../../redux/modules/market/actions';
import TextFnx from '../../components/Text/TextFnx';
import colors from '../../configs/styles/colors';
import {StyleSheet} from 'react-native';
import ButtonIcon from '../../components/Button/ButtonIcon';
import Layout from '../../components/Layout/Layout';
import FastImage from 'react-native-fast-image';
import Image from '../../components/Image/Image';

const checkLanguage = lang => {
  if (lang === 'vi-VN') {
    return {name: 'Tiếng Việt', value: 'vi-VN'};
  } else if (lang === 'en-US') {
    return {name: 'English', value: 'en-US'};
  }
};
const SettingScreen = ({componentId}) => {
  const dispatcher = useDispatch();
  const logged = useSelector(state => state.authentication.logged);
  const isPasscode = useSelector(state => state.authentication.isPasscode);
  const langGlobal = useSelector(state => state.authentication.lang);
  console.log(langGlobal, 'langGlobal');
  const userInfo = useSelector(state => state.authentication.userInfo);
  const [Lang, setLang] = useState(checkLang(langGlobal));
  const [IsSwitch, setIsSwitch] = useState(false);
  const handleLogout = () => {
    dispatcher(createAction(GET_FIAT_WALLET_SUCCESS, []));
    dispatcher(createAction(GET_CRYPTO_WALLET_SUCCESS, []));

    removeTokenAndUserInfo();
    dispatcher(createAction(CHECK_STATE_LOGIN, false));
    dispatcher(createAction(SET_USER_INFO, null));
    dispatcher(createAction(GET_ASSET_CRYPTO_WALLETS_SUCCESS), []);
    pop(componentId);
    // dispatcher(createAction(GET_ASSET_FIAT_WALLET_SUCCESS),[])
  };
  const hanldeCopy = url => {
    Clipboard.setString(url);
    toast('COPY_TO_CLIPBOARD'.t());
  };
  const handleLogin = () => {
    return pushSingleHiddenTopBarApp(componentId, LOGIN_SCREEN);
  };
  const checkDatalogged = (lang = '', currency = '') => {
    if (logged) {
      const dtLogged = [
        {
          title: 'Individual',
        },
        {
          textLeft: 'Identity verification',
          iconLeft: <St1 />,
          iconRight: true,
          onPress: onKyc,
        },
        {
          textLeft: 'Upgrade your account',
          iconLeft: <St2 />,
          iconRight: true,
          onPress: onUpdateAccount,
        },
        {
          textLeft: 'Security',
          iconLeft: <St3 />,
          iconRight: true,
          onPress: onSecurity,
          isBorder: true,
        },
        {
          title: 'Account',
        },
        {
          textLeft: 'Account P2P',
          iconLeft: <Accp2p />,
          iconRight: true,
          onPress: onAccP2p,
        },
        {
          textLeft: 'Refferal',
          iconLeft: <St4 />,
          iconRight: true,
          onPress: onRef,
        },
        {
          textLeft: 'Payment method',
          iconLeft: <PaymentMethod />,
          iconRight: true,
          onPress: onPaymentMethod,
        },
        {
          title: 'SETTING',
        },
        // {
        //   textLeft: 'History Login',
        //   iconLeft: <HistoryLogin />,
        //   iconRight: true,
        //   onPress: onHistoryLogin,
        //   isBorder: true,
        // },
        {
          textLeft: 'Support',
          iconLeft: <St6 />,
          iconRight: true,
          onPress: onSupport,
        },
      ];
      return dtLogged;
    } else {
      const dataNoLogged = [
        // { textLeft: "passcode", iconLeft: icons.passCode, hasSwitch: true, onValueChange: changeSwitchData, isBorder: true },

        {
          textLeft: 'Support',
          iconLeft: <St6 />,
          iconRight: true,
          onPress: onSupport,
        },
        // {
        //   textLeft: 'About',
        //   iconLeft: <St7 />,
        //   textRight: `V ${constant.GOOGLE_VERSION}`,
        // },
      ];
      return dataNoLogged;
    }
  };
  const [DataSetting, setDataSetting] = useState(
    checkDatalogged(get(Lang, 'name')),
  );
  useEffect(() => {
    setDataSetting(checkDatalogged(get(Lang, 'name')));
    return () => {};
  }, [logged, Lang]);
  useEffect(() => {
    if (isPasscode) {
      setIsSwitch(true);
    } else {
      setIsSwitch(false);
    }
  }, [isPasscode]);
  const onKyc = () => {
    pushSingleScreenApp(componentId, KYC_SCREEN);
  };
  const onAccP2p = () => {
    pushSingleScreenApp(componentId, ACCOUNTP2P_SCREEN);
  };
  const onPaymentMethod = () => {
    pushSingleScreenApp(componentId, PAYMENT_METHOD_SCREEN);
  };

  const onSupport = () => {
    pushSingleScreenApp(componentId, SUPPORT_SCREEN, hiddenTabbar());
  };
  const onUpdateAccount = () => {
    // pushSingleScreenApp(componentId, UPDATE_ACCOUNT_SCREEN);
    pushSingleScreenApp(componentId, LIST_UPDATE_ACCOUNT_SCREEN);
  };
  const onSecurity = () => {
    pushSingleScreenApp(componentId, SECURITY_SCREEN);
  };
  const onRef = () => {
    pushSingleScreenApp(componentId, REF_SCREEN);
  };
  // const onLanguage = () => {
  //   let propsData = {
  //     data: [
  //       {name: 'Tiếng Việt', value: 'vi-VN'},
  //       {name: 'English', value: 'en-US'},
  //     ],
  //     renderItem: ({item, key}) => {
  //       return (
  //         <ItemList
  //           onPress={() => handleActiveLang(item)}
  //           value={item.name}
  //           checked={item.value === Lang.value}
  //         />
  //       );
  //     },
  //     keywords: ['name'],
  //   };

  //   Navigation.showModal(hiddenModal(PICKER_SEARCH, propsData, false));
  // };
  const userKyc = useSelector(state => state.authentication.userKyc);
  const handleActiveLang = langActive => {
    setLang(langActive);
    dispatcher(createAction(LANGUAGES, langActive));
    i18n.locale = langActive;
    switchLangTabbar();
    // dismissAllModal();
  };
  const onCurrency = () => {
    let propsData = {
      data: [
        {name: 'VND', value: 'VND'},
        {name: 'IDR', value: 'IDR'},
      ],
      renderItem: ({item, key}) => {
        return (
          <ItemList
            onPress={() => handleActiveCurrency(item)}
            value={item.name}
            checked={item.value === Lang.value}
          />
        );
      },
      keywords: ['name'],
    };
    showModal(PICKER_SEARCH, propsData, false);
    // Navigation.showModal(hiddenModal(PICKER_SEARCH, propsData, false));
  };
  const handleActiveCurrency = currency => {
    dismissAllModal();
  };
  // useEffect(() => {

  //   return () => {

  //   }
  // }, [])
  useActionsAuthen().handleGetUserKyc(get(userInfo, 'id'));
  return (
    <Container
      space={5}
      componentId={componentId}
      isTopBar={false}
      title={'Account'.t()}
      isScroll>
      <Layout space={10} isSpaceBetween>
        <TouchableOpacity onPress={() => pop(componentId)}>
          <Layout type="row" isLineCenter>
            <Close />
            <TextFnx weight="bold">{'CLOSE'.t()}</TextFnx>
          </Layout>
        </TouchableOpacity>
        <Layout isLineCenter type="row">
          <Button
            onTitle={() => {}}
            weight={'bold'}
            size={fontSize.f16}
            color={
              Lang == 'en-US'
                ? colors.app.yellowHightlight
                : colors.app.textContentLevel3
            }
            isTitle
            title={'EN'}
          />
          <Button
            onTitle={() => handleActiveLang('vi-VN')}
            spaceHorizontal={20}
            weight={'bold'}
            size={fontSize.f16}
            color={
              Lang == 'vi-VN'
                ? colors.app.yellowHightlight
                : colors.app.textContentLevel3
            }
            isTitle
            title={'VI'}
          />
        </Layout>
      </Layout>
      {logged ? (
        <>
          <Layout isLineCenter space={15}>
            <View
              style={{
                paddingRight: 15,
              }}>
              <Image
                source={icons.avatar}
                style={{
                  width: 60,
                  height: 60,
                }}
              />
            </View>
            <View>
              <View style={stylest.flexRow}>
                <TextFnx
                  color={colors.app.lightWhite}
                  weight="bold"
                  size={fontSize.f18}>
                  {get(userInfo, 'email')}
                </TextFnx>
              </View>
              <View style={stylest.flexRow}>
                <TextFnx color={colors.description}>
                  {'Referral code'.t()}
                </TextFnx>
                <TextFnx color={colors.app.yellowHightlight} spaceLeft={5}>
                  {get(userInfo, 'customerMetaData.referralId')}
                </TextFnx>
                <ButtonIcon
                  style={{
                    height: 25,
                  }}
                  iconComponent={<CopyIC />}
                  color={colors.highlight}
                  onPress={() =>
                    hanldeCopy(get(userInfo, 'customerMetaData.referralId'))
                  }
                />
              </View>
              <View
                style={{
                  backgroundColor: get(
                    userInfo,
                    'customerMetaData.isKycUpdated',
                  )
                    ? '#28382E'
                    : '#361E21',
                  // paddingHorizontal:15,
                  paddingVertical: 2,
                  // marginLeft:15,
                  borderRadius: 5,
                  marginTop: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {get(userInfo, 'customerMetaData.isKycUpdated') ? (
                  <TextFnx color={colors.app.buy}>Đã xác minh</TextFnx>
                ) : (
                  <TextFnx color={colors.app.sell}>Chưa xác minh</TextFnx>
                )}
              </View>
            </View>
          </Layout>
          {size(get(userKyc, 'identityUserCustomerTypes')) >0 && get(userKyc, 'identityUserCustomerTypes').map((item, index) => {
            if (get(item, 'approved')) {
              return (
                <Layout space={4} isLineCenter>
                  <TickIc />
                  <TextFnx spaceLeft={5}>
                    {get(item, 'customerType.name')}
                  </TextFnx>
                </Layout>
              );
            }
            // if (get(item, 'customerTypeId') == get(it, 'id')) {
            //   it.approved = get(item, 'approved');
            // }
          })}
        </>
      ) : (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 30,
          }}>
          <Logo />
        </View>
      )}

      {DataSetting.map((item, index) => {
        return (
          <ItemSetting
            IsSwitch={IsSwitch}
            key={index}
            title={get(item, 'title') && get(item, 'title').t()}
            textLeft={get(item, 'textLeft') && get(item, 'textLeft').t()}
            iconLeftSvg={get(item, 'iconLeft')}
            iconRight={get(item, 'iconRight')}
            textRight={get(item, 'textRight')}
            hasSwitch={get(item, 'hasSwitch')}
            isBorder={get(item, 'isBorder')}
            onPress={get(item, 'onPress')}
            onValueChange={get(item, 'onValueChange')}
          />
        );
      })}
      <Button
        colorTitleClose={colors.app.sell}
        textClose={logged ? 'Logout'.t() : 'LOGIN'.t()}
        onClose={logged ? handleLogout : handleLogin}
        spaceTop={20}
        isClose
        isButtonCircle={false}
      />
      <Layout isCenter>
        <TextFnx color={colors.app.textDisabled}>Version 1.1.5</TextFnx>
      </Layout>
    </Container>
  );
};

const stylest = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default SettingScreen;
