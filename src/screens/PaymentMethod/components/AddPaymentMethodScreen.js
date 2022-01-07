import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Container from '../../../components/Container';
import Input from '../../../components/Input';
import Button from '../../../components/Button/Button';
import {CONFIRM_LOGIN_SCREEN, pushSingleScreenApp} from '../../../navigation';
import {constant} from '../../../configs/constant';
import TextFnx from '../../../components/Text/TextFnx';
import Layout from '../../../components/Layout/Layout';
import colors from '../../../configs/styles/colors';
import Icon from '../../../components/Icon';
import icons from '../../../configs/icons';

const AddPaymentMethodScreen = ({componentId, typeScreen = ''}) => {
  const getTitleScreen = () => {
    switch (typeScreen) {
      case constant.TYPE_PAYMENT_SCREEN.ADD_BANKING:
        return 'Thêm chuyển khoản ngân hàng';
      case constant.TYPE_PAYMENT_SCREEN.ADD_MOMO:
        return 'Thêm ví MoMo';
      case constant.TYPE_PAYMENT_SCREEN.ADD_VIETTEL_PAY:
        return 'Thêm ví Viettel Pay';
    }
  };

  const renderLayout = () => {
    switch (typeScreen) {
      case constant.TYPE_PAYMENT_SCREEN.ADD_BANKING:
        return (
          <>
            <Input placeholder="LU TUAN ANH" isLabel label="Tên *" />
            <Input
              placeholder="Nhập số tài khoản ngân hàng"
              isLabel
              label="Tài khoản ngân hàng/ Số thẻ *"
            />
            <Input
              placeholder="Nhập tên ngân hàng"
              isLabel
              label="Tên ngân hàng *"
            />
            <Input
              placeholder="Nhập thông tin chi nhánh ngân hàng"
              isLabel
              label="Chi nhánh"
            />
          </>
        );
      case constant.TYPE_PAYMENT_SCREEN.ADD_MOMO:
        return (
          <>
            <Input placeholder="LU TUAN ANH" isLabel label="Họ tên" />
            <Input
              placeholder="Nhập số điện thoại của bạn"
              isLabel
              label="Số điện thoại"
            />
          </>
        );
      case constant.TYPE_PAYMENT_SCREEN.ADD_VIETTEL_PAY:
        return (
          <>
            <Input placeholder="LU TUAN ANH" isLabel label="Họ tên *" />
            <Input
              placeholder="Nhập địa chỉ email của bạn"
              type="email"
              isLabel
              label="Email"
            />
            <Input
              placeholder="Nhập địa chỉ email của bạn"
              isLabel
              label="Số điện thoại"
            />
          </>
        );
    }
  };

  return (
    <Container
      componentId={componentId}
      isScroll
      title={getTitleScreen() || ''}>
      <>
        {renderLayout()}
        <Layout space={10} isSpaceBetween>
          <View style={{paddingRight: 10, marginTop: 3}}>
            <Icon iconComponent={icons.IcNote} />
          </View>

          <TextFnx
            color={colors.app.textContentLevel3}
            style={{lineHeight: 20}}>
            Khi bạn bán tiền mã hoá, phương thức thanh toán được thêm sẽ được
            hiển thị cho người mua trong quá trình giao dịch để chấp nhận chuyển
            tiền pháp định, do đó hãy đảm bảo thông tin là chính xác.
          </TextFnx>
        </Layout>
      </>

      <Button
        spaceVertical={10}
        isNormal
        title="Xác nhận"
        onPress={() => {
          pushSingleScreenApp(componentId, CONFIRM_LOGIN_SCREEN, {
            twoFactorType: constant.TWO_FACTOR_TYPE.EMAIL_2FA,
          });
        }}
      />
    </Container>
  );
};

export default AddPaymentMethodScreen;

const styles = StyleSheet.create({});
