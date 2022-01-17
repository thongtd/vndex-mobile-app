import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Keyboard} from 'react-native';
import {TouchablePreview} from 'react-native-navigation/lib/dist/src/adapters/TouchablePreview';

import PropTypes from 'prop-types';
import colors from '../../configs/styles/colors';
import {TextWhite} from '..';
import Icon from '../Icon';
import {constant} from '../../configs/constant';
import Image from '../Image/Image';
import TextFnx from '../Text/TextFnx';
const ButtonIcon = ({
  onPress,
  name = 'arrow-left',
  size = 15,
  color = colors.background,
  style,
  type = constant.TYPE_ICON.FontAwesome,
  titleIcon = '',
  styleBlockIcon = {},
  spaceLeft = 10,
  isHidden = false,
  space = 0,
  styleView,
  hasImage,
  width,
  height,
  source,
  iconComponent,
  title,
  iconRight,
  styleText,
  ...rest
}) => (
  <View style={[stylest.icon, style]}>
    {!isHidden && (
      <TouchableOpacity onPress={()=>{
        Keyboard.dismiss();
        onPress()
      }} {...rest}>
        <View
          style={[
            {
              paddingVertical: space,
            },
            title && {flexDirection: 'row', alignItems: 'center'},
            styleView,
          ]}>
          <View style={styleBlockIcon}>
            {titleIcon ? (
              <TextWhite>{titleIcon}</TextWhite>
            ) : hasImage ? (
              <Image
                source={source}
                style={{
                  width: width,
                  height: height,
                }}
              />
            ) : iconComponent ? (
              iconComponent
            ) : (
              <Icon name={name} size={size} color={color} type={type} />
            )}
          </View>
          {title && (
            <TextFnx spaceLeft={spaceLeft} style={styleText}>
              {title}
            </TextFnx>
          )}
        </View>
      </TouchableOpacity>
    )}
    {iconRight || null}
  </View>
);
ButtonIcon.propTypes = {
  onPress: PropTypes.func,
  name: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
  titleIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  styleBlockIcon: PropTypes.object,
  type: PropTypes.oneOf([
    constant.TYPE_ICON.FontAwesome,
    constant.TYPE_ICON.AntDesign,
    constant.TYPE_ICON.Ionicons,
    constant.TYPE_ICON.MaterialIcons,
    constant.TYPE_ICON.MaterialCommunityIcons,
    constant.TYPE_ICON.Foundation,
    constant.TYPE_ICON.Octicons,
    constant.TYPE_ICON.Zocial,
    constant.TYPE_ICON.Entypo,
    constant.TYPE_ICON.EvilIcons,
    constant.TYPE_ICON.Feather,
    constant.TYPE_ICON.Fontisto,
  ]),
  isHidden: PropTypes.bool,
};
const stylest = StyleSheet.create({
  icon: {
    paddingHorizontal: 10,
    height: 45,
    width: 45,
    justifyContent: 'center',
  },
});
export default ButtonIcon;
