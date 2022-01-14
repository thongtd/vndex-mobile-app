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
import Image from '../../../../components/Image/Image';
import Input from '../../../../components/Input';
import Layout from '../../../../components/Layout/Layout';
import TextFnx from '../../../../components/Text/TextFnx';
import {spacingApp} from '../../../../configs/constant';
import icons from '../../../../configs/icons';
import colors from '../../../../configs/styles/colors';

const Step2AddNewAds = ({submitNextStep, bntClose}) => {
  const [value, setValue] = useState(1000);

  const onSubmitNextStep = () => {
    submitNextStep();
  };
  return (
    <View style={styles.conatainer}>
      <>
        <Input
          spaceVertical={8}
          titleBtnRight="Tất cả"
          onChangeText={txt => setValue(txt)}
          value={value}
          onBtnRight={() => alert('ok')}
          placeholder="1000"
          styleBorder={{height: 'auto'}}
          style={{fontSize: 16, color: colors.text}}
          isInputTopUnit={
            <TextFnx color={colors.description} style={{marginRight: 20}}>
              AIFT
            </TextFnx>
          }
          isInputTop={
            "Tổng số tiền giao dịch"
          }
        />
        <Layout space={5} isSpaceBetween>
          <TextFnx color={colors.app.textDisabled} size={12}>
            {`Khả dụng   `}
            <TextFnx size={12} color={colors.app.textContentLevel2}>
              1,000 AIFT ≈ 25,000 VND
            </TextFnx>
          </TextFnx>
        </Layout>
      </>
      <Layout type="column" spaceTop={10}>
        <TextFnx color={colors.description}>Giới hạn lệnh</TextFnx>

        <Input
          spaceVertical={8}
          styleBorder={{height: 'auto'}}
          //   onBtnRight={() => alert('ok')}
          placeholder="20,000,000 VND ~ 50,000,000"
          style={{fontSize: 16, color: colors.text}}
          isInputTopUnit={
            <TextFnx style={{fontSize: 16, color: colors.text}}>VND</TextFnx>
          }
          isInputTop={
            <TextFnx
              color={colors.description}
              size={12}
              spaceTop={10}
              style={{marginBottom: -10}}>
              Từ
            </TextFnx>
          }
        />
        <Input
          spaceVertical={8}
          styleBorder={{height: 'auto'}}
          //   onBtnRight={() => alert('ok')}
          placeholder="20,000,000 VND ~ 50,000,000"
          style={{fontSize: 16, color: colors.text}}
          isInputTopUnit={
            <TextFnx style={{fontSize: 16, color: colors.text}}>VND</TextFnx>
          }
          isInputTop={
            <TextFnx
              color={colors.description}
              size={12}
              spaceTop={10}
              style={{marginBottom: -10}}>
              Đến
            </TextFnx>
          }
        />
      </Layout>

      <Layout isSpaceBetween isLineCenter spaceTop={10}>
        <TextFnx color={colors.description}>Phí</TextFnx>
        <TextFnx color={colors.greyLight}>0.03 USDT </TextFnx>
      </Layout>
      <Layout
        isSpaceBetween
        isLineCenter
        space={10}
        style={{
          borderBottomWidth: 1,
          borderColor: colors.app.lineSetting,
        }}>
        <TextFnx color={colors.description}>Thuế</TextFnx>
        <TextFnx color={colors.greyLight}>0.01 USDT</TextFnx>
      </Layout>

      <Layout isSpaceBetween isLineCenter spaceTop={10}>
        <TextFnx color={colors.description}>Phương thức thanh toán</TextFnx>
        <TouchableOpacity>
          <Layout isSpaceBetween isLineCenter>
            <TextFnx color={colors.highlight} spaceRight={10}>
              Thêm
            </TextFnx>
            <Image
              source={require('assets/icons/ic_add_bank.png')}
              style={{
                width: 20,
                height: 20,
              }}
            />
          </Layout>
        </TouchableOpacity>
      </Layout>

      <Layout
        type="column"
        space={10}
        style={{
          borderBottomWidth: 1,
          borderColor: colors.app.lineSetting,
        }}>
        <ButtonIcon
          space={10}
          title="Momo"
          iconComponent={icons.IcMomoSvg}
          styleText={{fontSize: 16, color: colors.description}}
          style={styles.method_payment}
          iconRight={
            <TouchableOpacity style={styles.bnt_close}>
              <Image
                source={require('assets/icons/ic_close.png')}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </TouchableOpacity>
          }
        />
        <ButtonIcon
          space={10}
          title="Chuyển khoản"
          iconComponent={icons.IcBank2}
          styleText={{fontSize: 16, color: colors.description}}
          style={styles.method_payment}
          iconRight={
            <TouchableOpacity style={styles.bnt_close}>
              <Image
                source={require('assets/icons/ic_close.png')}
                style={{
                  width: 20,
                  height: 20,
                }}
              />
            </TouchableOpacity>
          }
        />
        <TextFnx
          spaceBottom={10}
          color={colors.app.textDisabled}
          size={12}
          style={{fontStyle: 'italic'}}>
          Chọn tối đa 3 phương thức
        </TextFnx>
      </Layout>

      <Layout type="column" style={{width: '100%'}} spaceBottom={20}>
        <Button
          placeholder={'15 phút'}
          isPlaceholder={false}
          spaceVertical={20}
          isInputSize={16}
          height={'auto'}
          // onInput={() => setOpen(true)}
          isInput
          iconRight="caret-down"
          isInputLable={
            <TextFnx color={colors.description} size={12} spaceBottom={1.5}>
              Thời gian cần thanh toán
            </TextFnx>
          }
        />
      </Layout>

      <Button title={'Tiếp theo'} isNormal onPress={onSubmitNextStep} />
      {bntClose || null}
    </View>
  );
};
const styles = StyleSheet.create({
  conatainer: {
    backgroundColor: colors.app.backgroundLevel2,
    paddingTop: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: spacingApp,
    marginTop: 23,
    paddingBottom: 20,
  },
  method_payment: {
    width: '100%',
    backgroundColor: colors.app.bg363636,
    borderRadius: 3,
    height: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bnt_close: {
    marginRight: 10,
  },
});

export default Step2AddNewAds;
