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
import {pushSingleScreenApp, SETTING_SCREEN, STEP3KYC_SCREEN} from '../../navigation';
import {get, isEmpty} from 'lodash';
import {toast} from '../../configs/utils';
import FastImage from 'react-native-fast-image';
import {pop, popTo} from '../../navigation/Navigation';
import {authService} from '../../services/authentication.service';
import { Navigation } from 'react-native-navigation';
import { useSelector } from 'react-redux';
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
  identityUserId
}) {
  const [assetSelfieSide, setAssetSelfieSide] = useState('');
  
  const userKyc = useSelector(state => state.authentication.userKyc);
  const handleSubmit = selfieSide => {
    if (isEmpty(selfieSide) && isEmpty(get(userKyc,"selfie"))) {
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
        selfieBytes:get(selfieSide,"base64"),
        selfieFileName:get(selfieSide,"fileName"),
        frontIdentityCardBytes,
        frontIdentityCardFileName,
        backIdentityCardBytes,
        backIdentityCardFileName,
      };

      authService.updateUserInfo(data).then(res => {
        console.log(res,"REss");
        if(get(res,"status")){
          // popToRoo(componentId,SETTING_SCREEN);
          toast(get(res,"message"));
          Navigation.popToRoot(componentId);
        }else{
          toast(get(res,"message"));
        }
      })
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
      title={'Update portraits'.t()}>
      <TouchableOpacity
        onPress={handleSelfieSide}
        style={[stylest.box, {marginTop: 15}]}>
        <View style={stylest.centerFlex}>
          {(get(assetSelfieSide, 'uri') || get(userKyc,"selfie")) ? (
            <FastImage
              style={{width: 200, height: 200}}
              source={{
                uri:get(userKyc,"selfie")?get(userKyc,"selfie"): get(assetSelfieSide, 'uri'),
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
      <TextFnx space={10} color={colors.description}>
        {'RuleUploadImage'.t()}
      </TextFnx>
      <View>
        <Mtcmt1 />
        <View style={stylest.cmt}>
          <Checked />
          <TextFnx color={colors.description}>{'Valid'.t()}</TextFnx>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View>
          <Mtcmt2 />
          <View style={stylest.cmt}>
            <Close />
            <TextFnx color={colors.description}>{'Not blurred'.t()}</TextFnx>
          </View>
        </View>
        <View>
          <Mtcmt3 />
          <View style={stylest.cmt}>
            <Close />
            <TextFnx color={colors.description}>{'No match'.t()}</TextFnx>
          </View>
        </View>
        <View>
          <Mtcmt4 />
          <View style={stylest.cmt}>
            <Close />
            <TextFnx color={colors.description}>{'Not cut'.t()}</TextFnx>
          </View>
        </View>
      </View>
      <Button
        textClose={'Come back'.t()}
        onSubmit={() => handleSubmit(assetSelfieSide)}
        isButtonCircle={false}
        isSubmit
        isClose
        spaceVertical={30}
        onClose={() => pop(componentId)}
      />
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
