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
import {constant} from '../../../configs/constant';
import {Navigation} from 'react-native-navigation';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from '../../../components/Icon';
import Button from '../../../components/Button/Button';
export default function FilterCommand({
  startDate = new Date(),
  endDate = new Date(),
  onSubmitSearch,
  componentId,
}) {
  // hanld for date
  const [isModalCalendar, setModalCalendar] = useState(false);
  const [ActiveDate, setActiveDate] = useState('');
  const [StartDate, setStartDate] = useState(startDate.show);
  const [EndDate, setEndDate] = useState(endDate.show);
  const [currentDate, setCurrentDate] = useState('');
  const [open, setOpen] = useState(false);
  const [StartDateData, setStartDateData] = useState(startDate.api);
  const [EndDateData, setEndDateData] = useState(endDate.api);
  const coinsWalletType = useSelector(state => state.market.cryptoWallet);
  const [items, setItems] = useState(coinsWalletType);
  const [openStatus, setOpenStatus] = useState(false);
  const [itemsStatus, setItemsStatus] = useState([]);
  const [value, setValue] = useState(null);

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
  const handleActiveStatus = active => {
    setStatusActive(active);
    // Navigation.dismissModal(componentId);
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
  };

  return (
    <LayoutMofalFilter title="Bộ Lọc" isTitle>
      <Layout
        type={'column'}
        spaceHorizontal={0}
        style={[stylest.layoutHistory]}>
        <ItemFilter
          LabelFirst={'To'.t()}
          LabelSecond={'From'.t()}
          valueFirst={StartDate}
          valueSecond={EndDate}
          placeholderSecond={'To'.t()}
          onPressFirst={() => {
            setActiveDate('startDate');
            setCurrentDate(StartDateData);
            setModalCalendar(!isModalCalendar);
          }}
          onPressSecond={() => {
            setActiveDate('endDate');
            setCurrentDate(EndDateData);
            setModalCalendar(!isModalCalendar);
          }}
        />
        <TextFnx space={16} color={colors.subText}>
          Token
        </TextFnx>
        <DropDownPicker
          schema={{
            label: 'name',
            value: 'symbol',
            icon: 'icon',
          }}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          style={{
            backgroundColor: colors.app.backgroundLevel1,
            borderColor: colors.line,
          }}
          textStyle={{
            color: colors.text,
            fontWeight: '500',
          }}
          dropDownContainerStyle={{
            backgroundColor: colors.app.backgroundLevel2,
          }}
          // zIndexInverse={7000}
          zIndex={7000}
          ArrowDownIconComponent={({style}) => (
            <Icon
              name={'caret-down'}
              size={16}
              color={colors.app.textContentLevel3}
            />
          )}
          placeholderStyle={{
            color: colors.description,
          }}
          placeholder="Token"
        />
        <TextFnx space={16} color={colors.subText}>
          Trạng thái
        </TextFnx>
        <DropDownPicker
          open={openStatus}
          value={value}
          items={itemsStatus}
          setOpen={setOpenStatus}
          setValue={setValue}
          setItems={setItemsStatus}
          style={{
            backgroundColor: colors.app.backgroundLevel1,
            borderColor: colors.line,
          }}
          textStyle={{
            color: colors.text,
            fontWeight: '500',
          }}
          dropDownContainerStyle={{
            backgroundColor: colors.app.backgroundLevel2,
          }}
          ArrowDownIconComponent={({style}) => (
            <Icon
              name={'caret-down'}
              size={16}
              color={colors.app.textContentLevel3}
            />
          )}
          placeholderStyle={{
            color: colors.description,
          }}
          placeholder="Trạng thái"
        />
        <Button
          isNormal
          title={'Tìm kiếm'}
          onPress={() => {
            emitEventEmitter('submitSearchFilterCommand', {
              fromDate: StartDateData,
              toDate: EndDateData,
              symbol: value,
            });
            dismissAllModal();
          }}
          marginTop={10}
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
