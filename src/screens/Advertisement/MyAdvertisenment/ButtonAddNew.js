import React from 'react';
import {StyleSheet, View} from 'react-native';
import ButtonIcon from '../../../components/Button/ButtonIcon';
import icons from '../../../configs/icons';
import colors from '../../../configs/styles/colors';

const ButtonAddNew = ({onPress}) => {
  return (
    <ButtonIcon
      title="Tạo MUA BÁN mới"
      onPress={onPress}
      iconComponent={icons.IcEdit2}
      styleText={styles.text}
      style={styles.bnt}
      space={23}
      styleView={styles.hori_20}
    />
  );
};

export default ButtonAddNew;

const styles = StyleSheet.create({
  text: {
    color: colors.description,
    fontSize: 16,
  },
  bnt: {
    width: 'auto',
    backgroundColor: colors.navigation,
    height: 'auto',
    paddingHorizontal: 0,
  },
  hori_20: {
    paddingHorizontal: 20,
  },
});
