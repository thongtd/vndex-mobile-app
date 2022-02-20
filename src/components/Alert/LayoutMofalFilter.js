import React, {useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';
import AlertAuth from './AlertAuth';
import TextFnx from '../Text/TextFnx';
import colors from '../../configs/styles/colors';
import Input from '../Input';
import Button from '../Button/Button';
import {dismissAllModal} from '../../navigation/Navigation';
import LayoutSpaceHorizontal from '../Layout/LayoutSpaceHorizontal';
import Container from '../Container';
import {fontSize, constant} from '../../configs/constant';
import Icon from '../Icon';
// import { SafeAreaView } from '..';
const heightScreen = Dimensions.get('window').height;

const LayoutMofalFilter = ({title = 'this is title', isTitle, children}) => {
  //   useEffect(() => {
  //     if (onResend && typeof onResend === 'function') {
  //       onResend();
  //     }
  //   }, [onResend]);

  const dismissModal = () => {
    dismissAllModal();
  };
  return (
    <SafeAreaView
      style={stylest.container}
      //   onStartShouldSetResponder={dismissModal}
    >
 <View style={[stylest.block]}>
        <LayoutSpaceHorizontal style={stylest.layoutSpace}>
          <View style={stylest.titleContent}>
            {isTitle && (
              <TextFnx
                style={stylest.textTitle}
                value={title}
                size={16}
                align="center"
              />
            )}
            <TouchableOpacity style={stylest.icClose} onPress={dismissModal}>
              <Icon
                name="close"
                color={colors.subText}
                size={18}
                type={constant.TYPE_ICON.AntDesign}
              />
            </TouchableOpacity>
          </View>
          {children}
        </LayoutSpaceHorizontal>
      </View> 
      
    </SafeAreaView>
  );
};
const windowHeight = Dimensions.get('window').height;
const navbarHeight = heightScreen - windowHeight + StatusBar.currentHeight;
const stylest = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.transparent,
    // position: 'relative',
    // zIndex: 1000,
  },
  block: {
    backgroundColor: colors.app.backgroundLevel1,
    position: 'absolute',
    width: '85%',
    alignSelf: 'flex-end',
    flex: 1,
    height: heightScreen,
    borderRadius: 5,
    zIndex: 1000,
  },
  layoutSpace: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    marginTop:40
  },
  textTitle: {
    paddingBottom: 10,
    color: colors.subText,
    width: '100%',
  },
  titleContent: {
    position: 'relative',
  },
  icClose: {
    position: 'absolute',
    top: 2,
    right: -5,
  },
});
export default LayoutMofalFilter;
