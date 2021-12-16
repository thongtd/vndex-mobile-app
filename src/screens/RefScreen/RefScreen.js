import React, {useState, useEffect} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import Container from '../../components/Container';
import {constant} from '../../configs/constant';
import QRCode from 'react-native-qrcode-svg';
import TextFnx from '../../components/Text/TextFnx';
import ButtonIcon from '../../components/Button/ButtonIcon';
import colors from '../../configs/styles/colors';
import Fbc from 'assets/svg/fbc.svg';
import Ttc from 'assets/svg/ttc.svg';
import ItemSetting from '../../components/Item/ItemSetting';

import {
  get,
  hiddenTabbar,
  hiddenModal,
  checkLang,
  createAction,
  size,
  removeTokenAndUserInfo,
} from '../../configs/utils';
import { pushSingleScreenApp, REFFERAL_FRIEND_SCREEN, ROSE_DETAIL_SCREEN, TOTAL_COMMISSION_SCREEN } from '../../navigation';
const RefScreen = ({componentId}) => {
  const [DataSetting, setDataSetting] = useState(data);
  useEffect(() => {
    setDataSetting(data);
    return () => {};
  }, []);
  const data = [
    // { textLeft: "passcode", iconLeft: icons.passCode, hasSwitch: true, onValueChange: changeSwitchData, isBorder: true },
    {
      textLeft: 'Your total commission'.t(),
      textRight: '1,051,125 AIFT',
      iconRight: true,
      onPress: ()=>pushSingleScreenApp(componentId, TOTAL_COMMISSION_SCREEN),
    },
    {
      textLeft: 'Referred friends'.t(),
      iconRight: true,
      onPress: ()=>pushSingleScreenApp(componentId, REFFERAL_FRIEND_SCREEN),
      textRight: '1500'
    },
    {
      textLeft: 'Rose details'.t(),
      iconRight: true,
      onPress: ()=>pushSingleScreenApp(componentId, ROSE_DETAIL_SCREEN),
    },
  ];

  
  
  return (
    <Container
      componentId={componentId}
      hasBack
      title={'Refferal'}
      // nameRight={"search"}
      // nameLeft={"bars"}
      // typeLeft={constant.TYPE_ICON.AntDesign}
      // sizeIconLeft={19}
      // onClickRight={() => alert("kaka")}
      // onClickLeft={() => alert("left")}
    >
      <View style={{
          alignItems:"center"
      }}>
        <QRCode size={160} value="39919082" />
        <View style={[stylest.row,{
            width:170
        }]}>
          <TextFnx color={colors.description}>{"Referral code".t()}: </TextFnx>
          <TextFnx>39919082</TextFnx>
          <ButtonIcon color={colors.highlight} name="copy" />
        </View>
      </View>
      <View>
        <TextFnx color={colors.description}>{"Referral link".t()}</TextFnx>
        <View style={stylest.row}>
          <TextFnx color={colors.highlight}>https://accountslutuananh94846757348=39919082</TextFnx>
          <ButtonIcon color={colors.highlight} name="copy" />
        </View>
      </View>
      <View>
        <TextFnx color={colors.description}>{"Share".t()}</TextFnx>
        <View style={[stylest.row,{paddingVertical:10}]}>
          <TouchableOpacity style={{
              paddingRight:10
          }}>
            <Fbc />
          </TouchableOpacity>
          <TouchableOpacity style={{
              paddingHorizontal:10
          }}>
            <Ttc />
          </TouchableOpacity>
        </View>
      </View>
      {DataSetting &&
        DataSetting.map((item, index) => {
          return (
            <ItemSetting
              //   IsSwitch={IsSwitch}
              key={index}
              textLeft={get(item, 'textLeft').t()}
              iconLeftSvg={get(item, 'iconLeft')}
              iconRight={get(item, 'iconRight')}
              textRight={get(item, 'textRight')}
              hasSwitch={get(item, 'hasSwitch')}
              isBorder={get(item, 'isBorder')}
              onPress={get(item, 'onPress')}
              onValueChange={get(item, 'onValueChange')}
              colorLabel={colors.description}
              colorValue={colors.buy}
              weightvalue={'bold'}
              sizeValue={16}
            />
          );
        })}
    </Container>
  );
};
const stylest = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default RefScreen;
