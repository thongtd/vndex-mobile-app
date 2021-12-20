import React, {useState} from 'react';
import {Text, View, StyleSheet, Linking} from 'react-native';
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

import {hiddenModal, toast, get, _validateAuth} from '../../configs/utils';
import {IdNavigation} from '../../configs/constant';
import {authService} from '../../services/authentication.service';
import ButtonFooterAuth from '../../components/Button/ButtonFooterAuth';
import { pushSingleHiddenTopBarApp } from '../../navigation/Navigation';

const ConfirmScreen = ({countryCode="VN", componentId}) => {
  const [isCheck, setCheck] = useState(false);
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [referralId, setReferralId] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState('');
  const handleButtonRight = () => {
    Navigation.showModal(hiddenModal(ALERT_NOTICE_PASSWORD));
  };
  const handleChangeEmail = text => {
    setEmail(text);
  };
  const doRegister = () => {
    if (!isCheck) {
      toast('You must be accepted this condition'.t());
      return;
    }
    let register_model = {
      email: email,
      password: password,
      rePassword: rePassword,
      fromReferralId: referralId,
      countryCode: countryCode,
      via: 2,
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
            pushSingleHiddenTopBarApp(componentId, SEND_REG_SCREEN,{email});
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
    <LayoutSplashScreen componentId={componentId} isLoadding={disabled}>
      <View style={stylest.textRegister}>
        <ButtonWithTitle
          space={10}
          onPress={() => pushSingleHiddenTopBarApp(componentId, LOGIN_SCREEN)}
          color={colors.highlight}
          title={'LOGIN'.t()}
        />
      </View>
      <View style={stylest.title}>
        <TextFnx
          size={25}
          color={colors.tabbarActive}
          weight={'bold'}
          value={'REGISTER'.t()}
        />
      </View>
      <Input
        isLabel
        label="Email"
        value={email}
        onChangeText={handleChangeEmail}
        keyboardType={'email-address'}
        spaceVertical={10}
        placeholder={'Enter your email or phone'.t()}
        // isCircle
      />
      <Input
        isLabel
        label={'PASSWORD'.t()}
        styleRight={{
          borderRightWidth: 1,
          borderRightColor: colors.iconButton,
          height: 25,
        }}
        isSecurity
        onChangeText={text => setPassword(text)}
        onPressButtonRight={handleButtonRight}
        nameIconLeft="lock"
        spaceVertical={10}
        isIconLeft
        placeholder={'PASSWORD'.t()}
        isButtonRight
        nameIconRight="exclamation-circle"
      />
      <Input
        isLabel
        label={'CONFIRM_PASSWORD'.t()}
        isSecurity
        onChangeText={text => setRePassword(text)}
        spaceVertical={10}
        isIconLeft
        nameIconLeft={'lock'}
        placeholder={'CONFIRM_PASSWORD'.t()}
      />
      <Input
        isLabel
        label={'REFERRAL_ID'.t()}
        onChangeText={text => setReferralId(text)}
        spaceVertical={10}
        isIconLeft
        nameIconLeft={'user-friends'}
        placeholder={'REFERRAL_ID'.t()}
      />
      <View style={[stylest.blockCheckbox, {height: 20, marginTop: 10}]}>
        <CheckBox
          style={{height: 20, width: 20}}
          boxType="square"
          onTintColor="orange"
          onCheckColor="orange"
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
      <ButtonFooterAuth textLeft={''} />
    </LayoutSplashScreen>
  );
};

const stylest = StyleSheet.create({
  blockCheckbox: {flexDirection: 'row', alignItems: 'center'},
  title: {
    alignItems: 'center',
    paddingTop: 65,
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
