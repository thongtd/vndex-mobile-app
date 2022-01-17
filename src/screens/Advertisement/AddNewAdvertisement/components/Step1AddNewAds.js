import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Button from '../../../../components/Button/Button';
import Input from '../../../../components/Input';
import Layout from '../../../../components/Layout/Layout';
import TextFnx from '../../../../components/Text/TextFnx';
import {BUY, fontSize, SELL, spacingApp} from '../../../../configs/constant';
import colors from '../../../../configs/styles/colors';
import {RadioButton} from 'react-native-paper';
import ButtonIcon from '../../../../components/Button/ButtonIcon';
import {formatCurrency, get, getPropsData} from '../../../../configs/utils';
import ItemList from '../../../../components/Item/ItemList';
import {useDispatch, useSelector} from 'react-redux';
import {PICKER_SEARCH} from '../../../../navigation';
import {dismissAllModal, showModal} from '../../../../navigation/Navigation';
import {useActionsP2p} from '../../../../redux';
import {isEmpty, isNumber} from 'lodash';

const Menu = [
  {name: 'Mua', id: 1, type: BUY},
  {name: 'Bán', id: 2, type: SELL},
];
const Step1AddNewAds = ({bntClose, onSubmitNextStep, dataState, ...rest}) => {
  // const [get(dataState,"activeType"), SetActiveType] = useState(BUY);
  // const [checked, setChecked] = useState('first');
  const marketInfo = useSelector(state => state.p2p.marketInfo);
  // const [get(dataState,'price'), setPrice] = useState(formatCurrency(get(marketInfo,"lastestPrice"),get(marketInfo,"paymentUnit"),currencyList));
  const tradingMarket = useSelector(state => state.p2p.tradingMarket);
  const currencyList = useSelector(state => state.market.currencyList);
  // const [get(dataState,"ActiveAsset"), setActiveAsset] = useState(get(tradingMarket,"assets[0]"));
  // const [get(dataState,"ActiveFiat"), setActiveFiat] = useState(get(tradingMarket,"paymentUnit[0]"));
  // const [get(dataState,"percentPrice"), setPercentPrice] = useState(100);

  const renderMenu = (
    <Layout
      isSpaceBetween
      isLineCenter
      style={[styles.borderBottom, {paddingHorizontal: spacingApp}]}>
      {Menu.map((__i, ind) => (
        <TouchableOpacity
          onPress={()=>rest.onSelectType(__i)}
          key={String(`key-menu-${ind}`)}
          style={[
            styles.bntBuySell,
            get(dataState, 'activeType') == __i?.type && styles.active,
            {
              borderBottomColor:
                (get(dataState, 'activeType') == BUY && colors.buy) ||
                colors.app.sell,
            },
          ]}>
          <TextFnx
            weight="bold"
            size={fontSize.f16}
            color={
              (__i?.type == BUY &&
                get(dataState, 'activeType') == BUY &&
                colors.buy) ||
              (__i?.type == SELL &&
                get(dataState, 'activeType') == SELL &&
                colors.app.sell) ||
              colors.description
            }>
            {__i.name}
          </TextFnx>
        </TouchableOpacity>
      ))}
    </Layout>
  );
  return (
    <View style={styles.conatainer}>
      {renderMenu}
      <View style={[styles.conatainer, styles.space]}>
        <Button
          placeholder={get(dataState,"ActiveAsset")}
          isPlaceholder={false}
          spaceVertical={10}
          onInput={rest.onGetAsset}
          isInput
          iconRight="caret-down"
          isInputLable={
            <TextFnx color={colors.description} size={12} spaceBottom={1.5}>
              Tài sản
            </TextFnx>
          }
        />
        <Button
          // placeholder={'Tất cả'}
          placeholder={get(dataState,"ActiveFiat")}
          isPlaceholder={false}
          spaceVertical={10}
          onInput={rest.onGetFiat}
          isInput
          iconRight="caret-down"
          isInputLable={
            <TextFnx color={colors.description} size={12} spaceBottom={1.5}>
              Fiat
            </TextFnx>
          }
        />

        <View style={{paddingBottom: 20}}>
          <TextFnx color={colors.description} space={10}>
            Loại giá
          </TextFnx>
          <Layout isSpaceBetween isLineCenter>
            <ButtonIcon
              title={'Cố định'}
              onPress={rest.onFixed}
              style={styles.bntRaio}
              styleText={{
                color:
                  get(dataState, 'checked') === 'FIXED_PRICE'
                    ? colors.iconButton
                    : colors.description,
              }}
              iconComponent={
                <RadioButton
                  value="FIXED_PRICE"
                  color={colors.iconButton}
                  uncheckedColor={colors.description}
                  status={
                    get(dataState, 'checked') === 'FIXED_PRICE'
                      ? 'checked'
                      : 'unchecked'
                  }
                  onPress={rest.onFixed}
                />
              }
            />
            <ButtonIcon
              title={'Thả nổi'}
              onPress={rest.onFloat}
              style={styles.bntRaio}
              styleText={{
                color:
                  get(dataState, 'checked') === 'FLOAT_PRICE'
                    ? colors.iconButton
                    : colors.description,
              }}
              iconComponent={
                <RadioButton
                  value="FLOAT_PRICE"
                  color={colors.iconButton}
                  uncheckedColor={colors.description}
                  status={
                    get(dataState, 'checked') === 'FLOAT_PRICE'
                      ? 'checked'
                      : 'unchecked'
                  }
                  onPress={rest.onFloat}
                />
              }
            />
          </Layout>
        </View>
        <View>
          <TextFnx color={colors.description} space={10}>
            Biên giá thả nổi
          </TextFnx>
          <Layout isSpaceBetween isLineCenter style={{width: '100%'}}>
            <ButtonIcon
              onPress={rest.onIncreamentPrice}
              style={[styles.bntRaio, styles.borderBntLeft]}
              name="minus"
              styleBlockIcon={{alignItems: 'center'}}
              size={15}
              color={colors.iconButton}
            />
            <Input
              value={`${
                get(dataState, 'checked') === 'FIXED_PRICE'
                  ? get(dataState,'price')
                  : `${get(dataState,"percentPrice")}`
              }`}
              hasValue
              keyboardType='decimal-pad'
              styleView={{flex: 1}}
              onChangeText={value => rest.onChangePrice(value)}
              style={{
                textAlign: 'center',
                backgroundColor: colors.background,
                height: 56,
              }}
              prefix={get(dataState, 'checked') === 'FLOAT_PRICE' ? '%' : null}
            />
            <ButtonIcon
              onPress={rest.decrementPrice}
              style={[styles.bntRaio, styles.borderBntRight]}
              styleBlockIcon={{alignItems: 'center'}}
              name="plus"
              size={15}
              color={colors.iconButton}
            />
          </Layout>
        </View>

        <Layout isSpaceBetween isLineCenter spaceTop={10}>
          <TextFnx color={colors.description}>Giá của bạn</TextFnx>
          <TextFnx color={colors.greyLight}>
            {formatCurrency(
              get(dataState,'price').str2Number(),
              get(marketInfo, 'paymentUnit'),
              currencyList,
            )}{' '}
            {get(marketInfo, 'paymentUnit')}
          </TextFnx>
        </Layout>
        <Layout isSpaceBetween isLineCenter spaceTop={10} spaceBottom={30}>
          <TextFnx color={colors.description}>Giá lệnh thấp nhất</TextFnx>
          <TextFnx color={colors.greyLight}>
            {get(dataState, 'activeType') == BUY
              ? formatCurrency(
                  get(marketInfo, 'bestestBuyOpenPrice'),
                  get(marketInfo, 'paymentUnit'),
                  currencyList,
                )
              : formatCurrency(
                  get(marketInfo, 'bestestSellOpenPrice'),
                  get(marketInfo, 'paymentUnit'),
                  currencyList,
                )}{' '}
            {get(marketInfo, 'paymentUnit')}
          </TextFnx>
        </Layout>

        <Button title={'Tiếp theo'} isNormal onPress={onSubmitNextStep} />
        {bntClose || null}
      </View>
    </View>
  );
};

export default Step1AddNewAds;
const formatPercent = value => {
  if (!isEmpty(value)) return `${value}%`;
  return `${0}%`;
};
const styles = StyleSheet.create({
  conatainer: {
    backgroundColor: colors.app.backgroundLevel2,

    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  space: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: spacingApp,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.app.lineSetting,
  },
  bntBuySell: {
    textAlign: 'center',
    width: '50%',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  active: {
    borderBottomWidth: 3,
  },
  bntRaio: {
    backgroundColor: colors.background,
    width: '48%',
    borderRadius: 8,
    height: 56,
  },
  borderBntRight: {
    width: '20%',
    borderRadius: 0,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
    borderLeftColor: colors.cl3A3A3A,
    borderLeftWidth: 1,
  },
  borderBntLeft: {
    width: '20%',
    borderRadius: 0,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    borderRightColor: colors.cl3A3A3A,
    borderRightWidth: 1,
  },
});
