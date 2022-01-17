import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import {TouchablePreview} from 'react-native-navigation/lib/dist/src/adapters/TouchablePreview';
import {Keyboard} from 'react-native';
import TextFnx from '../Text/TextFnx';
import colors from '../../configs/styles/colors';
import Icon from '../Icon';
import {fontSize} from '../../configs/constant';

const ButtonSubmitClose = ({
  style,
  iconLeftSvg,
  onPress,
  isSubmit,
  isClose,
  isButtonCircle,
  title = isSubmit ? 'SUBMIT'.t() : 'CLOSE'.t(),
  bgButtonColor = isSubmit
    ? colors.app.yellowHightlight
    : colors.app.textDisabled,
  colorTitle,
  width,
  height = 48,
  spaceHorizontal,
  weightTitle = '500',
  disabled,
  ...rest
}) => (
  <View style={[stylest.flex, {paddingVertical: 8, width: width}]}>
    <TouchableOpacity
      disabled={disabled}
      onPress={() => {
        Keyboard.dismiss();
        onPress();
      }}
      {...rest}>
      <View
        style={[
          isButtonCircle ? stylest.btnCircle : stylest.btn,
          {
            backgroundColor: bgButtonColor,
            paddingHorizontal: spaceHorizontal,
            flexDirection: 'row',
            height: height,
          },
          style,
        ]}>
        {iconLeftSvg && iconLeftSvg}
        <TextFnx
          size={fontSize.f16}
          weight={weightTitle}
          spaceLeft={iconLeftSvg ? 5 : 0}
          color={
            colorTitle
              ? colorTitle
              : isSubmit
              ? colors.black
              : colors.textBtnClose
          }
          value={title}
        />
      </View>
    </TouchableOpacity>
  </View>
);
const stylest = StyleSheet.create({
  flex: {
    flex: 1,
  },
  btn: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  btnCircle: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
});
export default ButtonSubmitClose;
