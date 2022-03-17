import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import Button from '../../../../components/Button/Button';
import Container from '../../../../components/Container';
import Input from '../../../../components/Input';
import TextFnx from '../../../../components/Text/TextFnx';
import colors from '../../../../configs/styles/colors';
import {authService} from '../../../../services/authentication.service';
import {
  createAction,
  size,
  toast,
  listenerEventEmitter,
  get,
} from '../../../../configs/utils';
import {useDispatch, useSelector} from 'react-redux';
import {constant, spacingApp} from '../../../../configs/constant';
import {
  CREATE_ADVERTISMENT,
  UPDATE_ADVERTISMENT,
} from '../../../../redux/modules/p2p/actions';
import {
  pushSingleScreenApp,
  STEP_ADS_ADD_SUCCESS,
} from '../../../../navigation';
import {P2pService} from '../../../../services/p2p.service';

export default function Step2FaAdsAdd({componentId, data}) {
  const [otp, setOtp] = useState('');
  const [sessionId, setSessionId] = useState(sessionId);
  const UserInfo = useSelector(state => state.authentication.userInfo);
  const twoFactorySerice = get(UserInfo, 'twoFactorService');
  const twoFactorEnable = get(UserInfo, 'twoFactorEnabled');
  const [isLoading, setIsLoading] = useState(false);
  const dispatcher = useDispatch();
  useEffect(() => {
    const ev = listenerEventEmitter('successCreateAds', () => {
      pushSingleScreenApp(componentId, STEP_ADS_ADD_SUCCESS);
    });
    return () => {
      ev.remove();
    };
  }, [componentId]);
  const handleSubmit = () => {
    // let dataConfirm = {
    //   verifyCode: otp,
    //   userEmail: get(UserInfo, 'email'),
    //   sessionId: sessionId,
    // };
    if (size(otp) === 0) {
      toast('Please enter 2FA code'.t());
    } else {
      setIsLoading(true)
      P2pService.verify2Fa({
        verifyCode: otp,
        email: get(UserInfo, 'email'),
        sessionId: sessionId || '',
        ipAddress:""
      })
        .then( res => {
          setIsLoading(false);
          console.log('res: ', res);
          if ( get( res, 'succeeded' ) ) {
            debugger;
            dispatcher(
              createAction(
                 CREATE_ADVERTISMENT,
                {
                  side: get(data, 'activeType'),
                  coinSymbol: get(data, 'ActiveAsset'),
                  paymentUnit: get(data, 'ActiveFiat'),
                  price: get(data, 'price').str2Number(),
                  quantity: get(data, 'quantity').str2Number(),
                  priceType: get(data, 'checked'),
                  minOrderAmount: get(data, 'minOrder').str2Number(),
                  maxOrderAmount: get(data, 'maxOrder').str2Number(),
                  accountPaymentMethodIds: get(data, 'paymentMethodIdData'),
                  comment: get(data, 'comment'),
                  autoReplyMessage: get(data, 'autoReplyMessage'),
                  lockedInSecond: get(data, 'activeTimeToLive.second'),
                  requiredKyc: get(data, 'isSelectedKYC'),
                  requiredAgeInDay: get(data, 'isSelectedRegister') ? 10 : 0,
                  isOpenForTrading:
                    get(data, 'checkedStatus') == 'first' ? true : false,
                  verifyCode: otp,
                  userEmail: get(UserInfo, 'email'),
                  sessionId: sessionId || '',
                  tradingOrderId: get(data, 'tradingOrderId'),
                },
              ),
            );
          } else {
            // toast(get())
            toast('Mã 2FA không đúng');
          }
        })
        .catch(err => {
          setIsLoading(false);
          toast('Lỗi kết nối');
        });
    }
  };
  const handleResend = () => {
    authService.getTwoFactorEmailCode(get(UserInfo, 'email')).then(res => {
      setSessionId(get(res, 'data.sessionId'));
    });
  };
  useEffect(() => {
    handleResend();
    return () => {};
  }, []);
  return (
    <Container
      isTopBar={true}
      title={'security verification'.t()}
      componentId={componentId}
      isLoadding={isLoading}
      >
      <Input
        onSubmitEditing={handleSubmit}
        handleResend={handleResend}
        value={otp}
        onChangeText={text => setOtp(text)}
        isPaste
        autoFocus={true}
        keyboardType='numeric'
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
}
