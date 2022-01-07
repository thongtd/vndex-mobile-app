import React, {useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import {
  pushSingleScreenApp,
  STEP_2_BUY_SELL_SCREEN,
  STEP_3_BUY_SELL_SCREEN,
  STEP_5_BUY_SELL_SCREEN,
} from '../../../navigation';
import ButtonIcon from '../../../components/Button/ButtonIcon';
import Copy from 'assets/svg/ic_copy.svg';
import BottomSheet from '../../../components/ActionSheet/ActionSheet';
const Step4BuySellScreen = ({componentId}) => {
  const actionSheetRef = useRef(null);
  return (
    <Container
      space={15}
      spaceHorizontal={0}
      isTopBar
      isScroll
      componentId={componentId}
      title="Đang mở khóa">
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
        <TimelineBuySell
          step={2}
          title={'Chuyển tiền và Xác nhận chuyển tiền'}
        />
      </Layout>
      <View
        style={{
          backgroundColor: colors.app.backgroundLevel2,
          paddingTop: 20,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          paddingHorizontal: spacingApp,
        }}>
        <TextFnx weight="700" color={colors.app.buy}>
          Mua USDT
        </TextFnx>
        <Layout
          isLineCenter
          isSpaceBetween
          space={10}
          style={{
            borderBottomWidth: 1,
            borderColor: colors.app.lineSetting,
          }}>
          <TextFnx color={colors.app.textContentLevel3}>Số tiền</TextFnx>
          <TextFnx size={16} weight="700" color={colors.app.buy}>
            150.000.000{' '}
            <TextFnx color={colors.app.textContentLevel3}>VND</TextFnx>
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Giá</TextFnx>
          <TextFnx color={colors.app.textContentLevel2}>24.525 VND</TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Số lượng</TextFnx>
          <TextFnx color={colors.app.textContentLevel2}>5,000 AIF</TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Phí</TextFnx>
          <TextFnx color={colors.app.textContentLevel2}>1.120000 AIF</TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Thuế</TextFnx>
          <TextFnx color={colors.app.textContentLevel2}>1.120000 AIF</TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Số Lệnh</TextFnx>
          <Layout isLineCenter>
          <TextFnx color={colors.app.textContentLevel2}>1234567890</TextFnx>
          <ButtonIcon 
          style={{
              height:25,
              width:30
          }}
          iconComponent={<Copy height={20} width={20} />}
          />
          </Layout>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Thời gian tạo</TextFnx>
          <TextFnx color={colors.app.textContentLevel2}>16-11-2021 11:20:35</TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Phương thức thanh toán</TextFnx>
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
              <TextFnx spaceLeft={5}>Momo</TextFnx>
            </View>
        </Layout>
        <Layout style={{
            backgroundColor:colors.app.lineSetting,
            borderRadius:10,
            paddingLeft:16
        }} isSpaceBetween spaceTop={10}>
          <Layout>
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
            <Layout type="column">
              <TextFnx size={fontSize.f12} color={colors.app.textDisabled}>
                Người bán
              </TextFnx>
              <TextFnx color={colors.app.lightWhite} size={fontSize.f16}>
                kkk
              </TextFnx>
            </Layout>
          </Layout>
          <ButtonIcon name="eye" color={colors.app.yellowHightlight} />
        </Layout>
        <Layout spaceBottom={10} type="column">
          <TextFnx space={10} color={colors.app.yellowHightlight}>
            Lưu ý
          </TextFnx>
          <TextFnx color={colors.app.textContentLevel3}>
          Sau khi người bán xác nhận đã nhận được khoản thanh toán, hệ thống sẽ tự động chuyển tài sản vào ví của bạn.
          </TextFnx>
        </Layout>
        <Layout
          style={{
            paddingTop: 15,
            borderTopWidth: 0.5,
            borderTopColor: colors.app.lineSetting,
          }}
          type="column">
          <TextFnx space={10}>Điều khoản</TextFnx>
          <TextFnx color={colors.app.textContentLevel3}>
            Bạn có thể thêm đến 20 phương thức thanh toán. Kích hoạt phương thức
            thanh toán bạn muốn, và bắt đầu giao dịch ngay trên Binance P2P.
          </TextFnx>
        </Layout>
        <Button
          spaceVertical={20}
          isSubmit
          isClose
          onSubmit={() => {
              pushSingleScreenApp(componentId,STEP_5_BUY_SELL_SCREEN)
          }}
          colorTitle={colors.text}
          weightTitle={'700'}
          textClose={'Huỷ lệnh'}
          textSubmit={'Xác nhận đã chuyển tiền'}
          colorTitleClose={colors.app.sell}
          //   te={'MUA USDT'}
        />
      </View>

    </Container>
  );
};

export default Step4BuySellScreen;

const styles = StyleSheet.create({});
