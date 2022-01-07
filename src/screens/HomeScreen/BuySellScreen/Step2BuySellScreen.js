import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Container from '../../../components/Container';
import Icon from '../../../components/Icon';
import Layout from '../../../components/Layout/Layout';
import TextFnx from '../../../components/Text/TextFnx';
import {fontSize, spacingApp} from '../../../configs/constant';
import icons from '../../../configs/icons';
import colors from '../../../configs/styles/colors';
import TimelineBuySell from './TimelineBuySell';
import {Rating, AirbnbRating} from 'react-native-ratings';
import Image from '../../../components/Image/Image';
import Input from '../../../components/Input';
import Button from '../../../components/Button/Button';
import {pushSingleScreenApp, STEP_2_BUY_SELL_SCREEN} from '../../../navigation';

const Step2BuySellScreen = ({componentId}) => {
  return (
    <Container
      space={15}
      spaceHorizontal={0}
      isTopBar
      isScroll
      componentId={componentId}
      title="MUA USDT">
      <Layout
        isLineCenter
        style={{
          backgroundColor: '#41330D',
          paddingHorizontal: 10,
          paddingVertical: 5,
          marginBottom: 15,
        }}>
        <Icon iconComponent={icons.IcTimer} />
        <TextFnx spaceHorizontal={10} size={fontSize.f12}>
          Thời gian còn lại
        </TextFnx>
        <TextFnx color={colors.app.yellowHightlight}>14:31</TextFnx>
      </Layout>
      <Layout type="column" spaceHorizontal={spacingApp}>
        <TimelineBuySell step={1} title={'Thông tin chuyển tiền'} />
      </Layout>
      <View
        style={{
          backgroundColor: colors.app.backgroundLevel2,
          paddingTop: 20,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          paddingHorizontal: spacingApp,
          
        }}>
       <TextFnx weight='700' color={colors.app.buy}>
       Mua USDT
       </TextFnx>
       <Layout isLineCenter isSpaceBetween space={10} style={{
           borderBottomWidth:1,
           borderColor:colors.app.lineSetting
       }}>
           <TextFnx color={colors.app.textContentLevel3}>
           Số tiền
           </TextFnx>
           <TextFnx size={16} weight='700' color={colors.app.buy}>
           150.000.000{" "}
           <TextFnx color={colors.app.textContentLevel3}>VND</TextFnx>
           </TextFnx>
           
       </Layout>
       <Layout isSpaceBetween space={8}>
           <TextFnx color={colors.app.textContentLevel3}>
               Giá
           </TextFnx>
           <TextFnx color={colors.app.textContentLevel2}>
           24.525 VND
           </TextFnx>
       </Layout>
       <Layout isSpaceBetween space={8}>
           <TextFnx color={colors.app.textContentLevel3}>
           Số lượng
           </TextFnx>
           <TextFnx color={colors.app.textContentLevel2}>
           24.525 VND
           </TextFnx>
       </Layout>
       <Layout isSpaceBetween space={8}>
           <TextFnx color={colors.app.textContentLevel3}>
           Phí
           </TextFnx>
           <TextFnx color={colors.app.textContentLevel2}>
           24.525 VND
           </TextFnx>
       </Layout>
       <Layout isSpaceBetween space={8}>
           <TextFnx color={colors.app.textContentLevel3}>
           Thuế
           </TextFnx>
           <TextFnx color={colors.app.textContentLevel2}>
           24.525 VND
           </TextFnx>
       </Layout>
       <Layout isSpaceBetween space={8}>
           <TextFnx color={colors.app.textContentLevel3}>
           Số Lệnh
           </TextFnx>
           <TextFnx color={colors.app.textContentLevel2}>
           24.525 VND
           </TextFnx>
       </Layout>
       <Layout isSpaceBetween space={8}>
           <TextFnx color={colors.app.textContentLevel3}>
           Thời gian tạo
           </TextFnx>
           <TextFnx color={colors.app.textContentLevel2}>
           24.525 VND
           </TextFnx>
       </Layout>
       <Layout isLineCenter space={15}>
            <View
              style={{
                paddingRight: 15,
              }}>
              <Image
                source={icons.avatar}
                style={{
                  width: 30,
                  height: 30,
                }}
              />
            </View>
            <View>
              <Layout type='column'>
                  <TextFnx size={fontSize.f12} color={colors.app.textDisabled}>
                  Người bán
                  </TextFnx>
                <TextFnx
                  color={colors.app.lightWhite}
                  
                  size={fontSize.f16}>
                      kkk
                  
                </TextFnx>
              </Layout>
              
            </View>
          </Layout>
        <Button
          isNormal
          bgButtonColor={colors.app.buy}
          colorTitle={colors.text}
          weightTitle={'700'}
          title={'MUA USDT'}
        />
        <Layout
          space={10}
          style={{
            borderBottomWidth: 0.5,
            borderColor: colors.app.lineSetting,
          }}
          isCenter>
          <TextFnx color={colors.app.textDisabled}>
            Giới hạn thời gian thanh toán {'  '}
            <TextFnx>15 phút</TextFnx>
          </TextFnx>
        </Layout>
        <Layout
          style={{
            paddingTop: 15,
          }}
          type="column">
          <TextFnx space={10}>Điều khoản</TextFnx>
          <TextFnx color={colors.app.textContentLevel3}>
            Bạn có thể thêm đến 20 phương thức thanh toán. Kích hoạt phương thức
            thanh toán bạn muốn, và bắt đầu giao dịch ngay trên Binance P2P.
          </TextFnx>
        </Layout>
      </View>
    </Container>
  );
};

export default Step2BuySellScreen;

const styles = StyleSheet.create({});
