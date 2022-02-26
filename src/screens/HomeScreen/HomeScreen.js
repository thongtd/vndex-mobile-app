import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {LayoutSplashScreen} from '../../components';
import Button from '../../components/Button/Button';
import {
  ADS_ADD_NEW_SCREEN,
  ADS_HISTORY_EXCHANGE_SCREEN,
  ADS_MY_ADVERTISENMENT_SCREEN,
  COMMAND_SCREEN,
  FEEDBACK_SCREEN,
  HOME_SCREEN,
  LIST_UPDATE_ACCOUNT_SCREEN,
  LOGIN_SCREEN,
  MODAL_FILTER_HOME,
  RATING_BUY_SELL_SCREEN,
  SETTING_SCREEN,
  STEP_1_BUY_SELL_SCREEN,
  STEP_4_BUY_SELL_SCREEN,
  WALLET_SCREEN,
  UPDATE_ACCOUNT_SCREEN,
} from '../../navigation';
import {
  pushSingleHiddenTopBarApp,
  pushSingleScreenApp,
  pushTabBasedApp,
  showModal,
} from '../../navigation/Navigation';
import {useSelector} from 'react-redux';
import Container from '../../components/Container';
import {Navigation} from 'react-native-navigation';
import {
  BUY,
  constant,
  fontSize,
  IdNavigation,
  SELL,
} from '../../configs/constant';
import Banner from './components/Banner';
import colors from '../../configs/styles/colors';
import Layout from '../../components/Layout/Layout';
import Image from '../../components/Image/Image';
import TextFnx from '../../components/Text/TextFnx';
import ButtonIcon from '../../components/Button/ButtonIcon';
import icons from '../../configs/icons';
import Icon from '../../components/Icon';
import {useRef} from 'react';
import {get, isArray, size, uniqBy} from 'lodash';
import {Dimensions, StatusBar} from 'react-native';
const screenHeight = Dimensions.get('screen').height;
const windowHeight = Dimensions.get('window').height;
const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;
import {
  createAction,
  formatCurrency,
  jwtDecode,
  listenerEventEmitter,
  removeEventEmitter,
  removeTokenAndUserInfo,
  resetScreenGlobal,
  toast,
} from '../../configs/utils';
import {useActionsP2p} from '../../redux';
import {useDispatch} from 'react-redux';
import {
  CHECK_IS_LOGIN,
  CHECK_STATE_LOGIN,
  GET_USERS_KYC,
  SET_USER_INFO,
} from '../../redux/modules/authentication/actions';
import Empty from '../../components/Item/Empty';

var flagMenu = true;
const HomeScreen = ({componentId}) => {
  const dispatch = useDispatch();
  const [ActiveSymbol, setActiveSymbol] = useState('DIC');
  const [isRefresh, setRefresh] = useState(false);
  const [ActiveType, setActiveType] = useState('S');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadMore, setLoadMore] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [exPaymentMethodIds, setExPaymentMethodIds] = useState([]);
  const [orderAmount, setOrderAmount] = useState('');

  const UserInfo = useSelector(state => state.authentication.userInfo);
  useEffect(() => {
    // if (size(get(tradingMarket, 'assets')) > 0) {
    //   setActiveSymbol(get(tradingMarket, 'assets')[0]);
    // }
    dispatch(createAction(GET_USERS_KYC, get(UserInfo, 'id')));
    // useActionsP2p(dispatch).handleGetUserKyc(get(UserInfo, 'id'));
    return () => {};
  }, [tradingMarket]);
  const tradingMarket = useSelector(state => state.p2p.tradingMarket);
  const advertisments = useSelector(state => state.p2p.advertisments);

  useEffect(() => {
    const listenerEmit = listenerEventEmitter('pushMyads', () => {
      if (logged) {
        pushSingleScreenApp(componentId, ADS_MY_ADVERTISENMENT_SCREEN, null, {
          topBar: {
            rightButtons: [
              {
                id: IdNavigation.PressIn.filterMyAdvertisement,
                icon: require('assets/icons/Filter.png'),
              },
            ],
          },
        });
      } else {
        pushSingleScreenApp(componentId, LOGIN_SCREEN);
      }
    });
    const filerHomeEvent = listenerEventEmitter(
      'filerHomeEvent',
      ({exPaymentMethodIdsEv, orderAmountEv}) => {
        if (exPaymentMethodIdsEv) {
          setExPaymentMethodIds(exPaymentMethodIdsEv);
        }
        console.log(orderAmountEv, 'orderAmountEv');
        if (orderAmountEv) {
          setOrderAmount(orderAmountEv == 'empty' ? '' : orderAmountEv);
        }
      },
    );
    const listenerPushNewAds = listenerEventEmitter('pushNewAds', () => {
      if (logged) {
        useActionsP2p(dispatch).handleGetAdvertisment({});
        pushSingleScreenApp(componentId, ADS_ADD_NEW_SCREEN, null, {
          topBar: {
            rightButtons: [
              {
                id: IdNavigation.PressIn.warningAddNewAds,
                icon: require('assets/icons/ic_warning.png'),
              },
            ],
          },
        });
      } else {
        pushSingleScreenApp(componentId, LOGIN_SCREEN);
      }
    });
    const screenPoppedListener =
      Navigation.events().registerScreenPoppedListener(({componentId}) => {
        resetScreenGlobal();
      });

    const navigationButtonEventListener =
      Navigation.events().registerNavigationButtonPressedListener(
        ({buttonId}) => {
          if (buttonId == IdNavigation.PressIn.menuLeft) {
            Navigation.mergeOptions(componentId, {
              sideMenu: {
                left: {
                  visible: true,
                },
              },
            });
          }

          if (buttonId == IdNavigation.PressIn.profile) {
            if (logged) {
              pushSingleScreenApp(componentId, SETTING_SCREEN);
            } else {
              pushSingleScreenApp(componentId, LOGIN_SCREEN);
            }
          }
        },
      );
    const screenEventListener =
      Navigation.events().registerComponentDidAppearListener(
        ({componentId, componentName}) => {
          jwtDecode().then(user => {
            if (get(user, 'UserId')) {
              dispatch(createAction(CHECK_IS_LOGIN, get(user, 'UserId')));
            }else{
              removeTokenAndUserInfo();
              dispatch(createAction(CHECK_STATE_LOGIN, false));
              dispatch(createAction(SET_USER_INFO, null));
              // pushTabBasedApp();
            }
          });

          switch (componentName) {
            case HOME_SCREEN:
              setIsLoading(true);
              setActiveType('S');
              getAdvertisments(
                ActiveType,
                ActiveSymbol,
                pageIndex,
                exPaymentMethodIds,
                orderAmount,
              );
              break;
          }
        },
      );
    return () => {
      listenerEmit.remove();
      screenPoppedListener.remove();
      listenerPushNewAds.remove();
      navigationButtonEventListener.remove();
      filerHomeEvent.remove();
      screenEventListener.remove();
    };
  }, []);

  useEffect(() => {
    useActionsP2p(dispatch).handleGetTradingMarket();
    let evDone = listenerEventEmitter('doneApi', () => {
      setIsLoading(false);
    });
    if (ActiveSymbol) {
      setLoadMore(false);
      getAdvertisments(
        ActiveType,
        ActiveSymbol,
        pageIndex,
        exPaymentMethodIds,
        orderAmount,
      );
      setIsLoading(true);
      setPageIndex(1);
    }

    return () => {
      evDone.remove();
    };
  }, [
    dispatch,
    ActiveType,
    ActiveSymbol,
    exPaymentMethodIds,
    orderAmount,
    isRefresh,
  ]);
  useEffect(() => {
    getAdvertisments(
      ActiveType,
      ActiveSymbol,
      pageIndex,
      exPaymentMethodIds,
      orderAmount,
    );
    setIsLoading(true);

    return () => {};
  }, [pageIndex]);

  const getAdvertisments = (
    ActiveType,
    ActiveSymbol,
    pageIndex,
    exPaymentMethodIds = [],
    orderAmount,
  ) => {
    useActionsP2p(dispatch).handleGetAdvertisments({
      pageIndex: pageIndex || 1,
      pageSize: 15,
      side: ActiveType == BUY ? SELL : BUY,
      coinSymbol: ActiveSymbol,
      exPaymentMethodIds:
        size(exPaymentMethodIds) > 0 ? exPaymentMethodIds[0] : '',
      orderAmount,
    });
  };
  const logged = useSelector(state => state.authentication.logged);
  const currencyList = useSelector(state => state.market.currencyList);
  const _onScroll = event => {
    if (isLoadMore || pageIndex >= get(advertisments, 'pages')) {
      return;
    }
    let y = event.nativeEvent.contentOffset.y;
    let height = event.nativeEvent.layoutMeasurement.height;
    let contentHeight = event.nativeEvent.contentSize.height;
    if (y + height >= contentHeight - 20) {
      setPageIndex(pageIndex + 1);
      setLoadMore(true);
    }
  };
  return (
    <Container
      isLoadding={isLoading}
      isScroll
      componentId={componentId}
      isTopBar
      onRefresh={() => setRefresh(!isRefresh)}
      isFooter
      title="Giao dịch P2P"
      resAwareScrollView={{
        scrollEventThrottle: 50,
        onScroll: e => _onScroll(e),
      }}>
      <Banner />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: -20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '50%',
          }}>
          <Button
            isNormal
            onPress={() => setActiveType(BUY)}
            width={75}
            title={'Mua'}
            height={40}
            colorTitle={ActiveType == BUY ? colors.app.buy : colors.text}
            bgButtonColor={
              ActiveType == BUY ? colors.app.bgBuy : colors.app.backgroundLevel1
            }
          />
          <Button
            onPress={() => setActiveType(SELL)}
            isNormal
            width={75}
            title={'Bán'}
            height={40}
            colorTitle={ActiveType == SELL ? colors.app.sell : colors.text}
            bgButtonColor={
              ActiveType == SELL
                ? colors.app.bgSell
                : colors.app.backgroundLevel1
            }
          />
        </View>
        <TouchableOpacity onPress={() => showModal(MODAL_FILTER_HOME)}>
          <Icon name="filter" color={colors.highlight} size={18} />
        </TouchableOpacity>
      </View>

      <View>
        <FlatList
          style={{
            borderBottomColor: colors.app.lineSetting,
            borderBottomWidth: 1,
          }}
          horizontal
          data={get(tradingMarket, 'assets') || []}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => setActiveSymbol(item)}
              style={[
                {
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                },
                ActiveSymbol == item && {
                  borderBottomColor:
                    ActiveType == BUY ? colors.app.buy : colors.app.sell,
                  borderBottomWidth: 2,
                },
              ]}>
              <TextFnx
                weight={ActiveSymbol == item ? '700' : '400'}
                size={fontSize.f16}
                color={
                  ActiveSymbol == item
                    ? ActiveType == BUY
                      ? colors.app.buy
                      : colors.app.sell
                    : colors.app.textContentLevel3
                }>
                {item}
              </TextFnx>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      {size(get(advertisments, 'source')) > 0 ? (
        (
          (isArray(get(advertisments, 'source')) &&
            get(advertisments, 'source')) ||
          []
        ).map((item, index) => (
          <View
            key={`data-${index}`}
            style={{
              paddingVertical: 20,
              borderBottomWidth: 1,
              borderBottomColor: colors.app.lineSetting,
            }}>
            <Layout isSpaceBetween>
              <Layout>
                <TextFnx weight="400" size={fontSize.f16} spaceRight={10}>
                  {`${get(item, 'traderInfo.emailAddress')}`}
                </TextFnx>
                {get(item, 'requiredKyc') && (
                  <Icon iconComponent={icons.icTick} />
                )}
              </Layout>
              <TextFnx size={fontSize.f12} color={colors.app.textDisabled}>
                {get(item, 'traderInfo.totalCompleteOrder')} lệnh |{' '}
                {get(item, 'traderInfo.completePercent')}% hoàn tất
              </TextFnx>
            </Layout>
            <Layout isSpaceBetween isLineCenter>
              <View>
                <TextFnx color={colors.app.textDisabled} size={fontSize.f12}>
                  Giá
                </TextFnx>
                <TextFnx
                  weight="500"
                  color={
                    get(item, 'side') == SELL ? colors.app.buy : colors.app.sell
                  }
                  size={fontSize.f20}>
                  {formatCurrency(
                    get(item, 'price'),
                    get(item, 'paymentUnit'),
                    currencyList,
                  )}{' '}
                  <TextFnx
                    color={colors.app.textContentLevel3}
                    weight="400"
                    size={fontSize.f14}>
                    {get(item, 'paymentUnit')}
                  </TextFnx>
                </TextFnx>
              </View>
              <View>
                <Button
                  spaceHorizontal={20}
                  isNormal
                  // width={175}
                  onPress={() => {
                    if (!logged) {
                      return pushSingleScreenApp(componentId, LOGIN_SCREEN);
                    }
                    if (
                      get(item, 'traderInfo.identityUserId') ==
                      get(UserInfo, 'id')
                    ) {
                      return toast('Không được đặt lệnh bạn đã tạo');
                    }
                    if (!get(UserInfo, 'twoFactorEnabled')) {
                      return toast('Vui lòng bật thiết lập 2FA để tạo lệnh');
                    }
                    if (!get(UserInfo, 'customerMetaData.isKycUpdated')) {
                      return toast('Vui lòng KYC tài khoản để tạo lệnh');
                    }
                    pushSingleScreenApp(componentId, STEP_1_BUY_SELL_SCREEN, {
                      item,
                    });
                  }}
                  title={
                    get(item, 'side') == SELL
                      ? `Mua ${get(item, 'symbol')}`
                      : `Bán ${get(item, 'symbol')}`
                  }
                  height={40}
                  colorTitle={
                    get(item, 'side') == SELL ? colors.app.buy : colors.app.sell
                  }
                  bgButtonColor={
                    get(item, 'side') == SELL
                      ? colors.app.bgBuy
                      : colors.app.bgSell
                  }
                />
              </View>
            </Layout>

            <Layout>
              <Layout type="column" spaceRight={10}>
                <TextFnx
                  space={3}
                  size={fontSize.f12}
                  color={colors.app.textDisabled}>
                  Khả dụng
                </TextFnx>
                <TextFnx
                  space={3}
                  size={fontSize.f12}
                  color={colors.app.textDisabled}>
                  Giới hạn
                </TextFnx>
              </Layout>
              <View
                style={{
                  flex: 1,
                }}>
                <TextFnx space={3} size={fontSize.f12}>
                  {formatCurrency(
                    get(item, 'quantity'),
                    get(item, 'symbol'),
                    currencyList,
                  )}{' '}
                  {get(item, 'symbol')}
                </TextFnx>
                <Layout isSpaceBetween>
                  <TextFnx space={3} size={fontSize.f12}>
                    {formatCurrency(
                      get(item, 'minOrderAmount'),
                      get(item, 'paymentUnit'),
                      currencyList,
                    )}{' '}
                    -{' '}
                    {formatCurrency(
                      get(item, 'maxOrderAmount'),
                      get(item, 'paymentUnit'),
                      currencyList,
                    )}{' '}
                    {get(item, 'paymentUnit')}
                  </TextFnx>

                  <Layout>
                    {(uniqBy(get(item, 'paymentMethods'), 'code') || []).map(
                      (it, ind) => {
                        if (
                          get(it, 'code') == constant.CODE_PAYMENT_METHOD.MOMO
                        ) {
                          return (
                            <Image
                              source={icons.icMomo}
                              style={{
                                marginLeft: 5,
                              }}
                            />
                          );
                        } else if (
                          get(it, 'code') ==
                          constant.CODE_PAYMENT_METHOD.BANK_TRANSFER
                        ) {
                          return (
                            <Image
                              source={icons.icBank}
                              style={{
                                marginLeft: 5,
                              }}
                            />
                          );
                        }
                      },
                    )}
                  </Layout>
                </Layout>
              </View>
            </Layout>
          </View>
        ))
      ) : (
        <Empty />
      )}
    </Container>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});

// import React, { useState, useCallback, useEffect } from 'react'
// import { GiftedChat } from 'react-native-gifted-chat'
// import ChatScreen from '../CommandScreen/ChatScreen';

// export default function Example() {
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     setMessages([
//       {
//         _id: 1,
//         text: 'Hello developer',
//         createdAt: new Date(),
//         user: {
//           _id: 2,
//           name: 'React Native',
//           avatar: 'https://placeimg.com/140/140/any',
//         },
//         image: 'https://placeimg.com/140/140/any',
//       },
//     ])
//   }, [])

//   const onSend = useCallback((messages = []) => {
//     setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
//   }, [])

//   return (
//    <ChatScreen />
//   )
// }
