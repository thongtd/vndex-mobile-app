import React, {useState} from 'react';
import {Text, View, StyleSheet, Linking, Platform} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import colors from '../../configs/styles/colors';
import TextFnx from '../../components/Text/TextFnx';
import Input from '../../components/Input';
import Button from '../../components/Button/Button';
import {LayoutSplashScreen} from '../../components';
import ButtonWithTitle from '../../components/Button/ButtonWithTitle';
import Icon from '../../components/Icon';
// import CheckBox from 'react-native-check-box';
import ModalAlert from '../../components/Alert/AlertNoticePassword';
import {Navigation} from 'react-native-navigation';
import {
  ALERT_NOTICE_PASSWORD,
  ALERT_ACCOUNT_ACTIVE,
  WALLET_SCREEN,
  LOGIN_SCREEN,
  SEND_REG_SCREEN,
} from '../../navigation';

import {
  hiddenModal,
  toast,
  get,
  _validateAuth,
  validateEmail,
} from '../../configs/utils';
import {fontSize, IdNavigation} from '../../configs/constant';
import {authService} from '../../services/authentication.service';
import ButtonFooterAuth from '../../components/Button/ButtonFooterAuth';
import {pop, pushSingleHiddenTopBarApp, showModal} from '../../navigation/Navigation';
import Layout from '../../components/Layout/Layout';
import { size } from 'lodash';

const ConfirmScreen = ({countryCode = 'VN', componentId}) => {
  const [isCheck, setCheck] = useState(false);
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [referralId, setReferralId] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState('');
  const handleButtonRight = () => {
    showModal(ALERT_NOTICE_PASSWORD);
    // Navigation.showModal(hiddenModal(ALERT_NOTICE_PASSWORD));
  };
  const handleChangeEmail = text => {
    setEmail(text);
  };
  const doRegister = () => {
    if (!isCheck) {
      toast('You must be accepted this condition'.t());
      return;
    } else if (size(email) === 0) {
      return toast('PLEASE_ENTER_EMAIL'.t());
    } else if (!validateEmail(email)) {
      return toast('PLEASE_INPUT_A_VALID_EMAIL'.t());
    }
    let register_model = {
      email: email,
      password: password,
      rePassword: rePassword,
      fromReferralId: referralId,
      countryCode: countryCode,
      via: 2,
      CallbackUrl:"http://54.169.221.223:6868/confirm-email"
    };

    let isValid = _validateAuth(password, rePassword);
    if (isValid) {
      setDisabled(true);
      authService
        .register(register_model)
        .then(res => {
          if (get(res, 'status') === 'OK') {
            setDisabled(false);
            toast(get(res, 'message').t());
            pushSingleHiddenTopBarApp(componentId, SEND_REG_SCREEN, {email});
          } else {
            setDisabled(false);
            toast(get(res, 'message'));
          }
        })
        .catch(err => {
          console.log(err, 'Err');
          setDisabled(false);
        });
    }
  };
  return (
    <LayoutSplashScreen
      title={'REGISTER'.t()}
      componentId={componentId}
      isLoadding={disabled}>
      {/* <View style={stylest.textRegister}>
        <ButtonWithTitle
          space={10}
          onPress={() => pushSingleHiddenTopBarApp(componentId, LOGIN_SCREEN)}
          color={colors.highlight}
          title={'LOGIN'.t()}
        />
      </View> */}
      <TextFnx
        spaceTop={Platform.OS == 'android' ? 80 : 40}
        size={30}
        spaceBottom={7}
        color={colors.tabbarActive}
        weight={'bold'}
        value={'REGISTER'.t()}
      />
      <TextFnx
        size={fontSize.f12}
        spaceBottom={20}
        color={colors.app.textDisabled}>
        {'Please login with your Email account'.t()}
      </TextFnx>
      <Input
        value={email}
        onChangeText={handleChangeEmail}
        keyboardType={'email-address'}
        spaceVertical={10}
        placeholder={'Enter your email or phone'.t()}
        // isCircle
      />
      <Input
        styleRight={{
          borderRightWidth: 1,
          borderRightColor: colors.iconButton,
          height: 25,
        }}
        isSecurity
        onChangeText={text => setPassword(text)}
        onPressButtonRight={handleButtonRight}
        spaceVertical={10}
        placeholder={'PASSWORD'.t()}
        isButtonRight
        nameIconRight="exclamation-circle"
      />
      <Input
        isSecurity
        onChangeText={text => setRePassword(text)}
        spaceVertical={10}
        placeholder={'CONFIRM_PASSWORD'.t()}
      />
      <Input
        onChangeText={text => setReferralId(text)}
        spaceVertical={10}
        placeholder={'REFERRAL_ID'.t()}
      />
      <View style={[stylest.blockCheckbox, {height: 20, marginTop: 10}]}>
        <CheckBox
          style={{height: 20, width: 20}}
          boxType="square"
          onTintColor={colors.iconButton}
          onCheckColor={colors.iconButton}
          value={isCheck}
          onValueChange={() => {
            setCheck(!isCheck);
          }}
        />
        <TextFnx
          spaceLeft={10}
          color={colors.subText}
          value={`${'I_ALREADED_READ'.t()} `}
        />
        <ButtonWithTitle
          onPress={() => Linking.openURL('LINK_POLICY'.t())}
          color={colors.highlight}
          title={'CONDITION'.t()}
        />
      </View>
      <Button
        disabled={disabled}
        textSubmit={'CreateAccount'.t()}
        onSubmit={doRegister}
        spaceVertical={25}
        isSubmit
        isButtonCircle={false}
      />
      <Layout>
        <TextFnx size={fontSize.f16} color={colors.app.textContentLevel3}>
          {'I_HAVE_ACCOUNT'.t()}
          {'  '}
        </TextFnx>
        <ButtonWithTitle
          size={fontSize.f16}
          onPress={() => pop(componentId, LOGIN_SCREEN)}
          color={colors.highlight}
          title={'LOGIN_NOW'.t()}
        />
      </Layout>
    </LayoutSplashScreen>
  );
};

const stylest = StyleSheet.create({
  blockCheckbox: {flexDirection: 'row', alignItems: 'center'},
  title: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 10,
  },
  textRegister: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    // marginVertical: 10
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
export default ConfirmScreen;
