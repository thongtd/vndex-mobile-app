import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Container from '../../components/Container';
import React, {useState} from 'react';
import colors from '../../configs/styles/colors';
import Gallerry from 'assets/svg/id_gallery.svg';
import Mtcmt1 from 'assets/svg/mattruoccmt.svg';
import Mtcmt2 from 'assets/svg/mattruoccmt2.svg';
import Mtcmt3 from 'assets/svg/mattruoccmt3.svg';
import Mtcmt4 from 'assets/svg/mattruoccmt4.svg';
import Close from 'assets/svg/close.svg';
import Checked from 'assets/svg/checked.svg';

import TextFnx from '../../components/Text/TextFnx';
import Button from '../../components/Button/Button';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  pushSingleScreenApp,
  SETTING_SCREEN,
  STEP3KYC_SCREEN,
} from '../../navigation';
import {get, isEmpty} from 'lodash';
import {toast} from '../../configs/utils';
import FastImage from 'react-native-fast-image';
import {pop, popTo} from '../../navigation/Navigation';
import {authService} from '../../services/authentication.service';
import {Navigation} from 'react-native-navigation';
import {useSelector} from 'react-redux';
import {fontSize, spacingApp} from '../../configs/constant';
import StepIndicator from 'react-native-step-indicator';
export default function Step3Kyc({
  componentId,
  frontIdentityCardBytes,
  frontIdentityCardFileName,
  backIdentityCardBytes,
  backIdentityCardFileName,
  birthDate,
  city,
  countryCode,
  firstName,
  lastName,
  identityCard,
  postalCode,
  sex,
  identityUserId,
  phoneNumber,
  address,
}) {
  const [assetSelfieSide, setAssetSelfieSide] = useState('');

  const userKyc = useSelector(state => state.authentication.userKyc);
  const userInfo = useSelector(state => state.authentication.userInfo);
  const handleSubmit = selfieSide => {
    if (isEmpty(selfieSide) && isEmpty(get(userKyc, 'selfie'))) {
      toast('PLEASE_SELECT_SELFIE_IMAGE'.t());
    } else {
      let data = {
        birthDate,
        city,
        countryCode,
        firstName,
        lastName,
        identityCard,
        identityUserId,
        postalCode,
        sex,
        selfieBytes: get(selfieSide, 'base64'),
        selfieFileName: get(selfieSide, 'fileName'),
        frontIdentityCardBytes,
        frontIdentityCardFileName,
        backIdentityCardBytes,
        backIdentityCardFileName,
        phoneNumber,
        address,
      };

      authService.updateUserInfo(data).then(res => {
        if (get(res, 'status')) {
          toast(get(res, 'message'));
          Navigation.popToRoot(componentId);
        } else {
          toast(get(res, 'message'));
        }
      });
    }
  };
  const handleSelfieSide = () => {
    launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
    }).then(res => {
      if (get(res, 'assets[0].fileSize') > 5000000) {
        return toast('FILE_SIZE'.t());
      } else {
        setAssetSelfieSide(res.assets[0]);
      }
    });
  };
  return (
    <Container
      isScroll
      componentId={componentId}
      hasBack
      space={20}
      spaceHorizontal={0}
      title={'Update portraits'.t()}>
      <View
        style={{
          marginBottom: 20,
        }}>
        <TextFnx
          size={fontSize.f16}
          weight="bold"
          spaceBottom={20}
          spaceLeft={spacingApp}
          color={colors.app.yellowHightlight}>
          {'Update KYC'.t()}
        </TextFnx>
        <StepIndicator
          customStyles={customStyles}
          currentPosition={2}
          stepCount={3}
        />
      </View>
      <View
        style={{
          backgroundColor: colors.app.backgroundLevel2,
          paddingHorizontal: spacingApp,
          paddingTop: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: 200,
        }}>
        <TouchableOpacity
          onPress={handleSelfieSide}
          style={[stylest.box, {marginTop: 15}]}>
          <View style={stylest.centerFlex}>
            {get(assetSelfieSide, 'uri') ? (
              <FastImage
                style={{width: 200, height: 200}}
                source={{
                  uri: get(assetSelfieSide, 'uri'),
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            ) : get(userKyc, 'selfie') ? (
              <FastImage
                style={{width: 200, height: 200}}
                source={{
                  uri: get(userKyc, 'selfie'),
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            ) : (
              <>
                <Gallerry />
                <TextFnx color={colors.description}>{'Portrait'.t()}</TextFnx>
              </>
            )}
          </View>
        </TouchableOpacity>
        <TextFnx space={10} size={fontSize.f12} color={colors.description}>
          {'RuleUploadImage'.t()}
        </TextFnx>
        {!get(userInfo, 'customerMetaData.isKycUpdated') && (
          <Button
            textClose={'Come back'.t()}
            onSubmit={() => handleSubmit(assetSelfieSide)}
            isButtonCircle={false}
            isSubmit
            isClose
            spaceVertical={30}
            onClose={() => pop(componentId)}
          />
        )}
      </View>
    </Container>
  );
}

const stylest = StyleSheet.create({
  box: {
    height: 230,
    width: '100%',
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerFlex: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cmt: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 7,
    marginLeft: -5,
  },
});
const customStyles = {
  stepIndicatorSize: 35,
  currentStepIndicatorSize: 35,
  separatorStrokeWidth: 1,
  currentStepStrokeWidth: 1,
  stepStrokeCurrentColor: colors.app.yellowHightlight,
  stepStrokeWidth: 1,
  stepStrokeFinishedColor: colors.app.yellowHightlight,
  stepStrokeUnFinishedColor: colors.app.backgroundLevel2,
  separatorFinishedColor: colors.app.yellowHightlight,
  separatorUnFinishedColor: colors.app.backgroundLevel2,
  stepIndicatorFinishedColor: colors.app.yellowHightlight,
  stepIndicatorUnFinishedColor: colors.app.backgroundLevel2,
  stepIndicatorCurrentColor: colors.app.backgroundLevel2,
  stepIndicatorLabelFontSize: 14,
  stepIndicatorLabelCurrentColor: colors.app.yellowHightlight,
  currentStepIndicatorLabelFontSize: 14,
};
