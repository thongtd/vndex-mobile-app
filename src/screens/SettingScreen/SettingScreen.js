import React, {useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import Container from '../../components/Container';
import HeaderWalletScreen from '../WalletScreen/components/HeaderWalletScreen';
import HeaderSettingScreen from './components/HeaderSettingScreen';
import ItemSetting from '../../components/Item/ItemSetting';
import icons from '../../configs/icons';
import {
  get,
  hiddenTabbar,
  hiddenModal,
  checkLang,
  createAction,
  size,
  removeTokenAndUserInfo,
} from '../../configs/utils';
import {constant} from '../../configs/constant';
import {useDispatch, useSelector} from 'react-redux';
import {
  pushSingleScreenApp,
  SUPPORT_SCREEN,
  PICKER_SEARCH,
  PASSCODE_SCREEN,
  CHANGE_PASSWORD,
  SECURITY_SCREEN,
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
import {dismissAllModal} from '../../navigation/Navigation';
import Button from '../../components/Button/Button';
import {SvgXml} from 'react-native-svg';
// import ButtonSubmitClose from 'components/Button/ButtonSubmitClose';
import St1 from 'assets/svg/st1.svg';
import St2 from 'assets/svg/st2.svg';
import St3 from 'assets/svg/st3.svg';
import St4 from 'assets/svg/st4.svg';
import St5 from 'assets/svg/st5.svg';
import St6 from 'assets/svg/st6.svg';
import St7 from 'assets/svg/st7.svg';
import {
  GET_CRYPTO_WALLET_SUCCESS,
  GET_FIAT_WALLET_SUCCESS,
} from '../../redux/modules/market/actions';

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
  const [Lang, setLang] = useState(checkLanguage(checkLang(langGlobal)));
  const [IsSwitch, setIsSwitch] = useState(false);
  const handleLogout = () => {
    dispatcher(createAction(GET_FIAT_WALLET_SUCCESS, []));
    dispatcher(createAction(GET_CRYPTO_WALLET_SUCCESS, []));

    removeTokenAndUserInfo();
    dispatcher(createAction(CHECK_STATE_LOGIN, false));
    dispatcher(createAction(SET_USER_INFO, null));
    // dispatcher(createAction(GET_ASSET_CRYPTO_WALLETS_SUCCESS),[])
    // dispatcher(createAction(GET_ASSET_FIAT_WALLET_SUCCESS),[])
  };
  const checkDatalogged = (lang = '', currency = '') => {
    if (logged) {
      const dtLogged = [
        {textLeft: 'Identity verification', iconLeft: <SvgXml xml={St1}/>, iconRight: true},
        {
          textLeft: 'Change Password',
          iconLeft: <SvgXml xml={St2}/>,
          iconRight: true,
          onPress: onChangePassword,
        },
        {
          textLeft: 'Security',
          iconLeft: <SvgXml xml={St3}/>,
          iconRight: true,
          onPress: onSecurity,
          isBorder: true,
        },
        {
          textLeft: 'Refferal',
          iconLeft: <SvgXml xml={St4}/>,
          textRight: 'VND',
          onPress: onCurrency,
        },
        {
          textLeft: 'Languages',
          iconLeft: <SvgXml xml={St5}/>,
          textRight: lang,
          onPress: onLanguage,
          isBorder: true,
        },
        {
          textLeft: 'Support',
          iconLeft: <SvgXml xml={St6}/>,
          iconRight: true,
          onPress: onSupport,
        },
        {
          textLeft: 'About',
          iconLeft: <SvgXml xml={St7}/>,
          textRight: `V ${constant.GOOGLE_VERSION}`,
        },
      ];
      return dtLogged;
    } else {
      const dataNoLogged = [
        // { textLeft: "passcode", iconLeft: icons.passCode, hasSwitch: true, onValueChange: changeSwitchData, isBorder: true },
        {
          textLeft: 'Languages',
          iconLeft: <SvgXml xml={St5} />,
          textRight: lang,
          onPress: onLanguage,
          isBorder: true,
        },
        {
          textLeft: 'Support',
          iconLeft: <SvgXml xml={St6}/>,
          iconRight: true,
          onPress: onSupport,
        },
        {
          textLeft: 'About',
          iconLeft: <SvgXml xml={St7}/>,
          textRight: `V ${constant.GOOGLE_VERSION}`,
        },
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
  const changeSwitchData = () => {
    pushSingleScreenApp(componentId, PASSCODE_SCREEN);
  };
  const onSupport = () => {
    pushSingleScreenApp(componentId, SUPPORT_SCREEN, hiddenTabbar());
  };
  const onChangePassword = () => {
    pushSingleScreenApp(componentId, CHANGE_PASSWORD);
  };
  const onSecurity = () => {
    pushSingleScreenApp(componentId, SECURITY_SCREEN);
  };
  const onLanguage = () => {
    let propsData = {
      data: [
        {name: 'Tiếng Việt', value: 'vi-VN'},
        {name: 'English', value: 'en-US'},
      ],
      renderItem: ({item, key}) => {
        return (
          <ItemList
            onPress={() => handleActiveLang(item)}
            value={item.name}
            checked={item.value === Lang.value}
          />
        );
      },
      keywords: ['name'],
    };

    Navigation.showModal(hiddenModal(PICKER_SEARCH, propsData, false));
  };
  const handleActiveLang = langActive => {
    setLang(langActive);
    dispatcher(createAction(LANGUAGES, langActive.value));
    i18n.locale = langActive.value;
    switchLangTabbar();
    dismissAllModal();
  };
  const onCurrency = () => {
    let propsData = {
      data: [{name: 'VND', value: 'VND'}, {name: 'IDR', value: 'IDR'}],
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

    Navigation.showModal(hiddenModal(PICKER_SEARCH, propsData, false));
  };
  const handleActiveCurrency = currency => {
    dismissAllModal();
  };
  return (
    <Container
      space={5}
      isTopBar={false}
      customTopBar={<HeaderSettingScreen componentId={componentId} />}>
      {DataSetting.map((item, index) => {
        return (
          <ItemSetting
            IsSwitch={IsSwitch}
            key={index}
            textLeft={get(item, 'textLeft').t()}
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
      {logged && <Button
        textSubmit={'Logout'.t()}
        onSubmit={handleLogout}
        spaceVertical={25}
        isSubmit
        isButtonCircle={false}
      />}
    </Container>
  );
};

export default SettingScreen;
