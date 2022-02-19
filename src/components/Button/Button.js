import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Keyboard} from 'react-native';
import Icon from '../Icon';
import colors from '../../configs/styles/colors';
import TextFnx from '../Text/TextFnx';
import {TouchablePreview} from 'react-native-navigation/lib/dist/src/adapters/TouchablePreview';

import ButtonSubmitClose from './ButtonSubmitClose';

import PropTypes from 'prop-types';
const Button = ({
  typeIconRight,
  onPress,
  iconLeft,
  iconRight,
  isSubmit,
  isClose,
  isInput,
  styleInputView,
  isInputLable,
  isInputSize,
  isTitle,
  onInput,
  onSubmit,
  onClose,
  isInputCircle,
  isButtonCircle = false,
  spaceVertical,
  placeholder = 'placeholder',
  textSubmit,
  textClose,
  isPlaceholder = true,
  width,
  height,
  style,
  textStyle,
  color,
  size,
  weight,
  title,
  onTitle,
  bgButtonColor,
  spaceHorizontal,
  sizeIconRight,
  label,
  isReverse,
  iconLeftSubmit,
  iconLeftClose,
  colorTitleSubmit,
  colorTitleClose,
  spaceTop,
  spaceBottom,
  colorTitle,
  isNormal,
  marginTop,
  marginHorizontal,
  marginBottom,
  marginVertical,
  marginLeft,
  marginRight,
  disabledClose,
  disabledSubmit,
  weightTitle,
  bgButtonColorSubmit,
  bgButtonColorClose,
  ...rest
}) => (
  <View
    style={{
      marginTop: marginTop,
      marginHorizontal,
      marginBottom,
      marginRight,
      marginLeft,
      marginHorizontal,
    }}>
    {rest.isLabel && <TextFnx style={stylest.label} value={label} />}

    {isNormal && (
      <ButtonSubmitClose
        spaceHorizontal={spaceHorizontal}
        title={title}
        width={width}
        height={height}
        weightTitle={weightTitle}
        // iconLeft={iconLeftSubmit}
        iconLeftSvg={iconLeftSubmit}
        isSubmit
        isButtonCircle={false}
        onPress={onPress}
        bgButtonColor={bgButtonColor}
        style={style}
        colorTitle={colorTitle}
        {...rest}
      />
    )}

    {(isSubmit || isClose) && (
      <View
        style={[
          {
            marginVertical: spaceVertical,
            marginTop: spaceTop,
            marginBottom: spaceBottom,
          },
          isReverse && {flexDirection: 'row-reverse'},
        ]}>
        {isSubmit && (
          <ButtonSubmitClose
            weightTitle={weightTitle}
            title={textSubmit}
            disabled={disabledSubmit}
            iconLeftSvg={iconLeftSubmit}
            isSubmit
            isButtonCircle={isButtonCircle}
            onPress={onSubmit}
            bgButtonColor={bgButtonColorSubmit}
            style={style}
            colorTitle={colorTitleSubmit}
            {...rest}
          />
        )}
        {isSubmit && isClose && <View style={{flex: 0.05}} />}
        {isClose && (
          <ButtonSubmitClose
            bgButtonColor={bgButtonColorClose}
            title={textClose}
            disabled={disabledClose}
            isClose
            weightTitle={weightTitle}
            isButtonCircle={isButtonCircle}
            onPress={onClose}
            iconLeftSvg={iconLeftClose}
            colorTitle={colorTitleClose}
            style={style}
            {...rest}
          />
        )}
      </View>
    )}
    {isInput && (
      <TouchableOpacity
        {...rest}
        onPress={() => {
          Keyboard.dismiss();
          onInput();
        }}>
        <View
          style={[
            isInputCircle ? stylest.inputCircle : stylest.inputView,
            {
              marginVertical: spaceVertical,
              marginHorizontal: spaceHorizontal,
              height: height,
            },
            {...styleInputView},
          ]}>
          {iconLeft && <Icon name={iconLeft} style={[stylest.iconLeft]} />}
          <View style={stylest.inputCore}>
            {isInputLable || null}
            {(isInputSize && (
              <TextFnx
                value={placeholder}
                color={isPlaceholder ? colors.description : colors.text}
                size={isInputSize}
              />
            )) || (
              <TextFnx
                value={placeholder}
                color={isPlaceholder ? colors.description : colors.text}
              />
            )}
          </View>
          {iconRight && (
            <Icon
              size={sizeIconRight}
              type={typeIconRight}
              name={iconRight}
              style={[stylest.iconRight, stylest.icon]}
            />
          )}
        </View>
      </TouchableOpacity>
    )}
    {isTitle && (
      <View
        style={{
          width: width,
          height: height,
        }}>
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();

            onTitle();
          }}>
          <View style={style}>
            <TextFnx
              spaceHorizontal={spaceHorizontal}
              weight={weight}
              style={textStyle}
              size={size}
              color={color}
              value={title}
            />
          </View>
        </TouchableOpacity>
      </View>
    )}
  </View>
);
const stylest = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  inputView: {
    width: '100%',
    borderColor: colors.line,
    borderWidth: 0,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    backgroundColor: colors.background,
    borderRadius: 5,
  },
  inputCircle: {
    width: '100%',
    borderColor: colors.line,
    borderWidth: 0,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    borderRadius: 25,
    backgroundColor: colors.background,
  },
  inputCore: {
    height: 52,
    flex: 1,
    justifyContent: 'center',
  },
  iconLeft: {
    color: colors.description,
    height: 52,
    lineHeight: 52,
    paddingRight: 10,
  },
  iconRight: {
    color: colors.description,
  },
  icon: {
    width: 52,
    height: 52,
    lineHeight: 52,
    textAlign: 'center',
  },
  label: {
    paddingTop: 10,
    color: colors.subText,
  },
});

Button.propTypes = {
  iconLeft: PropTypes.string,
  iconRight: PropTypes.string,
  isSubmit: PropTypes.bool,
  isClose: PropTypes.bool,
  isInput: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  onInput: PropTypes.func,
};
export default Button;
