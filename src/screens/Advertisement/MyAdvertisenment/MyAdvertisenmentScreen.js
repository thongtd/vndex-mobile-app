import React, {useState} from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import ButtonIcon from '../../../components/Button/ButtonIcon';
import Container from '../../../components/Container';
import Icon from '../../../components/Icon';
import Image from '../../../components/Image/Image';
import Layout from '../../../components/Layout/Layout';
import TextFnx from '../../../components/Text/TextFnx';
import {IdNavigation} from '../../../configs/constant';
import icons from '../../../configs/icons';
import colors from '../../../configs/styles/colors';
import {ADS_ADD_NEW_SCREEN, pushSingleScreenApp} from '../../../navigation';
import BoxCommand from '../../CommandScreen/components/BoxCommand';
import ButtonAddNew from './ButtonAddNew';

const MyAdvertisenmentScreen = ({componentId}) => {
  const [isEnabled, setIsEnabled] = useState(true);

  const onAddNewAdvertisenment = () => {
    pushSingleScreenApp(componentId, ADS_ADD_NEW_SCREEN, null, {
      topBar: {
        rightButtons: [
          {
            id: IdNavigation.PressIn.warningAddNewAds,
            icon: require('assets/icons/ic_warning.png'),
          },
        ],
      },
    });
  };
  const onSeeDetailCommand = () => {
    alert('Xem chi tiết lệnh');
  };

  return (
    <Container
      componentId={componentId}
      isScroll
      title="Quảng cáo của tôi"
      spaceHorizontal={0}>
      <ButtonAddNew onPress={onAddNewAdvertisenment} />
      <View style={{paddingHorizontal: 20}}>
        <BoxCommand
          onSeeDetailCommand={onSeeDetailCommand}
          type="MUA"
          price="53,083.14"
          unit="VND"
          nameCoin="AIF"
          //   dateTime="2021-11-07 09:25:49"
          contentCenter={
            <>
              <Layout isSpaceBetween isLineCenter spaceBottom={10}>
                <TextFnx color={colors.btnClose} size={12}>
                  Khả dụng
                </TextFnx>
                <TextFnx color={colors.greyLight} size={12}>
                  89.25 NGT
                </TextFnx>
              </Layout>
              <Layout isSpaceBetween isLineCenter spaceBottom={10}>
                <TextFnx color={colors.btnClose} size={12}>
                  Giới hạn
                </TextFnx>
                <TextFnx color={colors.greyLight} size={12}>
                  50,000,000 - 1,000,000,000 VND
                </TextFnx>
              </Layout>
            </>
          }
          contentBottom={
            <Layout isSpaceBetween isLineCenter>
              <Layout isLineCenter>
                <Image
                  source={icons.icBankPng}
                  style={{
                    width: 18,
                    height: 18,
                    marginRight: 5,
                  }}
                />
                <Image
                  source={icons.icMomo}
                  style={{
                    width: 18,
                    height: 18,
                  }}
                />
              </Layout>

              <Layout isLineCenter>
                <TextFnx color={colors.btnClose} size={12} spaceRight={10}>
                  {isEnabled ? 'Đag bật' : 'Đang tắt'}
                </TextFnx>
                <Switch
                  trackColor={{false: '#767577', true: colors.iconButton}}
                  thumbColor={colors.greyLight}
                  ios_backgroundColor="#3e3e3e"
                  value={isEnabled}
                  onValueChange={() =>
                    setIsEnabled(previousState => !previousState)
                  }
                />
              </Layout>
              {/* <ButtonIcon
                onPress={() => {}}
                iconComponent={icons.IcChat}
                title={'Seller001'}
                style={{
                  width: 'auto',
                  backgroundColor: colors.background,
                  height: 'auto',
                  borderRadius: 5,
                }}
                spaceLeft={5}
              /> */}
            </Layout>
          }
        />
      </View>
    </Container>
  );
};

export default MyAdvertisenmentScreen;

const styles = StyleSheet.create({});
