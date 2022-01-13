import React, {useEffect, useRef} from 'react';
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
  constant,
  fontSize,
  SELL,
  spacingApp,
  BUY,
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
  STEP_2_BUY_SELL_SCREEN,
  STEP_3_BUY_SELL_SCREEN,
  STEP_4_BUY_SELL_SCREEN,
  STEP_5_BUY_SELL_SCREEN,
} from '../../../navigation';
import ButtonIcon from '../../../components/Button/ButtonIcon';
import Copy from 'assets/svg/ic_copy.svg';
import BottomSheet from '../../../components/ActionSheet/ActionSheet';
import {useDispatch} from 'react-redux';
import {useActionsP2p} from '../../../redux';
import {
  formatCurrency,
  get,
  listenerEventEmitter,
} from '../../../configs/utils';
import {isEmpty} from 'lodash';
import {useSelector} from 'react-redux';

const Step3BuySellScreen = ({
  item,
  componentId,
  offerOrder,
  paymentMethodData,
}) => {
  const dispatch = useDispatch();
  const offerOrderGlobal = useSelector(state => state.p2p.offerOrder);
  const offerOrderId = useSelector(state => state.p2p.offerOrderId);
  useEffect(() => {
    useActionsP2p(dispatch).handleGetOfferOrder(
      get(offerOrder, 'offerOrderId'),
    );
    return () => {};
  }, [dispatch]);
  useEffect(() => {
    const ev = listenerEventEmitter('pushStep', dataConfirm => {
      console.log(dataConfirm,"data confirm")
      if (get(dataConfirm, 'isHasPayment') === false) {
        pushSingleScreenApp(componentId, STEP_5_BUY_SELL_SCREEN);
      } else if (
        get(dataConfirm, 'isHasPayment') &&
        get(offerOrderGlobal, 'offerSide') == BUY
      ) {
        
        pushSingleScreenApp(componentId, STEP_4_BUY_SELL_SCREEN, {
          paymentMethodData,
          item,
        });
      }
    });
    return () => ev.remove();
  }, []);
  const currencyList = useSelector(state => state.market.currencyList);
  const actionSheetRef = useRef(null);
  const advertisment = useSelector(state => state.p2p.advertisment);

  return (
    <Container
      space={15}
      spaceHorizontal={0}
      isTopBar
      isScroll
      componentId={componentId}
      title="Xác nhận thanh toán">
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
          side={get(offerOrderGlobal, 'offerSide')}
          step={1}
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
            get(offerOrderGlobal, 'offerSide') == BUY
              ? colors.app.buy
              : colors.app.sell
          }>
          {`${get(offerOrderGlobal, 'offerSide') == BUY ? 'Mua' : 'Bán'} ${get(
            item,
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
              get(offerOrderGlobal, 'offerSide') == BUY
                ? colors.app.buy
                : colors.app.sell
            }>
            {`${formatCurrency(
              get(offerOrderGlobal, 'price'),
              get(advertisment, 'paymentUnit'),
              currencyList,
            )} `}
            <TextFnx color={colors.app.textContentLevel3}>
              {get(advertisment, 'paymentUnit')}
            </TextFnx>
          </TextFnx>
        </Layout>
        {!isEmpty(get(paymentMethodData, 'backAccountNo')) && (
          <Layout isSpaceBetween space={8}>
            <TextFnx color={colors.app.textContentLevel3}>Số tài khoản</TextFnx>
            <Layout isLineCenter>
              <TextFnx color={colors.app.textContentLevel2}>
                {get(paymentMethodData, 'backAccountNo')}
              </TextFnx>
              <ButtonIcon
                style={{
                  height: 25,
                  width: 30,
                }}
                iconComponent={<Copy height={20} width={20} />}
              />
            </Layout>
          </Layout>
        )}
        {!isEmpty(get(paymentMethodData, 'bankName')) && (
          <Layout isSpaceBetween space={8}>
            <TextFnx color={colors.app.textContentLevel3}>
              Tên ngân hàng
            </TextFnx>
            <Layout isLineCenter>
              <TextFnx color={colors.app.textContentLevel2}>
                {get(paymentMethodData, 'bankName')}
              </TextFnx>
              <ButtonIcon
                style={{
                  height: 25,
                  width: 30,
                }}
                iconComponent={<Copy height={20} width={20} />}
              />
            </Layout>
          </Layout>
        )}
        {!isEmpty(get(paymentMethodData, 'bankBranchName')) && (
          <Layout isSpaceBetween space={8}>
            <TextFnx color={colors.app.textContentLevel3}>Chi nhánh</TextFnx>
            <Layout isLineCenter>
              <TextFnx color={colors.app.textContentLevel2}>
                {get(paymentMethodData, 'bankBranchName')}
              </TextFnx>
              <ButtonIcon
                style={{
                  height: 25,
                  width: 30,
                }}
                iconComponent={<Copy height={20} width={20} />}
              />
            </Layout>
          </Layout>
        )}
        {!isEmpty(get(paymentMethodData, 'fullName')) && (
          <Layout isSpaceBetween space={8}>
            <TextFnx color={colors.app.textContentLevel3}>Tên</TextFnx>
            <Layout isLineCenter>
              <TextFnx color={colors.app.textContentLevel2}>
                {get(paymentMethodData, 'fullName')}
              </TextFnx>
              <ButtonIcon
                style={{
                  height: 25,
                  width: 30,
                }}
                iconComponent={<Copy height={20} width={20} />}
              />
            </Layout>
          </Layout>
        )}
        {!isEmpty(get(paymentMethodData, 'phoneNumber')) && (
          <Layout isSpaceBetween space={8}>
            <TextFnx color={colors.app.textContentLevel3}>
              Số điện thoại
            </TextFnx>
            <Layout isLineCenter>
              <TextFnx color={colors.app.textContentLevel2}>
                {get(paymentMethodData, 'phoneNumber')}
              </TextFnx>
              <ButtonIcon
                style={{
                  height: 25,
                  width: 30,
                }}
                iconComponent={<Copy height={20} width={20} />}
              />
            </Layout>
          </Layout>
        )}
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
        <Layout spaceBottom={10} type="column">
          <TextFnx space={10} color={colors.app.yellowHightlight}>
            Lưu ý
          </TextFnx>
          <TextFnx color={colors.app.textContentLevel3}>
            Để giao dịch thành công, vui lòng không đề cập đến bất kỳ thuật ngữ
            liên quan đến tiền mã hóa nào (BTC, v.v) trong ghi chú thanh toán.
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
          onSubmit={
            () => {
              useActionsP2p(dispatch).handleConfirmPaymentAdvertisment({
                  offerOrderId: offerOrderId,
                  isHasPayment: true,
                  pofPayment: '',
                  pofPaymentComment: '',
                  cancellationReason: '',
                });
            }
            // pushSingleScreenApp(componentId, STEP_4_BUY_SELL_SCREEN)
          }
          colorTitle={colors.text}
          weightTitle={'700'}
          textClose={'Huỷ lệnh'}
          onClose={() => {
            useActionsP2p(dispatch).handleConfirmPaymentAdvertisment({
              offerOrderId: offerOrderId,
              isHasPayment: false,
              pofPayment: '',
              pofPaymentComment: '',
              cancellationReason: '',
            });
          }}
          textSubmit={'Xác nhận đã chuyển tiền'}
          colorTitleClose={colors.app.sell}
          //   te={'MUA USDT'}
        />
      </View>
    </Container>
  );
};

export default Step3BuySellScreen;

const styles = StyleSheet.create({});
