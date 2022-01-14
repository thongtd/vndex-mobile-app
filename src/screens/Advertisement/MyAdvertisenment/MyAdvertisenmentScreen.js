import {get, isArray} from 'lodash';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Switch, ActivityIndicator, View} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {useDispatch, useSelector} from 'react-redux';
import Container from '../../../components/Container';
import Image from '../../../components/Image/Image';
import Empty from '../../../components/Item/Empty';
import Layout from '../../../components/Layout/Layout';
import TextFnx from '../../../components/Text/TextFnx';
import {IdNavigation} from '../../../configs/constant';
import icons from '../../../configs/icons';
import colors from '../../../configs/styles/colors';
import {formatCurrency, listenerEventEmitter} from '../../../configs/utils';
import {ADS_ADD_NEW_SCREEN, pushSingleScreenApp} from '../../../navigation';
import {useActionsP2p} from '../../../redux';
import BoxCommand from '../../CommandScreen/components/BoxCommand';
import ButtonAddNew from './ButtonAddNew';

const MyAdvertisenmentScreen = ({componentId}) => {
  const dispatch = useDispatch();
  const [isEnabled, setIsEnabled] = useState(true);
  const [callIndexFail, setCallIndexFail] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [ActiveType, setActiveType] = useState('');
  const [ActiveSymbol, setActiveSymbol] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const currencyList = useSelector(state => state.market.currencyList);
  const myAdvertisments = useSelector(state => state.p2p.myAdvertisments);

  useEffect(() => {
    const evDone = listenerEventEmitter('doneApi', isDone => {
      setCallIndexFail(isDone ? 0 : callIndexFail + 1);
      setIsLoading(false);
    });
    getMyAdvertisments();
    return () => {
      evDone.remove();
    };
  }, [pageIndex]);
  const getMyAdvertisments = () => {
    useActionsP2p(dispatch).handleGetMyAdvertisments({
      pageIndex: pageIndex,
      pageSize: 15,
      side: '',
      coinSymbol: ActiveSymbol,
    });
    setIsLoading(true);
  };

  const onAddNewAdvertisenment = () => {
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
    alert('Xem chi tiết lệnh');
  };

  return (
    <Container
      componentId={componentId}
      // isScroll
      title="Quảng cáo của tôi"
      spaceHorizontal={0}>
      <SwipeListView
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
        // disableLeftSwipe={IsActive === 'C' ? true : false}
        rightOpenValue={-60}
        keyExtractor={(item, index) => String(`key-item-my-ads-${index}`)}
        // ListFooterComponent={isHistoryTransaction ? renderFooter : null}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (pageIndex >= get(myAdvertisments, 'pages')) return;
          setPageIndex(pageIndex - callIndexFail + 1);
        }}
        ListFooterComponent={
          (isLoading && <ActivityIndicator style={{color: colors.text}} />) ||
          null
        }
        renderItem={({item}) => (
          <View style={{paddingHorizontal: 20}}>
            <BoxCommand
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
              //   dateTime="2021-11-07 09:25:49"
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
                    {(item?.isBanking && (
                      <Image
                        source={icons.icBankPng}
                        style={{
                          width: 18,
                          height: 18,
                          marginRight: 5,
                        }}
                      />
                    )) ||
                      null}
                    {(item?.isBankMomo && (
                      <Image
                        source={icons.icMomo}
                        style={{
                          width: 18,
                          height: 18,
                        }}
                      />
                    )) ||
                      null}
                  </Layout>

                  <Layout isLineCenter>
                    <TextFnx color={colors.btnClose} size={12} spaceRight={10}>
                      {get(item, 'status') > 0 ? 'Đag bật' : 'Đang tắt'}
                    </TextFnx>
                    <Switch
                      trackColor={{false: '#767577', true: colors.iconButton}}
                      thumbColor={colors.greyLight}
                      ios_backgroundColor="#3e3e3e"
                      // value={isEnabled}
                      value={get(item, 'status') > 0}
                      readonly
                      // onValueChange={() =>
                      //   setIsEnabled(previousState => !previousState)
                      // }
                    />
                  </Layout>
                </Layout>
              }
            />
          </View>
        )}
      />
    </Container>
  );
};

export default MyAdvertisenmentScreen;

const styles = StyleSheet.create({});
