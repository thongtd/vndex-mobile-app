import React, {useEffect, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Clipboard,
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
  toast,
  to_UTCDate,
} from '../../../configs/utils';
import {ceil, isEmpty, isNumber} from 'lodash';
import {useSelector} from 'react-redux';
import CountDown from 'react-native-countdown-component';
import {Navigation} from 'react-native-navigation';
import {actionsReducerP2p} from '../../../redux/modules/p2p/actions';
const Step3BuySellScreen = ({
  item,
  componentId,
  offerOrder,
  paymentMethodData,
}) => {
  const dispatch = useDispatch();
  const offerOrderGlobal = useSelector(state => state.p2p.offerOrder);
  const offerOrderId = useSelector(state => state.p2p.offerOrderId);
  const advertisment = useSelector(state => state.p2p.advertisment);
  const [isLoading, setIsLoading] = useState(false);
  const UserInfo = useSelector(state => state.authentication.userInfo);
  const [offerOrderState, setOfferOrderState] = useState(item);
  const [isPushChat, setIsPushChat] = useState(false);
  const infoChat = useSelector(state => state.p2p.chatInfoP2p);

  useEffect(() => {
    if (isPushChat) {
      pushSingleScreenApp(componentId, CHAT_SCREEN, {
        orderId: get(offerOrder, 'offerOrderId'),
        email: get(advertisment, 'traderInfo.emailAddress'),
      });
      setIsPushChat(false);
    }

    return () => {};
  }, [isPushChat]);

  useEffect(() => {
    if (
      get(UserInfo, 'id') ===
      get(offerOrderGlobal, 'ownerIdentityUser.identityUserId')
    ) {
      setOfferOrderState({
        ...offerOrderGlobal,
        offerSide: get(offerOrderGlobal, 'offerSide') === BUY ? SELL : BUY,
        ...paymentMethodData,
        quantity: get(offerOrderState, 'quantity'),
      });
    } else {
      setOfferOrderState( {
        ...offerOrderGlobal,
        ...paymentMethodData,
        quantity: get(offerOrderState, 'quantity'),
        

      });
    }
    return () => {};
  }, [offerOrderGlobal, UserInfo]);

  useEffect(() => {
    const ev = listenerEventEmitter( 'pushStep', dataConfirm => {
      setIsLoading(false);
      if (get(dataConfirm, 'isHasPayment') === false) {
        pushSingleScreenApp(componentId, STEP_5_BUY_SELL_SCREEN, null, {
          topBar: {
            rightButtons: [
              {
                id: IdNavigation.PressIn.chat,
                icon: require('assets/icons/ic_chat.png'),
              },
            ],
          },
        });
      } else if (
        get(dataConfirm, 'isHasPayment') &&
        get(item, 'offerSide') == BUY 
      ) {
        pushSingleScreenApp(
          componentId,
          STEP_4_BUY_SELL_SCREEN,
          {
            paymentMethodData,
            item,
          },
          {
            topBar: {
              rightButtons: [
                {
                  id: IdNavigation.PressIn.chat,
                  icon: require('assets/icons/ic_chat.png'),
                },
              ],
            },
          },
        );
      }
    });
    const navigationButtonEventListener =
      Navigation.events().registerNavigationButtonPressedListener(
        ({buttonId}) => {
          if (buttonId == IdNavigation.PressIn.chat) {
            setIsPushChat(true);
          }
        },
      );
    return () => {
      navigationButtonEventListener.remove();
      ev.remove();
    };
  }, [] );
  useEffect(() => {
    
    if (get(offerOrder, 'p2PTradingOrderId')) {
      useActionsP2p(dispatch).handleGetAdvertisment(get(offerOrder, 'p2PTradingOrderId'));
    }

    useActionsP2p(dispatch).handleGetOfferOrder(offerOrderId);
    useActionsP2p(dispatch).handleGetChatInfoP2p(offerOrderId);
    return () => {};
  }, [offerOrderId, offerOrder]);

  const hanldeCopy = url => {
    Clipboard.setString(url);
    toast('COPY_TO_CLIPBOARD'.t());
  };
  const currencyList = useSelector(state => state.market.currencyList);
  const actionSheetRef = useRef( null );
  
  console.log('item: ', item);
  // const feeTax = useSelector(state => state.p2p.feeTax);
  // const checkTax = (isPercent, stateData = advertisment, tax = feeTax) => {
  //   if (
  //     (get(stateData, 'symbol') == 'SMAT' && get(stateData, 'side') == BUY) ||
  //     (get(stateData, 'symbol') == 'SMAT' &&
  //       get(stateData, 'side') == BUY &&
  //       isPercent) ||
  //     (get(stateData, 'symbol') !== 'SMAT' && get(stateData, 'side') == BUY)
  //   ) {
  //     return '0';
  //   } else if (get(stateData, 'side') == SELL && isPercent) {
  //     return get(tax, 'taxPercent');
  //   } else if (get(stateData, 'side') == SELL) {
  //     return formatCurrency(
  //       get(tax, 'taxAmount'),
  //       get(tax, 'taxFeeByCurrency'),
  //       currencyList,
  //     );
  //   }
  // };
  // const checkFee = (isPercent, stateData = advertisment, fee = feeTax) => {
  //   if (
  //     (get(stateData, 'symbol') == 'SMAT' && get(stateData, 'side') == SELL) ||
  //     (get(stateData, 'symbol') == 'SMAT' &&
  //       get(stateData, 'side') == SELL &&
  //       isPercent)
  //   ) {
  //     return '0';
  //   } else if (isPercent) {
  //     return get(fee, 'feePercent');
  //   } else {
  //     return formatCurrency(
  //       get(fee, 'feeAmount'),
  //       get(fee, 'taxFeeByCurrency'),
  //       currencyList,
  //     );
  //   }
  // };
  const showConfirmDialog = () => {
    return Alert.alert(
      "Huỷ lệnh",
      "Bạn chắc chắn muốn huỷ lệnh chứ",
      [
        // The "Yes" button
        {
          text: "Đồng ý",
          onPress: () => {
            setIsLoading(true);
              useActionsP2p(dispatch).handleConfirmPaymentAdvertisment({
                offerOrderId: offerOrderId,
                isHasPayment: false,
                pofPayment: '',
                pofPaymentComment: '',
                cancellationReason: '',
              });
          },
        },
        {
          text: "Không",
        },
      ]
    );
  };
  useEffect(() => {
    useActionsP2p(dispatch).handleGetFeeTax({
      quantity: get(offerOrderState, 'quantity'),
      price: get(advertisment, 'price'),
    });

    return () => {};
  }, [offerOrderState, advertisment]);
  return (
    <Container
      space={15}
      spaceHorizontal={0}
      isTopBar
      isScroll
      isLoadding={isLoading}
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
          side={get(offerOrderState, 'offerSide')}
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
            get(offerOrderState, 'offerSide') == BUY
              ? colors.app.buy
              : colors.app.sell
          }>
          {`${get(offerOrderState, 'offerSide') == BUY ? 'Mua' : 'Bán'} ${get(
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
              get(offerOrderState, 'offerSide') == BUY
                ? colors.app.buy
                : colors.app.sell
            }>
            {`${formatCurrency(
              get(offerOrderState, 'price') * get(offerOrderState, 'quantity'),
              get(offerOrderState, 'paymentUnit'),
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
            get(offerOrderState, 'price'),
            get(offerOrderState, 'paymentUnit'),
            currencyList,
          )} ${get(offerOrderState, 'paymentUnit')}`}</TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Số lượng</TextFnx>
          <TextFnx color={colors.app.textContentLevel2}>{`${formatCurrency(
            get(offerOrderState, 'quantity'),
            get(offerOrderState, 'paymentUnit'),
            currencyList,
          )} ${get(offerOrderState, 'symbol')}`}</TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Phí</TextFnx>
          <TextFnx color={colors.app.textContentLevel2}>{`${
             formatCurrency(
                  get(offerOrderState, 'fee'),
                  get(offerOrderState, 'feeTaxBy'),
                  currencyList,
                )
          } ${get(offerOrderState, 'feeTaxBy')}`}</TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Thuế</TextFnx>
          <TextFnx color={colors.app.textContentLevel2}>
            {`${
              formatCurrency(
                    get(offerOrderState, 'tax'),
                    get(offerOrderState, 'feeTaxBy'),
                    currencyList,
                  )
                
            } ${get(offerOrderState, 'feeTaxBy')}`}
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Số lệnh</TextFnx>
          <TextFnx color={colors.app.textContentLevel2}>
            
                   { get(offerOrderGlobal, 'orderSequenceNumber')}
                 
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Thời gian tạo</TextFnx>
          <TextFnx color={colors.app.textContentLevel2}>
            {to_UTCDate(
              get(offerOrderState, 'createdDate'),
              'DD-MM-YYYY hh:mm:ss',
            )}
          </TextFnx>
        </Layout>
        {get( offerOrderState, 'paymentMethods' ) ? get( offerOrderState, 'paymentMethods' ).map( paymentMethod =>
          <View>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>
            Phương thức thanh toán
          </TextFnx>
          
          {get(paymentMethod,'code') == 
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
                <TextFnx spaceLeft={5}>Momo</TextFnx>
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
                <TextFnx spaceLeft={5}>Chuyển khoản</TextFnx>
              </View>
            </Layout>
          )}
              </Layout>
               {!isEmpty(get(paymentMethod, 'phoneNumber')) && (
          <Layout isSpaceBetween space={8}>
            <TextFnx color={colors.app.textContentLevel3}>
              Số điện thoại
            </TextFnx>
            <Layout isLineCenter>
              <TextFnx color={colors.app.textContentLevel2}>
                {get(paymentMethod, 'phoneNumber')}
              </TextFnx>
              <ButtonIcon
                style={{
                  height: 25,
                  width: 30,
                }}
                onPress={() => hanldeCopy(get(paymentMethod, 'phoneNumber'))}
                iconComponent={<Copy height={20} width={20} />}
              />
            </Layout>
          </Layout>
            )}
            {!isEmpty(get(paymentMethod, 'backAccountNo')) && (
          <Layout isSpaceBetween space={8}>
            <TextFnx color={colors.app.textContentLevel3}>Số tài khoản</TextFnx>
            <Layout isLineCenter>
              <TextFnx color={colors.app.textContentLevel2}>
                {get(paymentMethod, 'backAccountNo')}
              </TextFnx>
              <ButtonIcon
                style={{
                  height: 25,
                  width: 30,
                }}
                onPress={() =>
                  hanldeCopy(get(paymentMethod, 'bankAccountNo'))
                }
                iconComponent={<Copy height={20} width={20} />}
              />
            </Layout>
          </Layout>
        )}
        {!isEmpty(get(paymentMethod, 'bankName')) && (
          <Layout isSpaceBetween space={8}>
            <TextFnx color={colors.app.textContentLevel3}>
              Tên ngân hàng
            </TextFnx>
            <Layout isLineCenter>
              <TextFnx color={colors.app.textContentLevel2}>
                {get(paymentMethod, 'bankName')}
              </TextFnx>
              <ButtonIcon
                style={{
                  height: 25,
                  width: 30,
                }}
                onPress={() => hanldeCopy(get(paymentMethod, 'bankName'))}
                iconComponent={<Copy height={20} width={20} />}
              />
            </Layout>
          </Layout>
        )}
        {!isEmpty(get(paymentMethod, 'bankBranchName')) && (
          <Layout isSpaceBetween space={8}>
            <TextFnx color={colors.app.textContentLevel3}>Chi nhánh</TextFnx>
            <Layout isLineCenter>
              <TextFnx color={colors.app.textContentLevel2}>
                {get(paymentMethod, 'bankBranchName')}
              </TextFnx>
              <ButtonIcon
                style={{
                  height: 25,
                  width: 30,
                }}
                onPress={() =>
                  hanldeCopy(get(paymentMethod, 'bankBranchName'))
                }
                iconComponent={<Copy height={20} width={20} />}
              />
            </Layout>
          </Layout>
        )}
        {!isEmpty(get(paymentMethod, 'fullName')) && (
          <Layout isSpaceBetween space={8}>
            <TextFnx color={colors.app.textContentLevel3}>Tên</TextFnx>
            <Layout isLineCenter>
              <TextFnx color={colors.app.textContentLevel2}>
                {get(paymentMethod, 'fullName')}
              </TextFnx>
              <ButtonIcon
                style={{
                  height: 25,
                  width: 30,
                }}
                onPress={() => hanldeCopy(get(paymentMethod, 'fullName'))}
                iconComponent={<Copy height={20} width={20} />}
              />
            </Layout>
          </Layout>
        )}
              </View>) : null}
              
        
       
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
                Người {get(offerOrderState, 'offerSide') == BUY ? 'bán' : 'mua'}
              </TextFnx>
              <TextFnx
                space={8}
                color={colors.app.lightWhite}
                size={fontSize.f16}>
                {get(UserInfo, 'id') ==
                get(infoChat, 'offerIdentityUser.id')
                  ? get(infoChat, 'provideIdentityUser.email')
                  : get(infoChat, 'offerIdentityUser.email')}
              </TextFnx>
              <TextFnx color={colors.app.lightWhite} size={fontSize.f16}>
                {get(UserInfo, 'id') ==
                get(infoChat, 'offerIdentityUser.id')
                  ? get(infoChat, 'provideIdentityUser.phoneNumber')
                  : get(infoChat, 'offerIdentityUser.phoneNumber')}
              </TextFnx>
            </Layout>
          </Layout>
          {/* <ButtonIcon name="eye" color={colors.app.yellowHightlight} /> */}
        </Layout>

        <Layout spaceBottom={10} type="column">
          <TextFnx space={10} color={colors.app.yellowHightlight}>
            Lưu ý
          </TextFnx>
          <TextFnx color={colors.app.textContentLevel3}>
            Để giao dịch thành công, vui lòng liên hệ với đối tác trực tiếp về
            hình thức thanh toán, để đảm bảo thông tin thanh toán là chính xác.
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
            thanh toán bạn muốn, và bắt đầu giao dịch ngay trên VNDEx P2P.
          </TextFnx>
        </Layout>
        <Button
          spaceVertical={20}
          isSubmit
          isClose
          onSubmit={
            () => {
              setIsLoading(true);
              useActionsP2p(dispatch).handleConfirmPaymentAdvertisment({
                offerOrderId: offerOrderId,
                isHasPayment: true,
                pofPayment: '',
                pofPaymentComment: '',
                cancellationReason: '',
              });
              pushSingleScreenApp(
          componentId,
          STEP_4_BUY_SELL_SCREEN,
          {
            paymentMethodData,
            item,
          },
          {
            topBar: {
              rightButtons: [
                {
                  id: IdNavigation.PressIn.chat,
                  icon: require('assets/icons/ic_chat.png'),
                },
              ],
            },
          },
        );
            }
            // pushSingleScreenApp(componentId, STEP_4_BUY_SELL_SCREEN)
          }
          colorTitle={colors.text}
          weightTitle={'700'}
          textClose={'Huỷ lệnh'}
          onClose={() => {
            showConfirmDialog();
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
