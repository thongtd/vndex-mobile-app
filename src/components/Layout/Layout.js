import React from 'react';
import {Text, View} from 'react-native';
import colors from '../../configs/styles/colors';
import { ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
const Layout = ({
  children,
  type = 'row',
  isCenter,
  isSpaceBetween,
  style,
  space = 0,
  spaceHorizontal = 0,
  isTransparent,
  isLineCenter,
  isRightColumn,
  spaceRight,
  spaceLeft,
  spaceTop,
  spaceBottom,
  ...rest
}) => (
  <View
    {...rest}
    style={[
      {
        flexDirection: type,
        paddingVertical: space,
        paddingHorizontal: spaceHorizontal,
        paddingTop: spaceTop,
        paddingBottom: spaceBottom,
        paddingRight: spaceRight,
        paddingLeft: spaceLeft
      },
      isCenter && {
        alignItems: 'center',
        justifyContent: 'center',
      },
      isLineCenter && {
        alignItems: 'center',
      },
      isSpaceBetween && {
        justifyContent: 'space-between',
      },
      isTransparent && {
        backgroundColor: colors.transparent,
        flex: 1,
      },
      isRightColumn && {
        alignItems: 'flex-end',
      },
      style,
    ]}>
    {children}
  </View>
);


Layout.propTypes = {
  style: ViewPropTypes.style
};
export default Layout;
