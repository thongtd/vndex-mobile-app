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
import ButtonIcon from '../../components/Button/ButtonIcon';
import Container from '../../components/Container';
import Empty from '../../components/Item/Empty';
import Layout from '../../components/Layout/Layout';
import TextFnx from '../../components/Text/TextFnx';
import icons from '../../configs/icons';
import colors from '../../configs/styles/colors';
import {
  formatCurrency,
  listenerEventEmitter,
  to_UTCDate,
} from '../../configs/utils';
import { pushSingleScreenApp, STEP_3_BUY_SELL_SCREEN, STEP_4_BUY_SELL_SCREEN, STEP_5_BUY_SELL_SCREEN } from '../../navigation';
import {useActionsP2p} from '../../redux';
import BoxCommand from './components/BoxCommand';
import ButtonTop from './components/ButtonTop';

const CommandScreen = ({componentId}) => {
  const [activeMenu, setActiveMenu] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const currencyList = useSelector(state => state.market.currencyList);
  const historyOrders = useSelector(state => state.p2p.historyOrders);

  const onChangeActive = (menu = {}) => {
    setActiveMenu(get(menu, 'id'));
  };
  const onSelectUnit = () => {
    alert('Lựa chọn đợn vị');
  };
  const dispatch = useDispatch();
  const onSeeDetailCommand = (item) => {
    useActionsP2p(dispatch).handleGetOfferOrder(
      get(item, 'id'),
    );
    useActionsP2p(dispatch).handleGetAdvertisment(
      get(item, 'p2PTradingOrder.id'),
    );
    if(get(item,"isPaymentCancel")){
      pushSingleScreenApp(componentId,STEP_5_BUY_SELL_SCREEN)
    }else if(get(item,"isUnLockConfirm")){
      pushSingleScreenApp(componentId,STEP_5_BUY_SELL_SCREEN)
    }else if(get(item,"isPaymentConfirm")){
      pushSingleScreenApp(componentId,STEP_4_BUY_SELL_SCREEN);
    }else {
      pushSingleScreenApp(componentId,STEP_4_BUY_SELL_SCREEN);
    }
    
  };
  
  useEffect(() => {
    const evDone = listenerEventEmitter('doneApi', isDone => {
      setIsLoading(false);
    });
    getHistoryOrder(pageIndex,{
      side:activeMenu
    });
    return () => {
      evDone.remove();
    };
  }, [pageIndex,activeMenu]);
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
      side: get(data,"side")
    });
    setIsLoading(true);
  };
  const onRefresh = () => {
    setPageIndex(1);
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
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
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
            onSeeDetailCommand={()=>onSeeDetailCommand(item)}
            type={get(item, 'offerSide') == 'B' ? 'MUA' : 'BÁN'}
            isSell={get(item, 'offerSide') !== 'B'}
            price={formatCurrency(
              get(item, 'price') || 0,
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
                  onPress={() => {}}
                  iconComponent={icons.IcChat}
                  title={get(item,"p2PTradingOrder.identityUser.userName")}
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

      {/* <BoxCommand
        onSeeDetailCommand={onSeeDetailCommand}
        isSell
        type="MUA"
        price="53,083.14"
        nameCoin="AIF"
        unit="VND"
        dateTime="2021-11-07 09:25:49"
        contentCenter={
          <>
            <Layout isSpaceBetween isLineCenter spaceBottom={10}>
              <TextFnx color={colors.btnClose} size={12}>
                Giá
              </TextFnx>
              <TextFnx color={colors.greyLight} size={12}>
                23.152 VND
              </TextFnx>
            </Layout>
            <Layout isSpaceBetween isLineCenter spaceBottom={10}>
              <TextFnx color={colors.btnClose} size={12}>
                Số lượng
              </TextFnx>
              <TextFnx color={colors.greyLight} size={12}>
                89.25 AIFT
              </TextFnx>
            </Layout>
          </>
        }
        contentBottom={
          <Layout isSpaceBetween isLineCenter>
            <ButtonIcon
              onPress={() => {}}
              iconComponent={icons.IcChat}
              title={'Seller001'}
              style={{
                width: 'auto',
                backgroundColor: colors.background,
                height: 'auto',
                borderRadius: 5,
              }}
              spaceLeft={5}
            />
            <TextFnx
              color={colors.green}
              style={{
                backgroundColor: colors.app.bgBuy,
                borderRadius: 5,
              }}
              spaceHorizontal={12}>
              Hoàn thành
            </TextFnx>
          </Layout>
        }
      /> */}
    </Container>
  );
};
const mapStatus = ({ isPaymentCancel, isPaymentConfirm, isUnLockConfirm }) => {
  if (isPaymentCancel) {
      return {
        color:colors.app.sell,
        bg:colors.app.bgSell,
        label:"Đã huỷ"
      };
  } else if (isUnLockConfirm) {
    return {
      color:colors.app.buy,
      bg:colors.app.bgBuy,
      label:"Hoàn thành"
    };
  } else if (isPaymentConfirm && !isPaymentCancel) {
    return {
      color:colors.app.buy,
      bg:colors.app.bgBuy,
      label:"Đã thanh toán"
    };
  } else if(!isPaymentConfirm && !isPaymentCancel && !isUnLockConfirm){
    return {
      color:colors.app.sell,
      bg:colors.app.bgSell,
      label:"Chờ thanh toán"
    };
  }
 }

export default CommandScreen;

const styles = StyleSheet.create({
  containerLayout: {
    borderBottomWidth: 1,
    borderBottomColor: colors.app.lineSetting,
  },
});
