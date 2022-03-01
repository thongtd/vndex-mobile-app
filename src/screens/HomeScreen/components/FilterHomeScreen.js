import {
  Text,
  View,
  StyleSheet,
  Animated,
  Switch,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LayoutMofalFilter from '../../../components/Alert/LayoutMofalFilter';
import Layout from '../../../components/Layout/Layout';
import ItemList from '../../../components/Item/ItemList';
import Image from '../../../components/Image/Image';
import TextFnx from '../../../components/Text/TextFnx';
import {useDispatch, useSelector} from 'react-redux';
// import {get, orderBy, uniqBy} from 'lodash';
import {emitEventEmitter, fullHeight} from '../../../configs/utils';
import {uniqBy, orderBy, isEmpty} from 'lodash';
import {showModal, dismissAllModal} from '../../../navigation/Navigation';
import {CALENDAR_SCREEN, PICKER_SEARCH} from '../../../navigation';
import colors from '../../../configs/styles/colors';
import ItemFilter from '../../SwapScreen/components/ItemFilter';
import CalendarScreen from '../../SwapScreen/childrensScreens/CalendarScreen';
import Input from '../../../components/Input';
import ButtonIcon from '../../../components/Button/ButtonIcon';
import Icon from '../../../components/Icon';
import Button from '../../../components/Button/Button';
import {constant} from '../../../configs/constant';

export default function FilterHomeScreen() {
  const [qtty, setQtty] = useState(0);
  const [checked, setChecked] = useState(true);
  const exchangePaymentMethod = useSelector(
    state => state.p2p.exchangePaymentMethod,
  );
  const [dataFil, setDataFil] = useState([
    {id: '', name: 'Tất cả', isActive: true},
    ...exchangePaymentMethod.map(obj => ({...obj, isActive: false})),
    // {id: 2, name: 'Chuyển khoản', isActive: false, value:constant.CODE_PAYMENT_METHOD.BANK_TRANSFER},
    // {id: 3, name: 'Momo', isActive: false, value:constant.CODE_PAYMENT_METHOD.MOMO},
    // {id: 4, name: 'Viettel Pay', isActive: false},
    // {id: 5, name: 'Zalo Pay', isActive: false},
    // {id: 6, name: 'Paypal', isActive: false},
  ]);

  const onSelectFilter = id => {
    const data = dataFil.map(ite => {
      return {
        ...ite,
        isActive: ite?.id == id ? true : false,
      };
    });
    setDataFil([...data]);
  };
  useEffect(() => {
    emitEventEmitter('filerHomeEvent', {
      exPaymentMethodIdsEv: dataFil
        .filter(t => t.isActive == true)
        .map(s => s.id),
    });
    return () => {};
  }, [dataFil]);

  return (
    <LayoutMofalFilter title="Bộ Lọc" isTitle>
      <Layout
        type={'column'}
        spaceHorizontal={0}
        style={[stylest.layoutHistory]}>
        <Input
          label="Số lượng"
          placeholder="Nhập số lượng"
          isLabel
          titleRight="VND"
          value={qtty}
          hasValue
          onChangeText={qtty => {
            setQtty(qtty);
            // alert("ok");
            emitEventEmitter('filerHomeEvent', {
              orderAmountEv:isEmpty(qtty)?"empty": parseFloat(qtty)
            });
          }}
          keyboardType={'numeric'}
          // handleChange={}
        />

        <Layout type="column" space={10}>
          <Layout isSpaceBetween isCenter style={{borderWidth: 0}}>
            <TextFnx space={10}>Phương thức thanh toán</TextFnx>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextFnx space={10} spaceRight={6} color={colors.highlight}>
                Tất cả
              </TextFnx>
              <Icon name="chevron-down" color={colors.highlight} />
            </TouchableOpacity>
          </Layout>

          <View style={stylest.slBoxFilter}>
            {dataFil.map((i, ind) => (
              <Button
                key={String(`key-bnt-${ind}`)}
                isTitle
                title={i?.name || ''}
                width={100}
                style={[
                  stylest.styleFileBnt,
                  (i?.isActive && stylest.activeFil) || null,
                ]}
                color={(i?.isActive && colors.highlight) || colors.subText}
                onTitle={() => onSelectFilter(i?.id)}
              />
            ))}
          </View>
        </Layout>

        <Input
          style={{
            fontSize: 12,
          }}
          value="Nhà đầu tư chuyên nghiệp"
          hasValue
          editable={true}
          spacingApp={0}
          titleLeft={
            <Switch
              trackColor={{false: '#767577', true: colors.iconButton}}
              thumbColor={colors.greyLight}
              ios_backgroundColor="#3e3e3e"
              value={checked}
              onValueChange={() => setChecked(!checked)}
            />
          }
        />

        <Layout
          style={{
            paddingTop: 15,
            borderTopWidth: 0.5,
            borderTopColor: colors.app.lineSetting,
          }}
          type="column">
          <TextFnx space={10}>Mô tả</TextFnx>
          <TextFnx color={colors.app.textContentLevel3}>
            Phương thức thanh toán: Chỉ hiển thị các phương thức thanh toán khả
            dụng
          </TextFnx>
        </Layout>
      </Layout>
    </LayoutMofalFilter>
  );
}

const stylest = StyleSheet.create({
  container: {},
  layoutHistory: {},
  LayoutFilter: {
    height: fullHeight,
  },
  slBoxFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  styleFileBnt: {
    height: 45,
    backgroundColor: colors.cl353535,
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    borderRadius: 3,
    marginBottom: 10,
  },
  activeFil: {
    borderWidth: 0.5,
    borderColor: colors.highlight,
  },
});
