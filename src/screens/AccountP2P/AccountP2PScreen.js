import {StyleSheet, Text, View} from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/Container';
import TextFnx from '../../components/Text/TextFnx';
import Layout from '../../components/Layout/Layout';
import icons from '../../configs/icons';
import ItemSetting from '../../components/Item/ItemSetting';
import {Rating} from 'react-native-ratings';
import colors from '../../configs/styles/colors';
import { BUY, constant, fontSize, SELL } from '../../configs/constant';
import Button from '../../components/Button/Button';
import { ceil, get, isArray, uniqBy } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../../components/Icon';
import { formatCurrency, toast } from '../../configs/utils';
import Image from '../../components/Image/Image';
import { DETAIL_ACCOUNT_P2P_SCREEN, pushSingleScreenApp, STEP_1_BUY_SELL_SCREEN } from '../../navigation';
import Close from 'assets/svg/close.svg';
import Checked from 'assets/svg/checked.svg';
import { useActionsAuthen, useActionsP2p } from '../../redux';
const AccountP2PScreen = ({componentId,userId=''}) => {
    const [ActiveType, setActiveType] = useState('S');
    const advertisments = useSelector(state => state.p2p.myAdvertisments);
    const currencyList = useSelector(state => state.market.currencyList);
    const logged = useSelector(state => state.authentication.logged);
    const UserInfo = useSelector(state => state.authentication.userInfo);
    const advInfo = useSelector(state => state.p2p.advInfo);
    const dispatch = useDispatch()
    useEffect(() => {
      useActionsP2p(dispatch).handleGetAdvInfo({
        userId:userId
      });
      // useActionsP2p(dispatch).handleGetAdvertisments({
      //   pageIndex:1,
      //   pageSize: 20,
      //   side: ActiveType == BUY ? SELL : BUY,
      //   coinSymbol:''
      // });
      useActionsP2p(dispatch).handleGetMyAdvertisments({
        pageIndex: 1,
        pageSize: 25,
        side: ActiveType == BUY ? SELL : BUY,
        userId:userId
      });
      useActionsAuthen(dispatch).handleGetUserKyc(userId);
      return () => {
        
      }
    }, [dispatch,ActiveType])
    
    return (
    <Container
      componentId={componentId}
      title="Tài khoản P2P"
      isTopBar
      isScroll>
      <TextFnx color={colors.app.textContentLevel2} space={8} size={12}>Người dùng đã được xác minh</TextFnx>
      <Layout>
        <Layout isLineCenter spaceRight={10}>
         {get(UserInfo,"twoFactorEnabled")? <Checked />:<Close />}
          <TextFnx>Email</TextFnx>
        </Layout>
        <Layout isLineCenter>
        {get(UserInfo,"customerMetaData.isKycUpdated")? <Checked />:<Close />}
          <TextFnx>KYC</TextFnx>
        </Layout>
      </Layout>
      <ItemSetting
        textRight={'Xem thêm'}
        weightTextLeft={"600"}
        textLeft={'Thông tin'}
        isBorder
        iconRight
        onPress={() => {
          pushSingleScreenApp(componentId,DETAIL_ACCOUNT_P2P_SCREEN)
        }}
      />
      <Layout space={8}>
        <Layout
          type="column"
          style={{
            flex: 1,
          }}>
          <TextFnx space={8} size={16} weight="600">
          {String(get(advInfo,"totalRecentTransactions") || 0)} lần
          </TextFnx>
          <TextFnx color={colors.app.textContentLevel2} size={12}>Giao dịch trong 30 ngày</TextFnx>
        </Layout>
        <Layout
          type="column"
          style={{
            flex: 1,
          }}>
          <TextFnx space={8} size={16} weight="600">
          {String(ceil(get(advInfo,"percentageOfCompletedRecentTransactions")) || 0)}%
          </TextFnx>
          <TextFnx color={colors.app.textContentLevel2} size={12}>Tỷ lệ hoàn tất trong 30 ngày</TextFnx>
        </Layout>
      </Layout>
      <Layout space={8}>
        <Layout
          type="column"
          style={{
            flex: 1,
          }}>
          <TextFnx space={8} size={16} weight="600">
          {String(ceil(get(advInfo,"averageUnlockTime")))} phút
          </TextFnx>
          <TextFnx color={colors.app.textContentLevel2} size={12}>Thời gian mở khóa trung bình</TextFnx>
        </Layout>
        <Layout
          type="column"
          style={{
            flex: 1,
          }}>
          <TextFnx space={8} size={16} weight="600">
          {String(ceil(get(advInfo,"averagePaymentTime")))} phút
          </TextFnx>
          <TextFnx color={colors.app.textContentLevel2} size={12}>Thời gian thanh toán trung bình</TextFnx>
        </Layout>
      </Layout>
      <Layout space={8}>
        <Layout
          type="column"
          style={{
            flex: 1,
          }}>
          <TextFnx space={8} size={16} weight="600">
            {String(ceil(get(advInfo,"totalRecentTransactions")))}
          </TextFnx>
          <TextFnx color={colors.app.textContentLevel2} size={12}>Giao dịch gần đây</TextFnx>
        </Layout>
        <Layout
          type="column"
          style={{
            flex: 1,
          }}>
          <Rating
            imageSize={20}
            ratingCount={5}
            startingValue={ceil(get(advInfo,"averageRating")) || 0}
            readonly
            tintColor={colors.app.backgroundLevel1}
            //   onFinishRating={setRatingStar}
            style={{paddingVertical: 8, flexDirection: 'row'}}
          />
          <TextFnx color={colors.app.textContentLevel2} size={12}>Đánh giá</TextFnx>
        </Layout>
      </Layout>
      <Layout space={12} style={{
          borderBottomWidth:1,
          borderColor:colors.app.lineSetting
      }}>
        <TextFnx size={14} weight="600">Quảng cáo đang online</TextFnx>
      </Layout>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '50%',
          }}>
          <Button
            isNormal
            onPress={() => setActiveType(BUY)}
            width={75}
            title={'Mua'}
            height={40}
            colorTitle={ActiveType == BUY ? colors.app.buy : colors.text}
            bgButtonColor={
              ActiveType == BUY ? colors.app.bgBuy : colors.app.backgroundLevel1
            }
          />
          
          <Button
            onPress={() => setActiveType(SELL)}
            isNormal
            width={75}
            title={'Bán'}
            height={40}
            colorTitle={ActiveType == SELL ? colors.app.sell : colors.text}
            bgButtonColor={
              ActiveType == SELL
                ? colors.app.bgSell
                : colors.app.backgroundLevel1
            }
          />
        </View>
      </View>
      {(
        (isArray(get(advertisments, 'source')) &&
          get(advertisments, 'source')) ||
        []
      ).map((item, index) => (
        <View
          key={`data-${index}`}
          style={{
            paddingVertical: 20,
            borderBottomWidth: 1,
            borderBottomColor: colors.app.lineSetting,
          }}>
          <Layout isSpaceBetween>
            <Layout>
              <TextFnx weight="400" size={fontSize.f16} spaceRight={10}>
                {`${get(item, 'traderInfo.emailAddress')}`}
              </TextFnx>
              {get(item, 'requiredKyc') && (
                <Icon iconComponent={icons.icTick} />
              )}
            </Layout>
            <TextFnx size={fontSize.f12} color={colors.app.textDisabled}>
              {get(item, 'traderInfo.totalCompleteOrder')} lệnh |{' '}
              {get(item, 'traderInfo.completePercent')}% hoàn tất
            </TextFnx>
          </Layout>
          <Layout isSpaceBetween isLineCenter>
            <View>
              <TextFnx color={colors.app.textDisabled} size={fontSize.f12}>
                Giá
              </TextFnx>
              <TextFnx
                weight="500"
                color={
                  get(item, 'side') == SELL ? colors.app.buy : colors.app.sell
                }
                size={fontSize.f20}>
                {formatCurrency(
                  get(item, 'price'),
                  get(item, 'paymentUnit'),
                  currencyList,
                )}{' '}
                <TextFnx
                  color={colors.app.textContentLevel3}
                  weight="400"
                  size={fontSize.f14}>
                  {get(item, 'paymentUnit')}
                </TextFnx>
              </TextFnx>
            </View>
            <View>
              <Button
                spaceHorizontal={20}
                isNormal
                // width={175}
                onPress={() => {
                  if (!logged) {
                    return pushSingleScreenApp(componentId, LOGIN_SCREEN);
                  }
                  if (
                    get(item, 'traderInfo.identityUserId') ==
                    get(UserInfo, 'id')
                  ) {
                    return toast('Không được đặt lệnh bạn đã tạo');
                  }
                  if (!get(UserInfo, 'twoFactorEnabled')) {
                    return toast('Vui lòng bật thiết lập 2FA để tạo lệnh');
                  }
                  if (!get(UserInfo, 'customerMetaData.isKycUpdated')) {
                    return toast('Vui lòng KYC tài khoản để tạo lệnh');
                  }
                  pushSingleScreenApp(componentId, STEP_1_BUY_SELL_SCREEN, {
                    item,
                  });
                }}
                title={
                  get(item, 'side') == SELL
                    ? `Mua ${get(item, 'symbol')}`
                    : `Bán ${get(item, 'symbol')}`
                }
                height={40}
                colorTitle={
                  get(item, 'side') == SELL ? colors.app.buy : colors.app.sell
                }
                bgButtonColor={
                  get(item, 'side') == SELL
                    ? colors.app.bgBuy
                    : colors.app.bgSell
                }
              />
            </View>
          </Layout>

          <Layout>
            <Layout type="column" spaceRight={10}>
              <TextFnx
                space={3}
                size={fontSize.f12}
                color={colors.app.textDisabled}>
                Khả dụng
              </TextFnx>
              <TextFnx
                space={3}
                size={fontSize.f12}
                color={colors.app.textDisabled}>
                Giới hạn
              </TextFnx>
            </Layout>
            <View
              style={{
                flex: 1,
              }}>
              <TextFnx space={3} size={fontSize.f12}>
                {formatCurrency(
                  get(item, 'quantity'),
                  get(item, 'symbol'),
                  currencyList,
                )}{' '}
                {get(item, 'symbol')}
              </TextFnx>
              <Layout isSpaceBetween>
                <TextFnx space={3} size={fontSize.f12}>
                  {formatCurrency(
                    get(item, 'minOrderAmount'),
                    get(item, 'paymentUnit'),
                    currencyList,
                  )}{' '}
                  -{' '}
                  {formatCurrency(
                    get(item, 'maxOrderAmount'),
                    get(item, 'paymentUnit'),
                    currencyList,
                  )}{' '}
                  {get(item, 'paymentUnit')}
                </TextFnx>

                <Layout>
                  {(uniqBy(get(item, 'paymentMethods'), 'code') || []).map(
                    (it, ind) => {
                      if (
                        get(it, 'code') == constant.CODE_PAYMENT_METHOD.MOMO
                      ) {
                        return (
                          <Image
                            source={icons.icMomo}
                            style={{
                              marginLeft: 5,
                            }}
                          />
                        );
                      } else if (
                        get(it, 'code') ==
                        constant.CODE_PAYMENT_METHOD.BANK_TRANSFER
                      ) {
                        return (
                          <Image
                            source={icons.icBank}
                            style={{
                              marginLeft: 5,
                            }}
                          />
                        );
                      }
                    },
                  )}
                </Layout>
              </Layout>
            </View>
          </Layout>
        </View>
      ))}
    </Container>
  );
};

export default AccountP2PScreen;

const styles = StyleSheet.create({});
