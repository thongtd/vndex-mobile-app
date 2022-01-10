import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import { useActionsP2p } from '../../../redux';
import { get, isEmpty } from 'lodash';
import { listenerEventEmitter, toast } from '../../../configs/utils';
import { pop } from '../../../navigation/Navigation';
import { useDispatch, useSelector } from 'react-redux';

const AddPaymentMethodScreen = ({type, componentId, typeScreen = '',item}) => {
  const [fullName, setFullName] = useState(get(item,"fullName"));
  const [branchName, setBranchName] = useState(get(item,"bankBranchName"));
  const [bankName, setBankName] = useState(get(item,"bankName"));
  const [phoneNumber, setPhoneNumber] = useState(get(item,"phoneNumber"));
  const [bankAccNo, setBankAccNo] = useState(get(item,"backAccountNo"));
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = useSelector(state => state.authentication.userInfo);
  const getTitleScreen = () => {
    switch (typeScreen) {
      case constant.CODE_PAYMENT_METHOD.BANK_TRANSFER:
        return `${type == "add"?'Thêm':"Sửa"} chuyển khoản ngân hàng`;
      case constant.CODE_PAYMENT_METHOD.MOMO:
        return `${type == "add"?'Thêm':"Sửa"} ví MoMo`;
    }
  };
  const dispatcher = useDispatch();
  useEffect(() => {
    let ev = listenerEventEmitter('doneApi',()=>{
      setIsLoading(false);
      pop(componentId);
    })
    return () => {
      ev.remove()
    }
  }, [componentId])
  const renderLayout = () => {
    switch (typeScreen) {
      case constant.CODE_PAYMENT_METHOD.BANK_TRANSFER:
        return (
          <>
            <Input
              hasValue
              value={fullName}
              onChangeText={text => setFullName(text)}
              placeholder="Nhập tên của bạn"
              isLabel
              label="Tên *"
            />
            <Input
              hasValue
              value={bankAccNo}
              onChangeText={text => setBankAccNo(text)}
              placeholder="Nhập số tài khoản ngân hàng"
              isLabel
              label="Tài khoản ngân hàng/ Số thẻ *"
            />
            <Input
              hasValue
              value={bankName}
              onChangeText={text => setBankName(text)}
              placeholder="Nhập tên ngân hàng"
              isLabel
              label="Tên ngân hàng *"
            />
            <Input
              hasValue
              value={branchName}
              onChangeText={text => setBranchName(text)}
              placeholder="Nhập thông tin chi nhánh ngân hàng"
              isLabel
              label="Chi nhánh"
            />
          </>
        );
      case constant.CODE_PAYMENT_METHOD.MOMO:
        return (
          <>
            <Input  hasValue
              value={fullName}
              onChangeText={text => setFullName(text)} placeholder="LU TUAN ANH" isLabel label="Họ tên" />
            <Input
             hasValue
             value={phoneNumber}
             onChangeText={text => setPhoneNumber(text)}
              placeholder="Nhập số điện thoại của bạn"
              isLabel
              label="Số điện thoại"
            />
          </>
        );
      // case constant.TYPE_PAYMENT_SCREEN.ADD_VIETTEL_PAY:
      //   return (
      //     <>
      //       <Input placeholder="LU TUAN ANH" isLabel label="Họ tên *" />
      //       <Input
      //         placeholder="Nhập địa chỉ email của bạn"
      //         type="email"
      //         isLabel
      //         label="Email"
      //       />
      //       <Input
      //         placeholder="Nhập địa chỉ email của bạn"
      //         isLabel
      //         label="Số điện thoại"
      //       />
      //     </>
      //   );
    }
  };

  return (
    <Container
      isLoadding={isLoading}
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
          if(get(item,"code") == constant.CODE_PAYMENT_METHOD.BANK_TRANSFER){
            if(isEmpty(fullName)){
              return toast('Vui lòng nhập đầy đủ họ tên');
            }else if(isEmpty(bankAccNo)){
              return toast('Vui lòng nhập số tài khoản');
            }else if(isEmpty(bankName)){
              return toast('Vui lòng nhập tên ngân hàng');
            }
          }else if(get(item,"code") == constant.CODE_PAYMENT_METHOD.MOMO){
            if(isEmpty(fullName)){
              return toast('Vui lòng nhập đầy đủ họ tên');
            }else if(isEmpty(phoneNumber)){
              return toast('Vui lòng nhập số điện thoại');
            }
          }
          setIsLoading(true);
          if(type == "add"){
            useActionsP2p(dispatcher).handleAddPaymentMethod({
              exPaymentMethodId: get(item,"id"),
              fullName: fullName|| "",
              backAccountNo: bankAccNo || "",
              bankName: bankName || "",
              bankBranchName: branchName || "",
              phoneNumber: phoneNumber || "",
              emailAddress: "",
              description: ""
             })
          }else{
            useActionsP2p(dispatcher).handleAddPaymentMethod({
              exPaymentMethodId: get(item,"exPaymentMethodId"),
              fullName: fullName|| "",
              backAccountNo: bankAccNo || "",
              bankName: bankName || "",
              bankBranchName: branchName || "",
              phoneNumber: phoneNumber || "",
              emailAddress: "",
              description: "",
              id:get(item,"id")
             })
          }
         
        }}
      />
      {type == "edit" && <Button
        spaceVertical={10}
        isClose
        textClose="Xoá"
        colorTitleClose={colors.app.sell}
        onClose={() => {
          setIsLoading(true);
          
            useActionsP2p(dispatcher).handleRemovePaymentMethod({
              data:{
                ids:[get(item,"id")]
              },
              accId:get(userInfo,"id")
             })
         
        }}
      />} 
    </Container>
  );
};

export default AddPaymentMethodScreen;

const styles = StyleSheet.create({});
