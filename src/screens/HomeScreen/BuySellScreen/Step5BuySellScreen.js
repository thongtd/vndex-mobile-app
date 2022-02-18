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
import TimelineBuySell from './TimelineBuySell';

const Step5BuySellScreen = ({componentId}) => {
  
  const advertisment = useSelector(state => state.p2p.advertisment);
  const offerOrder = useSelector(state => state.p2p.offerOrder);
  const currencyList = useSelector(state => state.market.currencyList);
  const [offerOrderState, setOfferOrderState] = useState(offerOrder || {});
  const UserInfo = useSelector(state => state.authentication.userInfo);
  const dispatch = useDispatch();
  useEffect(() => {
    useActionsP2p(dispatch).handleGetAdvertisment(
      get(offerOrder, 'p2PTradingOrderId'),
    );
    return () => {};
  }, [dispatch]);
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
    return () => {};
  }, [offerOrder, UserInfo]);
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
                      get(offerOrderState, 'price'),
                      get(advertisment, 'paymentUnit'),
                      currencyList,
                    )
              } ${
                get(offerOrderState, 'offerSide') == BUY
                  ? get(advertisment, 'symbol')
                  : get(advertisment, 'paymentUnit')
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
              Trải nghiệm giao dịch của bạn như thế nào?
            </TextFnx>
            <Rating
              ratingCount={5}
              startingValue={5}
              tintColor={colors.app.backgroundLevel1}
              showRating
              style={{paddingVertical: 2}}
            />
            {/* <Button onTitle={()=>pushSingleScreenApp(componentId, RATING_BUY_SELL_SCREEN, null)} isTitle title={'Để lại bình luận'} /> */}
          </>
        )}
      </Layout>
    </Container>
  );
};

export default Step5BuySellScreen;

const styles = StyleSheet.create({});
