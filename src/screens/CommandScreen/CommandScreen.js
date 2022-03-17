import {get,isEmpty} from 'lodash';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {useSelector, useDispatch} from 'react-redux';
import {LoginScreen} from '..';
import ButtonIcon from '../../components/Button/ButtonIcon';
import Container from '../../components/Container';
import Empty from '../../components/Item/Empty';
import Layout from '../../components/Layout/Layout';
import TextFnx from '../../components/Text/TextFnx';
import {BUY, IdNavigation, SELL} from '../../configs/constant';
import icons from '../../configs/icons';
import colors from '../../configs/styles/colors';
import Button from '../../components/Button/Button';
import {
  formatCurrency,
  listenerEventEmitter,
  to_UTCDate,
  str2Number
} from '../../configs/utils';
import {
  CHAT_SCREEN,
  COMMAND_SCREEN,
  COMPLAINING_SCREEN,
  FEEDBACK_SCREEN,
  ADS_ADD_NEW_SCREEN,
  MODAL_FILTER_COMMAND,
  pushSingleScreenApp,
  STEP_2_BUY_SELL_SCREEN,
  STEP_3_BUY_SELL_SCREEN,
  STEP_4_BUY_SELL_SCREEN,
  STEP_5_BUY_SELL_SCREEN,
} from '../../navigation';
import {showModal} from '../../navigation/Navigation';
import {useActionsP2p} from '../../redux';
import BoxCommand from './components/BoxCommand';
import ButtonTop from './components/ButtonTop';

const CommandScreen2 = ({componentId}) => {
  const [activeMenu, setActiveMenu] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [dataSubmit, setDataSubmit] = useState({});
  const currencyList = useSelector(state => state.market.currencyList);
  const historyOrders = useSelector(state => state.p2p.historyOrders);
  const logged = useSelector(state => state.authentication.logged);
  const [isCheckComplain, setIsCheckComplain] = useState(false);
  const onChangeActive = (menu = {}) => {
    setActiveMenu(get(menu, 'id'));
  };
  // useEffect(() => {
  //   if(isCheckComplain){
  //     pushSingleScreenApp(componentId, STEP_4_BUY_SELL_SCREEN, null, {
  //       topBar: {
  //         rightButtons: [
  //           {
  //             id: IdNavigation.PressIn.chat,
  //             icon: require('assets/icons/ic_chat.png'),
  //           },
  //         ],
  //       },
  //     });
  //   }

  //   return () => {

  //   }
  // }, [isCheckComplain])

  const onSelectUnit = () => {
    // alert('Lựa chọn đợn vị');
  };
  const dispatch = useDispatch();
  const UserInfo = useSelector(state => state.authentication.userInfo);
  const onSeeDetailCommand = item => {
    setIsCheckComplain(false);
    // alert(JSON.stringify(UserInfo))
    useActionsP2p(dispatch).handleGetOfferOrder(get(item, 'id'));
    useActionsP2p(dispatch).handleGetAdvertisment(
      get(item, 'p2PTradingOrderId'),
    );
    
    // if(get(UserInfo, 'id') ===
    // get(item, 'ownerIdentityUser.identityUserId')){
    //   alert("ok");
    // }
    if ( get( item, 'status' ) == 4 ) {
      pushSingleScreenApp( componentId, STEP_4_BUY_SELL_SCREEN );
    } else if ( get( item, 'status' ) == 3 ) {
      pushSingleScreenApp( componentId, STEP_5_BUY_SELL_SCREEN );
    } else if (
      get( item, 'status' ) == 7 &&
      get( item, 'orderSide' ) == SELL 
    ) {
      pushSingleScreenApp( componentId, STEP_4_BUY_SELL_SCREEN, {item:item}, {
        topBar: {
          rightButtons: [
            {
              id: IdNavigation.PressIn.chat,
              icon: require( 'assets/icons/ic_chat.png' ),
            },
          ],
        },
      } );
    } else if (
      get( item, 'status' ) == 1 &&
      get( item, 'orderSide' ) == BUY &&
      get( UserInfo, 'id' ) === get( item, 'ownerIdentityUser.identityUserId' )
    ) {
      pushSingleScreenApp( componentId, STEP_3_BUY_SELL_SCREEN, {
        item: item,
      }, {
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
      get(item, 'status') ==1 &&
      get(item, 'orderSide') == SELL &&
      get(UserInfo, 'id') === get(item, 'ownerIdentityUser.identityUserId')
    ) {
      
      pushSingleScreenApp(
        componentId,
        STEP_4_BUY_SELL_SCREEN,
        {
          item: {...item, side: get(item, 'orderSide') == BUY ? BUY : SELL},
          offerOrder: {
            ...item,
            offerOrderId: get(item, 'id'),
            p2PTradingOrderId: get(item, 'p2PTradingOrderId'),
          },
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
    } else if (
      get(item, 'status') == 7 &&
      get(item, 'orderSide') == BUY &&
      get(UserInfo, 'id') === get(item, 'offerIdentityUser.identityUserId')
    ) {
      pushSingleScreenApp( componentId, STEP_4_BUY_SELL_SCREEN, {item:item}, {
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
      get(item, 'status') ==1 && 
      get(item, 'orderSide') == SELL
    ) {
      pushSingleScreenApp(componentId, STEP_4_BUY_SELL_SCREEN, {item:item}, {
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
      get(item, 'status') ==1 &&
      get(item, 'orderSide') == SELL
    ) {
      pushSingleScreenApp( componentId, STEP_4_BUY_SELL_SCREEN, {item:item}, {
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
      get(item, 'status')  ==1 &&
      get(item, 'orderSide') == BUY
    ) {
      pushSingleScreenApp(
        componentId,
        STEP_3_BUY_SELL_SCREEN,
        {
          item: {...item},
          
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
    } else if (
      get(item, 'status') == 7 &&
      get(item, 'orderSide') == BUY
    ) {
      pushSingleScreenApp( componentId, STEP_4_BUY_SELL_SCREEN, {item:item}, {
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
      get(item, 'status') ==5 
    ) {
      useActionsP2p(dispatch).handleGetComplain({
        orderId: get(item, 'id'),
        type: '2',
      } );
      debugger;
      pushSingleScreenApp( componentId, STEP_3_BUY_SELL_SCREEN, {item:item}, {
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
      pushSingleScreenApp(componentId, STEP_5_BUY_SELL_SCREEN);
    }
    // else if(!get(item, 'isUnLockConfirm') && !get(item, 'isPaymentConfirm') && !get(item, 'isPaymentCancel') && get(item, 'timeToLiveInSecond') >= 0){
    //   pushSingleScreenApp(componentId, STEP_3_BUY_SELL_SCREEN);
    // }else{
    //   pushSingleScreenApp(componentId, STEP_4_BUY_SELL_SCREEN);
    // }
  };

  useEffect(() => {
    const evDone = listenerEventEmitter('doneApi', isDone => {
      setIsLoading(false);
    });
    getHistoryOrder(pageIndex, {
      side: activeMenu,
      ...dataSubmit,
    });
    return () => {
      evDone.remove();
    };
  }, [pageIndex, activeMenu, dataSubmit]);
  useEffect(() => {
    if (pageIndex > 1) {
      setPageIndex(1);
    }
    return () => {};
  }, [activeMenu]);
  useEffect(() => {
    const evGetComplain = listenerEventEmitter(
      'doneGetComplain',
      ({type, data}) => {
        if (get(data, 'id')) {
          pushSingleScreenApp(componentId, COMPLAINING_SCREEN, {
            orderId: get(data, 'orderId'),
          });
        }
      },
    );
    const evSubmitFiler = listenerEventEmitter(
      'submitSearchFilterCommand',
      data => {
        setDataSubmit(data);
      },
    );
    const navigationButtonEventListener =
      Navigation.events().registerNavigationButtonPressedListener(
        ({buttonId}) => {
          if (buttonId == IdNavigation.PressIn.filterCommand) {
            showModal(MODAL_FILTER_COMMAND);
          }
        },
      );
    const navigationBuySellButtonEventListener =
      Navigation.events().registerNavigationButtonPressedListener(
        ({buttonId}) => {
          if (buttonId == IdNavigation.PressIn.adsAddNew) {
            pushSingleScreenApp(componentId, ADS_ADD_NEW_SCREEN, null, {
          topBar: {
            rightButtons: [
              {
                id: IdNavigation.PressIn.filterMyAdvertisement,
                icon: require('assets/icons/Filter.png'),
              },
            ],
          },
        });
          }
        },
      );
    const screenEventListener =
      Navigation.events().registerComponentDidAppearListener(
        ({componentId, componentName}) => {
          switch (componentName) {
            case COMMAND_SCREEN:
              getHistoryOrder(1, {
                side: activeMenu,
                ...dataSubmit,
              });
              break;
          }
        },
      );
    return () => {
      evGetComplain.remove();
      evSubmitFiler.remove();
      navigationBuySellButtonEventListener.remove();
      navigationButtonEventListener.remove();
      screenEventListener.remove();
    };
  }, []);

  const getHistoryOrder = (pageIndex, data) => {
    useActionsP2p(dispatch).handleGetHistoryOrder({
      pageIndex: pageIndex,
      pageSize: 15,
      side: get(data, 'side'),
      symbol: get(data, 'symbol'),
      fromDate: get(data, 'fromDate'),
      toDate: get(data, 'toDate'),
    });
    setIsLoading(true);
  };
  const onRefresh = activeMenu => {
    getHistoryOrder(1, {
      side: activeMenu,
      ...dataSubmit,
    });
  };
  let source = get( historyOrders, 'source' );
  let isShowButtonBuySell = source.length < 2 && source.length > 0;
  return (
    <Container
      customsNavigation={() => {
        Navigation.mergeOptions(componentId, {
          topBar: {
            leftButtons: [
              {
                id: IdNavigation.PressIn.adsAddNew,
                icon: require('assets/icons/ic_marketting_trans.png'),
                color: colors.app.yellowHightlight,
              },
            ],
            rightButtons: [
              {
                id: IdNavigation.PressIn.filterCommand,
                icon: require('assets/icons/Filter.png'),
              },
            ],
          },
        });
      }}
      componentId={componentId}
      title="Giao dịch của tôi">
      <ButtonTop
        onChangeActive={onChangeActive}
        activeMenu={activeMenu}
        onSelect={onSelectUnit}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => onRefresh( activeMenu )}
          />
        }
        ListEmptyComponent={
          <View>
            <Empty />
            <Button
              marginTop={40}
              isNormal
              onPress={() => {
                pushSingleScreenApp( componentId, ADS_ADD_NEW_SCREEN, null, {
                  topBar: {
                    rightButtons: [
                      {
                        id: IdNavigation.PressIn.filterMyAdvertisement,
                        icon: require( 'assets/icons/Filter.png' ),
                      },
                    ],
                  },
                } );
              }}
              title={'Chào MUA/BÁN'}
              iconLeftSubmit={icons.IcMarkettingTrans}
            />
          
            </View>
        }
        data={get( historyOrders, 'source' )}
        scrollEnabled
        ListFooterComponent={
          
             (isLoading && <ActivityIndicator style={{color: colors.text}} />) ||
          null
          
        
          
         
        }
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (pageIndex >= get(historyOrders, 'pages')) return;
          setPageIndex(pageIndex + 1);
        }}
        keyExtractor={(item, index) => `data-command-${index}`}
        renderItem={({item, index}) => (
          <BoxCommand
            key={`item-${index}`}
            onSeeDetailCommand={() => onSeeDetailCommand(item)}
            type={get(item, 'orderSide') == 'B' ? 'MUA' : 'BÁN'}
            isSell={get(item, 'orderSide') !== 'B'}
            price={formatCurrency(
              get(item, 'price') * get(item, 'quantity') || 0,
              get(item, 'paymentUnit') || '',
              currencyList,
            )}
            unit={get(item, 'paymentUnit') || ''}
            nameCoin={get(item, 'symbol') || ''}
            dateTime={to_UTCDate(
              get(item, 'createdDate'),
              'DD/MM/YYYY hh:mm:ss',
            )}
            contentCenter={
              <>
                <Layout isSpaceBetween isLineCenter spaceBottom={10}>
                  <TextFnx color={colors.btnClose} size={12}>
                    Giá
                  </TextFnx>
                  <TextFnx color={colors.greyLight} size={12}>
                    {`${formatCurrency(
                      get(item, 'price') || 0,
                      get(item, 'paymentUnit') || '',
                      currencyList,
                    )} ${get(item, 'paymentUnit')}`}
                  </TextFnx>
                </Layout>
                <Layout isSpaceBetween isLineCenter spaceBottom={10}>
                  <TextFnx color={colors.btnClose} size={12}>
                    Số lượng
                  </TextFnx>
                  <TextFnx color={colors.greyLight} size={12}>
                    {`${formatCurrency(
                      get(item, 'quantity') || 0,
                      get(item, 'symbol') || '',
                      currencyList,
                    )} ${get(item, 'symbol')}`}
                  </TextFnx>
                </Layout>
              </>
            }
            contentBottom={
              <Layout isSpaceBetween isLineCenter>
                <ButtonIcon
                  onPress={() => {
                    pushSingleScreenApp(componentId, CHAT_SCREEN, {
                      orderId: get(item, 'id'),
                      email: get(item, 'identityUser.userName'),
                    });
                  }}
                  iconComponent={icons.IcChat}
                  title={get(UserInfo, 'id') == get(item, 'offerIdentityUser.id')?get(item, 'partnerIdentityUser.email'):get(item, 'offerIdentityUser.email')}
                  style={{
                    width: 'auto',
                    backgroundColor: colors.background,
                    height: 'auto',
                    borderRadius: 5,
                  }}
                  spaceLeft={5}
                />
                <TextFnx
                  color={mapStatus(item).color}
                  style={{
                    backgroundColor: mapStatus(item).bg,
                    borderRadius: 5,
                  }}
                  spaceHorizontal={12}>
                  {item.statusLable}
                </TextFnx>
              </Layout>
            }
          />
        )}
      />
      
      {isShowButtonBuySell && <Button
        marginBottom={60}
        isNormal
        onPress={() => {
          pushSingleScreenApp( componentId, ADS_ADD_NEW_SCREEN, null, {
            topBar: {
              rightButtons: [
                {
                  id: IdNavigation.PressIn.filterMyAdvertisement,
                  icon: require( 'assets/icons/Filter.png' ),
                },
              ],
            },
          } );
        }}
        title={'Chào MUA/BÁN'}
        iconLeftSubmit={icons.IcMarkettingTrans}
      />}
    </Container>
  );
};
const CommandScreen = ({componentId}) => {
  const logged = useSelector(state => state.authentication.logged);
  if (logged) {
    return <CommandScreen2 componentId={componentId} />;
  }
  return <LoginScreen componentId={componentId} />;
};
const mapStatus = ({
 status
}) => {
  if (
    status == 5
  ) {
    return {
      color: colors.app.sell,
      bg: colors.app.bgSell,
      label: 'Hết hạn',
    };
  } else if (
    status == 4
  ) {
    return {
      color: colors.app.sell,
      bg: colors.app.bgSell,
      label: 'Đã huỷ',
    };
  } else if (status == 3) {
    return {
      color: colors.app.buy,
      bg: colors.app.bgBuy,
      label: 'Hoàn thành',
    };
  } else if (
    status ==7
  ) {
    return {
      color: colors.app.buy,
      bg: colors.app.bgBuy,
      label: 'Chờ mở khóa',
    };
  } else if (
    status == 6
  ) {
    return {
      color: colors.app.sell,
      bg: colors.app.bgSell,
      label: 'Khiếu nại',
    };
  } else if (
    status == 1
  ) {
    return {
      color: colors.app.buy,
      bg: colors.app.bgBuy,
      label: 'Mới',
    };
  }
  else{
      return {
      color: colors.app.sell,
      bg: colors.app.bgSell,
      label: 'N/A',
    };
  }
};

export default CommandScreen;

const styles = StyleSheet.create({
  containerLayout: {
    borderBottomWidth: 1,
    borderBottomColor: colors.app.lineSetting,
  },
});
