import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import Container from '../../../components/Container';
import Icon from '../../../components/Icon';
import Layout from '../../../components/Layout/Layout';
import TextFnx from '../../../components/Text/TextFnx';
import {
  BUY,
  constant,
  fontSize,
  SELL,
  spacingApp,
} from '../../../configs/constant';
import icons from '../../../configs/icons';
import colors from '../../../configs/styles/colors';
import TimelineBuySell from './TimelineBuySell';
import {Rating, AirbnbRating} from 'react-native-ratings';
import Image from '../../../components/Image/Image';
import Input from '../../../components/Input';
import Button from '../../../components/Button/Button';
import {pushSingleScreenApp, STEP_2_BUY_SELL_SCREEN} from '../../../navigation';
import {useActionsP2p} from '../../../redux';
import {useDispatch, useSelector} from 'react-redux';
import {get, isEmpty} from 'lodash';
import {
  formatCurrency,
  formatNumberOnChange,
  formatSCurrency,
  formatTrunc,
  getItemWallet,
  toast,
} from '../../../configs/utils';
import BackgroundTimer from 'react-native-background-timer';
const Step1BuySellScreen = ({componentId, item}) => {
  const advertisment = useSelector(state => state.p2p.advertisment);
  const currencyList = useSelector(state => state.market.currencyList);
  const cryptoWallet = useSelector(state => state.market.cryptoWallet);

  const [timer, setTimer] = useState(30);
  const [Pay, setPay] = useState('');
  const [Receive, setReceive] = useState('');
  const [isTimer, setIsTimer] = useState(true);

  const dispatch = useDispatch();
  useEffect(() => {
    useActionsP2p(dispatch).handleGetAdvertisment(get(item, 'orderId'));
    useActionsP2p(dispatch).handleGetPaymentMethodByAcc();
    // useActionsP2p(dispatch).handleResetOffer();
    return () => {};
  }, [dispatch, item]);

  useEffect(() => {
    var intervalId;
    if (isTimer && timer) {
      intervalId = BackgroundTimer.setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer <= 0) {
      useActionsP2p(dispatch).handleGetAdvertisment(get(item, 'orderId'));
      setTimer(30);
    }
    return () => BackgroundTimer.clearInterval(intervalId);
  }, [isTimer, timer, dispatch, item]);
  return (
    <Container
      space={15}
      spaceHorizontal={0}
      isTopBar
      isScroll
      componentId={componentId}
      title={`${get(item, 'side') == SELL ? 'Mua' : 'Bán'} ${get(
        item,
        'symbol',
      )}`}>
      <Layout type="column" spaceHorizontal={spacingApp}>
        <TimelineBuySell
          side={get(item, 'side') == SELL ? BUY : SELL}
          step={0}
          title={`Tạo lệnh ${get(item, 'side') == SELL ? 'mua' : 'bán'} ${get(
            item,
            'symbol',
          )}`}
        />

        <Layout
          type="column"
          style={{
            paddingBottom: 10,
          }}>
          <Layout>
            <TextFnx weight="400" size={fontSize.f16} spaceRight={10}>
              {`${get(advertisment, 'traderInfo.emailAddress')}`}{' '}
            </TextFnx>
            {get(advertisment, 'requiredKyc') && (
              <Icon iconComponent={icons.icTick} />
            )}
          </Layout>
          <Layout isSpaceBetween>
            <Rating
              imageSize={12}
              fractions={1}
              startingValue={get(advertisment, 'traderInfo.totalStar')}
              tintColor={colors.app.backgroundLevel1}
              readonly
              style={{paddingVertical: 2}}
            />
            <TextFnx size={fontSize.f12} color={colors.app.textDisabled}>
              {get(advertisment, 'traderInfo.totalCompleteOrder')} lệnh |{' '}
              {get(advertisment, 'traderInfo.completePercent')}% hoàn tất
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
            <TextFnx
              weight="500"
              color={
                get(item, 'side') == SELL ? colors.app.buy : colors.app.sell
              }
              size={fontSize.f20}>
              <TextFnx size={fontSize.f12} color={colors.app.textDisabled}>
                Giá{'    '}
              </TextFnx>
              {formatCurrency(
                get(advertisment, 'price'),
                get(advertisment, 'paymentUnit'),
                currencyList,
              )}{' '}
              <TextFnx color={colors.app.textContentLevel3}>
                {' '}
                {get(advertisment, 'paymentUnit')}
              </TextFnx>
            </TextFnx>
          </Layout>
          <Layout>
            <TextFnx>
              <TextFnx color={colors.app.textDisabled} size={fontSize.f12}>
                Làm mới sau{' '}
              </TextFnx>
              {timer}s
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
              {formatCurrency(
                get(advertisment, 'quantity'),
                get(advertisment, 'symbol'),
                currencyList,
              )}{' '}
              {get(advertisment, 'symbol')}
            </TextFnx>
            <TextFnx space={5} size={fontSize.f12}>
              {formatCurrency(
                get(advertisment, 'minOrderAmount'),
                get(advertisment, 'paymentUnit'),
                currencyList,
              )}{' '}
              -{' '}
              {formatCurrency(
                get(advertisment, 'maxOrderAmount'),
                get(advertisment, 'paymentUnit'),
                currencyList,
              )}{' '}
              {get(advertisment, 'paymentUnit')}
            </TextFnx>
          </View>
        </Layout>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            marginTop: 7,
          }}>
          {(get(advertisment, 'paymentMethods') || []).map((it, ind) => {
            if (get(it, 'code') == constant.CODE_PAYMENT_METHOD.MOMO) {
              return (
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
              );
            } else if (
              get(it, 'code') == constant.CODE_PAYMENT_METHOD.BANK_TRANSFER
            ) {
              return (
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
                    source={icons.icBank}
                    style={{
                      marginLeft: 5,
                      width: 10,
                      height: 10,
                    }}
                  />
                  <TextFnx>Chuyển khoản</TextFnx>
                </View>
              );
            }
          })}
        </ScrollView>
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
                {formatCurrency(
                  get(
                    getItemWallet(cryptoWallet, get(advertisment, 'symbol')),
                    'available',
                  ),
                  get(advertisment, 'symbol'),
                  currencyList,
                )}
                {` ${get(advertisment, 'symbol')}`}
              </TextFnx>
            </TextFnx>
          </Layout>
        </Layout>
        <Input
          spaceVertical={8}
          hasValue
          keyboardType="decimal-pad"
          onChangeText={text => {
            setPay(
              get(item, 'side') == SELL
                ? formatCurrency(
                    text.str2Number(),
                    get(advertisment, 'paymentUnit'),
                    currencyList,
                  )
                : formatNumberOnChange(
                    currencyList,
                    text,
                    get(advertisment, 'symbol'),
                  ),
            );
            setReceive(
              get(item, 'side') == SELL
                ? formatCurrency(
                    text.str2Number() / get(advertisment, 'price'),
                    get(advertisment, 'paymentUnit'),
                    currencyList,
                  )
                : formatCurrency(
                    text.str2Number() * get(advertisment, 'price'),
                    get(advertisment, 'paymentUnit'),
                    currencyList,
                  ),
            );
          }}
          prefix={
            get(advertisment, 'side') === SELL
              ? get(advertisment, 'paymentUnit')
              : get(advertisment, 'symbol')
          }
          stylePrefix={{
            right: 80,
          }}
          value={`${Pay}`}
          titleBtnRight="Tất cả"
          onBtnRight={() => {
            setPay(
              get(item, 'side') == SELL
                ? formatCurrency(
                    get(advertisment, 'maxOrderAmount'),
                    get(advertisment, 'paymentUnit'),
                    currencyList,
                  )
                : formatCurrency(
                  get(
                    getItemWallet(cryptoWallet, get(advertisment, 'symbol')),
                    'available',
                  ),
                    get(advertisment, 'symbol'),
                    currencyList,
                  ),
            );
            setReceive(
              get(item, 'side') == SELL
                ? formatCurrency(
                    get(advertisment, 'maxOrderAmount') /
                      get(advertisment, 'price'),
                    get(advertisment, 'symbol'),
                    currencyList,
                  )
                : formatCurrency(
                  get(
                    getItemWallet(cryptoWallet, get(advertisment, 'symbol')),
                    'available',
                  ) * get(advertisment, 'price'),
                    get(advertisment, 'paymentUnit'),
                    currencyList,
                  ),
            );
          }}
          placeholder={
            get(item, 'side') == SELL
              ? `${formatCurrency(
                  get(advertisment, 'minOrderAmount'),
                  get(advertisment, 'paymentUnit'),
                  currencyList,
                )} ${get(advertisment, 'paymentUnit')} ~ ${formatCurrency(
                  get(advertisment, 'maxOrderAmount'),
                  get(advertisment, 'paymentUnit'),
                  currencyList,
                )} ${get(advertisment, 'paymentUnit')}`
              : '0'
          }
        />
        <Layout space={5} isSpaceBetween>
          <Layout>
            <TextFnx color={colors.app.textDisabled} size={12}>
              Phí{'  '}{' '}
              <TextFnx size={12} color={colors.app.textContentLevel2}>
                {formatCurrency(
                  Pay.str2Number() * get(advertisment, 'fee'),
                  get(advertisment, 'paymentUnit'),
                  currencyList,
                )}{' '}
                {get(item, 'side') == BUY
                  ? get(advertisment, 'symbol')
                  : get(advertisment, 'paymentUnit')}
              </TextFnx>
            </TextFnx>
          </Layout>
          <Layout>
            <TextFnx color={colors.app.textDisabled} size={12}>
              Thuế{'  '}{' '}
              <TextFnx size={12} color={colors.app.textContentLevel2}>
                0 {get(advertisment, 'symbol')}
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
          // editable={false}
          onChangeText={text => {
            setReceive(
              get(item, 'side') == BUY
                ? formatCurrency(
                    text.str2Number(),
                    get(advertisment, 'paymentUnit'),
                    currencyList,
                  )
                : formatNumberOnChange(
                    currencyList,
                    text,
                    get(advertisment, 'symbol'),
                  ),
            );
            setPay(
              get(item, 'side') == BUY
                ? formatCurrency(
                    text.str2Number() / get(advertisment, 'price'),
                    get(advertisment, 'paymentUnit'),
                    currencyList,
                  )
                : formatCurrency(
                    text.str2Number() * get(advertisment, 'price'),
                    get(advertisment, 'paymentUnit'),
                    currencyList,
                  ),
            );
          }}
          hasValue
          value={Receive}
          spaceVertical={8}
          titleRight={
            get(item, 'side') == SELL
              ? get(advertisment, 'symbol')
              : get(advertisment, 'paymentUnit')
          }
          //   onBtnRight={() => alert('ok')}
          placeholder={
            get(item, 'side') == BUY
              ? `${formatCurrency(
                  get(advertisment, 'minOrderAmount'),
                  get(advertisment, 'paymentUnit'),
                  currencyList,
                )} ${get(advertisment, 'paymentUnit')} ~ ${formatCurrency(
                  get(advertisment, 'maxOrderAmount'),
                  get(advertisment, 'paymentUnit'),
                  currencyList,
                )} ${get(advertisment, 'paymentUnit')}`
              : '0'
          }
        />

        <Button
          isNormal
          onPress={() => {
            if (isEmpty(Pay) || Pay.str2Number() == 0) {
              if (get(advertisment, 'side') === BUY) {
                return toast(
                  `Vui lòng nhập số lượng ${get(
                    advertisment,
                    'symbol',
                  )} muốn bán phải lớn hơn 0`,
                );
              } else {
                return toast(
                  `Vui lòng nhập số tiền ${get(
                    advertisment,
                    'paymentUnit',
                  )} muốn trả phải lớn hơn 0`,
                );
              }
            } else if (isEmpty(Receive) || Receive.str2Number() == 0) {
              if (get(advertisment, 'side') === SELL) {
                return toast(
                  `Số lượng ${get(advertisment, 'symbol')} nhận được lớn hơn 0`,
                );
              } else {
                return toast(
                  `Số tiền ${get(
                    advertisment,
                    'paymentUnit',
                  )} nhận được phải lớn hơn 0`,
                );
              }
            } else if (
              (get(advertisment, 'side') === SELL &&
                Pay.str2Number() > 0 &&
                Pay.str2Number() < get(advertisment, 'minOrderAmount')) ||
              Pay.str2Number() > get(advertisment, 'maxOrderAmount')
            ) {
              return toast(
                `Giới hạn lệnh từ ${formatCurrency(
                  get(advertisment, 'minOrderAmount'),
                  get(advertisment, 'paymentUnit'),
                  currencyList,
                )} đến ${formatCurrency(
                  get(advertisment, 'maxOrderAmount'),
                  get(advertisment, 'paymentUnit'),
                  currencyList,
                )} ${get(advertisment, 'paymentUnit')}`,
              );
            } else if (
              (get(advertisment, 'side') === BUY &&
                Receive.str2Number() > 0 &&
                Receive.str2Number() < get(advertisment, 'minOrderAmount')) ||
              Receive.str2Number() > get(advertisment, 'maxOrderAmount')
            ) {
              return toast(
                `Giới hạn lệnh từ ${formatCurrency(
                  get(advertisment, 'minOrderAmount'),
                  get(advertisment, 'paymentUnit'),
                  currencyList,
                )} đến ${formatCurrency(
                  get(advertisment, 'maxOrderAmount'),
                  get(advertisment, 'paymentUnit'),
                  currencyList,
                )} ${get(advertisment, 'paymentUnit')}`,
              );
            } else if (
              (get(advertisment, 'side') === BUY &&
                Pay.str2Number() > get(advertisment, 'quantity')) ||
              (get(advertisment, 'side') === SELL &&
                Receive.str2Number() > get(advertisment, 'quantity'))
            ) {
              return toast(
                'Bạn không thể đặt lệnh với khối lượng lớn hơn khối lượng của lệnh quảng cáo',
              );
            } else if (
              ( get(advertisment, 'side') === SELL &&
              Receive.str2Number() >
                get(
                  getItemWallet(cryptoWallet, get(advertisment, 'symbol')),
                  'available',
                )) || ( get(advertisment, 'side') === BUY &&
                Pay.str2Number() >
                  get(
                    getItemWallet(cryptoWallet, get(advertisment, 'symbol')),
                    'available',
                  ))
             ) {
               return toast('Bạn không thể đặt lệnh với khối lượng lớn hơn số dư khả dụng');
             }
            pushSingleScreenApp(componentId, STEP_2_BUY_SELL_SCREEN, {
              item,
              data: {
                price:
                  get(item, 'side') === SELL
                    ? Pay.str2Number()
                    : Receive.str2Number(),
                quantity:
                  get(item, 'side') === SELL
                    ? Receive.str2Number()
                    : Pay.str2Number(),
              },
            });
          }}
          bgButtonColor={
            get(item, 'side') == SELL ? colors.app.buy : colors.app.sell
          }
          colorTitle={colors.text}
          weightTitle={'700'}
          title={
            get(item, 'side') == SELL
              ? `MUA ${get(advertisment, 'symbol')}`
              : `BÁN ${get(advertisment, 'symbol')}`
          }
        />
        <Layout
          space={10}
          style={{
            borderBottomWidth: 0.5,
            borderColor: colors.app.lineSetting,
          }}
          isCenter>
          <TextFnx color={colors.app.textDisabled}>
            Chọn thời gian thanh toán tối đa {'  '}
            <TextFnx>{get(advertisment, 'lockedInSecond') / 60} phút</TextFnx>
          </TextFnx>
        </Layout>
        <Layout
          style={{
            paddingTop: 15,
            paddingBottom: 30,
          }}
          type="column">
          <TextFnx space={10}>Điều khoản</TextFnx>
          <TextFnx color={colors.app.textContentLevel3}>
            Bạn có thể thêm đến 20 phương thức thanh toán. Kích hoạt phương thức
            thanh toán bạn muốn, và bắt đầu giao dịch ngay trên VNDEx P2P.
          </TextFnx>
        </Layout>
      </View>
    </Container>
  );
};

export default Step1BuySellScreen;

const styles = StyleSheet.create({});
