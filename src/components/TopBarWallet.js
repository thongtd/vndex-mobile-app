import React from 'react';
import {Text, View, Image, StyleSheet, ImageBackground} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../configs/styles/colors';
import icons from '../configs/icons';
import ButtonIcon from './Button/ButtonIcon';
import RenderItem from './RenderItem';
import PropTypes from 'prop-types';
import TextWhite from './Text/TextWhite';
import {constant, spacingApp} from '../configs/constant';

const TopBarWallet = ({
  children,
}) => (
  <View
    // start={{ x: 0.0, y: 0.25 }}
    // end={{ x: 0.5, y: 1.0 }}
    // colors={[colors.gradientFrom, colors.gradientTo]}
    style={stylest.container}>
    <ImageBackground
      source={icons.bgWallet}
      resizeMode="cover"
      style={{flex: 1}}>
   
      {children}
    </ImageBackground>
    
  </View>
);
const stylest = StyleSheet.create({
  bgTopBar: {
    width: 240,
  },
  blockWallet: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  container: {
    height: 182,
    paddingHorizontal:spacingApp,
    backgroundColor:colors.app.backgroundLevel1
    // overflow: 'hidden',
  },
  blockFeature: {
    flexDirection: 'row',
    height: '100%',
    position: 'absolute',
    top: 30,
  },
  viewFake: {width: '60%', justifyContent: 'center', alignItems: 'center'},
});
TopBarWallet.propTypes = {
  renderItem: PropTypes.element,
  onClickRight: PropTypes.func,
  onClickLeft: PropTypes.func,
  nameRight: PropTypes.string,
  nameLeft: PropTypes.string,
  sizeIconLeft: PropTypes.number,
  sizeIconRight: PropTypes.number,
  colorRight: PropTypes.string,
  colorLeft: PropTypes.string,
  textLeft: PropTypes.string,
  textRight: PropTypes.string,
  typeRight: PropTypes.oneOf([
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
  typeLeft: PropTypes.oneOf([
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
};
export default TopBarWallet;
