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
import Icon from '../../../components/Icon';
import DropDownPicker from 'react-native-dropdown-picker';
import Button from '../../../components/Button/Button';
export default function FilterMyAdvertisenment({
  startDate = new Date(),
  endDate = new Date(),
  onSubmitSearch,
}) {
  // hanld for date
  const coinsWalletType = useSelector(state => state.market.cryptoWallet);
  const [openBuySell, setOpenBuySell] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [openSymbol, setOpenSymbol] = useState(false);
  const [valueBuySell, setValueBuySell] = useState(null);
  const [valueStatus, setValueStatus] = useState(null);
  const [valueSymbol, setValueSymbol] = useState(null);
  const [itemsSymbol, setItemsSymbol] = useState(coinsWalletType);
  const [itemsBuySell, setItemsBuySell] = useState([
    {label: 'Tất cả', value: ''},
    {label: 'Mua', value: 'B'},
    {label: 'Bán', value: 'S'},
  ]);
  const [itemsStatus, setItemsStatus] = useState([]);
  return (
    <LayoutMofalFilter title="Bộ Lọc" isTitle>
      <Layout
        type={'column'}
        spaceHorizontal={0}
        style={[stylest.layoutHistory]}>
        <TextFnx space={16} color={colors.subText}>
          Token
        </TextFnx>
        <DropDownPicker
          schema={{
            label: 'name',
            value: 'symbol',
            icon: 'icon',
          }}
          open={openSymbol}
          value={valueSymbol}
          items={itemsSymbol}
          setOpen={setOpenSymbol}
          setValue={setValueSymbol}
          setItems={setItemsSymbol}
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
          Hình thức
        </TextFnx>
        <DropDownPicker
          open={openBuySell}
          value={valueBuySell}
          items={itemsBuySell}
          setOpen={setOpenBuySell}
          setValue={setValueBuySell}
          setItems={setItemsBuySell}
          zIndex={6999}
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
        <TextFnx space={16} color={colors.subText}>
          Trạng thái
        </TextFnx>
        <DropDownPicker
          open={openStatus}
          value={valueStatus}
          zIndex={6800}
          items={itemsStatus}
          setOpen={setOpenStatus}
          setValue={setValueStatus}
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
            emitEventEmitter('submitSearchFilterMyAdv', {
              coinSymbol: valueSymbol,
              side: valueBuySell,
              status: valueStatus,
            });
            dismissAllModal();
          }}
          marginTop={10}
        />
        {/*         
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
        />*/}
      </Layout>
      {/* <CalendarScreen
        isModalCalendar={isModalCalendar}
        date={ActiveDate}
        currentDate={currentDate}
        setModalCalendar={() => setModalCalendar(!isModalCalendar)}
      /> */}
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
