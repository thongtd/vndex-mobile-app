import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Input from '../../../components/Input';
import TextFnx from '../../../components/Text/TextFnx';
import colors from '../../../configs/styles/colors';

import {
  createAction,
  size,
  toast,
  listenerEventEmitter,
  get,
} from '../../../configs/utils';

import {useDispatch, useSelector} from 'react-redux';
import {constant, spacingApp} from '../../../configs/constant';
import Container from '../../../components/Container';
import Button from '../../../components/Button/Button';
import {authService} from '../../../services/authentication.service';
import {UNLOCK_OFFER_ADVERTISMENT} from '../../../redux/modules/p2p/actions';
import {pushSingleScreenApp, STEP_5_BUY_SELL_SCREEN} from '../../../navigation';
import Layout from '../../../components/Layout/Layout';
import TimelineBuySell from './TimelineBuySell';
const Step2FA = ({componentId}) => {
  const [otp, setOtp] = useState('');
  const dispatcher = useDispatch();
  const [disabled, setDisabled] = useState(false);
  const [sessionId, setSessionId] = useState(sessionId);
  const UserInfo = useSelector(state => state.authentication.userInfo);
  const twoFactorySerice = get(UserInfo, 'twoFactorService');
  const twoFactorEnable = get(UserInfo, 'twoFactorEnabled');
  const offerOrderId = useSelector(state => state.p2p.offerOrderId);
  const offerOrder = useSelector(state => state.p2p.offerOrder);
  useEffect(() => {
    const ev = listenerEventEmitter('successUnlock', () => {
      pushSingleScreenApp(componentId, STEP_5_BUY_SELL_SCREEN);
    });
    return () => {
      ev.remove();
    };
  }, [componentId]);
  
  const handleSubmit = () => {
    let dataConfirm = {
      verifyCode: otp,
      userEmail: get(UserInfo, 'email'),
      sessionId: sessionId,
    };
    if (size(otp) === 0) {
      toast('Please enter 2FA code'.t());
    } else {
      
      dispatcher(
        createAction(UNLOCK_OFFER_ADVERTISMENT,{
            data:dataConfirm,
            offerOrderId
        }),
      );
    }
  };
  const handleResend = () => {
    authService.getTwoFactorEmailCode(get(UserInfo, 'email')).then(res => {
      setSessionId(get(res, 'data.sessionId'));
    });
  };
  useEffect(() => {
    handleResend();
      return () => {
          
      }
  }, [])
  return (
    <Container
    //   isLoadding={disabled}
      componentId={componentId}
      isTopBar={true}
      title={'security verification'.t()}>
      <Layout type="column" spaceHorizontal={spacingApp}>
          <TimelineBuySell side={get(offerOrder, 'offerSide')} step={2} title={'security verification'.t()} />
        </Layout>
        
      <Input
        onSubmitEditing={handleSubmit}
        handleResend={handleResend}
        value={otp}
        onChangeText={text => setOtp(text)}
        isPaste
        spaceVertical={10}
        isResend={twoFactorySerice === constant.TWO_FACTOR_TYPE.EMAIL_2FA}
        placeholder={'2FA_CODE'.t()}
      />
      {twoFactorySerice === constant.TWO_FACTOR_TYPE.EMAIL_2FA ? (
        <TextFnx space={10} color={colors.description}>
          {'Enter the 6 numbers sent to the email'.t()} {get(UserInfo, 'email')}
        </TextFnx>
      ) : (
        <TextFnx>
          {'Enter 6 numbers google authenticator from'.t()}{' '}
          {get(UserInfo, 'email')}
        </TextFnx>
      )}
      <Button
        // disabled={disabled}
        onSubmit={handleSubmit}
        spaceVertical={10}
        isSubmit
        isButtonCircle={false}
      />
    </Container>
  );
};
const stylest = StyleSheet.create({
  title: {
    paddingTop: 25,
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
export default Step2FA;
