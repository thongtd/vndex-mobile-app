import React, {useState, useEffect} from 'react';
import {Text, TouchableOpacity, View, StyleSheet, Linking, Clipboard} from 'react-native';
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
  toast,
} from '../../configs/utils';
import { pushSingleScreenApp, REFFERAL_FRIEND_SCREEN, ROSE_DETAIL_SCREEN, TOTAL_COMMISSION_SCREEN } from '../../navigation';
import { useSelector } from 'react-redux';
import { authService } from '../../services/authentication.service';
const RefScreen = ({componentId}) => {
  const [DataSetting, setDataSetting] = useState([]);
  const [dataAssetsSumary, setDataAssetsSumary] = useState({});
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setDataSetting(handleData(get(dataAssetsSumary,"totalShared"),get(dataAssetsSumary,"commissionAmounts")));
    return () => {};
  }, [dataAssetsSumary]);
  const UserInfo = useSelector(state => state.authentication.userInfo)
  const handleData = (totalShare=0, totalCommission = 0)=>{
    return [
      // { textLeft: "passcode", iconLeft: icons.passCode, hasSwitch: true, onValueChange: changeSwitchData, isBorder: true },
      {
        textLeft: 'Your total commission'.t(),
        textRight: totalCommission || "0" + ' AIFT',
        iconRight: true,
        onPress: ()=>{
          // pushSingleScreenApp(componentId, TOTAL_COMMISSION_SCREEN)
        },
      },
      {
        textLeft: 'Referred friends'.t(),
        iconRight: true,
        onPress: ()=>pushSingleScreenApp(componentId, REFFERAL_FRIEND_SCREEN),
        textRight: totalShare || "0"
      },
      {
        textLeft: 'Rose details'.t(),
        iconRight: true,
        onPress: ()=>pushSingleScreenApp(componentId, ROSE_DETAIL_SCREEN),
      },
    ];
  }
  

  useEffect(() => {
    authService.getUserCommissionSummary(get(UserInfo,"id")).then(res => {
      setLoading(false);
      setDataAssetsSumary(get(res,"data"));
      console.log(res.data,"ress");
    }).catch(err => {
      setLoading(false);
      console.log(err,"err")
    })

    return () => {
      
    }
  }, [])
  const hanldeCopy = (url) =>{
    Clipboard.setString(url);
    toast("COPY_TO_CLIPBOARD".t());
    
  }
  return (
    <Container
      componentId={componentId}
      hasBack
      title={'Refferal'}
      isLoadding={loading}
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
        <QRCode size={160} value={get(dataAssetsSumary,"qrCode")|| "0"} />
        <View style={[stylest.row,{
            width:170
        }]}>
          <TextFnx color={colors.description}>{"Referral code".t()}: </TextFnx>
          <TextFnx>{get(dataAssetsSumary,"qrCode") || "0"}</TextFnx>
          <ButtonIcon color={colors.highlight} name="copy" />
        </View>
      </View>
      <View>
        <TextFnx color={colors.description}>{"Referral link".t()}</TextFnx>
        <View style={stylest.row}>
          <TextFnx color={colors.highlight}>{get(dataAssetsSumary,"referralUrl") }</TextFnx>
          <ButtonIcon onPress={()=>hanldeCopy(get(dataAssetsSumary,"referralUrl"))} color={colors.highlight} name="copy" />
        </View>
      </View>
      <View>
        <TextFnx color={colors.description}>{"Share".t()}</TextFnx>
        <View style={[stylest.row,{paddingVertical:10}]}>
          <TouchableOpacity onPress={() => Linking.openURL(constant.SHARE.TWITTER)} style={{
              paddingRight:10
          }}>
            <Fbc />
          </TouchableOpacity>
          <TouchableOpacity onPress={() =>  Linking.openURL(constant.SHARE.FACEBOOK)} style={{
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
