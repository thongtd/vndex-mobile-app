import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Button from '../../../../components/Button/Button';
import Input from '../../../../components/Input';
import Layout from '../../../../components/Layout/Layout';
import TextFnx from '../../../../components/Text/TextFnx';
import {fontSize, spacingApp} from '../../../../configs/constant';
import colors from '../../../../configs/styles/colors';
import {RadioButton} from 'react-native-paper';
import ButtonIcon from '../../../../components/Button/ButtonIcon';

const Menu = [
  {name: 'Mua', id: 1},
  {name: 'Bán', id: 2},
];
const Step1AddNewAds = ({bntClose, submitNextStep}) => {
  const [activeType, SetActiveType] = useState(1);
  const [checked, setChecked] = useState('first');
  const [price, setPrice] = useState(15);

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
          onPress={() => SetActiveType(__i?.id || 1)}
          key={String(`key-menu-${ind}`)}
          style={[
            styles.bntBuySell,
            activeType == __i?.id && styles.active,
            {
              borderBottomColor:
                (activeType == 1 && colors.buy) || colors.app.sell,
            },
          ]}>
          <TextFnx
            weight="bold"
            size={fontSize.f16}
            color={
              (__i?.id == 1 && activeType == 1 && colors.buy) ||
              (__i?.id == 2 && activeType == 2 && colors.app.sell) ||
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
          placeholder={'Tất cả'}
          isPlaceholder={false}
          spaceVertical={10}
          // onInput={() => setOpen(true)}
          isInput
          iconRight="caret-down"
          isInputLable={
            <TextFnx color={colors.description} size={12} spaceBottom={1.5}>
              Tài sản
            </TextFnx>
          }
        />
        <Button
          placeholder={'Tất cả'}
          isPlaceholder={false}
          spaceVertical={10}
          // onInput={() => setOpen(true)}
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
              onPress={() => setChecked('first')}
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
              onPress={() => setChecked('second')}
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
                  onPress={() => setChecked('second')}
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
              onPress={() => setPrice(15 - 1)}
              style={[styles.bntRaio, styles.borderBntLeft]}
              name="minus"
              styleBlockIcon={{alignItems: 'center'}}
              size={15}
              color={colors.iconButton}
            />
            <Input
              value={price}
              styleView={{flex: 1}}
              handleChange={value => setPrice(value)}
              style={{
                textAlign: 'center',
                backgroundColor: colors.background,
                height: 56,
              }}
            />
            <ButtonIcon
              onPress={() => setPrice(price + 1)}
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
          <TextFnx color={colors.greyLight}>22,940 VND</TextFnx>
        </Layout>
        <Layout isSpaceBetween isLineCenter spaceTop={10} spaceBottom={30}>
          <TextFnx color={colors.description}>Giá lệnh thấp nhất</TextFnx>
          <TextFnx color={colors.greyLight}>22.800 VND</TextFnx>
        </Layout>

        <Button title={'Tiếp theo'} isNormal onPress={onSubmitNextStep} />
        {bntClose || null}
      </View>
    </View>
  );
};

export default Step1AddNewAds;

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
