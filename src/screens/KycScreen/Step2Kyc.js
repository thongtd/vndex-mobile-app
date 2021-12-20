import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Container from '../../components/Container';

import React, {useState, useCallback, useEffect} from 'react';
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
import {pushSingleScreenApp, STEP3KYC_SCREEN} from '../../navigation';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {get, isEmpty} from 'lodash';
import {toast} from '../../configs/utils';
import FastImage from 'react-native-fast-image';
import {pop} from '../../navigation/Navigation';
import { useSelector } from 'react-redux';

export default function Step2Kyc({
  componentId,
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
  const [assetFrontSide, setAssetFrontSide] = useState('');
  const [assetBackSide, setAssetBackSide] = useState('');
  const userKyc = useSelector(state => state.authentication.userKyc);
  const handleFrontSide = () => {
    launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
    }).then(res => {
      console.log(res, 'ress');
      if (get(res, 'assets[0].fileSize') > 5000000) {
        return toast('FILE_SIZE'.t());
      } else {
        setAssetFrontSide(res.assets[0]);
      }
    });
  };
  const handleBackSide = () => {
    launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
    }).then(res => {
      if (get(res, 'assets[0].fileSize') > 5000000) {
        return toast('FILE_SIZE'.t());
      } else {
        setAssetBackSide(res.assets[0]);
      }
    });
  };
  const handleNext = (assetBackSide, assetFrontSide) => {
    if (isEmpty(assetFrontSide) && isEmpty(get(userKyc,"frontIdentityCard"))) {
      toast('PLEASE_SELECT_FRONT_OF_IDENTITY_CARD'.t());
    } else if (isEmpty(assetBackSide) && isEmpty(get(userKyc,"backIdentityCard"))) {
      toast('PLEASE_SELECT_BACK_OF_IDENTITY_CARD'.t());
    } else {
      pushSingleScreenApp(componentId, STEP3KYC_SCREEN, {
        frontIdentityCardBytes: get(assetFrontSide, 'base64'),
        frontIdentityCardFileName: get(assetFrontSide, 'fileName'),
        backIdentityCardBytes: get(assetBackSide, 'base64'),
        backIdentityCardFileName: get(assetFrontSide, 'fileName'),
        birthDate,
        city,
        countryCode,
        firstName,
        lastName,
        identityCard,
        postalCode,
        sex,
        identityUserId
      });
    }
  };
  return (
    <Container
      isScroll
      componentId={componentId}
      hasBack
      title={'Update KYC'.t()}>
      <TouchableOpacity
        onPress={handleFrontSide}
        style={[stylest.box, {marginTop: 15}]}>
        <View style={stylest.centerFlex}>
          {(get(assetFrontSide, 'uri') || get(userKyc,"frontIdentityCard")) ? (
            <FastImage
              style={{width: 200, height: 200}}
              source={{
                uri:get(userKyc,"frontIdentityCard")?get(userKyc,"frontIdentityCard"): get(assetFrontSide, 'uri'),
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          ) : (
            <>
              <Gallerry />
              <TextFnx color={colors.description}>
                {'Front side of ID card'.t()}
              </TextFnx>
            </>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleBackSide}
        style={[stylest.box, {marginTop: 15}]}>
        <View style={stylest.centerFlex}>
          {(get(assetBackSide, 'uri') || get(userKyc,"backIdentityCard")) ? (
            <FastImage
              style={{width: 200, height: 200}}
              source={{
                uri:get(userKyc,"backIdentityCard")?get(userKyc,"backIdentityCard"): get(assetBackSide, 'uri'),
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          ) : (
            <>
              <Gallerry />
              <TextFnx color={colors.description}>
                {'The back of the ID card'.t()}
              </TextFnx>
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
        onClose={() => pop(componentId)}
        textSubmit={'NEXT'.t()}
        textClose={'Come back'.t()}
        onSubmit={() => handleNext(assetBackSide, assetFrontSide)}
        isButtonCircle={false}
        isSubmit
        isClose
        spaceVertical={30}
      />
    </Container>
  );
}

const stylest = StyleSheet.create({
  box: {
    height: 230,
    maxHeight: 230,
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
