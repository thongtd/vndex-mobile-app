import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import Container from '../../components/Container';
import Input from '../../components/Input';
import colors from '../../configs/styles/colors';
import TextFnx from '../../components/Text/TextFnx';
import Button from '../../components/Button/Button';
import Layout from '../../components/Layout/Layout';
import ButtonIcon from '../../components/Button/ButtonIcon';
import Image from '../../components/Image/Image';
import {
  pushSingleScreenApp,
  FEEDBACK_SCREEN,
  COMPLAINING_PROCESS_SCREEN,
  CHAT_SCREEN,
  STEP_4_BUY_SELL_SCREEN,
} from '../../navigation';
import {
  BUY,
  constant,
  fontSize,
  IdNavigation,
  SELL,
  spacingApp,
} from '../../configs/constant';
import {pop} from '../../navigation/Navigation';
import Icon from '../../components/Icon';
import icons from '../../configs/icons';
import CountDown from 'react-native-countdown-component';
import {get, isEmpty, isNumber} from 'lodash';
import {useSelector, useDispatch} from 'react-redux';
import {
  formatCurrency,
  listenerEventEmitter,
  to_UTCDate,
} from '../../configs/utils';
import Copy from 'assets/svg/ic_copy.svg';
import {Navigation} from 'react-native-navigation';
import {useActionsP2p} from '../../redux';
const ComplainingScreen = ({componentId, orderId,item}) => {
  const currencyList = useSelector(state => state.market.currencyList);
  const offerOrder = useSelector(state => state.p2p.offerOrder);
  const complainInfo = useSelector(state => state.p2p.complain);
  const advertisment = useSelector(state => state.p2p.advertisment);
  const infoChat = useSelector(state => state.p2p.chatInfoP2p);
  const UserInfo = useSelector(state => state.authentication.userInfo);
  const [isCheckFalse, setIsCheckFalse] = useState(false);
  const dispatch = useDispatch();
  const [offerOrderState, setOfferOrderState] = useState(offerOrder);

  useEffect(() => {
    useActionsP2p(dispatch).handleGetComplainProcess(get(complainInfo, 'id'));

    const evGetComplain = listenerEventEmitter(
      'doneGetComplain',
      ({type, data}) => {
        if (!get(data, 'id') && type == '3') {
          pushSingleScreenApp(componentId, STEP_4_BUY_SELL_SCREEN, null, {
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
    );

    return () => {
      evGetComplain.remove();
    };
  }, [complainInfo]);
  useEffect(() => {
    if (
      get(UserInfo, 'id') ===
      get(offerOrder, 'ownerIdentityUser.identityUserId')
    ) {
      setOfferOrderState({
        ...offerOrder,
        offerSide: get(offerOrder, 'offerSide') === BUY ? SELL : BUY,
      });
    } else {
      setOfferOrderState({
        ...offerOrder,
      });
    }

    return () => {};
  }, [offerOrder, UserInfo]);
  useEffect(() => {
    // useActionsP2p(dispatch).handleGetComplainProcess(get(complainInfo, 'id'));
    useActionsP2p(dispatch).handleGetComplain({
      orderId,
      type: '2',
    });
    const navigationButtonEventListener =
      Navigation.events().registerNavigationButtonPressedListener(
        ({buttonId}) => {
          if (buttonId == IdNavigation.PressIn.chat) {
            pushSingleScreenApp(componentId, CHAT_SCREEN, {
              orderId: orderId,
              email: get(advertisment, 'traderInfo.emailAddress'),
            });
          }
        },
      );
    const ev = listenerEventEmitter('doneApi', () => {
      setIsLoading(false);
    });
    const evCancel = listenerEventEmitter('cancelSuccess', () => {
      pushSingleScreenApp(componentId, STEP_4_BUY_SELL_SCREEN, null, {
        topBar: {
          rightButtons: [
            {
              id: IdNavigation.PressIn.chat,
              icon: require('assets/icons/ic_chat.png'),
            },
          ],
        },
      });
    });

    return () => {
      navigationButtonEventListener.remove();
      ev.remove();
      evCancel.remove();
    };
  }, []);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Container
      isLoadding={isLoading}
      // spaceHorizontal={20}
      space={15}
      spaceHorizontal={0}
      componentId={componentId}
      isTopBar
      isScroll
      customsNavigation={() => {
        Navigation.mergeOptions(componentId, {
          topBar: {
            title: {
              text: 'Đang khiếu nại',
            },
            rightButtons: [
              {
                id: IdNavigation.PressIn.chat,
                icon: require('assets/icons/ic_chat.png'),
              },
            ],
          },
        });
      }}
      title="Đang khiếu nại">
      <Layout
        type="column"
        space={10}
        style={{
          borderBottomWidth: 1,
          borderColor: colors.app.lineSetting,
        }}>
        {get(UserInfo, 'id') == get(complainInfo, 'accId') ? (
          <TextFnx spaceBottom={5} size={14} align="center">
            Hãy chờ người bị khiếu nại xử lý
          </TextFnx>
        ) : isCheckFalse ? (
          <TextFnx spaceBottom={5} size={14} align="center">
            Hãy chờ bộ phận hỗ trợ khách hàng của VNDEX
          </TextFnx>
        ) : (
          <TextFnx spaceBottom={5} size={14} align="center">
            Hãy trả lời khiếu nại
          </TextFnx>
        )}
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
              isNumber(get(complainInfo, 'timeToLiveInSecond'))
                ? parseInt(get(complainInfo, 'timeToLiveInSecond'))
                : 0
            }
            size={14}
            timeLabels={{m: '', s: ''}}
            style={{
              flexDirection: 'row',
            }}
            onFinish={() => {
              // useActionsP2p(dispatch).handleGetOfferOrder(offerOrderId);
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
        {get(UserInfo, 'id') == get(complainInfo, 'accId') || isCheckFalse ? (
          <Layout type="column" spaceHorizontal={10}>
            <TextFnx spaceBottom={5} size={14}>
              1. Nếu cả hai đã được thỏa thuận, bạn có thể HỦY KHIẾU NẠI và tiến
              hành hoàn tất giao dịch
            </TextFnx>
            <TextFnx spaceBottom={5} size={14}>
              2. Nếu người khiếu nại không phản hồi kịp thời, hỗ trợ khách hàng
              sẽ can thiệp và tiến hành phân xử.
            </TextFnx>
            <TextFnx spaceBottom={5} size={14}>
              3. Hãy{' '}
              <TextFnx color={colors.highlight} style={{marginBottom: -3}}>
                Cung cấp thêm thông tin
              </TextFnx>
              . Thông tin cung cấp bởi người dùng và hỗ trợ khách hàng có thể
              tìm thấy ở "Tiến trình khiếu nại
            </TextFnx>
            <TextFnx color={colors.highlight}></TextFnx>
          </Layout>
        ) : (
          <Layout type="column" spaceHorizontal={10}>
            <TextFnx spaceBottom={5} size={14}>
              1. Nếu bạn đã đạt được thỏa thuận với đối tác, hãy nhấn ĐẠT THỎA
              THUẬN và đợi xác nhận. Khi được đối tác xác nhận thỏa thuận, khiếu
              nại sẽ bị hủy. Nếu đối tác không xác nhận thỏa thuận, bộ phận hỗ
              trợ khách hàng sẽ can thiệp và tiến hành phân xử.
            </TextFnx>
            <TextFnx spaceBottom={5} size={14}>
              2. Nếu bạn không thể đạt được thỏa thuận với đối tác, hãy nhấn ĐÀM
              PHÁN THẤT BẠI. Bộ phận hỗ trợ khách hàng sẽ can thiệp và tiến hành
              phân xử.
            </TextFnx>
            <TextFnx spaceBottom={5} size={14}>
              3. Nếu người khiếu nại không phản hồi kịp thời, hỗ trợ khách hàng
              sẽ can thiệp và tiến hành phân xử.
            </TextFnx>
            <TextFnx spaceBottom={5} size={14}>
              4. Hãy{' '}
              <TextFnx color={colors.highlight} style={{marginBottom: -3}}>
                Cung cấp thêm thông tin
              </TextFnx>
              . Thông tin cung cấp bởi người dùng và hỗ trợ khách hàng có thể
              tìm thấy ở "Tiến trình khiếu nại
            </TextFnx>
            <TextFnx color={colors.highlight}></TextFnx>
          </Layout>
        )}
      </Layout>

      <TouchableOpacity
        onPress={() => {
          pushSingleScreenApp(componentId, COMPLAINING_PROCESS_SCREEN, {
            orderId: orderId,
          });
        }}
        style={{
          borderBottomWidth: 1,
          borderColor: colors.app.lineSetting,
          paddingVertical: 5,
        }}>
        <ButtonIcon
          name=""
          onPress={() => {
            pushSingleScreenApp(componentId, COMPLAINING_PROCESS_SCREEN, {
              orderId: orderId,
            });
          }}
          style={{
            borderBottomWidth: 1,
            borderColor: colors.app.lineSetting,
            paddingVertical: 5,
              width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          title={'Tiến trình khiếu nại'}
          size={0}
          iconRight={
            <Icon name="chevron-right" size={14} color={colors.text} />
          }
        />
      </TouchableOpacity>

      {/* info create order */}
      {/* <Layout
        space={10}
        type="column"
        style={{
          borderBottomWidth: 1,
          borderColor: colors.app.lineSetting,
        }}>
        <Layout isSpaceBetween isLineCenter spaceBottom={10}>
          <TextFnx color={colors.btnClose} size={14}>
            Số tiền
          </TextFnx>
          <TextFnx color={colors.greyLight} size={16}>
            150,000,500 VND
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween isLineCenter spaceBottom={10}>
          <TextFnx color={colors.btnClose} size={14}>
            Giá
          </TextFnx>
          <TextFnx color={colors.greyLight} size={14}>
            24,525 VND
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween isLineCenter spaceBottom={10}>
          <TextFnx color={colors.btnClose} size={14}>
            Số lượng
          </TextFnx>
          <TextFnx color={colors.greyLight} size={14}>
            5,000 AIF
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween isLineCenter spaceBottom={10}>
          <TextFnx color={colors.btnClose} size={14}>
            Phí
          </TextFnx>
          <TextFnx color={colors.greyLight} size={14}>
            0.0154500 AIF
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween isLineCenter spaceBottom={10}>
          <TextFnx color={colors.btnClose} size={14}>
            Số lệnh
          </TextFnx>
          <TextFnx color={colors.greyLight} size={14}>
            1234567890
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween isLineCenter spaceBottom={10}>
          <TextFnx color={colors.btnClose} size={14}>
            Thời gian tạo
          </TextFnx>
          <TextFnx color={colors.greyLight} size={14}>
            16-11-2021 11:20:35
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween isLineCenter spaceBottom={10}>
          <TextFnx color={colors.btnClose} size={14}>
            Thời gian tạo
          </TextFnx>
          <TextFnx color={colors.greyLight} size={14}>
            16-11-2021 11:20:35
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween isLineCenter spaceBottom={10}>
          <TextFnx color={colors.btnClose} size={14}>
            Bí danh của người bán
          </TextFnx>
          <TextFnx color={colors.greyLight} size={14}>
            {`lutuananh94  `}
            <Icon
              name="chevron-right"
              size={14}
              color={colors.background}
              style={{marginLeft: 10}}
            />
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween isLineCenter spaceBottom={10}>
          <TextFnx color={colors.btnClose} size={14}>
            Phương thức thanh toán
          </TextFnx>

          <TextFnx style={{width: 'auto'}}>
            <TextFnx
              color={colors.greyLight}
              size={14}
              style={{backgroundColor: colors.app.bg363636, borderRadius: 3}}>
              Chuyển khoản
            </TextFnx>
            {`  `}
            <Icon
              name="chevron-right"
              size={14}
              color={colors.background}
              style={{marginLeft: 10}}
            />
          </TextFnx>
        </Layout>
      </Layout> */}
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
              get(offerOrderState, 'price') * get(offerOrderState, 'quantity'),
              get(advertisment, 'paymentUnit'),
              currencyList,
            )} `}
            <TextFnx color={colors.app.textContentLevel3}>
              {get(advertisment, 'paymentUnit') || get(item, 'paymentUnit')}
            </TextFnx>
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Giá</TextFnx>
          <TextFnx color={colors.app.textContentLevel2}>{`${formatCurrency(
            get(advertisment, 'price'),
            get(advertisment, 'paymentUnit'),
            currencyList,
          )} ${get(advertisment, 'paymentUnit') || get(item, 'paymentUnit')}`}</TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Số lượng</TextFnx>
          <TextFnx color={colors.app.textContentLevel2}>{`${formatCurrency(
            get(offerOrderState, 'quantity'),
            get(advertisment, 'paymentUnit') || get(item, 'paymentUnit'),
            currencyList,
          )} ${get(advertisment, 'symbol') || get(item, 'symbol')}`}</TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Phí</TextFnx>
          <TextFnx color={colors.app.textContentLevel2}>{`${formatCurrency(
            get(offerOrderState, 'fee'),
            get(offerOrderState, 'feeTaxBy'),
            currencyList,
          )} ${get(offerOrderState, 'feeTaxBy')}`}</TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Thuế</TextFnx>
          <TextFnx color={colors.app.textContentLevel2}>
            {`${formatCurrency(
              get(offerOrderState, 'tax'),
              get(offerOrderState, 'feeTaxBy'),
              currencyList,
            )} ${get(offerOrderState, 'feeTaxBy')}`}
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>Số Lệnh</TextFnx>
          <Layout isLineCenter>
            <TextFnx color={colors.app.textContentLevel2}>
              {get(advertisment, 'orderSequenceNumber') || get(item, 'orderSequenceNumber')}
            </TextFnx>
            <ButtonIcon
              onPress={() => {
                Clipboard.setString(get(advertisment, 'orderNumber') ?? get(item, 'orderNumber'));
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
              get(item,'createdDate'),
              'DD-MM-YYYY hh:mm:ss',
            )}
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween space={8}>
          <TextFnx color={colors.app.textContentLevel3}>
            Phương thức thanh toán
          </TextFnx>
          {get(offerOrderState, 'exPaymentMethodCode') ==
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
        {!isEmpty(get(offerOrderState, 'backAccountNo')) && (
          <Layout isSpaceBetween space={8}>
            <TextFnx color={colors.app.textContentLevel3}>Số tài khoản</TextFnx>
            <Layout isLineCenter>
              <TextFnx color={colors.app.textContentLevel2}>
                {get(offerOrderState, 'backAccountNo')}
              </TextFnx>
              <ButtonIcon
                style={{
                  height: 25,
                  width: 30,
                }}
                onPress={() => hanldeCopy(get(offerOrderState, 'bankAccountNo'))}
                iconComponent={<Copy height={20} width={20} />}
              />
            </Layout>
          </Layout>
        )}
        {!isEmpty(get(offerOrderState, 'bankName')) && (
          <Layout isSpaceBetween space={8}>
            <TextFnx color={colors.app.textContentLevel3}>
              Tên ngân hàng
            </TextFnx>
            <Layout isLineCenter>
              <TextFnx color={colors.app.textContentLevel2}>
                {get(offerOrderState, 'bankName')}
              </TextFnx>
              <ButtonIcon
                style={{
                  height: 25,
                  width: 30,
                }}
                onPress={() => hanldeCopy(get(offerOrderState, 'bankName'))}
                iconComponent={<Copy height={20} width={20} />}
              />
            </Layout>
          </Layout>
        )}
        {!isEmpty(get(offerOrderState, 'bankBranchName')) && (
          <Layout isSpaceBetween space={8}>
            <TextFnx color={colors.app.textContentLevel3}>Chi nhánh</TextFnx>
            <Layout isLineCenter>
              <TextFnx color={colors.app.textContentLevel2}>
                {get(offerOrderState, 'bankBranchName')}
              </TextFnx>
              <ButtonIcon
                style={{
                  height: 25,
                  width: 30,
                }}
                onPress={() => hanldeCopy(get(offerOrderState, 'bankBranchName'))}
                iconComponent={<Copy height={20} width={20} />}
              />
            </Layout>
          </Layout>
        )}
        {!isEmpty(get(offerOrderState, 'fullName')) && (
          <Layout isSpaceBetween space={8}>
            <TextFnx color={colors.app.textContentLevel3}>Tên</TextFnx>
            <Layout isLineCenter>
              <TextFnx color={colors.app.textContentLevel2}>
                {get(offerOrderState, 'fullName')}
              </TextFnx>
              <ButtonIcon
                style={{
                  height: 25,
                  width: 30,
                }}
                onPress={() => hanldeCopy(get(offerOrderState, 'fullName'))}
                iconComponent={<Copy height={20} width={20} />}
              />
            </Layout>
          </Layout>
        )}
        {!isEmpty(get(offerOrderState, 'phoneNumber')) && (
          <Layout isSpaceBetween space={8}>
            <TextFnx color={colors.app.textContentLevel3}>
              Số điện thoại
            </TextFnx>
            <Layout isLineCenter>
              <TextFnx color={colors.app.textContentLevel2}>
                {get(offerOrderState, 'phoneNumber')}
              </TextFnx>
              <ButtonIcon
                style={{
                  height: 25,
                  width: 30,
                }}
                onPress={() => hanldeCopy(get(offerOrderState, 'phoneNumber'))}
                iconComponent={<Copy height={20} width={20} />}
              />
            </Layout>
          </Layout>
        )}
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
                Người {get(advertisment, 'side') == SELL ? 'bán' : 'mua'}
              </TextFnx>
              <TextFnx
                space={8}
                color={colors.app.lightWhite}
                size={fontSize.f16}>
                {get(advertisment, 'traderInfo.identityUserId') ==
                get(infoChat, 'offerIdentityUser.id')
                  ? get(infoChat, 'offerIdentityUser.email')
                  : get(infoChat, 'provideIdentityUser.email')}
              </TextFnx>
              <TextFnx color={colors.app.lightWhite} size={fontSize.f16}>
                {get(advertisment, 'traderInfo.identityUserId') ==
                get(infoChat, 'offerIdentityUser.id')
                  ? get(infoChat, 'offerIdentityUser.phoneNumber')
                  : get(infoChat, 'provideIdentityUser.phoneNumber')}
              </TextFnx>
            </Layout>
          </Layout>
          {/* <ButtonIcon name="eye" color={colors.app.yellowHightlight} /> */}
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
            Bạn có thể hủy yêu cầu khiếu nại nếu đã liên lạc thành công với đối
            tác hoặc giải quyết được tranh chấp. Lệnh của bạn sẽ KHÔNG bị hủy
            nếu bạn hủy khiếu nại. Lệnh của bạn sẽ được trở lại trạng thái “Chờ
            mở khóa”.
          </TextFnx>
        </Layout>
        {!isCheckFalse && (
          <>
            {get(UserInfo, 'id') == get(complainInfo, 'accId') ? (
              <Button
                textClose={'Hủy khiếu nại'}
                isClose
                onClose={() => {
                  setIsLoading(true);
                  useActionsP2p(dispatch).handleCancelComplain(
                    get(complainInfo, 'id'),
                  );
                }}
              />
            ) : (
              <Button
                spaceVertical={20}
                isSubmit
                // bgButtonColorSubmit={
                //   disabledSubmit ? '#715611' : colors.app.yellowHightlight
                // }
                // bgButtonColorClose={disabledSubmit ? '#2C2B28' : colors.btnClose}
                // disabledClose={disabledSubmit}
                // disabledSubmit={disabledSubmit}
                isClose
                onSubmit={() => {
                  setIsLoading(true);
                  useActionsP2p(dispatch).handleGetComplain({
                    orderId,
                    type: '3',
                  });
                }}
                onClose={() => {
                  setIsCheckFalse(true);
                }}
                colorTitle={colors.text}
                weightTitle={'700'}
                textClose="Đàm phán thất bại"
                textSubmit="Đạt thỏa thuận"
                colorTitleClose={colors.description}
                //   te={'MUA USDT'}
              />
            )}
          </>
        )}
      </View>
    </Container>
  );
};

export default ComplainingScreen;

const styles = StyleSheet.create({
  textArea: {
    height: 150,
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    fontSize: 16,
    position: 'relative',
    marginTop: -10,
    marginBottom: 10,
    width: '100%',
  },
  noteForText: {
    position: 'absolute',
    bottom: 7,
    right: 10,
    zIndex: 100,
    height: 'auto',
  },
});
