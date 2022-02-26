import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Navigation} from 'react-native-navigation';
import { useSelector } from 'react-redux';
import icons from '../../configs/icons';
import colors from '../../configs/styles/colors';
import {emitEventEmitter} from '../../configs/utils';
import {
  LOGIN_SCREEN,
  pushSingleScreenApp,
  pushTabBasedApp,
  pushTutorialScreen,
  ADS_HISTORY_EXCHANGE_SCREEN,
} from '../../navigation';
import Button from '../Button/Button';
import ButtonIcon from '../Button/ButtonIcon';
import Container from '../Container';
import ItemSetting from '../Item/ItemSetting';
const Drawer = ({componentId}) => {
  const handleClose = () => {
    Navigation.mergeOptions(componentId, {
      sideMenu: {
        left: {
          visible: false,
        },
      },
    });
  };
  return (
    <Container backgroundColor={colors.app.backgroundLevel2} isFlex>
      <ButtonIcon
        onPress={handleClose}
        iconComponent={icons.IcClose}
        title={'Close'}
        style={{
          width: 100,
          marginLeft: -15,
          marginBottom: 50,
        }}
      />
      <ItemSetting title={'P2P'} />
      <ItemSetting
        iconRight={false}
        iconLeftSvg={icons.IcMarketting}
        textLeft={'Quảng cáo của tôi'}
        onPress={() => {
          setTimeout(() => {
            Navigation.mergeOptions(componentId, {
              sideMenu: {
                left: {
                  visible: false,
                },
              },
            });
          }, 500);
          emitEventEmitter('pushMyads', true);
        }}
      />
      <ItemSetting
        iconRight={false}
        iconLeftSvg={icons.IcHistory}
        textLeft={'Lịch sử giao dịch'}
        onPress={() => {
          pushTabBasedApp(2);
        }}
      />
      <Button
        marginTop={40}
        isNormal
      onPress={()=>{
        setTimeout(() => {
          Navigation.mergeOptions(componentId, {
            sideMenu: {
              left: {
                visible: false,
              },
            },
          });
        }, 500);
        emitEventEmitter('pushNewAds', true);
      }}
        title={'Chào MUA/BÁN'}
        iconLeftSubmit={icons.IcMarkettingTrans}
      />
    </Container>
  );
};

export default Drawer;

const styles = StyleSheet.create({});
