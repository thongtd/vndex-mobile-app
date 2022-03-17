import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Linking,
  Clipboard,
} from 'react-native';
import Container from '../../components/Container';
import {constant, fontSize} from '../../configs/constant';
import QRCode from 'react-native-qrcode-svg';
import TextFnx from '../../components/Text/TextFnx';
import ButtonIcon from '../../components/Button/ButtonIcon';
import colors from '../../configs/styles/colors';
import Fbc from 'assets/svg/fbc.svg';
import Ttc from 'assets/svg/ttc.svg';
import ItemSetting from '../../components/Item/ItemSetting';
import Tl from 'assets/svg/tl.svg';
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
import {
  pushSingleScreenApp,
  REFFERAL_FRIEND_SCREEN,
  ROSE_DETAIL_SCREEN,
  TOTAL_COMMISSION_SCREEN,
} from '../../navigation';
import {useSelector} from 'react-redux';
import {authService} from '../../services/authentication.service';
import Layout from '../../components/Layout/Layout';
import icons from '../../configs/icons';
import Image from '../../components/Image/Image';
const RefScreen = ({componentId}) => {
  const [DataSetting, setDataSetting] = useState([]);
  const [dataAssetsSumary, setDataAssetsSumary] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setDataSetting(
      handleData(
        get(dataAssetsSumary, 'totalShared'),
        get(dataAssetsSumary, 'commissionAmounts'),
      ),
    );
    return () => {};
  }, [dataAssetsSumary]);
  const UserInfo = useSelector(state => state.authentication.userInfo);
  const handleData = (totalShare = 0, totalCommission = 0) => {
    return [
      // { textLeft: "passcode", iconLeft: icons.passCode, hasSwitch: true, onValueChange: changeSwitchData, isBorder: true },
      {
        textLeft: 'Your total commission'.t(),
        textRight: totalCommission || '0' + ' SMAT',
        iconRight: true,
        onPress: () => {
          // pushSingleScreenApp(componentId, TOTAL_COMMISSION_SCREEN)
        },
      },
      {
        textLeft: 'Referred friends'.t(),
        iconRight: true,
        onPress: () => pushSingleScreenApp(componentId, REFFERAL_FRIEND_SCREEN),
        textRight: totalShare || '0',
      },
      {
        textLeft: 'Rose details'.t(),
        iconRight: true,
        onPress: () => pushSingleScreenApp(componentId, ROSE_DETAIL_SCREEN),
      },
    ];
  };

  useEffect(() => {
    authService
      .getUserCommissionSummary(get(UserInfo, 'id'))
      .then(res => {
        setLoading(false);
        setDataAssetsSumary(get(res, 'data'));
        console.log(res.data, 'ress');
      })
      .catch(err => {
        setLoading(false);
        console.log(err, 'err');
      });

    return () => {};
  }, []);
  const hanldeCopy = url => {
    Clipboard.setString(url);
    toast('COPY_TO_CLIPBOARD'.t());
  };
  return (
    <Container
      componentId={componentId}
      hasBack
      title={'Refferal'}
      isLoadding={loading}
      space={20}
      isScroll
      // nameRight={"search"}
      // nameLeft={"bars"}
      // typeLeft={constant.TYPE_ICON.AntDesign}
      // sizeIconLeft={19}
      // onClickRight={() => alert("kaka")}
      // onClickLeft={() => alert("left")}
    >
      <View
        style={{
          alignItems: 'center',
        }}>
        <QRCode size={160} value={get(dataAssetsSumary, 'qrCode') || '0'} />

          <TextFnx spaceTop={20} weight='400' size={fontSize.f16} color={colors.description}>{'Referral code'.t()} </TextFnx>
          
        <Layout isCenter >
            <TextFnx weight='500' size={fontSize.f20}>{get(dataAssetsSumary, 'qrCode') || '0'}</TextFnx>
            <ButtonIcon style={{
              width:40
            }} color={colors.highlight} iconComponent={icons.icCopy} />
          </Layout>
      </View>
      <View>
        <TextFnx space={12} size={fontSize.f16} color={colors.description}>{'Referral link'.t()}</TextFnx>
        <View style={[stylest.row,{
          height:52,
          backgroundColor:colors.app.backgroundLevel2,
          paddingHorizontal:15
        }]}>
          <TextFnx  color={colors.highlight}>
            {get(dataAssetsSumary, 'referralUrl') && get(dataAssetsSumary, 'referralUrl').length > 30 ? 
                    get(dataAssetsSumary, 'referralUrl').substring(0, 37 - 3) + "..." : 
                    get(dataAssetsSumary, 'referralUrl') || "No Data"}
          </TextFnx>
          <ButtonIcon
            onPress={() => hanldeCopy(get(dataAssetsSumary, 'referralUrl'))}
            color={colors.highlight}
            iconComponent={icons.icCopy}
          />
        </View>
      </View>
      <View>
        <TextFnx spaceTop={30} size={fontSize.f16} color={colors.description}>{'Share'.t()}</TextFnx>
        <View style={[stylest.row, {paddingVertical: 10}]}>
          <TouchableOpacity
            onPress={() => Linking.openURL(constant.SHARE.FACEBOOK)}
            style={{
              paddingRight: 10,
            }}>
            <Fbc />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL(constant.SHARE.TWITTER)}
            style={{
              // paddingHorizontal: 10,
            }}>
            {/* <Tl /> */}
            <Image style={{
              width:55,
              height:55
            }} source={require('assets/icons/icTeleCircle.png')} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL(constant.SHARE.ZALO)}
            style={{
              paddingHorizontal: 10,
            }}>
            {/* <Tl /> */}
            <Image style={{
              width:30,
              height:30
            }} source={require('assets/icons/icZalo.png')} />
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
              colorValue={colors.text}
              weightvalue={'400'}
              sizeValue={fontSize.f16}
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
