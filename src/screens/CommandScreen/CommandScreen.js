import {get} from 'lodash';
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
import {
  formatCurrency,
  listenerEventEmitter,
  to_UTCDate,
} from '../../configs/utils';
import {
  CHAT_SCREEN,
  pushSingleScreenApp,
  STEP_3_BUY_SELL_SCREEN,
  STEP_4_BUY_SELL_SCREEN,
  STEP_5_BUY_SELL_SCREEN,
} from '../../navigation';
import {useActionsP2p} from '../../redux';
import BoxCommand from './components/BoxCommand';
import ButtonTop from './components/ButtonTop';

const CommandScreen2 = ({componentId}) => {
  const [activeMenu, setActiveMenu] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const currencyList = useSelector(state => state.market.currencyList);
  const historyOrders = useSelector(state => state.p2p.historyOrders);
  const logged = useSelector(state => state.authentication.logged);

  const onChangeActive = (menu = {}) => {
    setActiveMenu(get(menu, 'id'));
  };
  const onSelectUnit = () => {
    // alert('Lựa chọn đợn vị');
  };
  const dispatch = useDispatch();
  const UserInfo = useSelector(state => state.authentication.userInfo);
  const onSeeDetailCommand = item => {
    // alert(JSON.stringify(UserInfo))
    useActionsP2p(dispatch).handleGetOfferOrder(get(item, 'id'));
    useActionsP2p(dispatch).handleGetAdvertisment(
      get(item, 'p2PTradingOrder.id'),
    );
    // if(get(UserInfo, 'id') ===
    // get(item, 'p2PTradingOrder.accId')){
    //   alert("ok");
    // }
    if (get(item, 'isPaymentCancel')) {
      pushSingleScreenApp(componentId, STEP_5_BUY_SELL_SCREEN);
    } else if (get(item, 'isUnLockConfirm')) {
      pushSingleScreenApp(componentId, STEP_5_BUY_SELL_SCREEN);
    } else if (
      get(item, 'isPaymentConfirm') &&
      get(item, 'timeToLiveInSecond') > 0 &&
      !get(item, 'isUnLockConfirm') &&
      get(item, 'offerSide') == SELL &&
      get(UserInfo, 'id') === get(item, 'p2PTradingOrder.accId')
    ) {
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
    } else if (
      !get(item, 'isPaymentConfirm') &&
      get(item, 'timeToLiveInSecond') > 0 &&
      !get(item, 'isUnLockConfirm') &&
      get(item, 'offerSide') == SELL &&
      get(UserInfo, 'id') === get(item, 'p2PTradingOrder.accId')
    ) {
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
    } else if (
      !get(item, 'isPaymentConfirm') &&
      get(item, 'timeToLiveInSecond') > 0 &&
      !get(item, 'isUnLockConfirm') &&
      get(item, 'offerSide') == BUY &&
      get(UserInfo, 'id') === get(item, 'p2PTradingOrder.accId')
    ) {
      pushSingleScreenApp(
        componentId,
        STEP_3_BUY_SELL_SCREEN,
        {
          item: {...item, side: get(item, 'offerSide') == BUY ? SELL : BUY},
          offerOrder: {
            ...item,
            offerOrderId: get(item, 'id'),
            p2PTradingOrderId: get(item, 'p2PTradingOrder.id'),
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
      get(item, 'isPaymentConfirm') &&
      get(item, 'timeToLiveInSecond') > 0 &&
      !get(item, 'isUnLockConfirm') &&
      get(item, 'offerSide') == BUY &&
      get(UserInfo, 'id') === get(item, 'p2PTradingOrder.accId')
    ) {
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
    } else if (
      !get(item, 'isPaymentConfirm') &&
      get(item, 'timeToLiveInSecond') > 0 &&
      !get(item, 'isUnLockConfirm') &&
      get(item, 'offerSide') == SELL
    ) {
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
    } else if (
      !get(item, 'isPaymentConfirm') &&
      get(item, 'timeToLiveInSecond') > 0 &&
      !get(item, 'isUnLockConfirm') &&
      get(item, 'offerSide') == SELL
    ) {
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
    } else if (
      !get(item, 'isPaymentConfirm') &&
      get(item, 'timeToLiveInSecond') > 0 &&
      !get(item, 'isUnLockConfirm') &&
      get(item, 'offerSide') == BUY
    ) {
      pushSingleScreenApp(
        componentId,
        STEP_3_BUY_SELL_SCREEN,
        {
          item: {...item, side: get(item, 'offerSide') == BUY ? SELL : BUY},
          offerOrder: {
            ...item,
            offerOrderId: get(item, 'id'),
            p2PTradingOrderId: get(item, 'p2PTradingOrder.id'),
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
      get(item, 'isPaymentConfirm') &&
      get(item, 'timeToLiveInSecond') > 0 &&
      !get(item, 'isUnLockConfirm') &&
      get(item, 'offerSide') == BUY
    ) {
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
    });
    return () => {
      evDone.remove();
    };
  }, [pageIndex, activeMenu]);
  useEffect(() => {
    if (pageIndex > 1) {
      setPageIndex(1);
    }
    return () => {};
  }, [activeMenu]);
  const getHistoryOrder = (pageIndex, data) => {
    useActionsP2p(dispatch).handleGetHistoryOrder({
      pageIndex: pageIndex,
      pageSize: 15,
      side: get(data, 'side'),
    });
    setIsLoading(true);
  };
  const onRefresh = activeMenu => {
    getHistoryOrder(1, {
      side: activeMenu,
    });
  };
  return (
    <Container componentId={componentId} title="Lịch sử giao dịch">
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
            onRefresh={() => onRefresh(activeMenu)}
          />
        }
        ListEmptyComponent={<Empty />}
        data={get(historyOrders, 'source')}
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
            type={get(item, 'offerSide') == 'B' ? 'MUA' : 'BÁN'}
            isSell={get(item, 'offerSide') !== 'B'}
            price={formatCurrency(
              get(item, 'price') * get(item, 'quantity') || 0,
              get(item, 'p2PTradingOrder.paymentUnit') || '',
              currencyList,
            )}
            unit={get(item, 'p2PTradingOrder.paymentUnit') || ''}
            nameCoin={get(item, 'p2PTradingOrder.symbol') || ''}
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
                      get(item, 'p2PTradingOrder.paymentUnit') || '',
                      currencyList,
                    )} ${get(item, 'p2PTradingOrder.paymentUnit')}`}
                  </TextFnx>
                </Layout>
                <Layout isSpaceBetween isLineCenter spaceBottom={10}>
                  <TextFnx color={colors.btnClose} size={12}>
                    Số lượng
                  </TextFnx>
                  <TextFnx color={colors.greyLight} size={12}>
                    {`${formatCurrency(
                      get(item, 'quantity') || 0,
                      get(item, 'p2PTradingOrder.symbol') || '',
                      currencyList,
                    )} ${get(item, 'p2PTradingOrder.symbol')}`}
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
                      email:get(item, 'p2PTradingOrder.identityUser.userName')
                    });
                  }}
                  iconComponent={icons.IcChat}
                  title={get(item, 'p2PTradingOrder.identityUser.userName')}
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
                  {mapStatus(item).label}
                </TextFnx>
              </Layout>
            }
          />
        )}
      />
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
  isPaymentCancel,
  isPaymentConfirm,
  isUnLockConfirm,
  timeToLiveInSecond,
}) => {
  if (
    isPaymentCancel ||
    (!isPaymentConfirm &&
      !isPaymentCancel &&
      !isUnLockConfirm &&
      timeToLiveInSecond == 0)
  ) {
    return {
      color: colors.app.sell,
      bg: colors.app.bgSell,
      label: 'Đã huỷ',
    };
  } else if (isUnLockConfirm) {
    return {
      color: colors.app.buy,
      bg: colors.app.bgBuy,
      label: 'Hoàn thành',
    };
  } else if (isPaymentConfirm && !isPaymentCancel && !isUnLockConfirm) {
    return {
      color: colors.app.buy,
      bg: colors.app.bgBuy,
      label: 'Đã thanh toán',
    };
  } else if (isPaymentConfirm && !isPaymentCancel && timeToLiveInSecond == 0) {
    return {
      color: colors.app.sell,
      bg: colors.app.bgSell,
      label: 'Khiếu lại',
    };
  } else if (
    !isPaymentConfirm &&
    !isPaymentCancel &&
    !isUnLockConfirm &&
    timeToLiveInSecond > 0
  ) {
    return {
      color: colors.app.sell,
      bg: colors.app.bgSell,
      label: 'Chờ thanh toán',
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
