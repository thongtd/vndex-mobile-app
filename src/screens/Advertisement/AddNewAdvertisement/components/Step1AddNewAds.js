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
import { formatCurrency, get, getPropsData } from '../../../../configs/utils';
import ItemList from '../../../../components/Item/ItemList';
import { useDispatch, useSelector } from 'react-redux';
import { PICKER_SEARCH } from '../../../../navigation';
import { dismissAllModal, showModal } from '../../../../navigation/Navigation';
import { useActionsP2p } from '../../../../redux';
import { isEmpty, isNumber } from 'lodash';

const Menu = [
  {name: 'Mua', id: 1, type:BUY},
  {name: 'Bán', id: 2, type:SELL},
];
const Step1AddNewAds = ({bntClose, submitNextStep}) => {
  const [activeType, SetActiveType] = useState(BUY);
  const [checked, setChecked] = useState('first');
  const marketInfo = useSelector(state => state.p2p.marketInfo);
  const [price, setPrice] = useState(formatCurrency(get(marketInfo,"lastestPrice"),get(marketInfo,"paymentUnit"),currencyList));
  const tradingMarket = useSelector(state => state.p2p.tradingMarket);
  const currencyList = useSelector(state => state.market.currencyList);
  const [ActiveAsset, setActiveAsset] = useState(get(tradingMarket,"assets[0]"));
  const [ActiveFiat, setActiveFiat] = useState(get(tradingMarket,"paymentUnit[0]"));
  const [percentPrice, setPercentPrice] = useState(100);
  
  const dispatch = useDispatch();
  useEffect(() => {
    useActionsP2p(dispatch).handleGetMarketInfo({
      symbol:ActiveAsset,
      paymentUnit:ActiveFiat
    })
    return () => {
      
    }
  }, [dispatch,ActiveAsset,ActiveFiat])
  const onGetAsset = () => {
    let propsData = {
      data:get(tradingMarket,"assets"),
      renderItem: ({item, key}) => {
        return (
          <ItemList
            onPress={() => handleActiveAsset(item)}
            value={item}
            checked={item === ActiveAsset}
          />
        );
      },
    };
    showModal(PICKER_SEARCH, propsData, false);
  };
  const handleActiveAsset = (item)=>{
    setActiveAsset(item);
    dismissAllModal();
  }
  const onGetFiat = () => {
    let propsData = {
      data:get(tradingMarket,"paymentUnit"),
      renderItem: ({item, key}) => {
        return (
          <ItemList
            onPress={() => handleActiveFiat(item)}
            value={item}
            checked={item === ActiveFiat}
          />
        );
      },
    };
    showModal(PICKER_SEARCH, propsData, false);
  };
  const handleActiveFiat = (item)=>{
    setActiveFiat(item);
    dismissAllModal();
  }
  const onSubmitNextStep = () => {
    submitNextStep();
  };
  const renderMenu = (
    <Layout
      isSpaceBetween
      isLineCenter
      style={[styles.borderBottom, {paddingHorizontal: spacingApp}]}>
      {Menu.map((__i, ind) => (
        <TouchableOpacity
          onPress={() => SetActiveType(__i?.type || 1)}
          key={String(`key-menu-${ind}`)}
          style={[
            styles.bntBuySell,
            activeType == __i?.type && styles.active,
            {
              borderBottomColor:
                (activeType == BUY && colors.buy) || colors.app.sell,
            },
          ]}>
          <TextFnx
            weight="bold"
            size={fontSize.f16}
            color={
              (__i?.type == BUY && activeType == BUY && colors.buy) ||
              (__i?.type == SELL && activeType == SELL && colors.app.sell) ||
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
          placeholder={ActiveAsset}
          isPlaceholder={false}
          spaceVertical={10}
          onInput={onGetAsset}
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
          placeholder={ActiveFiat}
          isPlaceholder={false}
          spaceVertical={10}
          onInput={onGetFiat}
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
              onPress={() => {
                // setPrice(formatCurrency(get(marketInfo,"lastestPrice"),get(marketInfo,"paymentUnit"),currencyList));
                // setPercentPrice(100);
                setPrice(formatCurrency(parseFloat(get(marketInfo,"lastestPrice") * parseFloat(percentPrice).toFixed(2)/100),get(marketInfo,"paymentUnit"),currencyList));
                // setPercentPrice(parseFloat(price.str2Number()/get(marketInfo,"lastestPrice") * 100).toFixed(2));
                setChecked('first')}}
              style={styles.bntRaio}
              styleText={{
                color:
                  checked === 'first' ? colors.iconButton : colors.description,
              }}
              iconComponent={
                <RadioButton
                  value="first"
                  color={colors.iconButton}
                  uncheckedColor={colors.description}
                  status={checked === 'first' ? 'checked' : 'unchecked'}
                  onPress={() => setChecked('first')}
                />
              }
            />
            <ButtonIcon
              title={'Thả nổi'}
              onPress={() => {
                setChecked('second');
                // setPrice(formatCurrency(parseFloat(get(marketInfo,"lastestPrice") * parseFloat(percentPrice).toFixed(2)/100),get(marketInfo,"paymentUnit"),currencyList));
                setPercentPrice(parseFloat(price.str2Number()/get(marketInfo,"lastestPrice") * 100).toFixed(2));
                // setPrice(formatCurrency(get(marketInfo,"lastestPrice"),get(marketInfo,"paymentUnit"),currencyList));
                // setPercentPrice(100);
              }}
              style={styles.bntRaio}
              styleText={{
                color:
                  checked === 'second' ? colors.iconButton : colors.description,
              }}
              iconComponent={
                <RadioButton
                  value="second"
                  color={colors.iconButton}
                  uncheckedColor={colors.description}
                  status={checked === 'second' ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setChecked('second')
                    
                  }}
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
              onPress={() => {
                if(checked == 'first'){
                  setPrice(formatCurrency(price.str2Number()-1000,get(marketInfo,"paymentUnit"),currencyList));
                  setPercentPrice(parseFloat(price.str2Number()-1000/get(marketInfo,"lastestPrice") * 100).toFixed(2));
                }else{
                  setPercentPrice(!isEmpty(percentPrice) && isNumber(parseFloat(percentPrice))?(parseFloat(percentPrice) - 0.01).toFixed(2):0);
                  setPrice(formatCurrency(parseFloat(get(marketInfo,"lastestPrice") * (parseFloat(percentPrice)-0.01).toFixed(2)/100),get(marketInfo,"paymentUnit"),currencyList));
                }
              }}
              style={[styles.bntRaio, styles.borderBntLeft]}
              name="minus"
              styleBlockIcon={{alignItems: 'center'}}
              size={15}
              color={colors.iconButton}
            />
            <Input
              value={`${checked === 'first'?price:`${percentPrice}`}`}
              hasValue
              // keyboardType='numeric'
              styleView={{flex: 1}}
              onChangeText={value => {
                if(checked == 'first'){
                  setPrice(formatCurrency(value.str2Number(),get(marketInfo,"paymentUnit"),currencyList))
                  setPercentPrice(parseFloat(value.str2Number()/get(marketInfo,"lastestPrice") * 100).toFixed(2));
                }else{
                  setPercentPrice(isNumber(parseFloat(value))?parseFloat(value).toFixed(2):value);
                  setPrice(formatCurrency(parseFloat(get(marketInfo,"lastestPrice") * parseFloat(value)/100),get(marketInfo,"paymentUnit"),currencyList));
                }
              }}
              style={{
                textAlign: 'center',
                backgroundColor: colors.background,
                height: 56,
              }}
              prefix={checked === 'second' ?"%":null}
            />
            <ButtonIcon
              onPress={() => {
                if(checked == 'first'){
                  setPrice(formatCurrency(price.str2Number() + 1000,get(marketInfo,"paymentUnit"),currencyList));
                  setPercentPrice(parseFloat(price.str2Number()+1000/get(marketInfo,"lastestPrice") * 100).toFixed(2));
                }else{
                  setPercentPrice(!isEmpty(percentPrice) && isNumber(parseFloat(percentPrice))?(parseFloat(percentPrice) + 0.01).toFixed(2):0);
                  setPrice(formatCurrency(parseFloat(get(marketInfo,"lastestPrice") * (parseFloat(percentPrice)+0.01).toFixed(2)/100),get(marketInfo,"paymentUnit"),currencyList));
                }
                }}
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
          <TextFnx color={colors.greyLight}>{formatCurrency(price.str2Number(),get(marketInfo,"paymentUnit"),currencyList)} {get(marketInfo,"paymentUnit")}</TextFnx>
        </Layout>
        <Layout isSpaceBetween isLineCenter spaceTop={10} spaceBottom={30}>
          <TextFnx color={colors.description}>Giá lệnh thấp nhất</TextFnx>
          <TextFnx color={colors.greyLight}>{activeType == BUY?formatCurrency(get(marketInfo,"bestestBuyOpenPrice"),get(marketInfo,"paymentUnit"),currencyList):formatCurrency(get(marketInfo,"bestestSellOpenPrice"),get(marketInfo,"paymentUnit"),currencyList)} {get(marketInfo,"paymentUnit")}</TextFnx>
        </Layout>

        <Button title={'Tiếp theo'} isNormal onPress={onSubmitNextStep} />
        {bntClose || null}
      </View>
    </View>
  );
};

export default Step1AddNewAds;
const formatPercent = (value)=>{
  if(!isEmpty(value)) return `${value}%`
  return `${0}%`
}
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
