import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Container from '../../components/Container';
import Input from '../../components/Input';
import Button from '../../components/Button/Button';
import Layout from '../../components/Layout/Layout';
import TextFnx from '../../components/Text/TextFnx';
import colors from '../../configs/styles/colors';
import {pushSingleScreenApp} from '../../navigation/Navigation';
import {ADD_PAYMENT_METHOD_SCREEN} from '../../navigation';
import ButtonIcon from '../../components/Button/ButtonIcon';
import icons from '../../configs/icons';
import Image from '../../components/Image/Image';
import { constant } from '../../configs/constant';

const PaymentMethodScreen = ({componentId}) => {
  return (
    <Container
      componentId={componentId}
      isScroll
      title="Phương thức thanh toán">
      {/* payment banking */}

      <View>
        <Layout isSpaceBetween isLineCenter>
          <TextFnx
            color={colors.textTransfer}
            style={{backgroundColor: colors.app.bg363636, borderRadius: 5}}
            spaceHorizontal={10}>
            Chuyển khoản
          </TextFnx>
          <ButtonIcon onPress={() => {}} iconComponent={icons.IcEdit} />
        </Layout>
        <Layout isSpaceBetween isLineCenter space={7}>
          <TextFnx color={colors.description}>Số tài khoản</TextFnx>
          <TextFnx color={colors.greyLight}>1903211551163</TextFnx>
        </Layout>
        <Layout isSpaceBetween isLineCenter space={7}>
          <TextFnx color={colors.description}>Tên ngân hàng</TextFnx>
          <TextFnx color={colors.greyLight}>Techcombank</TextFnx>
        </Layout>
        <Layout isSpaceBetween isLineCenter space={7}>
          <TextFnx color={colors.description}>Chi nhánh</TextFnx>
          <TextFnx color={colors.greyLight}>Thanh Xuân</TextFnx>
        </Layout>
        <Layout isSpaceBetween isLineCenter space={7}>
          <TextFnx color={colors.description}>Tên</TextFnx>
          <TextFnx color={colors.greyLight}>LU TUAN ANH</TextFnx>
        </Layout>
      </View>

      {/* payment momo */}
      <View>
        <Layout isSpaceBetween isLineCenter>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#3B2B2B',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 5,
              paddingVertical: 2,
              borderRadius: 5,
            }}>
            <Image
              source={icons.icMomo}
              style={{
                marginLeft: 5,
                width: 10,
                height: 10,
              }}
            />
            <TextFnx>Momo</TextFnx>
          </View>
          <ButtonIcon onPress={() => {}} iconComponent={icons.IcEdit} />
        </Layout>
        <Layout isSpaceBetween isLineCenter space={7}>
          <TextFnx color={colors.description}>Số điện thoại</TextFnx>
          <TextFnx color={colors.greyLight}>0126455455</TextFnx>
        </Layout>
        <Layout isSpaceBetween isLineCenter space={7}>
          <TextFnx color={colors.description}>Tên</TextFnx>
          <TextFnx color={colors.greyLight}>LU TUAN ANH</TextFnx>
        </Layout>
      </View>


      <Button
        spaceVertical={20}
        isNormal
        title="Thêm phương thức thanh toán"
        onPress={() => {
          pushSingleScreenApp(componentId, ADD_PAYMENT_METHOD_SCREEN, {
            type: constant.TYPE_PAYMENT_SCREEN.ADD_BANKING,
          });
        }}
      />
    </Container>
  );
};

export default PaymentMethodScreen;

const styles = StyleSheet.create({});
