import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Platform} from 'react-native';
import {LayoutSplashScreen} from '../../components';
import WellCome from '../../components/WellCome';
import Input from '../../components/Input';
import TextFnx from '../../components/Text/TextFnx';
import colors from '../../configs/styles/colors';
import Button from '../../components/Button/Button';
import ButtonWithTitle from '../../components/Button/ButtonWithTitle';
import Icon from '../../components/Icon';
import ButtonFooterAuth from '../../components/Button/ButtonFooterAuth';
import {
  CHECK_LOGIN,
  useActionsAuthen,
} from '../../redux/modules/authentication/actions';
import {
  createAction,
  toast,
  size,
  validateEmail,
  jwtDecode,
  listenerEventEmitter,
  get,
} from '../../configs/utils';
import {useDispatch} from 'react-redux';
import {
  pushSingleScreenApp,
  REGISTER_SCREEN,
  LOGIN_SCREEN,
  RESET_SCREEN,
} from '../../navigation';
import {pop, pushSingleHiddenTopBarApp} from '../../navigation/Navigation';
import ButtonBack from '../../components/Button/ButtonBack';
import {constant, fontSize} from '../../configs/constant';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import {useActionsMarket} from '../../redux';
import publicIP from 'react-native-public-ip';
import {
  GET_ASSET_SUMARY,
  GET_WITHDRAW_COIN_LOG,
  GET_WITHDRAW_FIAT_LOG,
  GET_DEPOSIT_FIAT_LOG,
  GET_DEPOSIT_COIN_LOG,
} from '../../redux/modules/wallet/actions';
import Layout from '../../components/Layout/Layout';
const LoginScreen = ({componentId, hasBack}) => {
  const userInfo = useSelector(state => state.authentication.userInfo);
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [ipAddress, setipAddress] = useState('');
  const [disabled, setDisabled] = useState(false);
  const dispatcher = useDispatch();
  const marketWatch = useSelector(state => state.market.marketWatch);
  useEffect(() => {
    publicIP().then(ip => setipAddress(ip));
    // fetch("https://extreme-ip-lookup.com/json/")
    //         .then(response => response.json())
    //         .then(res => {
    //             console.log(res, "ip address");
    //             // AsyncStorage.setItem("ipAddress", res.query)
    //             // this.setState({
    //             //     ipAddress: res.query,
    //             //     city: res.city,
    //             //     userLocationRaw: res.region
    //             // }, () => console.log(this.state.ipAddress, this.state.city, this.state.userLocationRaw, "ipaddress2"))
    //         })
    const emitterData = listenerEventEmitter(
      constant.EVENTS_DEVICE.onAPI,
      () => {
        setDisabled(false);
      },
    );
    return () => {
      emitterData.remove();
    };
  }, []);
  useActionsMarket().handleGetCryptoWallet(get(userInfo, 'id'));
  useActionsMarket().handleGetFiatWallet(get(userInfo, 'id'));
  useEffect(() => {
    dispatcher(
      createAction(GET_ASSET_SUMARY, {
        UserId: get(userInfo, 'id'),
        marketWatch,
      }),
    );
    dispatcher(
      createAction(GET_WITHDRAW_COIN_LOG, {
        UserId: get(userInfo, 'id'),
        pageIndex: 1,
      }),
    );
    dispatcher(
      createAction(GET_WITHDRAW_FIAT_LOG, {
        UserId: get(userInfo, 'id'),
        pageIndex: 1,
      }),
    );
    dispatcher(
      createAction(GET_DEPOSIT_COIN_LOG, {
        UserId: get(userInfo, 'id'),
        pageIndex: 1,
      }),
    );
    dispatcher(
      createAction(GET_DEPOSIT_FIAT_LOG, {
        UserId: get(userInfo, 'id'),
        pageIndex: 1,
      }),
    );
  }, [userInfo, marketWatch]);
  const handleLogin = async () => {
    let dataLogin = {
      email,
      password,
      ipAddress,
      componentId,
    };
    let valid = validate();
    if (valid) {
      setDisabled(true);
      dispatcher(createAction(CHECK_LOGIN, dataLogin));
    }
  };

  const validate = () => {
    if (size(email) === 0 || size(password) === 0) {
      toast('Enter your Email and Password to login'.t());
      return false;
    } else if (!validateEmail(email)) {
      toast('PLEASE_INPUT_A_VALID_EMAIL'.t());
      return false;
    }
    return true;
  };
  return (
    <LayoutSplashScreen
      isLoadding={disabled}
      componentId={componentId}
      isLogin={true}
      title={"LOGIN".t()}>
      {/* <View style={[stylest.textRegister,{justifyContent:"flex-end"}]}>
        
        <ButtonWithTitle
          space={10}
          color={colors.highlight} onPress={() => pushSingleHiddenTopBarApp(componentId, REGISTER_SCREEN)} title={"REGISTER".t()} />
      </View> */}
      <View style={stylest.title}>
        <TextFnx
          spaceTop={Platform.OS == 'android' && 40}
          size={30}
          color={colors.tabbarActive}
          weight={'bold'}
          value={'LOGIN'.t()}
        />
      </View>
      <TextFnx
        size={fontSize.f12}
        spaceBottom={20}
        color={colors.app.textDisabled}>
        {'Please login with your Email account'.t()}
      </TextFnx>
      <Input
        onChangeText={text => setemail(text)}
        spaceVertical={10}
        keyboardType={'email-address'}
        placeholder="Email"
      />
      <Input
        onSubmitEditing={handleLogin}
        onChangeText={text => setpassword(text)}
        spaceVertical={10}
        isSecurity
        placeholder={'PASSWORD'.t()}
      />

      <Button
        disabled={disabled}
        onSubmit={handleLogin}
        spaceVertical={25}
        isSubmit
        isButtonCircle={false}
      />

      <ButtonWithTitle
        space={10}
        size={fontSize.f16}
        color={colors.highlight}
        onPress={() => pushSingleScreenApp(componentId, RESET_SCREEN)}
        title={'FORGOT_PASSWORD'.t()}
      />
      <Layout>
        <TextFnx size={fontSize.f16} color={colors.app.textContentLevel3}>
          {'Do not have an account'.t()}
          {'  '}
        </TextFnx>
        <ButtonWithTitle
          size={fontSize.f16}
          color={colors.highlight}
          onPress={() => pushSingleScreenApp(componentId, REGISTER_SCREEN)}
          title={'REGISTER_NOW'.t()}
        />
      </Layout>
    </LayoutSplashScreen>
  );
};
const stylest = StyleSheet.create({
  title: {
    paddingTop: 40,
    paddingBottom: 7,
  },
  textRegister: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textBottom: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '120%',
    left: '-10%',
  },
});
export default LoginScreen;
