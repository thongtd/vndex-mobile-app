import React, { Component } from 'react'
import { Text, View, Platform, StyleSheet, StatusBar } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import TextWhite from './Text/TextWhite'
import SafeAreaViewFnx from './SafeAreaView'
import DeviceInfo from 'react-native-device-info';
import { TouchablePreview } from 'react-native-navigation/lib/dist/adapters/TouchablePreview'
import icons from '../configs/icons'
import Icon from "react-native-vector-icons/FontAwesome5";
import ButtonIcon from './Button/ButtonIcon'
import PropTypes from 'prop-types';
import colors from '../configs/styles/colors'
import { constant } from '../configs/constant'
import { pop } from '../navigation/Navigation'
import TextFnx from './Text/TextFnx'
let hasNotch = DeviceInfo.hasNotch();
const TopBarView = ({
  isFilter,
  title = "Title",
  onClickRight,
  onClickLeft,
  nameLeft = "arrow-left",
  nameRight = "arrow-right",
  sizeIconLeft = 15,
  sizeIconRight = 15,
  colorLeft = "#fff",
  colorRight ="#fff",
  textLeft = "",
  textRight = "",
  typeRight = constant.TYPE_ICON.FontAwesome,
  typeLeft = constant.TYPE_ICON.FontAwesome,
  children,
  style,
  hasBack,
  componentId,
  
}) => {
  return (
    // <LinearGradient
    //   start={{ x: 0.0, y: 0.25 }}
    //   end={{ x: 0.5, y: 1.0 }}
    //   colors={[colors.gradientFrom, colors.gradientTo]} style={[stylest.bgLinear,style]}>
        <View style={[stylest.bgLinear,style]}>
      {children || <View style={[stylest.blockTextHeader]}>
        <ButtonIcon
        space={10}
          styleBlockIcon={{ alignItems: 'flex-start' }}
          name={nameLeft}
          onPress={hasBack?()=>pop(componentId):onClickLeft}
          size={sizeIconLeft}
          color={colorLeft}
          titleIcon={textLeft}
          type={typeLeft}
          isHidden={(onClickLeft || textLeft || nameLeft) ? false : true}
        />
        <View style={[stylest.flex1, stylest.viewCenter, { width: "60%" }]}>
          <TextFnx size={16} weight={"bold"} value={title} />
        </View>
        <ButtonIcon
          space={10}
          styleBlockIcon={{ alignItems: 'flex-end' }}
          name={nameRight}
          onPress={onClickRight}
          size={sizeIconRight}
          color={colorRight}
          titleIcon={textRight}
          type={typeRight}
          isHidden={onClickRight ? false : true}
        />
      </View>}
      </View>
  );

}
export default TopBarView;
TopBarView.propTypes = {
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
  title: PropTypes.string,
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
    constant.TYPE_ICON.Fontisto
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
    constant.TYPE_ICON.Fontisto
  ]),

}
const stylest = StyleSheet.create({
  bgLinear: {
    height: hasNotch ? 85 : StatusBar.currentHeight > 24 ? 80 : 60,
    width: "100%",
    position: "relative",
    // marginBottom: 15,
    backgroundColor:colors.baseBg
  },
  blockTextHeader: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    height: 45,
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  viewCenter: {
    alignItems: "center",
    justifyContent: "center",
  },
  flex1: {
    width: "20%",
    lineHeight: 45
  }
})