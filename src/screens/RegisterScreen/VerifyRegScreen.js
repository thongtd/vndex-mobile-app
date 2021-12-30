import {StyleSheet, Text, View} from 'react-native';
import {LayoutSplashScreen} from '../../components';
import React, {useState, useEffect} from 'react';
import colors from '../../configs/styles/colors';
import ButtonWithTitle from '../../components/Button/ButtonWithTitle';
import {Navigation} from 'react-native-navigation';
import Button from '../../components/Button/Button';
import Input from '../../components/Input';
import TextFnx from '../../components/Text/TextFnx';
import {pushSingleHiddenTopBarApp, pushTabBasedApp} from '../../navigation';
import BackgroundTimer from 'react-native-background-timer';
import {authService} from '../../services/authentication.service';

const VerifyRegScreen = ({componentId, email}) => {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isTimer, setIsTimer] = useState(true);
  const handleResend = () => {
      setLoading(true);
    authService
      .resendConfirmEmail(email)
      .then(res => {
        if(res){
            setTimer(60);
            setLoading(false);
            setIsTimer(true);
        }
        setIsTimer(true);
      })
      .catch(err => {
          setLoading(false);
        console.log(err, 'err')
      });

    // rest.handleResend()
  };
  useEffect(() => {
    var intervalId;
    if (isTimer && timer) {
      intervalId = BackgroundTimer.setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (!timer) {
      setIsTimer(false);
      BackgroundTimer.clearInterval(intervalId);
    }
    return () => BackgroundTimer.clearInterval(intervalId);
  }, [isTimer, timer]);
  return (
    <LayoutSplashScreen componentId={componentId} isLoadding={loading}>
     
      <View style={stylest.title}>
        <TextFnx
          size={30}
          color={colors.tabbarActive}
          weight={'bold'}
          value={'REGISTER'.t()}
        />
      </View>

      <TextFnx weight="bold" space={15} size={16}>
        {'Unconfirmed account'.t()}
      </TextFnx>
      <TextFnx>{'Content verify account'.t().replace('{0}', email)}</TextFnx>
      <Button
        onPress={handleResend}
        isButtonCircle={false}
        disabled={timer && isTimer ? true : false}
        // onSubmit={handleSubmitCheckEmail}
        spaceVertical={25}
        isSubmit
        textSubmit={
          timer
            ? 'Resend after s'.t().replace('{0}', timer)
            : 'Resend email'.t()
        }
      />
      <View
        style={{
          alignItems: 'center',
        }}>
        <ButtonWithTitle
          space={10}
          color={colors.highlight}
          onPress={() => pushTabBasedApp()}
          title={'Go to homepage'.t()}
        />
      </View>
    </LayoutSplashScreen>
  );
};
const stylest = StyleSheet.create({
  blockCheckbox: {flexDirection: 'row', alignItems: 'center'},
  title: {
    paddingTop: 40,
    paddingBottom: 32,
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
export default VerifyRegScreen;

const styles = StyleSheet.create({});
