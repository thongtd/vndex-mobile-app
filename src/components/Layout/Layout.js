import React from 'react';
import {Text, View} from 'react-native';
import colors from '../../configs/styles/colors';

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
  ...rest
}) => (
  <View
    {...rest}
    style={[
      {
        flexDirection: type,
        paddingVertical: space,
        paddingHorizontal: spaceHorizontal,
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

export default Layout;
