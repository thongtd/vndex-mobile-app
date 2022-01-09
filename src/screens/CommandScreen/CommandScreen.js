import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ButtonIcon from '../../components/Button/ButtonIcon';
import Container from '../../components/Container';
import Layout from '../../components/Layout/Layout';
import TextFnx from '../../components/Text/TextFnx';
import icons from '../../configs/icons';
import colors from '../../configs/styles/colors';
import BoxCommand from './components/BoxCommand';
import ButtonTop from './components/ButtonTop';

const CommandScreen = ({componentId}) => {
  const [activeMenu, setActiveMenu] = useState(1);

  const onChangeActive = (menu = {}) => {
    setActiveMenu(menu?.id || 1);
  };
  const onSelectUnit = () => {
    alert('Lựa chọn đợn vị');
  };
  const onSeeDetailCommand = () => {
    alert('Xem chi tiết lệnh');
  };
  return (
    <Container componentId={componentId} isScroll title="Lịch sử giao dịch">
      <ButtonTop
        onChangeActive={onChangeActive}
        activeMenu={activeMenu}
        onSelect={onSelectUnit}
      />

      <BoxCommand
        onSeeDetailCommand={onSeeDetailCommand}
        type="MUA"
        price="53,083.14"
        unit="VND"
        nameCoin="AIF"
        dateTime="2021-11-07 09:25:49"
        contentCenter={
          <>
            <Layout isSpaceBetween isLineCenter spaceBottom={10}>
              <TextFnx color={colors.btnClose} size={12}>
                Giá
              </TextFnx>
              <TextFnx color={colors.greyLight} size={12}>
                23.152 VND
              </TextFnx>
            </Layout>
            <Layout isSpaceBetween isLineCenter spaceBottom={10}>
              <TextFnx color={colors.btnClose} size={12}>
                Số lượng
              </TextFnx>
              <TextFnx color={colors.greyLight} size={12}>
                89.25 AIFT
              </TextFnx>
            </Layout>
          </>
        }
        contentBottom={
          <Layout isSpaceBetween isLineCenter>
            <ButtonIcon
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
            />
            <TextFnx
              color={colors.green}
              style={{
                backgroundColor: colors.app.bgBuy,
                borderRadius: 5,
              }}
              spaceHorizontal={12}>
              Hoàn thành
            </TextFnx>
          </Layout>
        }
      />

      <BoxCommand
        onSeeDetailCommand={onSeeDetailCommand}
        isSell
        type="MUA"
        price="53,083.14"
        nameCoin="AIF"
        unit="VND"
        dateTime="2021-11-07 09:25:49"
        contentCenter={
          <>
            <Layout isSpaceBetween isLineCenter spaceBottom={10}>
              <TextFnx color={colors.btnClose} size={12}>
                Giá
              </TextFnx>
              <TextFnx color={colors.greyLight} size={12}>
                23.152 VND
              </TextFnx>
            </Layout>
            <Layout isSpaceBetween isLineCenter spaceBottom={10}>
              <TextFnx color={colors.btnClose} size={12}>
                Số lượng
              </TextFnx>
              <TextFnx color={colors.greyLight} size={12}>
                89.25 AIFT
              </TextFnx>
            </Layout>
          </>
        }
        contentBottom={
          <Layout isSpaceBetween isLineCenter>
            <ButtonIcon
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
            />
            <TextFnx
              color={colors.green}
              style={{
                backgroundColor: colors.app.bgBuy,
                borderRadius: 5,
              }}
              spaceHorizontal={12}>
              Hoàn thành
            </TextFnx>
          </Layout>
        }
      />
    </Container>
  );
};

export default CommandScreen;

const styles = StyleSheet.create({
  containerLayout: {
    borderBottomWidth: 1,
    borderBottomColor: colors.app.lineSetting,
  },
});
