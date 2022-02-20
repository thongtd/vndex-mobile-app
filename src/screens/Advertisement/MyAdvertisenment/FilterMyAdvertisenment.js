import {Text, View, StyleSheet, Animated, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import LayoutMofalFilter from '../../../components/Alert/LayoutMofalFilter';
import Layout from '../../../components/Layout/Layout';
import ItemList from '../../../components/Item/ItemList';
import Image from '../../../components/Image/Image';
import TextFnx from '../../../components/Text/TextFnx';
import {useDispatch, useSelector} from 'react-redux';
// import {get, orderBy, uniqBy} from 'lodash';
import {
  listenerEventEmitter,
  removeEventEmitter,
  emitEventEmitter,
  get,
  getPropsData,
  fullHeight,
} from '../../../configs/utils';
import {uniqBy, orderBy} from 'lodash';
import {showModal, dismissAllModal} from '../../../navigation/Navigation';
import {CALENDAR_SCREEN, PICKER_SEARCH} from '../../../navigation';
import colors from '../../../configs/styles/colors';
import ItemFilter from '../../SwapScreen/components/ItemFilter';
import CalendarScreen from '../../SwapScreen/childrensScreens/CalendarScreen';
import { constant } from '../../../configs/constant';

export default function FilterMyAdvertisenment({
  startDate = new Date(),
  endDate = new Date(),
  onSubmitSearch,
}) {
  // hanld for date
  const [isModalCalendar, setModalCalendar] = useState(false);
  const [ActiveDate, setActiveDate] = useState('');
  const [StartDate, setStartDate] = useState(startDate.show);
  const [EndDate, setEndDate] = useState(endDate.show);
  const [currentDate, setCurrentDate] = useState('');

  const [StartDateData, setStartDateData] = useState(startDate.api);
  const [EndDateData, setEndDateData] = useState(endDate.api);
  const coinsWalletType = useSelector(state => state.market.cryptoWallet);

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
    <LayoutMofalFilter title="Bộ Lọc" isTitle>
      <Layout
        type={'column'}
        spaceHorizontal={0}
        style={[stylest.layoutHistory]}>
        
        <ItemFilter
          LabelSecond={'Token'}
          isColumn
          hiddenFirst
          valueFirst={get(WalletTypeActive, 'name')}
          valueSecond={get(SelectCoinActive, 'symbol')}
          onPressSecond={onSelectCoin}
          onPressFirst={onWalletType}
          iconFirst={'caret-down'}
          iconSecond={'caret-down'}
          placeholderSecond={'Token'}
          placeholderFirst={'Select Wallet Type'.t()}
        />
        <ItemFilter
          LabelSecond={'Hình thức'}
          isColumn
          hiddenFirst
          valueFirst={get(WalletTypeActive, 'name')}
          valueSecond={get(SelectCoinActive, 'symbol')}
          onPressSecond={onSelectCoin}
          onPressFirst={onWalletType}
          iconFirst={'caret-down'}
          iconSecond={'caret-down'}
          placeholderSecond={'Hình thức'}
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
      </Layout>
      <CalendarScreen
        isModalCalendar={isModalCalendar}
        date={ActiveDate}
        currentDate={currentDate}
        setModalCalendar={() => setModalCalendar(!isModalCalendar)}
      />
    </LayoutMofalFilter>
  );
}
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

const stylest = StyleSheet.create({
  container: {},
  layoutHistory: {},
  LayoutFilter: {
    height: fullHeight,
  },
});
