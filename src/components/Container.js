import React, {useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  Touchable,
  TouchableOpacityBase,
  TouchableOpacity,
} from 'react-native';
import TopBarView from './TopBarView';
import SafeAreaViewFnx from './SafeAreaView';
import PropTypes from 'prop-types';
import {constant, spacingApp} from '../configs/constant';
import Spinner from './Layout/Spinner';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LayoutSplashScreen from './Layout/LayoutSplashScreen';
import TaskBackground from '../redux/Provider/TaskBackground';
import {StatusBar} from 'react-native';
import colors from '../configs/styles/colors';
import {Navigation} from 'react-native-navigation';
import {BUTTON_ICON_RIGHT_NAV} from '../navigation';
import {useRef} from 'react';
import Button from './Button/Button';
import TextFnx from './Text/TextFnx';
import Layout from './Layout/Layout';
const Container = ({
  children,
  ref,
  resAwareScrollView,
  isFooter,
  isTopBar = true,
  title = '',
  onClickRight,
  onClickLeft,
  nameLeft,
  nameRight,
  sizeIconLeft = 15,
  sizeIconRight = 15,
  colorLeft,
  colorRight,
  textLeft = '',
  textRight = '',
  typeRight = constant.TYPE_ICON.FontAwesome,
  typeLeft = constant.TYPE_ICON.FontAwesome,
  customTopBar = null,
  space = 0,
  hasBack,
  componentId,
  isLayoutAuth = false,
  isSplashScreen,
  isLoadding,
  isScroll,
  isFlex = true,
  style,
  refreshing = false,
  onRefresh,
  isFilter,
  spaceHorizontal = spacingApp,
  backgroundColor=colors.app.backgroundLevel1,
  isNotTranslateTitle,
  customsNavigation=()=>{}
}) => {
  const scrollRef = useRef();
  useEffect(() => {
    customsNavigation();
    if (isTopBar) {
      Navigation.mergeOptions(componentId, {
        topBar: {
          animate: true,
          title: {
            text:isNotTranslateTitle?title: title.t(),
          },
        },
      });
    } else {
      Navigation.mergeOptions(componentId, {
        topBar: {
          animate: true,
          visible: false,
        },
      });
    }

    return () => {};
  }, [isTopBar, componentId,isNotTranslateTitle, title]);
  const onPressTouch = () => {
    scrollRef.current?.scrollToPosition(0, 0);
  };
  return (
    <>
      {/* <StatusBar barStyle="light-content" /> */}
      <TaskBackground componentId={componentId} />
      {isLayoutAuth ? (
        <LayoutSplashScreen
          isSplashScreen={isSplashScreen}
          isLoadding={isLoadding}>
          {children}
        </LayoutSplashScreen>
      ) : (
        <>
          {customTopBar && customTopBar}
          <View
            style={[
              stylest.container,
              {
                paddingTop: space,
                backgroundColor: backgroundColor,
                paddingHorizontal: spaceHorizontal,
              },
              isFlex && {flex: 1},
              style,
            ]}>
            <Spinner visible={isLoadding} />
            {isScroll ? (
              <KeyboardAwareScrollView
                ref={scrollRef}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                {...resAwareScrollView}>
                {children}

                {isFooter && (
                  <Layout isCenter space={20}>
                    <TouchableOpacity
                      onPress={onPressTouch}
                      style={{
                        // position:"absolute",
                        // bottom:10,
                        width: 130,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 10,
                        borderRadius: 35,
                        backgroundColor: colors.app.backgroundLevel3,
                      }}>
                      <TextFnx color={colors.app.yellowHightlight}>
                        Lên trên cùng
                      </TextFnx>
                    </TouchableOpacity>
                  </Layout>
                )}
              </KeyboardAwareScrollView>
            ) : (
              <SafeAreaView
                style={{
                  flex: 1,
                }}>
                {children}
              </SafeAreaView>
            )}
          </View>
        </>
      )}
    </>
  );
};
Container.propTypes = {
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
  customTopBar: PropTypes.element,
};
const stylest = StyleSheet.create({
  container: {
    zIndex: 1,
  },
});
export default Container;
