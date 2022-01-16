import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Image from '../../../components/Image/Image';
import Layout from '../../../components/Layout/Layout';
import TextFnx from '../../../components/Text/TextFnx';
import icons from '../../../configs/icons';
import colors from '../../../configs/styles/colors';

const BoxCommand = ({
  item,
  dateTime = '',
  type,
  isSell,
  price,
  unit,
  icon,
  nameCoin,
  contentCenter,
  contentBottom,
  onSeeDetailCommand,
}) => {
  return (
    <Layout space={10} style={styles.containerLayout} type="column">
      <TouchableOpacity
        style={{width: '100%'}}
        onPress={() => onSeeDetailCommand({...item})}>
        <Layout isSpaceBetween isLineCenter spaceBottom={10}>
          <Layout isLineCenter>
            <TextFnx
              weight="bold"
              color={isSell ? colors.app.sell : colors.app.buy}>
              {type || ''}
            </TextFnx>
            {(dateTime && (
              <TextFnx color={colors.app.textDisabled} size={12} spaceLeft={10}>
                {dateTime}
              </TextFnx>
            )) ||
              null}
          </Layout>
          <Image
            source={icons.icArrowRight}
            style={{
              width: 14,
              height: 14,
            }}
          />
        </Layout>

        <Layout isSpaceBetween isLineCenter spaceBottom={10}>
          <Layout isLineCenter>
            {(icon && (
              <Image
                source={require('assets/icons/ic_usdt.png')}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            )) ||
              null}
            <TextFnx color={colors.subText} spaceLeft={(icon && 10) || 0}>
              {nameCoin || ''}
            </TextFnx>
          </Layout>
          <Layout isLineCenter>
            <TextFnx weight="bold" color={colors.buy} size={16}>
              {price || ''}
            </TextFnx>
            <TextFnx weight="500" color={colors.description} spaceLeft={10}>
              {unit || ''}
            </TextFnx>
          </Layout>
        </Layout>

        {contentCenter || null}
      </TouchableOpacity>

      {contentBottom || null}
    </Layout>
  );
};

export default memo(BoxCommand);

const styles = StyleSheet.create({
  containerLayout: {
    borderBottomWidth: 1,
    borderBottomColor: colors.app.lineSetting,
  },
});
