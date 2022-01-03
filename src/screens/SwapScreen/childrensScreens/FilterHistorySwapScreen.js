import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Animated, Dimensions} from 'react-native';
import {SafeAreaView} from '../../../components';
import Layout from '../../../components/Layout/Layout';
import HeaderFilter from '../components/HeaderFilter';
import ItemFilter from '../components/ItemFilter';
import Button from '../../../components/Button/Button';
import colors from '../../../configs/styles/colors';
import {
  fullHeight,
  fullWidth,
  listenerEventEmitter,
  removeEventEmitter,
  emitEventEmitter,
  get,
  isArray,
  size,
  createAction,
  jwtDecode,
  getCurrentDate,
  getOneMonthAgoDate,
  getPropsData,
} from '../../../configs/utils';
import CalendarScreen from './CalendarScreen';
import {showModal, dismissAllModal} from '../../../navigation/Navigation';
import {CALENDAR_SCREEN, PICKER_SEARCH} from '../../../navigation';
import {useDispatch, useSelector} from 'react-redux';
import {uniqBy, orderBy} from 'lodash';
import ItemList from '../../../components/Item/ItemList';
import Image from '../../../components/Image/Image';
import TextFnx from '../../../components/Text/TextFnx';

import {constant} from '../../../configs/constant';
const FilterHistorySwapScreen = ({
  onHiddenShow,
  startDate,
  endDate,
  HiddenShow,
  isHistoryTransaction,
  onSubmitSearch,
  onActiveWalletType,
}) => {
  const [StartDate, setStartDate] = useState(startDate.show);
  const [EndDate, setEndDate] = useState(endDate.show);
  const [StartDateData, setStartDateData] = useState(startDate.api);
  const [EndDateData, setEndDateData] = useState(endDate.api);
  const swapConfig = useSelector(state => state.market.swapConfig);
  const fiatsWalletType = useSelector(state => state.wallet.fiatsWalletType);
  const coinsWalletType = useSelector(state => state.market.cryptoWallet);
  const pairs = get(swapConfig, 'pairs');
  const [ListPay, setListPay] = useState(
    orderBy(uniqBy(pairs, 'symbol'), ['symbol'], ['asc']),
  );
  const [Listget, setListget] = useState(
    orderBy(uniqBy(pairs, 'paymentUnit'), ['paymentUnit'], ['asc']),
  );
  const [symbol, setSymbol] = useState('');
  const [PaymentUnit, setPaymentUnit] = useState('');
  const dispatcher = useDispatch();
  const [UserId, setUserId] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const [Hidden, setHidden] = useState(false);
  const [WalletTypeActive, setWalletTypeActive] = useState({
    name: 'FIAT'.t(),
    value: '1',
  });
  const [StatusActive, setStatusActive] = useState({name: '', value: ''});
  const [SelectCoinActive, setSelectCoinActive] = useState({
    symbol: '',
    name: '',
    image: '',
  });
  useEffect(() => {
    listenerEventEmitter('startDate', startDate => {
      setStartDate(startDate.show);
      setStartDateData(startDate.api);
    });
    listenerEventEmitter('endDate', endDate => {
      setEndDate(endDate.show);
      setEndDateData(endDate.api);
    });
    return () => {
      removeEventEmitter('endDate');
      removeEventEmitter('startDate');
    };
  }, []);
  const onSelectCurrency = () => {
    let data = orderBy([...coinsWalletType], ['symbol'], ['asc']);
    let propsData = getPropData(
      [{symbol: 'ALL'.t(), image: '', name: ''}, ...data],
      'images',
      'symbol',
      symbol,
      item => handleActiveCurrency(item),
    );
    showModal(PICKER_SEARCH, propsData);
  };

  const handleActiveCurrency = pair => {
    setSymbol(get(pair, 'symbol'));
    dismissAllModal();
  };
  const onSubmit = () => {
    emitEventEmitter('searchSwapOrderBook', {
      currency: symbol,
      fromDate: StartDateData,
      toDate: EndDateData,
    });
    onHiddenShow(false);
  };
  const onWalletType = () => {
    let walletTypes = [
      {name: 'FIAT'.t(), value: '1'},
      {name: 'Coin', value: '2'},
    ];
    let propsData = getPropsData(
      walletTypes,
      '',
      'name',
      get(WalletTypeActive, 'name'),
      item => handleActiveWalletType(item),
      false,
    );
    showModal(PICKER_SEARCH, propsData);
  };
  const handleActiveWalletType = active => {
    setWalletTypeActive(active);
    onActiveWalletType(active);
    dismissAllModal();
  };
  const onStatus = () => {
    let statusList = [
      {name: 'ALL'.t(), value: ''},
      {name: 'Open'.t(), value: constant.STATUS_FUNDS.Open},
      {name: 'Email Sent'.t(), value: constant.STATUS_FUNDS.EmailSent},
      {name: 'Processing'.t(), value: constant.STATUS_FUNDS.Processing},
      {name: 'Completed'.t(), value: constant.STATUS_FUNDS.Completed},
      {name: 'Cancelled'.t(), value: constant.STATUS_FUNDS.Cancelled},
      {name: 'Rejected'.t(), value: constant.STATUS_FUNDS.Rejected},
      {name: 'Pending'.t(), value: constant.STATUS_FUNDS.Pending},
    ];
    let propsData = getPropsData(
      statusList,
      '',
      'name',
      get(StatusActive, 'name'),
      item => handleActiveStatus(item),
      false,
    );
    showModal(PICKER_SEARCH, propsData);
  };
  const handleActiveStatus = active => {
    setStatusActive(active);
    dismissAllModal();
  };

  const onSelectCoin = () => {
    let propsData = getPropData(
      coinsWalletType,
      'images',
      'symbol',
      get(SelectCoinActive, 'symbol'),
      item => handleActiveSelectCoin(item),
    );
    showModal(PICKER_SEARCH, propsData);
  };
  const handleActiveSelectCoin = active => {
    setSelectCoinActive(active);
    dismissAllModal();
  };

  return (
    <>
      {HiddenShow && (
        <View style={[stylest.container, {}]}>
          <Layout
            onStartShouldSetResponder={onHiddenShow}
            type={'column'}
            isTransparent
            style={stylest.LayoutFilter}></Layout>
          <Layout
            type={'column'}
            spaceHorizontal={16}
            style={[stylest.layoutHistory]}>
            <ItemFilter
              LabelFirst={'To'.t()}
              LabelSecond={'From'.t()}
              valueFirst={StartDate}
              valueSecond={EndDate}
              placeholderSecond={'To'.t()}
              onPressFirst={() =>
                showModal(
                  CALENDAR_SCREEN,
                  {
                    date: 'startDate',
                    currentDate: StartDateData,
                  },
                  true,
                )
              }
              onPressSecond={() =>
                showModal(
                  CALENDAR_SCREEN,
                  {
                    date: 'endDate',
                    currentDate: EndDateData,
                  },
                  true,
                )
              }
            />
            {/* {!isHistoryTransaction && (
              <ItemFilter
                valueFirst={symbol}
                buttonRight
                onPressSecond={onSubmit}
                onPressFirst={onSelectCurrency}
                iconFirst={'caret-down'}
                placeholderFirst={'currency'.t()}
              />
            )} */}
            {isHistoryTransaction && (
              <>
                <ItemFilter
                  LabelSecond={'Select Coin'.t()}
                  isColumn
                  hiddenFirst
                  valueFirst={get(WalletTypeActive, 'name')}
                  valueSecond={get(SelectCoinActive, 'symbol')}
                  onPressSecond={onSelectCoin}
                  onPressFirst={onWalletType}
                  iconFirst={'caret-down'}
                  iconSecond={'caret-down'}
                  placeholderSecond={'Select Coin'.t()}
                  placeholderFirst={'Select Wallet Type'.t()}
                />
                <ItemFilter
                  LabelFirst={'Status'.t()}
                  valueFirst={get(StatusActive, 'name')}
                  onPressFirst={onStatus}
                  iconFirst={'caret-down'}
                  placeholderFirst={'Status'.t()}
                  buttonRight
                  isColumn
                  onPressSecond={() =>
                    onSubmitSearch({
                      status: get(StatusActive, 'value'),
                      symbol: get(SelectCoinActive, 'symbol'),
                      startDate: StartDateData,
                      endDate: EndDateData,
                    })
                  }
                />
              </>
            )}
          </Layout>
        </View>
      )}
    </>
  );
};
const stylest = StyleSheet.create({
  container: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    zIndex: 1,
  },
  layoutHistory: {
    backgroundColor: colors.app.backgroundLevel1,
    paddingBottom: 5,
    position: 'absolute',
    width: '85%',
    right: 0,
    height: Dimensions.get('window').height,
    // marginHorizontal: -10,
  },
  LayoutFilter: {
    height: fullHeight,
    // marginHorizontal: -10,
  },
});

const getPropData = (data, image, value, Active, cb) => {
  return {
    data: [...data],
    renderItem: ({item, key}) => {
      return (
        <ItemList
          customView={
            <Layout>
              <Image
                source={{
                  uri: get(item, image),
                }}
                style={{width: 17, height: 17}}
              />
              <TextFnx isDart weight={'500'} value={`  ${get(item, value)}`} />
            </Layout>
          }
          onPress={() => cb(item)}
          value={get(item, value)}
          checked={get(item, value) === Active}
        />
      );
    },
    keywords: [value],
  };
};

export default FilterHistorySwapScreen;
