import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from 'react-native';
import ButtonIcon from '../Button/ButtonIcon';
import ButtonWithTitle from '../Button/ButtonWithTitle';
import icons from '../../configs/icons';
import colors from '../../configs/styles/colors';
import TextFnx from '../Text/TextFnx';
import {TouchablePreview} from 'react-native-navigation/lib/dist/src/adapters/TouchablePreview';

import Icon from '../Icon';
import {isAndroid} from '../../configs/utils';
const ItemSetting = ({
  onPress,
  onValueChange = () => {},
  title,
  hasSwitch,
  textRight,
  iconRight = false,
  nameIcon,
  colorIcon = colors.description,
  textLeft,
  iconLeft,
  isBorder = true,
  sizeIconLeft = {
    width: 25,
    height: 25,
  },
  sizeIconRight = 18,
  IsSwitch,
  height = 50,
  iconLeftSvg,
  colorLabel,
  colorValue,
  weightvalue,
  sizeValue,
  colorTitle=colors.app.textDisabled,
  style,
  ...rest
}) => {
  return (
    <>
      {title ? (
          <View style={[
            stylest.container,
            {height: height},{borderBottomWidth: 0.5},
          ]}>
 <TextFnx weight='700' color={colorTitle}>{title}</TextFnx>
          </View>
       
      ) : (
        <TouchableOpacity onPress={onPress}>
          <View
            style={[
              stylest.container,
              {height: height},
              isBorder && {borderBottomWidth: 0.5},
              style
            ]}>
            <View style={stylest.blockLeft}>
              {iconLeftSvg && iconLeftSvg}
              {/* <Image source={iconLeft} style={sizeIconLeft} resizeMode="contain" /> */}
              <TextFnx
                spaceLeft={iconLeftSvg ? '3%' : 0}
                value={textLeft}
                color={colorLabel}
              />
            </View>
            {hasSwitch ? (
              <Switch
                value={IsSwitch}
                style={isAndroid() ? {marginRight: -3.5} : {}}
                onValueChange={onValueChange}
              />
            ) : textRight && iconRight ? (
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <TextFnx
                  size={sizeValue}
                  weight={weightvalue}
                  color={colorValue}
                  spaceRight={10}
                  value={textRight}
                />
                <Icon
                  size={sizeIconRight}
                  color={colorIcon}
                  name={'chevron-right'}
                />
              </View>
            ) : textRight && !iconRight ? (
              <TextFnx
                size={sizeValue}
                weight={weightvalue}
                color={colorValue}
                spaceRight={10}
                value={textRight}
              />
            ) : iconRight?(
              <Icon
                size={sizeIconRight}
                color={colorIcon}
                name={'chevron-right'}
              />
            ):null}
          </View>
        </TouchableOpacity>
      )}
    </>
  );
};

const stylest = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: colors.app.lineSetting,
    // paddingHorizontal: "1%",
  },
  blockLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textLeft: {
    // paddingLeft: "3%",
  },
});
export default ItemSetting;
