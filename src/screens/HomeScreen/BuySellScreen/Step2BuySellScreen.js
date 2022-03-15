import React, {useEffect, useRef} from 'react';
import {
  Clipboard,
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
  BUY,
  spacingApp,
  IdNavigation,
} from '../../../configs/constant';
import icons from '../../../configs/icons';
import colors from '../../../configs/styles/colors';
import TimelineBuySell from './TimelineBuySell';
import {Rating, AirbnbRating} from 'react-native-ratings';
import Image from '../../../components/Image/Image';
import Input from '../../../components/Input';
import Button from '../../../components/Button/Button';
import {
  CHAT_SCREEN,
  pushSingleScreenApp,
  STEP_2_BUY_SELL_SCREEN,
  STEP_3_BUY_SELL_SCREEN,
  STEP_4_BUY_SELL_SCREEN,
} from '../../../navigation';
import ButtonIcon from '../../../components/Button/ButtonIcon';
import Copy from 'assets/svg/ic_copy.svg';
import BottomSheet from '../../../components/ActionSheet/ActionSheet';
import {useSelector} from 'react-redux';
import {
  formatCurrency,
  get,
  listenerEventEmitter,
  size,
  toast,
  to_UTCDate,
} from '../../../configs/utils';
import {useDispatch} from 'react-redux';
import {isEmpty} from 'lodash';
import {useActionsP2p} from '../../../redux';
import { Navigation } from 'react-native-navigation';
const Step2BuySellScreen = ( { componentId, item, data } ) => {
  
  const actionSheetRef = useRef(null);
  const dispatch = useDispatch();
  const advertisment = useSelector(state => state.p2p.advertisment);
  const currencyList = useSelector(state => state.market.currencyList);
  const paymentMethods = useSelector(state => state.p2p.paymentMethods);
  const feeTax = useSelector(state => state.p2p.feeTax);
  useEffect(() => {
    // const navigationButtonEventListener =
    // Navigation.events().registerNavigationButtonPressedListener(
    //   ({buttonId}) => {
    //     if (buttonId == IdNavigation.PressIn.chat) {
    //       pushSingleScreenApp(componentId,CHAT_SCREEN,{orderId:get(advertisment, 'orderId'), email:get(advertisment,'traderInfo.emailAddress')})
    //     }
    //   },
    // );
    const ev = listenerEventEmitter('pushOfferOrder', data => {
      if ( get( data, 'offerOrder.offerSide' ) === BUY ) {
        // debugger
        
        pushSingleScreenApp(componentId, STEP_3_BUY_SELL_SCREEN, {
          paymentMethodData: get(data, 'paymentMethodData'),
          offerOrder: get(data, 'offerOrder'),
          item,
        },{
          topBar: {
            rightButtons: [
              {
                id: IdNavigation.PressIn.chat,
                icon: require('assets/icons/ic_chat.png'),
              },
            ],
          },
        });
      } else {
        pushSingleScreenApp(componentId, STEP_4_BUY_SELL_SCREEN, {
          paymentMethodData: get(data, 'paymentMethodData'),
          item,
        },{
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
    });

    return () => {
      ev.remove();
      // navigationButtonEventListener.remove();
    };
  }, [componentId]);
  const checkTax = ( isPercent, stateData = item, tax = feeTax ) => {
    
     if ( isPercent) {
      return get(stateData, 'taxPercent');
    } else 
      return formatCurrency(
        get(stateData, 'tax'),
        get(stateData, 'feeTaxBy'),
        currencyList,
      );
    
  };
  const checkFee = ( isPercent, stateData = item, fee = feeTax ) => {
     if (isPercent) {
      return get(stateData, 'feePercent');
    } else {
      return formatCurrency(
        get(stateData, 'fee'),
        get(stateData, 'feeTaxBy'),
        currencyList,
      );
    }
  };
  return (
    <Container
      space={15}
      spaceHorizontal={0}
      isTopBar
      isScroll
      componentId={componentId}
      title="Thông tin thanh toán">
      {/* <Layout
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
      </Layout> */}
      <Layout type="column" spaceHorizontal={spacingApp}>
        <TimelineBuySell
          step={1}
          side={get(item, 'offerSide') == BUY ? BUY : SELL}
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
          color={get(item, 'offerSide') == BUY ? colors.app.buy : colors.app.sell}>
          {`${get(item, 'offerSide') == BUY ? 'Mua' : 'Bán'} ${get(
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
              get(item, 'offerSide') == BUY ? colors.app.buy : colors.app.sell
            }>
            {`${formatCurrency(
              get(item, 'price'),
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
            get(item, 'quantity'),
            get(advertisment, 'paymentUnit'),
            currencyList,
          )} ${get(advertisment, 'symbol')}`}</TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Phí</TextFnx>
          <TextFnx color={colors.app.textContentLevel2}>{`${checkFee()} ${get(feeTax,'taxFeeByCurrency')}`}</TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Thuế</TextFnx>
          <TextFnx color={colors.app.textContentLevel2}>
          {`${checkTax()} ${get(feeTax,'taxFeeByCurrency')}`}
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Số Lệnh</TextFnx>
          <Layout isLineCenter>
            <TextFnx color={colors.app.textContentLevel2}>
              {get(advertisment, 'orderSequenceNumber')}
            </TextFnx>
            <ButtonIcon
              onPress={() => {
                Clipboard.setString(get(advertisment, 'orderSequenceNumber'));
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
        <Layout
          style={{
            backgroundColor: colors.app.lineSetting,
            borderRadius: 10,
            paddingLeft: 16,
          }}
          isSpaceBetween
          space={15}>
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
                Người {get(advertisment, 'side') == SELL?"bán":"mua" }
              </TextFnx>
              <TextFnx color={colors.app.lightWhite} size={fontSize.f16}>
                {get(advertisment, 'traderInfo.emailAddress')}
              </TextFnx>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{
                  paddingTop: 5,
                }}>
                {( get( advertisment, 'paymentMethods' ) || [] ).map( ( it, ind ) => {
                  
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
                    get(it, 'code') ==
                    constant.CODE_PAYMENT_METHOD.BANK_TRANSFER
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
          </Layout>
          <ButtonIcon name="eye" color={colors.app.yellowHightlight} />
        </Layout>
       {get(advertisment, 'side') == SELL && (
         <>
         <Layout space={5} spaceTop={20} isLineCenter>
          <Icon iconComponent={icons.IcChecked} />
          <TextFnx> VNDEx đã khóa token của người bán</TextFnx>
        </Layout>
        <Layout space={5} isLineCenter>
          <Icon iconComponent={icons.IcChecked} />
          <TextFnx> VNDEx hỗ trợ 24/7</TextFnx>
        </Layout></>
       )} 
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
            thanh toán bạn muốn, và bắt đầu giao dịch ngay trên VNDEx P2P.
          </TextFnx>
        </Layout>
        <Button
          spaceVertical={20}
          isSubmit
          onSubmit={() => actionSheetRef?.current?.show()}
          colorTitle={colors.text}
          weightTitle={'700'}
          colorTitleClose={colors.app.sell}
          //   te={'MUA USDT'}
        />
      </View>

      <BottomSheet
        title="Chọn Phương thức thanh toán"
        actionRef={actionSheetRef}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          onScrollEndDrag={() => actionSheetRef.current?.handleChildScrollEnd()}
          onScrollAnimationEnd={() =>
            actionSheetRef.current?.handleChildScrollEnd()
          }
          onMomentumScrollEnd={() =>
            actionSheetRef.current?.handleChildScrollEnd()
          }>
          {get(advertisment, 'paymentMethods') &&
            size(get(advertisment, 'paymentMethods')) > 0 &&
            (get(advertisment, 'side') == SELL
              ? get(advertisment, 'paymentMethods')
              : paymentMethods
          ).map( ( item, index ) => {
              
              return (
                <TouchableOpacity
                  key={`ite-${index}`}
                  onPress={() => {
                    actionSheetRef.current?.hide();
                    // useActionsP2p(dispatch).handleResetOffer();
                    // debugger;
                    useActionsP2p(dispatch).handleCreateOfferOrder({
                      data: {
                        orderId: get(advertisment, 'orderId'),
                        orderQtty: get(data, 'quantity'),
                        orderPrice: get(advertisment, 'price'),
                        p2PAccountPaymentMethodId: get(item, 'id'),
                      },
                      paymentMethodData: item,
                    });
                  }}>
                  <Layout
                    style={{
                      paddingVertical: 10,
                      borderBottomWidth: 1,
                      borderColor: colors.app.lineSetting,
                    }}>
                    <Icon
                      name="credit-card"
                      color={colors.app.textContentLevel3}
                      size={14}
                    />
                    <Layout spaceLeft={20} type="column">
                      <TextFnx
                        spaceBottom={3}
                        color={colors.app.textContentLevel3}>
                        {get(item, 'name')}
                      </TextFnx>

                      <TextFnx
                        size={16}
                        space={3}
                        color={colors.app.textContentLevel2}>
                        {get(item, 'fullName')}
                      </TextFnx>
                      {!isEmpty(get(item, 'backAccountNo')) && (
                        <TextFnx
                          size={16}
                          space={3}
                          color={colors.app.textContentLevel2}>
                          {get(item, 'backAccountNo')}
                        </TextFnx>
                      )}
                      {!isEmpty(get(item, 'bankName')) && (
                        <TextFnx
                          size={16}
                          space={3}
                          color={colors.app.textContentLevel2}>
                          {get(item, 'bankName')}
                        </TextFnx>
                      )}
                      {!isEmpty(get(item, 'bankBranchName')) && (
                        <TextFnx
                          size={16}
                          space={3}
                          color={colors.app.textContentLevel2}>
                          {get(item, 'bankBranchName')}
                        </TextFnx>
                      )}
                      {!isEmpty(get(item, 'phoneNumber')) && (
                        <TextFnx
                          size={16}
                          space={3}
                          color={colors.app.textContentLevel2}>
                          {get(item, 'phoneNumber')}
                        </TextFnx>
                      )}
                    </Layout>
                  </Layout>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      </BottomSheet>
    </Container>
  );
};

export default Step2BuySellScreen;

const styles = StyleSheet.create({});
