import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
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
import {constant} from '../../configs/constant';
import BottomSheet from '../../components/ActionSheet/ActionSheet';
import {useDispatch, useSelector} from 'react-redux';
import {createAction, size} from '../../configs/utils';
import { get } from 'lodash';
import { GET_PAYMENT_METHOD_BY_ACC } from '../../redux/modules/p2p/actions';

const dataActionSheet = [
  {
    name: 'Chuyển khoản ngân hàng',
    ic: icons.IcBank2,
    type: constant.TYPE_PAYMENT_SCREEN.ADD_BANKING,
  },
  {
    name: 'Ví Momo',
    ic: icons.IcMomoSvg,
    type: constant.TYPE_PAYMENT_SCREEN.ADD_MOMO,
  },
  {
    name: 'Ví Viettl Pay',
    ic: icons.IcViettelPay,
    type: constant.TYPE_PAYMENT_SCREEN.ADD_VIETTEL_PAY,
  },
];
const PaymentMethodScreen = ({componentId}) => {
  const refAction = useRef(null);
  const dispatcher = useDispatch();
  
  useEffect(() => {
    dispatcher(createAction(GET_PAYMENT_METHOD_BY_ACC));
    return () => {
      
    }
  }, [dispatcher])
  const paymentMethods = useSelector(state => state.p2p.paymentMethods);
  const exchangePaymentMethod = useSelector(state => state.p2p.exchangePaymentMethod);

  return (
    <Container
      componentId={componentId}
      isScroll
      title="Phương thức thanh toán">
      {/* payment banking */}
      {paymentMethods &&
        size(paymentMethods) > 0 &&
        paymentMethods.map((itemPayment, index) => {
          return (
            <View key={`pm-${index}`}>
              <Layout isSpaceBetween isLineCenter>
                <TextFnx
                  color={get(itemPayment,"code") == constant.CODE_PAYMENT_METHOD.BANK_TRANSFER?colors.textTransfer:colors.text}
                  style={{
                    backgroundColor:get(itemPayment,"code") == constant.CODE_PAYMENT_METHOD.BANK_TRANSFER?colors.app.bg363636:'#3B2B2B',
                    borderRadius: 5,
                  }}
                  spaceHorizontal={10}>
                  {get(itemPayment,"name")}
                </TextFnx>
                <ButtonIcon onPress={() => {
                   pushSingleScreenApp(componentId, ADD_PAYMENT_METHOD_SCREEN, {
                    typeScreen: get(itemPayment,"code") || '',
                    item:itemPayment,
                    type:"edit"
                  });
                }} iconComponent={icons.IcEdit} />
              </Layout>
             
             {get(itemPayment,"code") == constant.CODE_PAYMENT_METHOD.BANK_TRANSFER && <Layout isSpaceBetween isLineCenter space={7}>
                <TextFnx color={colors.description}>Số tài khoản</TextFnx>
                <TextFnx color={colors.greyLight}>{get(itemPayment,"backAccountNo")}</TextFnx>
              </Layout>} 
              {get(itemPayment,"code") == constant.CODE_PAYMENT_METHOD.BANK_TRANSFER &&<Layout isSpaceBetween isLineCenter space={7}>
                <TextFnx color={colors.description}>Tên ngân hàng</TextFnx>
                <TextFnx color={colors.greyLight}>{get(itemPayment,"bankName")}</TextFnx>
              </Layout>}
              {get(itemPayment,"code") == constant.CODE_PAYMENT_METHOD.BANK_TRANSFER &&<Layout isSpaceBetween isLineCenter space={7}>
                <TextFnx color={colors.description}>Chi nhánh</TextFnx>
                <TextFnx color={colors.greyLight}>{get(itemPayment,"bankBranchName")}</TextFnx>
              </Layout>}
              
              <Layout isSpaceBetween isLineCenter space={7}>
                <TextFnx color={colors.description}>Tên</TextFnx>
                <TextFnx color={colors.greyLight}>{get(itemPayment,"fullName")}</TextFnx>
              </Layout>
              {get(itemPayment,"code") == constant.CODE_PAYMENT_METHOD.MOMO &&<Layout isSpaceBetween isLineCenter space={7}>
                <TextFnx color={colors.description}>Số điện thoại</TextFnx>
                <TextFnx color={colors.greyLight}>{get(itemPayment,"phoneNumber")}</TextFnx>
              </Layout>}
            </View>
          );
        })}

      {/* payment momo
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
      </View> */}

      <Button
        spaceVertical={20}
        isNormal
        title="Thêm phương thức thanh toán"
        onPress={() => {
          refAction.current?.setModalVisible();
        }}
      />
      {/* actionSheet */}
      <BottomSheet actionRef={refAction} title="Chọn Phương thức thanh toán">
        <View style={{paddingVertical: 20, paddingHorizontal: 10}}>
          {exchangePaymentMethod.map((_i, _ind) => (
            <View
            key={`dt-${_ind}`}
            >
              <ButtonIcon
                onPress={() => {
                  refAction.current?.hide();
                  pushSingleScreenApp(componentId, ADD_PAYMENT_METHOD_SCREEN, {
                    typeScreen: get(_i,"code") || '',
                    item:_i,
                    type:"add"
                  });
                }}
                iconComponent={get(_i,"code") == constant.CODE_PAYMENT_METHOD.MOMO?icons.IcMomoSvg:icons.IcBank2 || ''}
                title={get(_i,"name") || ''}
                style={{width: '100%'}}
              />
            </View>
          ))}
        </View>
        <View style={{height: 150}} />
      </BottomSheet>
    </Container>
  );
};

export default PaymentMethodScreen;

const styles = StyleSheet.create({});
