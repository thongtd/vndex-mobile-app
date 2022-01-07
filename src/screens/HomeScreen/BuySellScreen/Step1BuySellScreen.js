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

const Step1BuySellScreen = ({componentId}) => {
  return (
    <Container
      space={15}
      spaceHorizontal={0}
      isTopBar
      isScroll
      componentId={componentId}
      title="MUA USDT">
      <Layout type="column" spaceHorizontal={spacingApp}>
        <TimelineBuySell step={0} title={'Tạo lệnh mua USDT'} />

        <Layout
          type="column"
          style={{
            paddingBottom: 10,
          }}>
          <Layout>
            <TextFnx weight="400" size={fontSize.f16} spaceRight={10}>
              lutuananh94
            </TextFnx>
            <Icon iconComponent={icons.icTick} />
          </Layout>
          <Layout isSpaceBetween>
            <Rating
              imageSize={12}
              fractions={1}
              startingValue={1}
              tintColor={colors.app.backgroundLevel1}
              readonly
              style={{paddingVertical: 2}}
            />
            <TextFnx size={fontSize.f12} color={colors.app.textDisabled}>
              2125 lệnh | 99.07% hoàn tất
            </TextFnx>
          </Layout>
        </Layout>
        <Layout
          space={9}
          isSpaceBetween
          isLineCenter
          style={{
            borderBottomWidth: 1,
            borderTopWidth: 1,
            borderColor: colors.app.lineSetting,
          }}>
          <Layout isLineCenter>
            <TextFnx weight="500" color={colors.app.buy} size={fontSize.f20}>
              <TextFnx size={fontSize.f12} color={colors.app.textDisabled}>
                Giá{'    '}
              </TextFnx>
              53,083.14{' '}
              <TextFnx color={colors.app.textContentLevel3}>VND</TextFnx>
            </TextFnx>
          </Layout>
          <Layout>
            <TextFnx>
              <TextFnx color={colors.app.textDisabled} size={fontSize.f12}>
                Làm mới sau{' '}
              </TextFnx>
              30s
            </TextFnx>
          </Layout>
        </Layout>
        <Layout spaceTop={10}>
          <Layout type="column" spaceRight={10}>
            <TextFnx
              space={5}
              size={fontSize.f12}
              color={colors.app.textDisabled}>
              Khả dụng
            </TextFnx>
            <TextFnx
              space={5}
              size={fontSize.f12}
              color={colors.app.textDisabled}>
              Giới hạn
            </TextFnx>
          </Layout>
          <View>
            <TextFnx space={5} size={fontSize.f12}>
              89.25 AIFT
            </TextFnx>
            <TextFnx space={5} size={fontSize.f12}>
              50,000,000 - 1,000,000,000 VND
            </TextFnx>
          </View>
        </Layout>
        <Layout
          style={{
            marginTop: 7,
          }}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#3B2B2B',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 5,
              paddingVertical: 2,
              borderRadius: 5,
              marginRight: 10,
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
        </Layout>
      </Layout>
      <View
        style={{
          backgroundColor: colors.app.backgroundLevel2,
          paddingTop: 20,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          paddingHorizontal: spacingApp,
          marginTop: 23,
        }}>
        <Layout isSpaceBetween>
          <TextFnx color={colors.app.textContentLevel3}>Tôi muốn trả</TextFnx>
          <Layout>
            <TextFnx color={colors.app.textDisabled} size={12}>
              Số dư{'  '}{' '}
              <TextFnx size={12} color={colors.app.textContentLevel2}>
                5,546,123 AIFT
              </TextFnx>
            </TextFnx>
          </Layout>
        </Layout>
        <Input
          spaceVertical={8}
          titleBtnRight="Tất cả"
          onBtnRight={() => alert('ok')}
          placeholder="20,000,000 VND ~ 50,000,000 VND"
        />
        <Layout space={5} isSpaceBetween>
          <Layout>
            <TextFnx color={colors.app.textDisabled} size={12}>
              Phí{'  '}{' '}
              <TextFnx size={12} color={colors.app.textContentLevel2}>
                10.000000 AIFT
              </TextFnx>
            </TextFnx>
          </Layout>
          <Layout>
            <TextFnx color={colors.app.textDisabled} size={12}>
              Thuế{'  '}{' '}
              <TextFnx size={12} color={colors.app.textContentLevel2}>
                0.000123 AIFT
              </TextFnx>
            </TextFnx>
          </Layout>
        </Layout>
        <Layout spaceTop={10} isSpaceBetween>
          <TextFnx color={colors.app.textContentLevel3}>
            Tôi sẽ nhận được
          </TextFnx>
        </Layout>
        <Input
          spaceVertical={8}
          titleRight="EUR"
          //   onBtnRight={() => alert('ok')}
          placeholder="20,000,000 VND ~ 50,000,000 VND"
        />

        <Button
          isNormal
          onPress={() =>
            pushSingleScreenApp(componentId, STEP_2_BUY_SELL_SCREEN)
          }
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

export default Step1BuySellScreen;

const styles = StyleSheet.create({});
