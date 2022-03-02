import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Rating} from 'react-native-ratings';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../../components/Button/Button';
import Container from '../../../components/Container';
import Image from '../../../components/Image/Image';
import Layout from '../../../components/Layout/Layout';
import TextFnx from '../../../components/Text/TextFnx';
import {BUY, fontSize, SELL, spacingApp} from '../../../configs/constant';
import icons from '../../../configs/icons';
import colors from '../../../configs/styles/colors';
import {formatCurrency, get} from '../../../configs/utils';
import {pushSingleScreenApp, pushTabBasedApp, RATING_BUY_SELL_SCREEN} from '../../../navigation';
import {useActionsP2p} from '../../../redux';
import RatingBuySellScreen from './RatingBuySellScreen';
import TimelineBuySell from './TimelineBuySell';

const Step5BuySellScreen = ({componentId}) => {
  
  const advertisment = useSelector(state => state.p2p.advertisment);
  const offerOrder = useSelector(state => state.p2p.offerOrder);
  const currencyList = useSelector(state => state.market.currencyList);
  const [offerOrderState, setOfferOrderState] = useState(offerOrder || {});
  const UserInfo = useSelector(state => state.authentication.userInfo);
  const dispatch = useDispatch();
  const [isRating, setIsRating] = useState(false);

  useEffect(() => {
    // alert("kkk")
    if (
      get(UserInfo, 'id') ===
      get(offerOrder, 'ownerIdentityUser.identityUserId')
    ) {
      setOfferOrderState({
        ...offerOrder,
        offerSide: get(offerOrder, 'offerSide') === BUY ? SELL : BUY,
      });
    } else {
      setOfferOrderState({
        ...offerOrder,
      });
    }
    if(get(offerOrder, 'p2PTradingOrderId')){
      useActionsP2p(dispatch).handleGetAdvertisment(
        get(offerOrder, 'p2PTradingOrderId'),
      );
    }
    return () => {};
  }, [offerOrder, UserInfo]);
  if(isRating){
    return <RatingBuySellScreen onCancel={()=>setIsRating(false)} componentId={componentId} />
  }
  return (
    <Container
      isTopBar
      title="Hoàn thành"
      componentId={componentId}
      spaceHorizontal={0}
      isScroll
      space={15}>
         <Layout type="column" spaceHorizontal={spacingApp}>
          <TimelineBuySell
            side={get(offerOrderState, 'isPaymentCancel')?SELL:BUY}
            step={3}
            title={'Hoàn thành'}
          />
        </Layout>
      <Layout isCenter type="column">
       
        <Image
          source={
            get(offerOrderState, 'isPaymentCancel')
              ? icons.imgCancel
              : icons.imgChecked
          }
        />
        <TextFnx space={20} size={30} color={get(offerOrderState, 'isPaymentCancel')?colors.app.sell:colors.app.buy}>
          {get(offerOrderState, 'isPaymentCancel')
            ? 'Đã huỷ lệnh'
            : `${
                get(offerOrderState, 'offerSide') == BUY
                  ? formatCurrency(
                      get(offerOrderState, 'quantity'),
                      get(advertisment, 'symbol'),
                      currencyList,
                    )
                  : formatCurrency(
                      get(offerOrderState, 'quantity'),
                      get(advertisment, 'symbol'),
                      currencyList,
                    )
              } ${
                get(offerOrderState, 'offerSide') == BUY
                  ? get(advertisment, 'symbol')
                  : get(advertisment, 'symbol')
              }`}
        </TextFnx>
        {!get(offerOrderState, 'isPaymentCancel') && (
          <TextFnx spaceBottom={30} color={colors.app.textContentLevel2}>
            {get(offerOrderState, 'offerSide') == BUY ? 'Mua' : 'Bán'} thành công
          </TextFnx>
        )}
        <View
          style={{
            height: 100,
          }}>
          <Button
            onPress={() => pushTabBasedApp(3)}
            width={200}
            isNormal
            title={'Kiểm tra ví'}
          />
        </View>
        {!get(offerOrderState, 'isPaymentCancel') && (
          <>
            <TextFnx spaceBottom={20} color={colors.app.textContentLevel2}>
              Trải nghiệm giao dịch của bạn với đối tác như thế nào?
            </TextFnx>
            <Rating
              readonly={true}
              ratingCount={5}
              startingValue={get(advertisment, 'traderInfo.totalStar') || 0}
              tintColor={colors.app.backgroundLevel1}
              showRating
              showReadOnlyText={false}
              style={{paddingVertical: 2}}
            />
            <Button marginTop={8} onTitle={()=>{
              setIsRating(true)
            }} isTitle title={'Để lại bình luận'} />
          </>
        )}
      </Layout>
    </Container>
  );
};

export default Step5BuySellScreen;

const styles = StyleSheet.create({});
