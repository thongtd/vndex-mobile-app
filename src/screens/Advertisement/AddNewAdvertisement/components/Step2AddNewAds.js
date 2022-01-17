import {get, isEmpty} from 'lodash';
import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import BottomSheet from '../../../../components/ActionSheet/ActionSheet';
import Button from '../../../../components/Button/Button';
import ButtonIcon from '../../../../components/Button/ButtonIcon';
import Icon from '../../../../components/Icon';
import Image from '../../../../components/Image/Image';
import Input from '../../../../components/Input';
import ItemList from '../../../../components/Item/ItemList';
import Layout from '../../../../components/Layout/Layout';
import TextFnx from '../../../../components/Text/TextFnx';
import {constant, spacingApp} from '../../../../configs/constant';
import icons from '../../../../configs/icons';
import colors from '../../../../configs/styles/colors';
import {
  formatCurrency,
  formatNumberOnChange,
  getItemWallet,
  set,
  size,
  toast,
} from '../../../../configs/utils';
import {PICKER_SEARCH} from '../../../../navigation';
import {dismissAllModal, showModal} from '../../../../navigation/Navigation';
import {useActionsP2p} from '../../../../redux';

const Step2AddNewAds = ({submitNextStep, bntClose, dataState, ...rest}) => {
  const actionSheetRef = useRef(null);
  const marketInfo = useSelector(state => state.p2p.marketInfo);
  const cryptoWallet = useSelector(state => state.market.cryptoWallet);
  const currencyList = useSelector(state => state.market.currencyList);
  const onSubmitNextStep = () => {
    submitNextStep();
  };
  const paymentMethods = useSelector(state => state.p2p.paymentMethods);

  return (
    <View style={styles.conatainer}>
      {console.log('get(dataStateitem, ): ', get(dataState, 'quantity'))}
      <>
        <Input
          spaceVertical={8}
          titleBtnRight="Tất cả"
          onChangeText={txt => rest.onQuantityChange(txt)}
          value={get(dataState, 'quantity')}
          hasValue
          onBtnRight={() => rest.onBtnAll(formatCurrency(
            get(
              getItemWallet(cryptoWallet, get(dataState, 'symbol')),
              'available',
            ),
            get(dataState, 'symbol'),
            currencyList,
          ))}
          keyboardType='decimal-pad'
          placeholder="1000"
          styleBorder={{height: 'auto'}}
          style={{fontSize: 16, color: colors.text}}
          isInputTopUnit={
            <TextFnx color={colors.description} style={{marginRight: 20}}>
              {get(dataState, 'symbol')}
            </TextFnx>
          }
          isInputTop={'Khối lượng'}
        />
        <Layout space={5} isSpaceBetween>
          <TextFnx color={colors.app.textDisabled} size={12}>
            {`Khả dụng   `}
            <TextFnx size={12} color={colors.app.textContentLevel2}>
              {formatCurrency(
                get(
                  getItemWallet(cryptoWallet, get(dataState, 'symbol')),
                  'available',
                ),
                get(dataState, 'symbol'),
                currencyList,
              )}
              {` ${get(dataState, 'symbol')}`} ≈{' '}
              {`${formatCurrency(
                get(
                  getItemWallet(cryptoWallet, get(dataState, 'symbol')),
                  'available',
                ) * get(marketInfo, 'lastestPrice'),
                get(dataState, 'paymentUnit'),
                currencyList,
              )} ${get(dataState, 'paymentUnit')}`}
            </TextFnx>
          </TextFnx>
        </Layout>
      </>
      <Layout type="column" spaceTop={10}>
        <TextFnx color={colors.description}>Giá trị giao dịch cho phép</TextFnx>
        <Input
          spaceVertical={8}
          styleBorder={{height: 'auto'}}
          hasValue
          keyboardType='decimal-pad'
          value={get(dataState, 'minOrder')}
          onChangeText={txt => rest.onMinOrderChange(txt)}
          placeholder={`${formatCurrency(
            get(marketInfo, 'minOrderAmount'),
            get(dataState, 'paymentUnit'),
            currencyList,
          )} ~ ${formatCurrency(
            get(marketInfo, 'maxOrderAmount'),
            get(dataState, 'paymentUnit'),
            currencyList,
          )}`}
          style={{fontSize: 16, color: colors.text}}
          isInputTopUnit={
            <TextFnx style={{fontSize: 16, color: colors.description}}>
              {get(dataState, 'paymentUnit')}
            </TextFnx>
          }
          isInputTop={
            <TextFnx
              color={colors.description}
              size={12}
              spaceTop={10}
              style={{marginBottom: -10}}>
              Tối thiểu
            </TextFnx>
          }
        />
        <Input
          spaceVertical={8}
          keyboardType='decimal-pad'
          value={get(dataState, 'maxOrder')}
          onChangeText={txt => rest.onMaxOrderChange(txt)}
          styleBorder={{height: 'auto'}}
          //   onBtnRight={() => alert('ok')}
          hasValue
          placeholder={`${formatCurrency(
            get(marketInfo, 'minOrderAmount'),
            get(dataState, 'paymentUnit'),
            currencyList,
          )} ~ ${formatCurrency(
            get(marketInfo, 'maxOrderAmount'),
            get(dataState, 'paymentUnit'),
            currencyList,
          )}`}
          style={{fontSize: 16, color: colors.text}}
          isInputTopUnit={
            <TextFnx style={{fontSize: 16, color: colors.description}}>
              {get(dataState, 'paymentUnit')}
            </TextFnx>
          }
          isInputTop={
            <TextFnx
              color={colors.description}
              size={12}
              spaceTop={10}
              style={{marginBottom: -10}}>
              Tối đa
            </TextFnx>
          }
        />
      </Layout>

      <Layout isSpaceBetween isLineCenter spaceTop={10}>
        <TextFnx color={colors.description}>Phí</TextFnx>
        <TextFnx color={colors.greyLight}>
          0 {get(dataState, 'paymentUnit')}
        </TextFnx>
      </Layout>
      <Layout
        isSpaceBetween
        isLineCenter
        space={10}
        style={{
          borderBottomWidth: 1,
          borderColor: colors.app.lineSetting,
        }}>
        <TextFnx color={colors.description}>Thuế</TextFnx>
        <TextFnx color={colors.greyLight}>
          0 {get(dataState, 'paymentUnit')}
        </TextFnx>
      </Layout>

      <Layout isSpaceBetween isLineCenter spaceTop={10}>
        <TextFnx color={colors.description}>Phương thức thanh toán</TextFnx>
        <TouchableOpacity
          onPress={() => {
            actionSheetRef.current?.show();
          }}>
          <Layout isSpaceBetween isLineCenter>
            <TextFnx color={colors.highlight} spaceRight={10}>
              Thêm
            </TextFnx>
            <Image
              source={require('assets/icons/ic_add_bank.png')}
              style={{
                width: 20,
                height: 20,
              }}
            />
          </Layout>
        </TouchableOpacity>
      </Layout>

      <Layout
        type="column"
        space={10}
        style={{
          borderBottomWidth: 1,
          borderColor: colors.app.lineSetting,
        }}>
        {size(get(dataState, 'paymentMethodData')) > 0 &&
          get(dataState, 'paymentMethodData').map((item, index) => (
            <ButtonIcon
              key={`key-pm-methods-${index}`}
              space={10}
              title={get(item, 'name')}
              iconComponent={
                get(item, 'code') == constant.CODE_PAYMENT_METHOD.MOMO
                  ? icons.IcMomoSvg
                  : icons.IcBank2
              }
              styleText={{fontSize: 16, color: colors.description}}
              style={styles.method_payment}
              iconRight={
                <TouchableOpacity
                  onPress={() => rest.onRemovePaymentMethod(item)}
                  style={styles.bnt_close}>
                  <Image
                    source={require('assets/icons/ic_close.png')}
                    style={{
                      width: 20,
                      height: 20,
                    }}
                  />
                </TouchableOpacity>
              }
            />
          ))}
        <TextFnx
          spaceBottom={10}
          color={colors.app.textDisabled}
          size={12}
          style={{fontStyle: 'italic'}}>
          Chọn tối đa 3 phương thức
        </TextFnx>
      </Layout>

      <Layout type="column" style={{width: '100%'}} spaceBottom={20}>
        <Button
          placeholder={get(dataState, 'activeTimeToLive.name')}
          isPlaceholder={false}
          spaceVertical={20}
          isInputSize={16}
          height={'auto'}
          onInput={rest.onGetTimer}
          isInput
          iconRight="caret-down"
          isInputLable={
            <TextFnx color={colors.description} size={12} spaceBottom={1.5}>
              Thời gian cần thanh toán
            </TextFnx>
          }
        />
      </Layout>

      <Button title={'Tiếp theo'} isNormal onPress={onSubmitNextStep} />
      {bntClose || null}
      <BottomSheet
        title="Chọn Phương thức thanh toán"
        actionRef={actionSheetRef}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          onScrollEndDrag={() => actionSheetRef.current?.handleChildScrollEnd()}
          onScrollAnimationEnd={() =>
            actionSheetRef.current?.handleChildScrollEnd()
          }
          onMomentumScrollEnd={() =>
            actionSheetRef.current?.handleChildScrollEnd()
          }>
          {paymentMethods &&
            size(paymentMethods) > 0 &&
            paymentMethods.map((item, index) => {
              return (
                <TouchableOpacity
                  key={`ite-${index}`}
                  onPress={() => {
                    if (size(get(dataState, 'paymentMethodData')) >= 3) {
                      toast('Chỉ thêm tối đa 3 phương thức thanh toán');
                    } else {
                      rest.onSelectPaymentMethod(item, () => {
                        actionSheetRef.current?.hide();
                      });
                    }
                  }}>
                  <Layout
                    style={{
                      paddingVertical: 10,
                      borderBottomWidth: 1,
                      borderColor: colors.app.lineSetting,
                    }}>
                    <Icon
                      name="credit-card"
                      color={colors.app.textContentLevel3}
                      size={14}
                    />
                    <Layout spaceLeft={20} type="column">
                      <TextFnx
                        spaceBottom={3}
                        color={colors.app.textContentLevel3}>
                        {get(item, 'name')}
                      </TextFnx>

                      <TextFnx
                        size={16}
                        space={3}
                        color={colors.app.textContentLevel2}>
                        {get(item, 'fullName')}
                      </TextFnx>
                      {!isEmpty(get(item, 'backAccountNo')) && (
                        <TextFnx
                          size={16}
                          space={3}
                          color={colors.app.textContentLevel2}>
                          {get(item, 'backAccountNo')}
                        </TextFnx>
                      )}
                      {!isEmpty(get(item, 'bankName')) && (
                        <TextFnx
                          size={16}
                          space={3}
                          color={colors.app.textContentLevel2}>
                          {get(item, 'bankName')}
                        </TextFnx>
                      )}
                      {!isEmpty(get(item, 'bankBranchName')) && (
                        <TextFnx
                          size={16}
                          space={3}
                          color={colors.app.textContentLevel2}>
                          {get(item, 'bankBranchName')}
                        </TextFnx>
                      )}
                      {!isEmpty(get(item, 'phoneNumber')) && (
                        <TextFnx
                          size={16}
                          space={3}
                          color={colors.app.textContentLevel2}>
                          {get(item, 'phoneNumber')}
                        </TextFnx>
                      )}
                    </Layout>
                  </Layout>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      </BottomSheet>
    </View>
  );
};
const styles = StyleSheet.create({
  conatainer: {
    backgroundColor: colors.app.backgroundLevel2,
    paddingTop: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: spacingApp,
    marginTop: 23,
    paddingBottom: 20,
  },
  method_payment: {
    width: '100%',
    backgroundColor: colors.app.bg363636,
    borderRadius: 3,
    height: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bnt_close: {
    marginRight: 10,
  },
});

export default Step2AddNewAds;
