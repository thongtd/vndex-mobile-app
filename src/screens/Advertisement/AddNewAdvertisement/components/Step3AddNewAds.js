import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';

import Button from '../../../../components/Button/Button';
import ButtonIcon from '../../../../components/Button/ButtonIcon';
import Input from '../../../../components/Input';
import Layout from '../../../../components/Layout/Layout';
import TextFnx from '../../../../components/Text/TextFnx';
import {spacingApp} from '../../../../configs/constant';
import colors from '../../../../configs/styles/colors';
import {RadioButton} from 'react-native-paper';
import icons from '../../../../configs/icons';
import Image from '../../../../components/Image/Image';
import CheckBox from 'react-native-check-box';
import { get } from '../../../../configs/utils';

const Step3AddNewAds = ({submitNextStep, bntClose, dataState,...rest}) => {

  const onSubmitNextStep = () => {
    submitNextStep();
  };
  return (
    <View
      style={{
        backgroundColor: colors.app.backgroundLevel2,
        paddingTop: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingHorizontal: spacingApp,
        marginTop: 23,
        paddingBottom: 20,
      }}>
      <Layout type="column">
        <Input
          spaceVertical={8}
          styleBorder={{height: 'auto'}}
          placeholder="Điều khoản sẽ được hiển thị cho đối tác"
          style={styles.textArea}
          hasValue
          value={get(dataState,"comment")}
          onChangeText={(text)=>rest.onCommentChange(text)}
          restInput={{
            numberOfLines: 10,
            multiline: true,
          }}
          isInputTop={
            <TextFnx
              color={colors.description}
              size={12}
              spaceTop={10}
              style={{marginBottom: -2}}>
              Lưu ý
            </TextFnx>
          }
        />
        <Input
          spaceVertical={8}
          styleBorder={{height: 'auto'}}
          placeholder="Tin nhắn trả lời tự động sẽ được gửi đến đối tác khi họ đặt lệnh"
          style={styles.textArea}
          hasValue
          value={get(dataState,"autoReplyMessage")}
          onChangeText={(text)=>rest.onAutoRepChange(text)}
          restInput={{
            numberOfLines: 10,
            multiline: true,
          }}
          isInputTop={
            <TextFnx
              color={colors.description}
              size={12}
              spaceTop={10}
              style={{marginBottom: -2}}>
              Trả lời tự động
            </TextFnx>
          }
        />
      </Layout>
      <Layout
        type="column"
        space={10}
        style={{
          borderBottomWidth: 1,
          borderColor: colors.app.lineSetting,
        }}>
        <TextFnx color={colors.highlight} space={10}>
          Thêm điều kiện cho đối tác
        </TextFnx>
        <TextFnx color={colors.description} size={12} spaceBottom={20}>
          Thêm yêu cầu cho đối tác sẽ làm quảng cáo của bạn bị giảm khả năng
          tiếp cận
        </TextFnx>

        <CheckBox
          isChecked={get(dataState,"isSelectedKYC")}
          onClick={()=>{}}
          style={styles.checkbox}
          // rightTextView={'Momo'}
          checkedCheckBoxColor={colors.iconButton}
          checkBoxColor={colors.text}
          uncheckedCheckBoxColor={colors.description}
          style={[styles.bntRaio, styles.bntchecked]}
          rightTextView={
            <View style={{marginLeft: 15}}>
              <TextFnx size={16}>Đã hoàn tất KYC </TextFnx>
            </View>
          }
        />
        {/* <CheckBox
          isChecked={get(dataState,"isSelectedRegister")}
          onClick={rest.onCheckReg}
          style={styles.checkbox}
          // rightTextView={'Momo'}
          checkedCheckBoxColor={colors.iconButton}
          checkBoxColor={colors.text}
          uncheckedCheckBoxColor={colors.description}
          style={[styles.bntRaio, styles.bntchecked]}
          rightTextView={
            <View style={{marginLeft: 15}}>
              <TextFnx color={colors.description} size={12} spaceBottom={3}>
                Đã đăng ký
              </TextFnx>
              <Layout>
                <TextFnx size={16}>10 </TextFnx>
                <TextFnx size={16} color={colors.description} spaceRight={10}>
                  ngày trước
                </TextFnx>
              </Layout>
            </View>
          }
        /> */}
        {/* <CheckBox
          isChecked={isSelectedAIFT}
          onClick={() => setSelectedAIFT(!isSelectedAIFT)}
          style={styles.checkbox}
          // rightTextView={'Momo'}
          checkedCheckBoxColor={colors.iconButton}
          checkBoxColor={colors.text}
          uncheckedCheckBoxColor={colors.description}
          style={[styles.bntRaio, styles.bntchecked]}
          rightTextView={
            <View style={{marginLeft: 15}}>
              <TextFnx color={colors.description} size={12} spaceBottom={3}>
                Sở hữu nhiều hơn hơn
              </TextFnx>
              <Layout>
                <TextFnx size={16}>10000</TextFnx>
                <TextFnx size={16} color={colors.description} spaceRight={10}>
                  AIFT
                </TextFnx>
              </Layout>
            </View>
          }
        /> */}
      </Layout>

      <Layout type="column" style={{width: '100%'}} spaceBottom={20}>
        <TextFnx color={colors.description} space={10}>
          Trạng thái
        </TextFnx>
        <ButtonIcon
          title={'Online, đăng ngay'}
          onPress={()=>rest.onCheckStatus('first')}
          style={styles.bntRaio}
          styleText={{
            color: get(dataState,"checkedStatus")=== 'first' ? colors.iconButton : colors.description,
          }}
          iconComponent={
            <RadioButton
              value="first"
              color={colors.iconButton}
              uncheckedColor={colors.description}
              status={get(dataState,"checkedStatus")=== 'first' ? 'checked' : 'unchecked'}
              onPress={()=>rest.onCheckStatus('first')}
            />
          }
        />
        <ButtonIcon
          title={'Offline, thực hiện sau'}
          onPress={()=>rest.onCheckStatus('second')}
          style={styles.bntRaio}
          styleText={{
            color:
              get(dataState,"checkedStatus")=== 'second' ? colors.iconButton : colors.description,
          }}
          iconComponent={
            <RadioButton
              value="second"
              color={colors.iconButton}
              uncheckedColor={colors.description}
              status={get(dataState,"checkedStatus")=== 'second' ? 'checked' : 'unchecked'}
              onPress={()=>rest.onCheckStatus('second')}
            />
          }
        />
      </Layout>
      <Button title={'Tiếp theo'} isNormal onPress={onSubmitNextStep} />
      {bntClose || null}
    </View>
  );
};

export default Step3AddNewAds;

const styles = StyleSheet.create({
  bntRaio: {
    backgroundColor: colors.background,
    width: '100%',
    borderRadius: 8,
    height: 56,
    marginBottom: 10,
  },
  bntchecked: {
    justifyContent: 'center',
    paddingHorizontal: 15,
  },

  textArea: {
    height: 130,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    fontSize: 16,
  },
});
