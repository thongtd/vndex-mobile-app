import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
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
import {useSelector} from 'react-redux';
import StepIndicator from 'react-native-step-indicator';
import {fontSize, spacingApp} from '../../configs/constant';
import Layout from '../../components/Layout/Layout';

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
  identityUserId,
  phoneNumber,
  address,
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
    if (isEmpty(assetFrontSide) && isEmpty(get(userKyc, 'frontIdentityCard'))) {
      toast('PLEASE_SELECT_FRONT_OF_IDENTITY_CARD'.t());
    } else if (
      isEmpty(assetBackSide) &&
      isEmpty(get(userKyc, 'backIdentityCard'))
    ) {
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
        identityUserId,
        phoneNumber,
        address,
      });
    }
  };
  return (
    <Container
      isScroll
      componentId={componentId}
      hasBack
      space={20}
      spaceHorizontal={0}
      title={'Update KYC'.t()}>
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
          currentPosition={1}
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
        }}>
        <TouchableOpacity
          onPress={handleFrontSide}
          style={[stylest.box, {marginTop: 15}]}>
          <View style={stylest.centerFlex}>
            {get(assetFrontSide, 'uri') ? (
              <FastImage
                style={{width: 200, height: 200}}
                source={{
                  uri: get(assetFrontSide, 'uri'),
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            ) : get(userKyc, 'frontIdentityCard') ? (
              <FastImage
                style={{width: 200, height: 200}}
                source={{
                  uri: get(userKyc, 'frontIdentityCard'),
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
            {get(assetBackSide, 'uri') ? (
              <FastImage
                style={{width: 200, height: 200}}
                source={{
                  uri: get(assetBackSide, 'uri'),
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
            ) : get(userKyc, 'backIdentityCard') ? (
              <FastImage
                style={{width: 200, height: 200}}
                source={{
                  uri: get(userKyc, 'backIdentityCard'),
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
        <TextFnx space={10} size={fontSize.f12} color={colors.description}>
          {'RuleUploadImage'.t()}
        </TextFnx>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          <View style={stylest.boxImg}>
            <Mtcmt1 />
            <View style={stylest.cmt}>
              <Checked />
              <TextFnx size={fontSize.f12} color={colors.description}>
                {'Valid'.t()}
              </TextFnx>
            </View>
          </View>
          <View style={stylest.boxImg}>
            <Mtcmt2 />
            <View style={stylest.cmt}>
              <Close />
              <TextFnx size={fontSize.f12} color={colors.description}>
                {'Not blurred'.t()}
              </TextFnx>
            </View>
          </View>
          <View style={stylest.boxImg}>
            <Mtcmt3 />
            <View style={stylest.cmt}>
              <Close />
              <TextFnx size={fontSize.f12} color={colors.description}>
                {'No match'.t()}
              </TextFnx>
            </View>
          </View>
          <View style={stylest.boxImg}>
            <Mtcmt4 />
            <View style={stylest.cmt}>
              <Close />
              <TextFnx size={fontSize.f12} color={colors.description}>
                {'Not cut'.t()}
              </TextFnx>
            </View>
          </View>
        </ScrollView>
        <View>
          <Layout style={stylest.marginLeft} isLineCenter>
            <Checked />
            <TextFnx size={fontSize.f14} color={colors.app.textContentLevel2}>
              Do chính phủ cấp
            </TextFnx>
          </Layout>
          <Layout style={stylest.marginLeft} isLineCenter>
            <Checked />
            <TextFnx size={fontSize.f14} color={colors.app.textContentLevel2}>
              Giấy tờ nguyên gốc có kích thước đầy đủ, chưa qua chỉnh sửa
            </TextFnx>
          </Layout>
          <Layout style={stylest.marginLeft} isLineCenter>
            <Checked />
            <TextFnx size={fontSize.f14} color={colors.app.textContentLevel2}>
              Hình ảnh có màu, đủ ánh sáng, có thể đọc được
            </TextFnx>
          </Layout>
          <Layout style={stylest.marginLeft} isLineCenter>
            <Close />
            <TextFnx size={fontSize.f14} color={colors.app.textContentLevel2}>
              Không chấp nhận hình ảnh đen trắng
            </TextFnx>
          </Layout>
          <Layout style={stylest.marginLeft} isLineCenter>
            <Close />
            <TextFnx size={fontSize.f14} color={colors.app.textContentLevel2}>
              Không chấp nhận giấy tờ đã qua chỉnh sửa hoặc hết hạn
            </TextFnx>
          </Layout>
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
      </View>
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
    borderRadius: 8,
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
  boxImg: {
    paddingRight: 30,
  },
  marginLeft: {
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
