import _, {get, isArray, uniqBy} from 'lodash';
import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, Switch, ActivityIndicator, View} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {SwipeListView} from 'react-native-swipe-list-view';
import {useDispatch, useSelector} from 'react-redux';
import BottomSheet from '../../../components/ActionSheet/ActionSheet';
import Button from '../../../components/Button/Button';
import ButtonIcon from '../../../components/Button/ButtonIcon';
import Container from '../../../components/Container';
import Icon from '../../../components/Icon';
import Image from '../../../components/Image/Image';
import Empty from '../../../components/Item/Empty';
import Layout from '../../../components/Layout/Layout';
import TextFnx from '../../../components/Text/TextFnx';
import {constant, IdNavigation} from '../../../configs/constant';
import icons from '../../../configs/icons';
import colors from '../../../configs/styles/colors';
import {
  formatCurrency,
  listenerEventEmitter,
  size,
} from '../../../configs/utils';
import {
  ADS_ADD_NEW_SCREEN,
  MODAL_FILTER_MY_ADS,
  pushSingleScreenApp,
} from '../../../navigation';
import {showModal} from '../../../navigation/Navigation';
import {useActionsP2p} from '../../../redux';
import BoxCommand from '../../CommandScreen/components/BoxCommand';
import ButtonAddNew from './ButtonAddNew';

const ActionBottom = (status)=>{
  console.log('status: ', status);
  return [
    {
      name: 'Chỉnh sửa',
      type: 'EDIT',
    },
    {
      name: 'Offline',
      type: 'OFFLINE',
    },
    {
      name: 'Chia sẻ quảng cáo',
      type: 'SHARE',
    },
    {
      name: 'Huỷ quảng cáo',
      type: 'CLOSE',
    },
  ].filter(s => {
    if(status == 3 || status == 4){
      return s.type !== 'CLOSE'
    }
    return s
  });
}
const MyAdvertisenmentScreen = ({componentId}) => {
  const dispatch = useDispatch();
  const [isEnabled, setIsEnabled] = useState({});
  const [itemData, setItem] = useState({});
  const refAction = useRef(null);
  // const [callIndexFail, setCallIndexFail] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [ActiveType, setActiveType] = useState('');
  const [ActiveSymbol, setActiveSymbol] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dataSubmit, setDataSubmit] = useState({});
  const currencyList = useSelector(state => state.market.currencyList);
  const myAdvertisments = useSelector(state => state.p2p.myAdvertisments);
  const UserInfo = useSelector(state => state.authentication.userInfo);

  useEffect(() => {
    const evFilter = listenerEventEmitter('submitSearchFilterMyAdv', data => {
      setDataSubmit(data);
    });
    const navigationButtonEventListener =
      Navigation.events().registerNavigationButtonPressedListener(
        ({buttonId}) => {
          if (buttonId == IdNavigation.PressIn.filterMyAdvertisement) {
            showModal(MODAL_FILTER_MY_ADS);
          }
        },
      );

    return () => {
      navigationButtonEventListener.remove();
      evFilter.remove();
    };
  }, []);
  useEffect(() => {
    const evDone = listenerEventEmitter('doneApi', isDone => {
      setIsLoading(false);
    });
    getMyAdvertisments(pageIndex, dataSubmit);

    return () => {
      evDone.remove();
    };
  }, [pageIndex, dataSubmit]);
  const getMyAdvertisments = (pageIndex, dataSubmit) => {
    console.log('pageIndex: ', pageIndex);
    setIsEnabled({});
    useActionsP2p(dispatch).handleGetMyAdvertisments({
      pageIndex: pageIndex,
      pageSize: 15,
      side: '',
      coinSymbol: ActiveSymbol,
      ...dataSubmit,
    });
    setIsLoading(true);
  };

  const onAddNewAdvertisenment = () => {
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
  };
  const onSeeDetailCommand = () => {
    // alert('Xem chi tiết lệnh');
  };
  const onActionClick = item => {
    refAction.current?.hide();

    switch (item?.type) {
      case 'EDIT': {
        // const item = refAction.current?.item || {};
        // const option = {
        //   topBar: {
        //     rightButtons: [
        //       {
        //         id: IdNavigation.PressIn.warningAddNewAds,
        //         icon: require('assets/icons/ic_warning.png'),
        //       },
        //     ],
        //   },
        // };

        // useActionsP2p(dispatch).handleGetAdvertisment(get(item, 'orderId'));
        // pushSingleScreenApp(componentId, ADS_ADD_NEW_SCREEN, {
        //   isEdit:true
        // }, {...option});
        break;
      }
      case 'OFFLINE': {
        break;
      }
      case 'SHARE': {
        break;
      }
      case 'CLOSE': {
        refAction.current?.hide();
        const item = refAction.current?.item || {};

        useActionsP2p(dispatch).handleRemoveAdvertisment(get(item, 'orderId'));
        break;
      }
    }
  };
  const onRefresh = () => {
    getMyAdvertisments(pageIndex, dataSubmit);
  };
  return (
    <Container
      componentId={componentId}
      // isScroll
      title="Quảng cáo của tôi"
      spaceHorizontal={0}
      customsNavigation={() => {
        Navigation.mergeOptions(componentId, {
          topBar: {
            rightButtons: [
              {
                id: IdNavigation.PressIn.filterMyAdvertisement,
                icon: require('assets/icons/Filter.png'),
              },
            ],
          },
        });
      }}>
      <SwipeListView
        onRefresh={onRefresh}
        ListHeaderComponent={<ButtonAddNew onPress={onAddNewAdvertisenment} />}
        showsVerticalScrollIndicator={false}
        scrollEnabled
        ListEmptyComponent={<Empty />}
        data={
          (isArray(get(myAdvertisments, 'source')) &&
            get(myAdvertisments, 'source')) ||
          []
        }
        stopRightSwipe={-100}
        disableRightSwipe
        rightOpenValue={-60}
        keyExtractor={(item, index) => String(`key-item-my-ads-${index}`)}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (pageIndex >= get(myAdvertisments, 'pages')) return;
          setPageIndex(pageIndex + 1);
        }}
        ListFooterComponent={
          (isLoading && <ActivityIndicator style={{color: colors.text}} />) ||
          null
        }
        refreshing={isLoading}
        renderItem={({item, index}) => (
          <View key={`item-${index}`} style={{paddingHorizontal: 20}}>
            <BoxCommand
              statusLabel={get(item, 'statusLable')}
              onSeeDetailCommand={onSeeDetailCommand}
              type={get(item, 'side') == 'B' ? 'Mua' : 'Bán'}
              isSell={get(item, 'side') !== 'B'}
              price={formatCurrency(
                get(item, 'price') || 0,
                get(item, 'paymentUnit') || '',
                currencyList,
              )}
              unit={get(item, 'paymentUnit') || ''}
              nameCoin={get(item, 'symbol') || ''}
              dateTime={get(item, 'createdDateVnTime')}
              contentCenter={
                <>
                  <Layout isSpaceBetween isLineCenter spaceBottom={10}>
                    <TextFnx color={colors.btnClose} size={12}>
                      Khả dụng
                    </TextFnx>
                    <TextFnx color={colors.greyLight} size={12}>
                      {`${formatCurrency(
                        get(item, 'quantity') || 0,
                        get(item, 'symbol') || '',
                        currencyList,
                      )} ${get(item, 'symbol')}`}
                    </TextFnx>
                  </Layout>
                  <Layout isSpaceBetween isLineCenter spaceBottom={10}>
                    <TextFnx color={colors.btnClose} size={12}>
                      Giới hạn
                    </TextFnx>
                    <TextFnx color={colors.greyLight} size={12}>
                      {`${formatCurrency(
                        get(item, 'minOrderAmount') || 0,
                        get(item, 'paymentUnit') || '',
                        currencyList,
                      )} - ${formatCurrency(
                        get(item, 'maxOrderAmount') || 0,
                        get(item, 'paymentUnit') || '',
                        currencyList,
                      )} ${get(item, 'paymentUnit') || ''}`}
                    </TextFnx>
                  </Layout>
                </>
              }
              contentBottom={
                <Layout isSpaceBetween isLineCenter>
                  <Layout isLineCenter>
                    {get(item, 'paymentMethods') &&
                      size(get(item, 'paymentMethods')) > 0 &&
                      uniqBy(get(item, 'paymentMethods'), 'code').map(
                        (__it, index) => {
                          return (
                            <Image
                              key={String(`item-key-code-image-${index}___`)}
                              source={
                                get(__it, 'code') ===
                                constant.CODE_PAYMENT_METHOD.BANK_TRANSFER
                                  ? icons.icBankPng
                                  : icons.icMomo
                              }
                              style={{
                                width: 18,
                                height: 18,
                                marginRight: 5,
                              }}
                            />
                          );
                        },
                      )}
                  </Layout>

                  <Layout isLineCenter>
                    <TextFnx color={colors.btnClose} size={12} spaceRight={10}>
                      {get(item, 'isOpenForTrading') ? 'Đang bật' : 'Đang tắt'}
                    </TextFnx>
                    <Switch
                      trackColor={{false: '#767577', true: colors.iconButton}}
                      thumbColor={colors.greyLight}
                      ios_backgroundColor="#3e3e3e"
                      value={
                        get(isEnabled, 'orderId') === get(item, 'orderId')
                          ? get(isEnabled, 'isOpenForTrading')
                          : get(item, 'isOpenForTrading')
                      }
                      // value={get(item, 'status') > 0}
                      // readonly
                      onValueChange={
                        value => {
                          setIsEnabled({...item, isOpenForTrading: value});
                          useActionsP2p(dispatch).handleUpdateStatusAdv({
                            data: {
                              isOpenForTrading: value,
                            },
                            orderId: get(item, 'orderId'),
                          });
                        }
                        // setIsEnabled(previousState => !previousState)
                      }
                    />
                    <ButtonIcon
                      style={{width: 'auto'}}
                      spaceLeft={10}
                      color={colors.iconButton}
                      size={14}
                      name="ellipsis-v"
                      onPress={() => {
                        setItem(item);
                        refAction.current.item = {...item};
                        refAction.current?.setModalVisible();
                      }}
                    />
                  </Layout>
                </Layout>
              }
            />
          </View>
        )}
      />
      <BottomSheet actionRef={refAction} title="Thêm hành động">
        {ActionBottom(get(itemData,"status") ).map((item, index) => (
          <Button
            key={`dt-${index}`}
            onInput={() => onActionClick(item)}
            placeholder={item?.name || ''}
            styleInputView={{
              backgroundColor: 'transparent',
              borderBottomWidth: 1,
            }}
            isInput
          />
        ))}
        <View style={{height: 250}} />
      </BottomSheet>
    </Container>
  );
};

export default MyAdvertisenmentScreen;

const styles = StyleSheet.create({});
