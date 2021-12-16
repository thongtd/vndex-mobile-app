import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Container from '../../components/Container';
import React from 'react';
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
export default function Step3Kyc({componentId}) {
  return (
    <Container
      isScroll
      componentId={componentId}
      hasBack
      title={'Update portraits'.t()}>
      <TouchableOpacity style={[stylest.box, {marginTop: 15}]}>
        <View style={stylest.centerFlex}>
          <Gallerry />
          <TextFnx color={colors.description}>
            {'Portrait'.t()}
          </TextFnx>
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
        textClose={"Come back".t()}
        onSubmit={() => pushSingleScreenApp(componentId, STEP3KYC_SCREEN)}
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
