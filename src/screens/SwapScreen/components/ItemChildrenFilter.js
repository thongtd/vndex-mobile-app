import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Layout from '../../../components/Layout/Layout';
import {TouchablePreview} from 'react-native-navigation/lib/dist/src/adapters/TouchablePreview';
import TextFnx from '../../../components/Text/TextFnx';
import Icon from '../../../components/Icon';
import colors from '../../../configs/styles/colors';
import Button from '../../../components/Button/Button';

const ItemChildrenFilter = ({
  icon = 'calendar',
  placeholder = 'From'.t(),
  space,
  onPress,
  isValue,
  isSubmit,
  label,
  isColumn,
}) => {
  return (
    <View
      style={[
        stylest.containerButton,
        isColumn && {
          width: '100%',
        },
      ]}>
      {isSubmit ? (
        <Button
          onSubmit={onPress}
          isSubmit
          textSubmit={'Search'.t()}
          isButtonCircle={false}
          style={{
            borderRadius: 8,
          }}
        />
      ) : (
        <View
          style={[
            {
              width: '100%',
            },
          ]}>
              <TextFnx space={16} color={colors.subText}>{label}</TextFnx>
          <TouchableOpacity onPress={onPress}>
            <Layout
              space={space}
              spaceHorizontal={10}
              isSpaceBetween
              style={stylest.layoutItem}>
              <TextFnx
                color={isValue ? colors.text : colors.app.textContentLevel3}
                value={placeholder}
              />
              <Icon
                name={icon}
                size={16}
                color={colors.app.textContentLevel3}
              />
            </Layout>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
const stylest = StyleSheet.create({
  containerButton: {
    width: '47%',
  },
  layoutItem: {
    borderWidth: 0.5,
    borderColor: colors.line,
    borderRadius: 8,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    height: 52,
  },
});
export default ItemChildrenFilter;
