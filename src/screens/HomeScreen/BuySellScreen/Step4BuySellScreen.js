import React, {useEffect, useRef, useState, useMemo} from 'react';
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
import {
  BUY,
  constant,
  fontSize,
  IdNavigation,
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
import {
  pushSingleScreenApp,
  STEP_2FA_BUY_SELL_SCREEN,
  STEP_2_BUY_SELL_SCREEN,
  STEP_3_BUY_SELL_SCREEN,
  STEP_5_BUY_SELL_SCREEN,
} from '../../../navigation';
import ButtonIcon from '../../../components/Button/ButtonIcon';
import Copy from 'assets/svg/ic_copy.svg';
import BottomSheet from '../../../components/ActionSheet/ActionSheet';
import {useDispatch, useSelector} from 'react-redux';
import {ceil, get, isNumber} from 'lodash';
import {formatCurrency, to_UTCDate} from '../../../configs/utils';
import {useActionsP2p} from '../../../redux';
import CountDown from 'react-native-countdown-component';
const Step4BuySellScreen = ({componentId, item, paymentMethodData}) => {
  const actionSheetRef = useRef(null);
  const dispatch = useDispatch();
  const advertisment = useSelector(state => state.p2p.advertisment);
  const currencyList = useSelector(state => state.market.currencyList);
  const offerOrder = useSelector(state => state.p2p.offerOrder);
  const offerOrderId = useSelector(state => state.p2p.offerOrderId);
  const [offerOrderState, setOfferOrderState] = useState(offerOrder || {});
  const UserInfo = useSelector(state => state.authentication.userInfo);
  useEffect(() => {
    if (
      get(UserInfo, 'id') ===
      get(offerOrder, 'ownerIdentityUser.identityUserId')
    ) {
      setOfferOrderState({
        ...offerOrder,
        offerSide: get(offerOrder, 'offerSide') === BUY ? SELL : BUY,
      });
      if(get(offerOrder, 'offerSide') === BUY &&  !get(offerOrder, 'isPaymentConfirm')){
        setDisabledSubmit(true);
      }
    } else {
      if( get(offerOrder, 'offerSide') === SELL &&
      !get(offerOrder, 'isPaymentConfirm')){
        setDisabledSubmit(true);
      }
      setOfferOrderState({
        ...offerOrder,
      });
    }
    return () => {};
  }, [offerOrder, UserInfo]);
  useEffect(() => {
    useActionsP2p(dispatch).handleGetAdvertisment(
      get(offerOrder, 'p2PTradingOrderId'),
    );
    useActionsP2p(dispatch).handleGetOfferOrder(offerOrderId);
    return () => {};
  }, []);
  // useEffect(() => {
  //   useActionsP2p(dispatch).handleGetAdvertisment(
  //     get(offerOrderState, 'p2PTradingOrderId'),
  //   );
  //   useActionsP2p(dispatch).handleGetOfferOrder(offerOrderId);
  //   return () => {};
  // }, []);
  const [disabledSubmit, setDisabledSubmit] = useState(false);

  useEffect(() => {
    var intervalID = setInterval(
      (offerData, offerOrderIdData) => {
        // console.log(offerData,"offerData");
        useActionsP2p(dispatch).handleGetAdvertisment(
          get(offerData, 'p2PTradingOrderId'),
        );
        useActionsP2p(dispatch).handleGetOfferOrder(offerOrderIdData);
        if (
          get(offerData, 'offerSide') === BUY &&
          get(offerData, 'isUnLockConfirm')
        ) {
          pushSingleScreenApp(componentId, STEP_5_BUY_SELL_SCREEN,null,{
            topBar: {
              rightButtons: [
                {
                  id: IdNavigation.PressIn.chat,
                  icon: require('assets/icons/ic_chat.png'),
                },
              ],
            },
          });
        }
        if (
          get(offerData, 'offerSide') === SELL &&
          get(offerData, 'isPaymentConfirm')
        ) {
          setDisabledSubmit(false);
        }
        if (
          get(offerData, 'offerSide') === SELL &&
          !get(offerData, 'isPaymentConfirm')
        ) {
          setDisabledSubmit(true);
        }
        if (get(offerData, 'isPaymentCancel')) {
          pushSingleScreenApp(componentId, STEP_5_BUY_SELL_SCREEN,null,{
            topBar: {
              rightButtons: [
                {
                  id: IdNavigation.PressIn.chat,
                  icon: require('assets/icons/ic_chat.png'),
                },
              ],
            },
          });
        }
      },
      3000,
      offerOrderState,
      offerOrderId
    );
    return () => {
      clearInterval(intervalID);
    };
  }, [offerOrderState, offerOrderId, offerOrder]);

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
        <CountDown
          until={
            isNumber(get(offerOrderState, 'timeToLiveInSecond'))
              ? parseInt(get(offerOrderState, 'timeToLiveInSecond'))
              : 0
          }
          size={14}
          timeLabels={{m: '', s: ''}}
          style={{
            flexDirection: 'row',
          }}
          onFinish={() => {
            useActionsP2p(dispatch).handleGetOfferOrder(offerOrderId);
          }}
          digitStyle={{height: 15, width: 20}}
          digitTxtStyle={{
            color: colors.app.yellowHightlight,
            fontWeight: '400',
          }}
          timeToShow={['M', 'S']}
          showSeparator
          separatorStyle={{
            color: colors.app.yellowHightlight,
          }}
        />
      </Layout>
      <Layout type="column" spaceHorizontal={spacingApp}>
        <TimelineBuySell
          step={2}
          side={get(offerOrderState, 'offerSide')}
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
        <TextFnx
          weight="700"
          color={
            get(offerOrderState, 'offerSide') == BUY
              ? colors.app.buy
              : colors.app.sell
          }>
          {`${get(offerOrderState, 'offerSide') == BUY ? 'Mua' : 'Bán'} ${get(
            advertisment,
            'symbol',
          )}`}
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
          <TextFnx
            size={16}
            weight="700"
            color={
              get(offerOrderState, 'offerSide') == BUY
                ? colors.app.buy
                : colors.app.sell
            }>
            {`${formatCurrency(
              get(offerOrderState, 'price'),
              get(advertisment, 'paymentUnit'),
              currencyList,
            )} `}
            <TextFnx color={colors.app.textContentLevel3}>
              {get(advertisment, 'paymentUnit')}
            </TextFnx>
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Giá</TextFnx>
          <TextFnx color={colors.app.textContentLevel2}>{`${formatCurrency(
            get(advertisment, 'price'),
            get(advertisment, 'paymentUnit'),
            currencyList,
          )} ${get(advertisment, 'paymentUnit')}`}</TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Số lượng</TextFnx>
          <TextFnx color={colors.app.textContentLevel2}>{`${formatCurrency(
            get(offerOrderState, 'quantity'),
            get(advertisment, 'paymentUnit'),
            currencyList,
          )} ${get(advertisment, 'symbol')}`}</TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Phí</TextFnx>
          <TextFnx color={colors.app.textContentLevel2}>{`${formatCurrency(
            get(offerOrderState, 'price') * get(advertisment, 'fee'),
            get(advertisment, 'paymentUnit'),
            currencyList,
          )} ${get(advertisment, 'paymentUnit')}`}</TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Thuế</TextFnx>
          <TextFnx color={colors.app.textContentLevel2}>
            0 {get(advertisment, 'paymentUnit')}
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Số Lệnh</TextFnx>
          <Layout isLineCenter>
            <TextFnx color={colors.app.textContentLevel2}>
              {get(advertisment, 'orderNumber')}
            </TextFnx>
            <ButtonIcon
              onPress={() => {
                Clipboard.setString(get(advertisment, 'orderNumber'));
                toast('COPY_TO_CLIPBOARD'.t());
              }}
              style={{
                height: 25,
                width: 30,
              }}
              iconComponent={<Copy height={20} width={20} />}
            />
          </Layout>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Thời gian tạo</TextFnx>
          <TextFnx color={colors.app.textContentLevel2}>
            {to_UTCDate(
              get(advertisment, 'createdDate'),
              'DD-MM-YYYY hh:mm:ss',
            )}
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>
            Phương thức thanh toán
          </TextFnx>
          {get(paymentMethodData, 'code') ==
          constant.CODE_PAYMENT_METHOD.MOMO ? (
            <Layout isLineCenter>
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
                <TextFnx spaceLeft={5}>
                  {get(paymentMethodData, 'name')}
                </TextFnx>
              </View>
            </Layout>
          ) : (
            <Layout isLineCenter>
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
                  source={icons.icBank}
                  style={{
                    marginLeft: 5,
                    width: 10,
                    height: 10,
                  }}
                />
                <TextFnx spaceLeft={5}>
                  {get(paymentMethodData, 'name')}
                </TextFnx>
              </View>
            </Layout>
          )}
        </Layout>
        <Layout
          style={{
            backgroundColor: colors.app.lineSetting,
            borderRadius: 10,
            paddingLeft: 16,
          }}
          isSpaceBetween
          spaceTop={10}>
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
                {get(advertisment, 'traderInfo.emailAddress')}
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
            Sau khi người bán xác nhận đã nhận được khoản thanh toán, hệ thống
            sẽ tự động chuyển tài sản vào ví của bạn.
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
            thanh toán bạn muốn, và bắt đầu giao dịch ngay trên Vndex P2P.
          </TextFnx>
        </Layout>
        <Button
          spaceVertical={20}
          isSubmit
          bgButtonColorSubmit={
            disabledSubmit ? '#715611' : colors.app.yellowHightlight
          }
          bgButtonColorClose={disabledSubmit ? '#2C2B28' : colors.btnClose}
          disabledClose={disabledSubmit}
          disabledSubmit={disabledSubmit}
          isClose
          onSubmit={() => {
            if (get(offerOrderState, 'offerSide') === SELL) {
              pushSingleScreenApp(componentId, STEP_2FA_BUY_SELL_SCREEN);
            }
          }}
          colorTitle={colors.text}
          weightTitle={'700'}
          onClose={() => {
            if (get(offerOrderState, 'offerSide') === BUY) {
              useActionsP2p(dispatch).handleConfirmPaymentAdvertisment({
                offerOrderId: offerOrderId,
                isHasPayment: false,
                pofPayment: '',
                pofPaymentComment: '',
                cancellationReason: '',
              });
            }
          }}
          textClose={
            get(offerOrderState, 'offerSide') === BUY ? 'Huỷ lệnh' : 'Khiếu nại'
          }
          textSubmit={
            get(offerOrderState, 'offerSide') === BUY
              ? 'Khiếu nại'
              : 'Xác nhận mở khóa'
          }
          colorTitleClose={
            disabledSubmit ? colors.description : colors.textBtnClose
          }
          //   te={'MUA USDT'}
        />
      </View>
    </Container>
  );
};

export default Step4BuySellScreen;

const styles = StyleSheet.create({});
